import BackLink from "@/comp/ui/backlink";
import { getUserData } from "@/data/admin-app/get/getUserData";
import { getPlayById } from "@/data/app/get/play";
import { Play } from "@/data/types/logPlayTypes";
import { Suspense } from 'react';
import PlayDataCorrection from "./PlayDataCorrection";

type AuthorizedRole = 'sa' | 'ef' | 'el';

const isAuthorized = (roleCode: string | undefined): roleCode is AuthorizedRole => {
  return roleCode === 'sa' || roleCode === 'ef' || roleCode === 'el';
};

async function AuthorizedPlayDataCorrection({ play }: { play: Play }) {
  const userData = await getUserData();
  const authorized = isAuthorized(userData.roleCode);

  return <PlayDataCorrection play={play} authorized={authorized} />;
}

export default async function Page({ params }: { params: { id: string } }) {
  const play = await getPlayById(Number(params.id));

  return (
    <>
      <BackLink href={`/app/game/drive/${play.playData.game_drive_id}`} label="Drive" />
      <h1>Play {play.playData.num_in_game_drive} of Drive {play.driveData.number_in_game} vs {play.gameData.against}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthorizedPlayDataCorrection play={play.playData} />
      </Suspense>
    </>
  );
}