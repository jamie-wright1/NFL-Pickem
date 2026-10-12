// This file contains type definitions for data.

export type PickSide = {player: string, picked: 'home' | 'away' | null};

export type GameRowsProps = {
    game_id: number;
    away_team: string;
    away_score: number;
    away_record: string;
    home_team: string;
    home_score: number;
    home_record: string;
    is_scored: boolean;
    away_odds: number | null;
    home_odds: number | null;
    week: number;
    date: string | Date;
    time: string;
    picks: PickSide[] | null;
    requestingPlayer: string;
    activeWeek: number | null;
};

export type GamePageProps = {
    searchParams?: Promise<{
        game_id?: string | string[];
    }>;
};

export type TeamImageProps = {
    team: string;
};

export type PickGameProps = {
    game_id: number;
    isHomeTeam: boolean;
    buttonPicked: boolean;
    isLocked: boolean;
    odds: number | null;
};

//DB Definitions

export type User = {
    name: string;
    password: string;
    points: number;
    record: string;
};

export type Pick = {
    game: number;
    player: string;
    pickedHomeTeam: boolean;
};

export type Team = {
    displayName: string;
    name: string;
    record: string;
    abbreviation: string;
    color: string;
};

export type Game = {
    game_id: number;
    away_team: string;
    away_score: number;
    home_team: string;
    home_score: number;
    is_scored: boolean;
    week: number;
    date: string;
    time: string;
    away_odds: number | null;
    home_odds: number | null;
};

export type UserTeamRecord = {
    user: string;
    team: string;
    record: string;
}

export type HeadToHeadRecord = {
    team1: string;
    team2: string;
    team1Record: string;
    team2Record: string;
}

export type Score = {
    home_score: number;
    away_score: number;
}

export type GameOutcome = "home" | "away" | "tie";

export const IdNamesFromTeamNames: { [key: string]: number } = {
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
