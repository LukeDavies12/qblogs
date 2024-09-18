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
