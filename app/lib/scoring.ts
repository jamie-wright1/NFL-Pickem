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
    try{
        const games = await sql`
            SELECT game_id, is_scored
            FROM games
            WHERE is_scored = false
                AND (date + time) <= (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')
            `;

        const processedGames: number[] = [];
        const skippedGames: number[] = [];

        for (const game of games) {
            const gameCompleted = await CheckGameFinished(game.game_id);

            if (!game.is_scored) {
                const score: Score = await FetchFinalScore(game.game_id);
                const updated = await updateScoring(game.game_id, score, gameCompleted);
                if (updated) {
                    processedGames.push(game.game_id);
                } else {
                    skippedGames.push(game.game_id);
                }
            } else {
                skippedGames.push(game.game_id);
            }
        }

        return { processed: processedGames, skipped: skippedGames };
    } catch (error) {
        console.error("Error during scoring process:", error);
        throw new Error("Scoring process failed.");
    }
}