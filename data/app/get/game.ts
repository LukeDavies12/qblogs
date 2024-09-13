import { GameDrive, IndividualGame } from "@/data/types/games";
import { createClient } from "@/utils/supabase/server";

export async function getGameById(id: number): Promise<IndividualGame> {
  const supabase = createClient();
  
  const { data: gameData, error: gameError } = await supabase
    .from("games")
    .select("id, date, against, season_id, result")
    .eq("id", id)
    .single();

  if (gameError) {
    throw new Error(gameError.message);
  }

  if (!gameData) {
    throw new Error("Game not found");
  }

  const { data: drivesData, error: drivesError } = await supabase
    .from("game_drives")
    .select("id, number_in_game")
    .eq("game_id", id);

  if (drivesError) {
    throw new Error(drivesError.message);
  }

  const seasonGame: IndividualGame = {
    ...gameData,
    game_drives: drivesData.map((drive): GameDrive => ({
      id: drive.id,
      game_id: id,
      number_in_game: drive.number_in_game,
    }))
  };

  return seasonGame;
}