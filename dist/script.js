import postgres from "postgres";
const sql = postgres(process.env.POSTGRES_URL, {
    ssl: 'require',
    prepare: false,
});
export async function populateOdds() {
    for (let week = 1; week <= 18; week++) {
        const response = await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2026/types/2/weeks/' + week.toString() + '/events');
        const items = await response.json();
        for (const event of items.items) {
            const oddsResponse = await fetch("http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/" + event.id + "/competitions/" + event.id + "/odds?lang=en&region=us");
            const oddsData = await oddsResponse.json();
            const awayOdds = oddsData["items"][0]["awayTeamOdds"];
            const homeOdds = oddsData["items"][0]["homeTeamOdds"];
            await sql `
                UPDATE games
                SET away_odds = ${awayOdds},
                    home_odds = ${homeOdds}
                WHERE game_id = ${event.id}
            `;
        }
    }
}
populateOdds();
