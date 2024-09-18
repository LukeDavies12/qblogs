// GameDashboard.tsx
import { PlayStats } from "@/data/types/logPlayTypes"; // Make sure the PlayStats type is defined appropriately
import React from "react";

interface GameDashboardProps {
  playStats: PlayStats;
}

const GameDashboard: React.FC<GameDashboardProps> = ({ playStats }) => {
  return (
    <div className="game-dashboard">
      <h3 className="mb-1">Overview</h3>
      <div className="dashboard-stats grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
        <StatCard title="First Downs" value={playStats.firstDowns} percentage={playStats.firstDownPercentage} />
        <StatCard title="Touchdowns" value={playStats.touchdowns} percentage={playStats.driveTDPercentage} />
        <StatCard title="Drive TD%" percentage={playStats.driveTDPercentage} />
        <StatCard title="Red Zone TD%" percentage={playStats.redZoneTDPercentage} />
        <StatCard title="Explosive Plays" value={playStats.explosives} />
        <StatCard title="10+ Yard Plays" value={playStats.tenYardPlays} />
        <StatCard title="5+ Yard Plays" value={playStats.fiveYardPlays} />
        <StatCard title="On-Schedule Play%" percentage={playStats.onSchedulePlayPercentage} />
      </div>

      <h3 className="mb-1">QB Play</h3>

      <h3 className="mb-1">By Play Groupings</h3>
      <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Object.entries(playStats.playCallFamilyStats)
          .sort(([, a], [, b]) => (b.avgYards || 0) - (a.avgYards || 0)) // Sort by avgYards in descending order
          .map(([family, stats]) => {
            const onSchedule = stats.total - stats.offSchedule;
            const onSchedulePercentage = ((onSchedule / stats.total) * 100).toFixed(2);

            return (
              <div key={family} className="bg-white p-2 rounded-xl text-center">
                <p className="font-bold">{family}</p>
                <p className="text-xs text-neutral-600">
                  On-Sched: {onSchedule}/{stats.total} ({onSchedulePercentage}%)
                </p>
                <div className="text-xs text-neutral-600 mt-2">
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
};

interface StatCardProps {
  title: string;
  value?: number;
  percentage?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, percentage }) => {
  return (
    <div className="bg-white p-2 rounded-xl text-center">
      <p className="font-bold text-lg">{title}</p>
      {value !== undefined && <p className="text-2xl font-bold">{value}</p>}
      {percentage !== undefined && <p className="text-neutral-600 text-sm">{percentage.toFixed(2)}%</p>}
    </div>
  );
};

export default GameDashboard;
