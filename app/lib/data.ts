import postgres from "postgres";
import {User, Pick, PickSide, Team, Game, UserTeamRecord, HeadToHeadRecord} from "./definitions";


// Supabase's pooler can route queries to different backend connections.
// Disable server-side prepared statements for pooler compatibility.
const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: 'require',
    prepare: false,
});

export async function fetchTeams() {
    try {
        const teams: Team[] = await sql`SELECT * FROM teams`;
        return teams;
    }
    catch (error) {
        console.error("Database error:", error);
        throw new Error("Error fetching teams");
    }
}

export async function fetchGames(week: number = 1) {
    try {
        const games: Game[] = await sql`SELECT * FROM games WHERE week = ${week}`;
        return games;
    }
    catch (error) {
        console.error("Database error:", error);
        throw new Error("Error fetching games");
    }
}

export async function fetchGameById(game_id: number) {
    try {
        const game: Game[] = await sql`SELECT * FROM games WHERE game_id = ${game_id}`;
        return game[0];
    }
    catch (error) {
        console.error("Database error:", error);
        throw new Error("Error fetching game by ID");
    }
}

export async function fetchLeaderboard() {
    try {
        const leaderboard: { name: string; points: number }[] = await sql`SELECT name, points FROM users ORDER BY points DESC`;
        return leaderboard;
    }
    catch (error) {
        console.error("Database error:", error);
        throw new Error("Error fetching leaderboard");
    }
}

export async function fetchButtonPicked(game_id: number, player: string) {
    try {
        const pick: Pick[] = await sql`
            SELECT game, pickedhometeam AS "pickedHomeTeam"
            FROM picks
            WHERE game = ${game_id} AND player = ${player}
        `;
        if (pick.length > 0 && pick[0].pickedHomeTeam === true) {
            return 'home'; // Home team picked
        } else if (pick.length > 0 && pick[0].pickedHomeTeam === false) {
            return 'away'; // Away team picked
        } else {
            return null; // No pick found
        }
    }
    catch (error) {
        console.error("Database error:", error);
        throw new Error("Error fetching picked button state");
    }
}

export async function fetchButtonPickedForGames(gameIds: number[], player: string) {
    if (gameIds.length === 0) {
        return new Map<number, PickSide>();
    }

    try {
        const picks: Pick[] = await sql`
            SELECT game, pickedhometeam AS "pickedHomeTeam"
            FROM picks
            WHERE player = ${player}
              AND game IN ${sql(gameIds)}
        `;

        return new Map<number, PickSide>(
            picks.map((pick) => [pick.game, pick.pickedHomeTeam ? 'home' : 'away'])
        );
    }
    catch (error) {
        console.error("Database error:", error);
        throw new Error("Error fetching picked button states");
    }
}
