import { getDriveById } from "@/data/app/get/gameDrive";
import { GameDriveWithPlays } from "@/data/types/games";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const drive = await getDriveById(Number(params.id)) as GameDriveWithPlays;

  return (
    <div>
      <h1>Drive {drive.number_in_game}</h1>
      <h2>Plays</h2>
      <ul>
        {drive.plays.map((play) => (
          <li key={play.id}>
            {play.team_qb_id}
          </li>
        ))}
      </ul>
    </div>
  )
}