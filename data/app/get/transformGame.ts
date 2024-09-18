import { Play } from "@/data/types/logPlayTypes";
import { PlayCallFamilyStats, TeamStats } from "@/data/types/viewDataTypes";

export function transformGamePlaysTeam(plays: Play[]): TeamStats {
  const stats: TeamStats = {
    firstDowns: 0, firstDownChances: 0, touchdowns: 0,
    explosives: 0, tenYardPlays: 0, fiveYardPlays: 0, onSchedulePlays: 0,
    firstDownPercentage: 0, driveTDPercentage: 0, onSchedulePlayPercentage: 0,
    playCallFamilyStats: {}, totalDrives: 0, totalPlays: plays.length
  };
  
  const totalDrives = new Set(plays.map(p => p.game_drive_id)).size;
  let currentDrive: number, yardsToGo = 0, isNewChance = true;

  plays.forEach(play => {
    if (play.game_drive_id !== undefined && Number(play.game_drive_id) !== currentDrive) {
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

function updatePlayCallFamilyStats(play: Play, stats: Record<string, PlayCallFamilyStats>) {
  if (play.play_call_family) {
    if (!stats[play.play_call_family]) {
      stats[play.play_call_family] = { offSchedule: 0, total: 0, yards: [], threePlusYards: 0, avgYards: 0, minYards: Infinity, maxYards: -Infinity, family: '' };
    }
    stats[play.play_call_family].total++;
    stats[play.play_call_family].yards.push(play.yards);
    if (!play.on_schedule) stats[play.play_call_family].offSchedule++;
    if (play.yards >= 3) stats[play.play_call_family].threePlusYards++;
  }
}

function calculateFinalStats(stats: TeamStats, totalPlays: number, totalDrives: number): TeamStats {
  stats.firstDownPercentage = (stats.firstDowns / stats.firstDownChances) * 100;
  stats.onSchedulePlayPercentage = (stats.onSchedulePlays / totalPlays) * 100;
  stats.driveTDPercentage = (stats.touchdowns / totalDrives) * 100;
  stats.totalPlays = totalPlays;
  stats.totalDrives = totalDrives;

  Object.values(stats.playCallFamilyStats).forEach(familyStats => {
    if (familyStats.yards.length > 0) {
      familyStats.avgYards = familyStats.yards.reduce((sum, yard) => sum + yard, 0) / familyStats.yards.length;
      familyStats.minYards = Math.min(...familyStats.yards);
      familyStats.maxYards = Math.max(...familyStats.yards);
    }
  });

  return stats;
}
