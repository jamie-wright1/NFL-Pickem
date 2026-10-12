import React from 'react';
import GameBox from "../components/gameBox";
import Pagination from "../components/pagination";
import { fetchGames, fetchPicksForGames } from "../../lib/data";
import { auth } from "@/auth";



type GameRowsProps = {
  week: number;
  activeWeek: number | null;
};

export default async function GameRows ({ week, activeWeek }: GameRowsProps) {
    const session = await auth();
    const player = session?.user?.name; // Replace with actual player name from session

    if (!player) {
        throw new Error("User not authenticated");
    }
    const games = await fetchGames(week); // Fetch the games data

    const picks = await fetchPicksForGames(
        games.map((game) => game.game_id),
        player
    );

    const gameBoxes = [];

    for (const game of games) {
        const pick = picks.get(game.game_id) ?? null; // Get the pick for the current game, or null if not found

        gameBoxes.push(
            <GameBox
                key={game.game_id}
                game_id={game.game_id}
                away_team={game.away_team}
                away_score={game.away_score}
                away_record={game.away_record ?? "0-0"}
                home_team={game.home_team}
                home_score={game.home_score}
                home_record={game.home_record ?? "0-0"}
                is_scored={game.is_scored}
                away_odds={game.away_odds}
                home_odds={game.home_odds}
                week={game.week}
                date={game.date}
                time={game.time}
                picks={pick}
                requestingPlayer={player}
                activeWeek={activeWeek}
            />
        );
    }


    return <div className="game-rows">
        <p className="player-name">Player: {player}</p>
        <Pagination totalPages={18} currentPage={week} />
        <div className="game-boxes">
            {gameBoxes}
        </div>
    </div>;
}