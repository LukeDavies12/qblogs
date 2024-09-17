import { Play } from '@/data/types/logPlayTypes';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export const DrivePlaysTable: React.FC<{ plays: Play[] }> = ({ plays }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-neutral-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-600"># in Drive</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-600">Down</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-600">Distance</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-600">Play Call Type</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-600">Play Call</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-600">Play Call Family</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-600">Result</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-600">Yards</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-neutral-600">On Schedule</th>
          </tr>
        </thead>
        <tbody>
          {plays.map((play) => (
            <tr key={play.id} className="border-b border-neutral-200 hover:bg-neutral-50">
              <td className="px-4 py-2 text-sm">{play.num_in_game_drive}</td>
              <td className="px-4 py-2 text-sm">{play.down}</td>
              <td className="px-4 py-2 text-sm">{play.distance}</td>
              <td className="px-4 py-2 text-sm">{play.play_call_grouping}</td>
              <td className="px-4 py-2 text-sm">{play.play_call}</td>
              <td className="px-4 py-2 text-sm">{play.play_call_family}</td>
              <td className="px-4 py-2 text-sm">{play.result}</td>
              <td className="px-4 py-2 text-sm">{play.yards}</td>
              <td className="px-4 py-2 text-sm">
              {play.on_schedule === true ? (
                  <CheckCircleIcon className="text-green-500 h-5 w-5" />
                ) : (
                  <XCircleIcon className="text-red-500 h-5 w-5" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
