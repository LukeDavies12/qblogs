export const StatCard: React.FC<{ title: string; value?: number; value2?: number; percentage?: number; label?: string }> = ({ title, value, percentage, value2, label }) => (
  <div className="bg-white p-2 rounded-xl text-center">
    <p className="font-semibold">{title}</p>
    <p>{value !== undefined && <span className="text-lg font-bold">{value}</span>}{value2 !== undefined && <span className="text-lg font-bold">/{value2}</span>}<span className="text-xs"> {label}</span></p>
    {percentage !== undefined && <p className="text-neutral-700 text-sm font-medium">{percentage.toFixed(1)}%</p>}
  </div>
);