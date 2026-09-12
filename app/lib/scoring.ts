import postgres from "postgres";
import { CheckGameFinished, FetchFinalScore } from '@/app/lib/api'
import { updateScoring } from '@/app/lib/actions'
import { Score } from '@/app/lib/definitions'

// Supabase's pooler can route queries to different backend connections.
// Disable server-side prepared statements for pooler compatibility.
const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: 'require',
    prepare: false,
});


export default async function runScoring() {
    const games = await sql`SELECT game_id, is_scored from games`

    const processedGames: number[] = [];
    const skippedGames: number[] = [];

    for (const game of games) {
        if (!game.is_scored && await CheckGameFinished(game.game_id)) {
            const score: Score = await FetchFinalScore(game.game_id);
            await updateScoring(game.game_id, score);
            processedGames.push(game.game_id);
        } else {
            skippedGames.push(game.game_id);
        }
    }

    return { processed: processedGames, skipped: skippedGames };
}