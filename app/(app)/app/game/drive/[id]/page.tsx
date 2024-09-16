import BackLink from "@/comp/ui/backlink";
import { getDriveById } from "@/data/app/get/gameDrive";
import { GameDriveWithPlays } from "@/data/types/games";
import LogGamePlays from "./LogGamePlays";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const drive = await getDriveById(Number(params.id)) as GameDriveWithPlays;

  return (
    <>
      <BackLink href={`/app/game/${drive.game_id}`} label="Game" />
      <h1>Drive {drive.number_in_game}</h1>
      <h2>Plays</h2>
      <ul>
        {drive.plays.map((play) => (
          <li key={play.id}>
            {play.team_qb_id}
          </li>
        ))}
      </ul>
      <h2>Log</h2>
      <LogGamePlays gameDriveId={drive.id} />
    </>
  )
}