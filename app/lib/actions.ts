'use server';

import { z } from "zod";
import { revalidatePath } from 'next/cache';
import postgres from 'postgres';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { Score } from '@/app/lib/definitions'
 
const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
  prepare: false,
});

const PickSchema = z.object({
  game: z.number(),
  picked_home_team: z.boolean(),
});

export async function storePick(pick: { game: number; pickedHomeTeam: boolean }) {
  
  
  const session = await auth();
  const player = session?.user?.name;

  if (!player) {
    throw new Error('User not authenticated');
  }

  const { game, picked_home_team } = PickSchema.parse({
    game: pick.game,
    picked_home_team: pick.pickedHomeTeam,
  });

    await sql.begin(async (transaction) => {
      const openGame = await transaction`
        SELECT game_id
        FROM games
        WHERE game_id = ${game}
          AND (date + time) > (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
        FOR UPDATE
      `;

      if (openGame.length === 0) {
        throw new Error('Picks are closed for this game');
      }

      await transaction`
        INSERT INTO picks (game, player, pickedHomeTeam)
        VALUES (${game}, ${player}, ${picked_home_team})
        ON CONFLICT (game, player)
        DO UPDATE SET pickedHomeTeam = EXCLUDED.pickedHomeTeam
      `;
    });

    revalidatePath('/ui/week');
}

export async function updatePlayerRecord(player: string, pickedCorrectly: boolean) {
    const currRecord = await sql`SELECT record FROM users WHERE name = ${player}`;
    let [correct, incorrect] = currRecord[0].record.split('-').map(Number);
    if (pickedCorrectly) {
        correct += 1;
        await sql`UPDATE users SET points = points + 1, record = ${`${correct}-${incorrect}`} WHERE name = ${player}`;
    } else {
        incorrect += 1;
        await sql`UPDATE users SET record = ${`${correct}-${incorrect}`} WHERE name = ${player}`;
    }
    

    //revalidatePath('/ui/components/leaderboard');
}

export async function updateUserTeamRecord(player: string, team: string, win: boolean, pickedTeam: boolean) {
    const currRecord = await sql`SELECT record FROM user_team_records WHERE user = ${player} AND team = ${team}`;
    let [correct, incorrect] = currRecord[0].record.split('-').map(Number);
    if (win === pickedTeam) {
        correct += 1;
    } else {
        incorrect += 1;
    }
    await sql`UPDATE user_team_records SET record = ${`${correct}-${incorrect}`} WHERE user = ${player} AND team = ${team}`;

    //revalidatePath('/ui/components/leaderboard');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function updateScoring(game: number, score: Score) {
  const homeTeamWon = score.home_score > score.away_score;

  const scored = await sql.begin(async (transaction) => {
    const games = await transaction`
      SELECT game_id
      FROM games
      WHERE game_id = ${game}
        AND is_scored = false
      FOR UPDATE
    `;

    if (games.length === 0) {
      return false;
    }

    const picks = await transaction`
      SELECT player, pickedHomeTeam AS "pickedHomeTeam"
      FROM picks
      WHERE game = ${game}
    `;

    for (const pick of picks) {
      const pickedCorrectly = pick.pickedHomeTeam === homeTeamWon;
      const users = await transaction`
        SELECT record
        FROM users
        WHERE name = ${pick.player}
        FOR UPDATE
      `;

      if (users.length === 0) {
        throw new Error(`User not found while scoring game ${game}`);
      }

      let [correct, incorrect] = users[0].record.split('-').map(Number);
      if (pickedCorrectly) {
        correct += 1;
      } else {
        incorrect += 1;
      }

      await transaction`
        UPDATE users
        SET points = points + ${pickedCorrectly ? 1 : 0},
            record = ${`${correct}-${incorrect}`}
        WHERE name = ${pick.player}
      `;
    }

    await transaction`
      UPDATE games
      SET home_score = ${score.home_score},
          away_score = ${score.away_score},
          is_scored = true
      WHERE game_id = ${game}
        AND is_scored = false
    `;

    return true;
  });

  if (scored) {
    revalidatePath('/ui/week');
    return true;
  } else {
    return false;
  }
}