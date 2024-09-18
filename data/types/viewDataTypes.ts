import { Play } from "./logPlayTypes";

export interface PlayCallFamilyStats {
  offSchedule: number;
  threePlusYards: number;
  total: number;
  avgYards: number;
  minYards: number;
  maxYards: number;
  family: string;
  yards: number[];
}

export interface TeamStats {
  touchdowns: number;
  driveTDPercentage: number;
  totalDrives: number;
  firstDowns: number;
  firstDownChances: number;
  firstDownPercentage: number;
  explosives: number;
  tenYardPlays: number;
  fiveYardPlays: number;
  onSchedulePlays: number;
  onSchedulePlayPercentage: number;
  totalPlays: number;
  playCallFamilyStats: Record<string, PlayCallFamilyStats>;
}
 
export interface QBStats {
  qbFullName: string;
  attempts: number;
  passReadsCount: number;
  passBallPlacementCount: number;
  completions: number;
  passingYards: number;
  passingTouchdowns: number;
  interceptions: number;
  rpoPlays: number;
  rpoPlaysReads: number;
  rpoPlaysBallPlacement: number;
  scrambleAttempts: number;
  scrambleYards: number;
  scrambleTouchdowns: number;
  rushingAttempts: number;
  rushingYards: number;
  rushingTouchdowns: number;
  pressured: number;
  sacks: number;
  outstandingPlays: number;
  turnoverWorthyPlays: number;
}

export interface TransformedQBData {
  [qb: string]: {
    fullName: string;
    plays: Play[];
  };
}