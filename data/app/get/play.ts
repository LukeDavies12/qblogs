import { GameDrive, SeasonGame } from "@/data/types/games";
import { Play } from "@/data/types/logPlayTypes";
import { createClient } from "@/utils/supabase/server";

interface PlayWithGameDriveAndGame {
  playData: Play;
  driveData: GameDrive;
  gameData: SeasonGame;
}

export async function getPlayById(playId: number): Promise<PlayWithGameDriveAndGame> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("plays")
    .select(`
      *,
      game_drive:game_drives (
        *,
        game:games (*)
      )
    `)
    .eq("id", playId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data || !data.game_drive || !data.game_drive.game) {
    throw new Error("Play, game drive, or game not found");
  }

  return {
    playData: data as Play,
    driveData: data.game_drive as GameDrive,
    gameData: data.game_drive.game as SeasonGame
  };
}