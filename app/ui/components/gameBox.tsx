import React from "react";
import Link from "next/link";
import TeamImage from "./teamImage";
import PickGame from "./pickGame";
import { GameRowsProps } from "../../lib/definitions";
import { isGameClosed } from "../../lib/utils";
import clsx from "clsx";


export default function GameBox ({ game_id, away_team, away_score, home_team, home_score, is_scored, week, date, time, picks, requestingPlayer, activeWeek }: GameRowsProps) {
  const userPick =
    picks?.find((pick) => pick.player === requestingPlayer) ?? null; // Get the user's pick if available, otherwise null

  const otherPicks = picks?.filter(
    (pick) => pick.player !== requestingPlayer
  ) ?? [];

  const awayPickers = otherPicks.filter((pick) => pick.picked === "away");
  const homePickers = otherPicks.filter((pick) => pick.picked === "home");

  const className = "game-box";

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


  const isLocked = activeWeek !== week || isGameClosed(date, time);

  const awayWon = away_score > home_score;
  const homeWon = home_score > away_score;
  const gameScored = is_scored;
  const awayPickedCorrectly = gameScored && userPick?.picked === "away" && awayWon;
  const homePickedCorrectly = gameScored && userPick?.picked === "home" && homeWon;
  const awayPickedIncorrectly = gameScored && userPick?.picked === "away" && homeWon;
  const homePickedIncorrectly = gameScored && userPick?.picked === "home" && awayWon;
  const awayPickPending = !gameScored && userPick?.picked === "away";
  const homePickPending = !gameScored && userPick?.picked === "home";

    return <div className = {className}>
              <div className = "game-info">
                <Link href={`/ui/game/${game_id}`}>
                  <h2 className="away-team">{away_team}</h2>
                  <h2 className="at">@</h2>
                  <h2 className="home-team">{home_team}</h2>
                </Link>
              </div>
              <div className = "pick-screen">
                <div
                  className={clsx("team-side", {
                    "picked-correct": awayPickedCorrectly,
                    "picked-incorrect": awayPickedIncorrectly,
                    "picked-pending": awayPickPending,
                  })}
                >
                  <PickGame
                    game_id={game_id}
                    isHomeTeam={false}
                    buttonPicked={userPick?.picked === "away"}
                    isLocked={isLocked}
                  />
                  <div className="img-box">
                    <TeamImage team={away_team} />
                  </div>
                </div>

                <p className="game-score">{away_score}-{home_score}</p>

                <div
                  className={clsx("team-side", {
                    "picked-correct": homePickedCorrectly,
                    "picked-incorrect": homePickedIncorrectly,
                    "picked-pending": homePickPending,
                  })}
                >
                  <div className="img-box">
                    <TeamImage team={home_team} />
                  </div>
                  <PickGame
                    game_id={game_id}
                    isHomeTeam={true}
                    buttonPicked={userPick?.picked === "home"}
                    isLocked={isLocked}
                  />
                </div>
              </div>
              <div className = "game-date-time">
                <Link href={`/ui/game/${game_id}`}>
                  <p className="game-date">{displayDate}</p>

                  <div className="team-pickers away-pickers">
                    {awayPickers.map((pick) => (
                      <span
                        key={pick.player}
                        className={clsx({
                          "picker-correct": gameScored && awayWon,
                          "picker-incorrect": gameScored && homeWon,
                          "picker-pending": !gameScored,
                        })}
                      >
                        {pick.player}
                      </span>
                    ))}
                  </div>

                  <div className="middle-line"></div>

                  <div className="team-pickers home-pickers">
                    {homePickers.map((pick) => (
                      <span
                        key={pick.player}
                        className={clsx({
                          "picker-correct": gameScored && homeWon,
                          "picker-incorrect": gameScored && awayWon,
                          "picker-pending": !gameScored,
                        })}
                      >
                        {pick.player}
                      </span>
                    ))}
                  </div>

                  <p className="game-time">{displayTime}</p>
                </Link>
              </div>
          </div>;


/*

    return <div className = {className}>
        <GameBoxTeam />
        <p className="game-score">{away_score}-{home_score}</p>
        <div className="middle-line"></div>
        <GameBoxTeam />
    </div>

    */
}