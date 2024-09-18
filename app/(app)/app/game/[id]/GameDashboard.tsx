import { TeamStats } from "@/data/types/viewDataTypes";
import React from "react";

const GameDashboard: React.FC<{ teamStats: TeamStats }> = ({ teamStats }) => (
  <div className="game-dashboard">
    <h3 className="mb-1">Overview</h3>
    <div className="dashboard-stats grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-3">
      <StatCard title="Touchdowns" value={teamStats.touchdowns} value2={teamStats.totalDrives} label="Drives" percentage={teamStats.driveTDPercentage} />
      <StatCard title="First Downs" value={teamStats.firstDowns} value2={teamStats.firstDownChances} label="Conv" percentage={teamStats.firstDownPercentage} />
      <StatCard title="On-Schedule Plays" value={teamStats.onSchedulePlays} value2={teamStats.totalPlays} percentage={teamStats.onSchedulePlayPercentage} label="Plays" />
      <StatCard title="Explosive Plays" value={teamStats.explosives} />
      <StatCard title="10+ Yard Plays" value={teamStats.tenYardPlays} />
      <StatCard title="5+ Yard Plays" value={teamStats.fiveYardPlays} />
    </div>
    <h3 className="mb-1">QB Play</h3>
    <h3 className="mb-1">By Play Groupings</h3>
    <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Object.entries(teamStats.playCallFamilyStats)
        .sort(([, a], [, b]) => (b.avgYards || 0) - (a.avgYards || 0))
        .map(([family, stats]) => {
          const onSchedule = stats.total - stats.offSchedule;
          const onSchedulePercentage = ((onSchedule / stats.total) * 100).toFixed(1);
          const threePlusYardsPercentage = ((stats.threePlusYards / stats.total) * 100).toFixed(1);
          return (
            <div key={family} className="bg-white p-2 rounded-xl text-center">
              <p className="font-semibold">{family}</p>
              <p className="text-xs text-neutral-950">On-Sched: {onSchedule}/{stats.total} (<span className="font-semibold">{onSchedulePercentage}%</span>)</p>
              <p className="text-xs text-neutral-950">3+ Yds: {stats.threePlusYards}/{stats.total} (<span className="font-semibold">{threePlusYardsPercentage}%</span>)</p>
              <div className="text-xs text-neutral-800 mt-2">
                <p>Avg Yards: {stats.avgYards?.toFixed(1)}</p>
                <p>Max Yards: {stats.maxYards}</p>
                <p>Min Yards: {stats.minYards}</p>
              </div>
            </div>
          );
        })}
    </div>
  </div>
);

const StatCard: React.FC<{ title: string; value?: number; value2?: number; percentage?: number; label?: string }> = ({ title, value, percentage, value2, label }) => (
  <div className="bg-white p-2 rounded-xl text-center">
    <p className="font-semibold">{title}</p>
    <p>{value !== undefined && <span className="text-lg font-bold">{value}</span>}{value2 !== undefined && <span className="text-lg font-bold">/{value2}</span>}<span className="text-xs"> {label}</span></p>
    {percentage !== undefined && <p className="text-neutral-700 text-sm font-medium">{percentage.toFixed(1)}%</p>}
  </div>
);

export default GameDashboard;