import React from "react";
import Link from "next/link";
import TeamImage from "./teamImage";
import PickGame from "./pickGame";
import { GameBoxTeamProps } from "../../lib/definitions";
import { isGameClosed } from "../../lib/utils";
import clsx from "clsx";

export default async function GameBoxTeam ({ game_id, team, score, isHome, date, time, picks, requestingPlayer }: GameBoxTeamProps) {
    const userPick =
    picks?.find((pick) => pick.player === requestingPlayer) ?? null; // Get the user's pick if available, otherwise null

  const otherPicks = picks?.filter(
    (pick) => pick.player !== requestingPlayer
  ) ?? [];

  const teamPicked = isHome ? "home" : !isHome ? "away" : null;

  const pickers = otherPicks.filter((pick) => pick.picked);

  const className = clsx("game-box", {
      "bg-green-100": userPick?.picked,
      "bg-cyan-100": !userPick?.picked,
  });

  const datePart = date instanceof Date
    ? date.toISOString().slice(0, 10)
    : date.slice(0, 10);
  const gameStart = new Date(`${datePart}T${time}Z`);

  const displayDate = gameStart.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
  });

  const displayTime = gameStart.toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  });


  const isLocked = isGameClosed(date, time);

  return <div className = {className}>
            <div className = "game-info">
                <Link href={`/ui/game/${game_id}`}>
                  <h2 className="team">{team}</h2>
                </Link>
              </div>
              <div className = "pick-screen">
                <PickGame
                  game_id={game_id}
                  isHomeTeam={isHome}
                  buttonPicked={userPick?.picked === "away"}
                  isLocked={isLocked}
                />

                <div className="img-box">
                  <TeamImage team={team} />
                </div>
            </div>


            <div className = "game-date-time">
                <Link href={`/ui/game/${game_id}`}>
                  <p className="game-date">{displayDate}</p>

                  <div className="team-pickers">
                    {pickers.map((pick) => (
                      <span key={pick.player}>{pick.player}</span>
                    ))}
                  </div>
                </Link>
              </div>
        </div>

}
