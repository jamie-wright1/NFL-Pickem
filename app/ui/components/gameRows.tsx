import React from 'react';
import GameBox from "../components/gameBox";
import Pagination from "../components/pagination";
import { Game } from "../../lib/definitions";
import { fetchGames, fetchButtonPickedForGames } from "../../lib/data";
import { auth } from "@/auth";



type GameRowsProps = {
  week: number;
};

export default async function GameRows ({ week }: GameRowsProps) {
    const session = await auth();
    const player = session?.user?.name; // Replace with actual player name from session

    if (!player) {
        throw new Error("User not authenticated");
    }

    const games = await fetchGames(week); // Fetch the games data

    const picks = await fetchButtonPickedForGames(
        games.map((game) => game.game_id),
        player,
    );

    const gameBoxes = [];

    for (const game of games) {
        const pick = picks.get(game.game_id) ?? null;
        gameBoxes.push(
            <GameBox
                key={game.game_id}
                game_id={game.game_id}
                away_team={game.away_team}
                away_score={game.away_score}
                home_team={game.home_team}
                home_score={game.home_score}
                week={game.week}
                date={game.date}
                time={game.time}
                pick={pick}
            />
        );
    }


    return <div className="game-rows">
        <Pagination totalPages={18} currentPage={week} />
        <div className="game-boxes">
            {gameBoxes}
        </div>
    </div>;
}