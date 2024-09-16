"use server";

import { GameDrive } from "@/data/types/games";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createGameDrive(gameId: number): Promise<GameDrive | null> {
  const supabase = createClient();

  // Fetch the latest drive number
  const { data: latestDrive, error: fetchError } = await supabase
    .from("game_drives")
    .select("number_in_game")
    .eq("game_id", gameId)
    .order("number_in_game", { ascending: false })
    .limit(1)
    .maybeSingle();  // Use maybeSingle instead of single

  if (fetchError && fetchError.code !== 'PGRST116') {  // PGRST116 is the error code for no rows returned
    throw new Error(fetchError.message);
  }

  const nextNumber = latestDrive ? latestDrive.number_in_game + 1 : 1;

  // Insert the new game drive
  const { data, error } = await supabase
    .from("game_drives")
    .insert({ game_id: gameId, number_in_game: nextNumber })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/app/game/[id]", "page");
  return data;
}