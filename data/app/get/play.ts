import { Play } from "@/data/types/logPlayTypes";
import { createClient } from "@/utils/supabase/server";

export async function getPlayById(playId: number): Promise<Play> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("plays")
    .select("*")
    .eq("id", playId)
    .single(); 

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Play not found");
  }

  return data as Play;
}