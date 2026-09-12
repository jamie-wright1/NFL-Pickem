import React from "react";
import Link from "next/link";
import TeamImage from "./teamImage";
import PickGame from "./pickGame";
import { GameRowsProps } from "../../lib/definitions";
import clsx from "clsx";



export default function GameBox ({ game_id, away_team, away_score, home_team, home_score, week, date, time, pick }: GameRowsProps) {
    const className = clsx("game-box", {
        "bg-green-100": pick,
        "bg-cyan-100": !pick,
    });

  const displayDate = date instanceof Date
    ? date.toLocaleDateString()
    : date;

  const datePart = date instanceof Date
    ? date.toISOString().slice(0, 10)
    : date;

  const displayTime = new Date(`${datePart}T${time}Z`).toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  });
  const isLocked = new Date(`${datePart}T${time}Z`) <= new Date();

    return <div className = {className}>
            <Link href={`/ui/game/${game_id}`}>
              <div className = "game-info">
                  <h2 className="away-team">{away_team}</h2>
                  <h2 className="at">@</h2>
                  <h2 className="home-team">{home_team}</h2>
              </div>
              <div className = "pick-screen">
                <PickGame game_id={game_id} isHomeTeam={false} buttonPicked={pick === 'away'} isLocked={isLocked} />
                <div className="img-box">
                  <TeamImage team={away_team} />
                </div>
                <p className="game-score">{away_score}-{home_score}</p>
                <div className = "img-box" id = "home-img-box">
                  <TeamImage team={home_team} />
                </div>
                <PickGame game_id={game_id} isHomeTeam={true} buttonPicked={pick === 'home'} isLocked={isLocked} />
              </div>
              <div className = "game-date-time">
                <p className="game-date">{displayDate}</p>
                <p className="game-time">{displayTime}</p>
              </div>
            </Link>
          </div>;
}