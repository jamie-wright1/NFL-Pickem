import { Team, Game } from "./definitions";
import { teams } from "./initial-data";

type ApiGame = Omit<Game, "is_scored"> & {
    is_scored: boolean;
};

export async function FetchGames(week: number) {
  const response = await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2026/types/2/weeks/' + week.toString() + '/events');
  const events = await response.json();
  
  const gameData: ApiGame[] = [];

  const teamNamesFromId: { [key: number]: string } = {
        1: 'Atlanta Falcons',
        2: 'Buffalo Bills',
        3: 'Chicago Bears',
        4: 'Cincinnati Bengals',
        5: 'Cleveland Browns',
        6: 'Dallas Cowboys',
        7: 'Denver Broncos',
        8: 'Detroit Lions',
        9: 'Green Bay Packers',
        10: 'Tennessee Titans',
        11: 'Indianapolis Colts',
        12: 'Kansas City Chiefs',
        13: 'Las Vegas Raiders',
        14: 'Los Angeles Rams',     
        15: 'Miami Dolphins',
        16: 'Minnesota Vikings',
        17: 'New England Patriots',
        18: 'New Orleans Saints',
        19: 'New York Giants',
        20: 'New York Jets',
        21: 'Philadelphia Eagles',
        22: 'Arizona Cardinals',
        23: 'Pittsburgh Steelers',
        24: 'Los Angeles Chargers',
        25: 'San Francisco 49ers',
        26: 'Seattle Seahawks',
        27: 'Tampa Bay Buccaneers',
        28: 'Washington Commanders',
        29: 'Carolina Panthers',
        30: 'Jacksonville Jaguars',
        33: 'Baltimore Ravens',
        34: 'Houston Texans'
  }
  
  for (const event of events.items) {
    const eventData = await fetch(event.$ref);
    const eventDetails = await eventData.json();
    const homeScoreData = await fetch(eventDetails["competitions"][0]["competitors"][0]["score"].$ref);
    const homeScore = await homeScoreData.json();
    const awayScoreData = await fetch(eventDetails["competitions"][0]["competitors"][1]["score"].$ref);
    const awayScore = await awayScoreData.json();

    const { date, time } = parseApiDateTime(eventDetails.date);

    gameData.push({
      game_id: eventDetails.id,
      away_team: teamNamesFromId[eventDetails["competitions"][0]["competitors"][1].id],
      away_score: awayScore.value,
      home_team: teamNamesFromId[eventDetails["competitions"][0]["competitors"][0].id],
      home_score: homeScore.value,
      week,
      date,
      time,
      is_scored: event.status.type.completed,
    });
  }

  return gameData;
}   

export async function FetchTeam(teamName: string) {
  const IdNamesFromTeamNames: { [key: string]: number } = {
    'Atlanta Falcons': 1,
    'Buffalo Bills': 2,
    'Chicago Bears': 3,
    'Cincinnati Bengals': 4,
    'Cleveland Browns': 5,
    'Dallas Cowboys': 6,
    'Denver Broncos': 7,
    'Detroit Lions': 8,
    'Green Bay Packers': 9,
    'Tennessee Titans': 10,
    'Indianapolis Colts': 11,
    'Kansas City Chiefs': 12,
    'Las Vegas Raiders': 13,
    'Los Angeles Rams': 14,
    'Miami Dolphins': 15,
    'Minnesota Vikings': 16,
    'New England Patriots': 17,
    'New Orleans Saints': 18,
    'New York Giants': 19,
    'New York Jets': 20,
    'Philadelphia Eagles': 21,
    'Arizona Cardinals': 22,
    'Pittsburgh Steelers': 23,
    'Los Angeles Chargers': 24,
    'San Francisco 49ers': 25,
    'Seattle Seahawks': 26,
    'Tampa Bay Buccaneers': 27,
    'Washington Commanders': 28,
    'Carolina Panthers': 29,
    'Jacksonville Jaguars': 30,
    'Baltimore Ravens': 33,
    'Houston Texans': 34
  };

  const response = await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2026/teams/' + IdNamesFromTeamNames[teamName]);
  const teamData = await response.json();

  const recordResponse = await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2026/types/2/teams/' + IdNamesFromTeamNames[teamName] + '/record');
  const recordData = await recordResponse.json();

  const teamInfo: Team = {
    displayName: teamData.displayName,
    name: teamData.name,
    record: recordData.items[0].summary,
    abbreviation: teamData.abbreviation,
    color: teamData.color,
  };

  return teamInfo;
}

export async function FetchGameInfo(week: number) {
  const gameData = await FetchGames(week);
  
  const gameInfo: { gameId: string; awayTeam: string; awayRecord: string; homeTeam: string; homeRecord: string; awayScore: number, homeScore: number }[] = [];

  for (const game of gameData) {
    const awayTeamInfo = await FetchTeam(game.away_team);
    const homeTeamInfo = await FetchTeam(game.home_team);
    gameInfo.push({ gameId: String(game.game_id), awayTeam: awayTeamInfo.displayName, awayRecord: awayTeamInfo.record, homeTeam: homeTeamInfo.displayName, homeRecord: homeTeamInfo.record, awayScore: game.away_score, homeScore: game.home_score });
  }

  return gameInfo;
}

export async function CheckGameFinished(gameId: number) {
  const gameStatus = await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/' + gameId + '/competitions/' + gameId + '/status?lang=en&region=us')
  const gameStatusData = await gameStatus.json();
  const gameFinished = gameStatusData.type.completed;

  return gameFinished;
}

export async function FetchFinalScore(game: number) {
  const response = await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/' + game);
  const gameData = await response.json();
  
  
  const homeScoreData = await fetch(gameData["competitions"][0]["competitors"][0]["score"].$ref);
  const homeScore = await homeScoreData.json();
  const awayScoreData = await fetch(gameData["competitions"][0]["competitors"][1]["score"].$ref);
  const awayScore = await awayScoreData.json();

  const score = {home_score: homeScore.value, away_score: awayScore.value};
  return score;
}

export async function FetchGameRows(week: number) {
  const gameData = await FetchGames(week);
  
  return gameData.map((game) => ({
    game_id: game.game_id,
    away_team: game.away_team,
    away_score: game.away_score,
    home_team: game.home_team,
    home_score: game.home_score,
    week: game.week,
    date: game.date,
    time: game.time,
    is_scored: game.is_scored,
  }));
}

function parseApiDateTime(dateTime: string): {
    date: string;
    time: string;
} {
    const date = new Date(dateTime);

    return {
        date: date.toISOString().slice(0, 10),
        time: date.toISOString().slice(11, 19),
    };
}