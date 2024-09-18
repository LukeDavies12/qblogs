import { Play, PlayCallFamilyStats } from "@/data/types/logPlayTypes";

export function transformGamePlays(plays: Play[]) {
  let firstDowns = 0;
  let touchdowns = 0;
  let redZoneTDs = 0;
  let explosives = 0;
  let tenYardPlays = 0;
  let fiveYardPlays = 0;
  let onSchedulePlays = 0;
  const totalPlays = plays.length;
  const totalDrives = plays.reduce((acc, play) => acc.add(play.game_drive_id), new Set()).size;

  const playCallFamilyStats: Record<string, PlayCallFamilyStats> = {};

  const redZoneDrives = new Set<number>();

  plays.forEach(play => {
    if (play.distance !== undefined && play.yards > play.distance) firstDowns++;

    if (play.result.includes("TD")) touchdowns++;

    if (play.game_drive_id !== undefined && play.yard_line !== undefined && play.yard_line <= 20) { 
      redZoneDrives.add(Number(play.game_drive_id)); 
      if (play.result.includes("TD")) redZoneTDs++;
    }

    if (play.yards >= 25) explosives++;
    if (play.yards >= 10) tenYardPlays++;
    if (play.yards >= 5) fiveYardPlays++;

    if (play.on_schedule) onSchedulePlays++;

    if (play.play_call_family) {
      if (!playCallFamilyStats[play.play_call_family]) {
        playCallFamilyStats[play.play_call_family] = { offSchedule: 0, total: 0, yards: [] }; // Initialize yards
      }

      playCallFamilyStats[play.play_call_family].total++;
      playCallFamilyStats[play.play_call_family].yards.push(play.yards); // Collect yards

      if (!play.on_schedule) {
        playCallFamilyStats[play.play_call_family].offSchedule++;
      }
    }
  });

  const redZoneTrips = redZoneDrives.size;
  
  const firstDownPercentage = (firstDowns / totalPlays) * 100;
  const onSchedulePlayPercentage = (onSchedulePlays / totalPlays) * 100;
  const driveTDPercentage = (touchdowns / totalDrives) * 100;
  const redZoneTDPercentage = redZoneTrips > 0 ? (redZoneTDs / redZoneTrips) * 100 : 0;

  // Calculate average, min, and max yards for each play call family
  Object.entries(playCallFamilyStats).forEach(([family, stats]) => {
    if (stats.yards.length > 0) {
      const totalYards = stats.yards.reduce((sum, yard) => sum + yard, 0);
      stats.avgYards = totalYards / stats.yards.length;
      stats.minYards = Math.min(...stats.yards);
      stats.maxYards = Math.max(...stats.yards);
      stats.family = family;
    }
  });

  return {
    firstDowns,
    firstDownPercentage,
    touchdowns,
    driveTDPercentage,
    redZoneTrips,
    redZoneTDPercentage,
    explosives,
    tenYardPlays,
    fiveYardPlays,
    onSchedulePlayPercentage,
    playCallFamilyStats
  };
}
