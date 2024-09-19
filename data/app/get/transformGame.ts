import { Play } from "@/data/types/logPlayTypes";
import {
  PlayCallFamilyStats,
  TeamStats,
  TransformedQBData,
} from "@/data/types/viewDataTypes";
import { getTeamQBs } from "./teamQBs";

export function transformGamePlaysTeam(plays: Play[]): TeamStats {
  const stats: TeamStats = {
    firstDowns: 0,
    firstDownChances: 0,
    touchdowns: 0,
    explosives: 0,
    tenYardPlays: 0,
    fiveYardPlays: 0,
    onSchedulePlays: 0,
    firstDownPercentage: 0,
    driveTDPercentage: 0,
    onSchedulePlayPercentage: 0,
    playCallFamilyStats: {},
    totalDrives: 0,
    totalPlays: plays.length,
  };

  const totalDrives = new Set(plays.map((p) => p.game_drive_id)).size;
  let currentDrive: number,
    yardsToGo = 0,
    isNewChance = true;

  plays.forEach((play) => {
    if (
      play.game_drive_id !== undefined &&
      Number(play.game_drive_id) !== currentDrive
    ) {
      currentDrive = Number(play.game_drive_id);
      isNewChance = true;
    }

    if (isNewChance) {
      stats.firstDownChances++;
      yardsToGo = play.distance || 10;
      isNewChance = false;
    }

    if (play.yards >= yardsToGo || play.result.includes("TD")) {
      stats.firstDowns++;
      isNewChance = true;
    } else {
      yardsToGo -= play.yards;
    }

    if (play.down === 4 && yardsToGo > 0) isNewChance = true;
    if (play.result.includes("TD")) stats.touchdowns++;
    if (play.yards >= 25) stats.explosives++;
    if (play.yards >= 10) stats.tenYardPlays++;
    if (play.yards >= 5) stats.fiveYardPlays++;
    if (play.on_schedule) stats.onSchedulePlays++;

    updatePlayCallFamilyStats(play, stats.playCallFamilyStats);
  });

  return calculateFinalStats(stats, plays.length, totalDrives);
}

function updatePlayCallFamilyStats(
  play: Play,
  stats: Record<string, PlayCallFamilyStats>
) {
  if (play.play_call_family) {
    if (!stats[play.play_call_family]) {
      stats[play.play_call_family] = {
        offSchedule: 0,
        total: 0,
        yards: [],
        threePlusYards: 0,
        avgYards: 0,
        minYards: Infinity,
        maxYards: -Infinity,
        family: "",
      };
    }
    stats[play.play_call_family].total++;
    stats[play.play_call_family].yards.push(play.yards);
    if (!play.on_schedule) stats[play.play_call_family].offSchedule++;
    if (play.yards >= 3) stats[play.play_call_family].threePlusYards++;
  }
}

function calculateFinalStats(
  stats: TeamStats,
  totalPlays: number,
  totalDrives: number
): TeamStats {
  stats.firstDownPercentage = (stats.firstDowns / stats.firstDownChances) * 100;
  stats.onSchedulePlayPercentage = (stats.onSchedulePlays / totalPlays) * 100;
  stats.driveTDPercentage = (stats.touchdowns / totalDrives) * 100;
  stats.totalPlays = totalPlays;
  stats.totalDrives = totalDrives;

  Object.values(stats.playCallFamilyStats).forEach((familyStats) => {
    if (familyStats.yards.length > 0) {
      familyStats.avgYards =
        familyStats.yards.reduce((sum, yard) => sum + yard, 0) /
        familyStats.yards.length;
      familyStats.minYards = Math.min(...familyStats.yards);
      familyStats.maxYards = Math.max(...familyStats.yards);
    }
  });

  return stats;
}

export async function transformGamePlaysQBs(
  plays: Play[]
): Promise<TransformedQBData> {
  const qbData: TransformedQBData = {};
  const uniqueQBs = new Set(plays.map((p) => p.team_qb_id));
  const teamQBs = await getTeamQBs(Array.from(uniqueQBs));

  for (const qb of teamQBs) {
    qbData[qb.id] = {
      fullName: qb.fullName,
      stats: {
        qbFullName: qb.fullName,
        attempts: 0,
        passReadsCount: 0,
        passBallPlacementCount: 0,
        completions: 0,
        passingYards: 0,
        passingTouchdowns: 0,
        interceptions: 0,
        rpoPlays: 0,
        rpoPlaysReads: 0,
        rpoPlaysThrown: 0,
        rpoPlaysBallPlacement: 0,
        scrambleAttempts: 0,
        scrambleYards: 0,
        scrambleTouchdowns: 0,
        rushingAttempts: 0,
        rushingYards: 0,
        rushingTouchdowns: 0,
        pressured: 0,
        sacks: 0,
        outstandingPlays: 0,
        turnoverWorthyPlays: 0,
      },
    };
  }

  for (const play of plays) {
    const qb = qbData[play.team_qb_id];
    if (!qb) continue;

    if (
      play.result === "Complete" ||
      play.result === "TD Pass" ||
      play.result === "Interception" ||
      play.result === "Incomplete"
    ) {
      qb.stats.attempts++;
      if (play.pass_read === true) {
        qb.stats.passReadsCount++;
      }
      if (play.pass_ball_placement === true) {
        qb.stats.passBallPlacementCount++;
      }
      if (play.result === "TD Pass") {
        qb.stats.passingTouchdowns++;
      }
      if (play.result === "Interception") {
        qb.stats.interceptions++;
      }
      if (play.result === "Complete" || play.result === "TD Pass") {
        qb.stats.completions++;
        qb.stats.passingYards += play.yards;
      }
      if(play.qb_pressured === true) {
        qb.stats.pressured++;
      }
    }

    if (play.result === "QB Run") {
      qb.stats.rushingAttempts++;
      qb.stats.rushingYards += play.yards;
    }

    if (play.result === "Scramble") {
      qb.stats.scrambleAttempts++;
      qb.stats.scrambleYards += play.yards;
    }

    if (play.result === "TD QB Run") {
      qb.stats.rushingTouchdowns++;
    }

    if (play.result === "TD Scramble") {
      qb.stats.scrambleTouchdowns++;
      qb.stats.scrambleYards += play.yards;
    }

    if (play.turnover_worthy_play) {
      qb.stats.turnoverWorthyPlays++;
    }

    if (play.outstanding_qb_play) {
      qb.stats.outstandingPlays++;
    }

    if (play.result === "Sack") {
      qb.stats.sacks++;
      if(play.qb_pressured === true) {
        qb.stats.pressured++;
      }
    }

    if (play.play_call_grouping === "Run with RPO") {
      qb.stats.rpoPlays++;
      if (play.pass_read === true) {
        qb.stats.rpoPlaysReads++;
      }
      if (play.pass_ball_placement === true) {
        qb.stats.rpoPlaysBallPlacement++;
      }
      if (play.result === "Complete" || play.result === "TD Pass") {
        qb.stats.rpoPlaysThrown++;
      }
    }

    if (play.play_call_grouping === "QB Run with RPO") {
      qb.stats.rpoPlays++;
      if (play.run_rpo_key_read === true) {
        qb.stats.rpoPlaysReads++;
      }
      if (play.result === "Complete" || play.result === "TD Pass" || play.result === "Incomplete" || play.result === "Interception") {
        qb.stats.rpoPlaysThrown++;
        if (play.pass_ball_placement === true) {
          qb.stats.rpoPlaysBallPlacement++;
        }
      }
    }
  }

  return qbData;
}
