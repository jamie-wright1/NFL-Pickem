import React from 'react';
import GameBox from "../components/gameBox";
import FetchGameInfo from "../games/api";

type GameRowsProps = {
    week: number;
}

export default async function GameRows({week} : GameRowsProps) {
    const games = await FetchGameInfo(week);

    const gameBoxes = [];

    for (const game of games) {
        gameBoxes.push(
            <GameBox
                key={game.gameId}
                awayTeam={game.awayTeam}
                awayRecord={game.awayRecord}
                homeTeam={game.homeTeam}
                homeRecord={game.homeRecord}
                awayScore={game.awayScore}
                homeScore={game.homeScore}
            />
        );
    }


    return <div className="game-rows">{gameBoxes}</div>;
}