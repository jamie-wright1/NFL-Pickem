import { fetchLeaderboard } from "../../lib/data";

export default async function Leaderboard() {
    const leaderboardData = await fetchLeaderboard();
    return (
        <div className="leaderboard-container">
            <h1 id="Header">| Leaderboard |</h1>
            <div className="leaderboard">
                {leaderboardData.map((user) => (
                    <p key={user.name}>{user.name}: {user.points} points</p>
                ))}
            </div>
        </div>
    );
}