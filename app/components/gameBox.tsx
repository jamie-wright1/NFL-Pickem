import React from "react";
import TeamImage from "./teamImage";

type GameBoxProps = {
    awayTeam: string;
    awayRecord: string;
    homeTeam: string;
    homeRecord: string;
    awayScore: number;
    homeScore: number;
};

export default function GameBox ({ awayTeam, awayRecord, homeTeam, homeRecord, awayScore, homeScore }: GameBoxProps) {
    return <div className = "game-box">
            <div className = "game-info">
                <h2 className="away-team">{awayTeam} ({awayRecord})</h2>
                <h2 className="at">@</h2>
                <h2 className="home-team">{homeTeam} ({homeRecord})</h2>
            </div>
            <div className = "pick-screen">
              <p className="left-box pick-box">Pick</p>
              <div className="img-box">
                <TeamImage team={awayTeam} />
              </div>
              <p className="game-score">{awayScore}-{homeScore}</p>
              <div className = "img-box" id = "home-img-box">
                <TeamImage team={homeTeam} />
              </div>
              <p className="right-box pick-box">Pick</p>
            </div>
          </div>;
}