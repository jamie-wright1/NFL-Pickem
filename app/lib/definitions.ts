// This file contains type definitions for data.

export type PickSide = {player: string, picked: 'home' | 'away' | null};

export type GameRowsProps = {
    game_id: number;
    away_team: string;
    away_score: number;
    home_team: string;
    home_score: number;
    is_scored: boolean;
    week: number;
    date: string | Date;
    time: string;
    picks: PickSide[] | null;
    requestingPlayer: string;
    activeWeek: number | null;
};

export type GameBoxTeamProps = {
    game_id: number;
    team: string;
    score: number;
    isHome: boolean;
    week: number;
    date: string | Date;
    time: string;
    picks: PickSide[] | null;
    requestingPlayer: string;
}

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