import { Play } from "./logPlayTypes";

export type SeasonGame = {
  id: number;
  date: string;
  against: string;
  season_id: string;
  result: boolean;
};

export type IndividualGame = {
  id: number;
  date: string;
  against: string;
  season_id: number;
  result: boolean;
  game_drives: GameDrive[];
};

export type GameDrive = {
  id: number;
  game_id: number;
  number_in_game: number;
  plays?: Play[];
};

export type GameDriveWithPlays = {
  id: number;
  game_id: number;
  number_in_game: number;
  plays: Play[];
};