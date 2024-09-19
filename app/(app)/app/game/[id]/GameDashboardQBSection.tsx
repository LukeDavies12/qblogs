import { StatCard } from "@/comp/ui/StatCard";
import { TransformedQBData } from "@/data/types/viewDataTypes";

interface Props {
  qbStats: TransformedQBData;
}

const QBDashboard: React.FC<Props> = ({ qbStats }) => {
  return (
    <div>
      {Object.entries(qbStats).map(([qb, { fullName, stats }]) => (
        <div key={qb}>
          <h4>{fullName}</h4>
          <div className="dashboard-stats grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-3">
          <StatCard title="Completions" value={stats.completions} value2={stats.attempts} label="Att" percentage={parseFloat(((stats.completions/stats.attempts)*100).toFixed(1))} />
          <StatCard title="Passing Yds" value={stats.passingYards} />
          <StatCard title="Passing TDs" value={stats.passingTouchdowns} />
          <StatCard title="Pass Reads" value={stats.passReadsCount} value2={stats.attempts} label="Att" percentage={parseFloat(((stats.passReadsCount/stats.attempts)*100).toFixed(1))} />
          <StatCard title="Ball Placement" value={stats.passBallPlacementCount} value2={stats.attempts} label="Att" percentage={parseFloat(((stats.passBallPlacementCount/stats.attempts)*100).toFixed(1))} />
          <StatCard title="RPO Key Reads" value={stats.rpoPlaysReads} value2={stats.rpoPlays} label="RPOs" percentage={parseFloat(((stats.rpoPlaysReads/stats.rpoPlays)*100).toFixed(1))} />
          <StatCard title="RPO Throw Conv" value={stats.rpoPlaysCompleted} value2={stats.rpoPlaysThrown} label="Att" percentage={parseFloat(((stats.rpoPlaysCompleted/stats.rpoPlaysThrown)*100).toFixed(1))} />
          <StatCard title="Sacks v Pressure" value={stats.sacks} value2={stats.pressured} label="Pressured" percentage={parseFloat(((stats.sacks/stats.pressured)*100).toFixed(1))} />
          <StatCard title="Scrambles" value={stats.scrambleAttempts} />
          <StatCard title="Scramble Yds" value={stats.scrambleYards} />
          <StatCard title="Scramble TDs" value={stats.scrambleTouchdowns} />
          <StatCard title="Big Plays" value={stats.outstandingPlays} />
          <StatCard title="Turnover Worthy" value={stats.turnoverWorthyPlays} value2={stats.allPlaysCount} label="Plays" percentage={parseFloat(((stats.turnoverWorthyPlays/stats.allPlaysCount)*100).toFixed(1))}  />
          </div>
        </div>
      ))}
    </div>
  );
};

export default QBDashboard;