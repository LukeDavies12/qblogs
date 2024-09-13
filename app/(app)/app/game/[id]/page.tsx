import { getGameById } from "@/data/app/get/game";
import { IndividualGame } from "@/data/types/games";
import { formatDate } from "@/data/types/parseDate";
import Link from "next/link";
import AddGameDrive from "./AddGameDrive";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const game = await getGameById(Number(params.id)) as IndividualGame;

  return (
    <>
      <h1>{formatDate(game.date)} vs {game.against} Game</h1>
      <h2>Log Plays</h2>
      {game.game_drives.map((drive) => (
        <Link key={drive.id} href={`/app/game//drive/${drive.id}`}
        className="block p-2 bg-card hover:bg-neutral-50 hover:text-neutral-600 text-neutral-700 rounded-xl underline"> 
            Drive {drive.number_in_game}
        </Link>
      ))}
      <AddGameDrive gameId={game.id} />
    </>
  );
}