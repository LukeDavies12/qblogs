import { GameDriveWithPlays } from "@/data/types/games";
import { createClient } from "@/utils/supabase/server";

// get game drive by id but also get all of its plays
export async function getDriveById(id: number): Promise<GameDriveWithPlays> {
  const supabase = createClient();
  
  const { data: driveData, error: driveError } = await supabase
    .from("game_drives")
    .select("id, number_in_game, game_id")
    .eq("id", id)
    .single();

  if (driveError) {
    throw new Error(driveError.message);
  }

  if (!driveData) {
    throw new Error("Drive not found");
  }

  const { data: playsData, error: playsError } = await supabase
    .from("plays")
    .select("*")
    .eq("game_drive_id", driveData.id);

  if (playsError) {
    throw new Error(playsError.message);
  }

  const gameDrive: GameDriveWithPlays = {
    id: driveData.id,
    game_id: driveData.game_id,
    number_in_game: driveData.number_in_game,
    plays: playsData
  };

  return gameDrive;
}