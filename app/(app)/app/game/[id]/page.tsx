import BackLink from "@/comp/ui/backlink";
import { getGameById } from "@/data/app/get/game";
import { transformGamePlaysTeam } from "@/data/app/get/transformGame";
import { IndividualGame } from "@/data/types/games";
import { Play } from "@/data/types/logPlayTypes";
import { formatDate } from "@/data/types/parseDate";
import Link from "next/link";
import AddGameDrive from "./AddGameDrive";
import GameDashboard from "./GameDashboard";

export default async function Page({ params }: { params: { id: string } }) {
  const game = await getGameById(Number(params.id)) as IndividualGame;
  const allPlays = game.game_drives.flatMap((drive) => drive.plays).filter((play): play is Play => play !== undefined);
  
  return (
    <>
      <BackLink href="/app/games" label="All Games" />
      <h1>{formatDate(game.date)} vs {game.against} Game</h1>
      <h2>Game Stats</h2>
      <GameDashboard teamStats={transformGamePlaysTeam(allPlays)} />
      <h2>Log Plays</h2>
      <div className="grid md:grid-cols-4 lg:grid-cols-8 gap-4">
        {game.game_drives.map((drive) => (
          <Link
            key={drive.id}
            href={`/app/game/drive/${drive.id}`}
            className="block p-2 bg-card hover:bg-neutral-50 hover:text-neutral-600 text-neutral-700 rounded-xl underline"
          >
            Drive {drive.number_in_game}
          </Link>
        ))}
      </div>
      <AddGameDrive gameId={game.id} />
    </>
  );
}
