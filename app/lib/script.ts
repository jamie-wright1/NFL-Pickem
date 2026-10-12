import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: 'require',
    prepare: false,
});

export async function populateOdds() {
    for (let week = 1; week <= 18; week++) {
        const response = await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2026/types/2/weeks/' + week.toString() + '/events');
        const items = await response.json();

        for (const event of items.items) {
            const eventData = await fetch(event.$ref);
            const eventDetails = await eventData.json();
            const oddsResponse = await fetch("https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/" + eventDetails.id + "/competitions/" + eventDetails.id + "/odds?lang=en&region=us");
            const oddsData = await oddsResponse.json();

            const odds = oddsData?.items?.[0];
            const awayOdds = odds?.awayTeamOdds?.moneyLine;
            const homeOdds = odds?.homeTeamOdds?.moneyLine;

            if (!Number.isInteger(awayOdds) || !Number.isInteger(homeOdds)) {
                console.warn(`Skipping event ${eventDetails.id}: moneyline odds are unavailable`);
                continue;
            }

            await sql`
                UPDATE games
                SET away_odds = ${awayOdds},
                    home_odds = ${homeOdds}
                WHERE game_id = ${eventDetails.id}
            `;
        }
    }
}

populateOdds()
    .catch((error) => {
        console.error("Failed to populate odds:", error);
        process.exitCode = 1;
    })
    .finally(() => sql.end());