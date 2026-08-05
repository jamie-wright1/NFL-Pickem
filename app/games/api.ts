import { event } from "next/dist/build/output/log";


async function FetchGames(week: number) {
  const response = await fetch('http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2026/types/2/weeks/' + week.toString() + '/events');
  const events = await response.json();
  
  const gameData: { gameId: string; awayTeamId: string; homeTeamId: string; awayScore: number; homeScore: number }[] = [];
  
  for (const event of events.items) {
    const eventData = await fetch(event.$ref);
    const eventDetails = await eventData.json();
    const homeScoreData = await fetch(eventDetails["competitions"][0]["competitors"][0]["score"].$ref);
    const homeScore = await homeScoreData.json();
    const awayScoreData = await fetch(eventDetails["competitions"][0]["competitors"][1]["score"].$ref);
    const awayScore = await awayScoreData.json();

    gameData.push({
      gameId: eventDetails.id,
      awayTeamId: eventDetails["competitions"][0]["competitors"][1].id,
      homeTeamId: eventDetails["competitions"][0]["competitors"][0].id,
      awayScore: awayScore.value,
      homeScore: homeScore.value
    });
  }

  return gameData;
}   

type TeamInfo = {
  id: string;
  displayName: string;
  record: string;
  abbreviation: string;
  color: string;
};

async function FetchTeamInfo(teamId: string) {
  const response = await fetch('http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2026/teams/' + teamId);
  const teamData = await response.json();

  const recordResponse = await fetch('http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2026/types/2/teams/' + teamId + '/record');
  const recordData = await recordResponse.json();

  const teamInfo: TeamInfo = {
    id: teamData.id,
    displayName: teamData.displayName,
    record: recordData.items[0].summary,
    abbreviation: teamData.abbreviation,
    color: teamData.color,
  };

  return teamInfo;
}

export default async function FetchGameInfo(week: number) {
  const gameData = await FetchGames(week);
  

  const gameInfo: { gameId: string;awayTeam: string; awayRecord: string; homeTeam: string; homeRecord: string; awayScore: number, homeScore: number }[] = [];

  for (const game of gameData) {
    const awayTeamInfo = await FetchTeamInfo(game.awayTeamId);
    const homeTeamInfo = await FetchTeamInfo(game.homeTeamId);
    gameInfo.push({ gameId: game.gameId, awayTeam: awayTeamInfo.displayName, awayRecord: awayTeamInfo.record, homeTeam: homeTeamInfo.displayName, homeRecord: homeTeamInfo.record, awayScore: game.awayScore, homeScore: game.homeScore });
  }

  return gameInfo;
}

FetchGameInfo(1);