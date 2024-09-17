export const logPlayTypes = [
  "Pass",
  "Run with RPO",
  "Run no RPO",
  "QB Run no Read",
  "QB Run with RPO",
  "QB Run with Run Read Key",
];

export interface Play {
  id?: number;
  practice_block_id?: bigint;
  game_drive_id?: bigint;
  num_in_game_drive?: number;
  hash: string;
  yard_line?: number;
  down?: number;
  distance?: number;
  personnel: string;
  formation_name: string;
  back_alignment?: string;
  formation_strength: string;
  pass_protection?: string;
  play_call: string;
  play_call_strength: string;
  result: string;
  yards: number;
  team_qb_id: number;
  turnover_worthy_play: boolean;
  qb_pressured: boolean;
  missed_check: boolean;
  pass_read?: boolean;
  pass_ball_placement?: boolean;
  outstanding_qb_play?: boolean;
  run_rpo_key_read?: boolean;
  off_schedule_play_on_qb?: boolean;
  bad_play_reason?: string;
  play_call_grouping: string;
  notes?: string;
  qb_run_execution?: boolean;
  qb_run_read_key?: boolean;
  motion?: string;
  call_tag?: string;
}

export type PlayResult =
  | "Complete"
  | "Incomplete"
  | "Run"
  | "QB Run"
  | "Scramble"
  | "Sack"
  | "Fumble"
  | "Interception"
  | "TD Pass"
  | "TD Run"
  | "TD Scramble"
  | "TD QB Run";
export type FormationStrength = "L" | "R";
export type PlayHash = "L" | "LM" | "M" | "RM" | "R";
export type PlayPersonnel = '00' | '01' | '10' | '11' | '12' | '13' | '20' | '21' | '22' | '23';