"server only";

import { SeasonGame } from "@/data/types/games";
import { createClient } from "@/utils/supabase/server";

type CombinedResult = {
  season_games?: SeasonGame[];
  error?: string;
};

export default async function seasonGames(): Promise<CombinedResult> {
  const supabase = createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: userMetadata, error: metadataError } = await supabase
      .from("user_metadata")
      .select("current_season_id")
      .eq("auth_id", user.id)
      .single();

    if (metadataError) {
      throw new Error(metadataError.message);
    }

    if (!userMetadata || !userMetadata.current_season_id) {
      throw new Error("Current season not set for user");
    }

    const current_season_id = userMetadata.current_season_id;

    const { data, error } = await supabase
      .from("games")
      .select("id, date, against, season_id, result")
      .eq("season_id", current_season_id);

    if (error) {
      throw new Error(error.message);
    }

    const typedData: SeasonGame[] = data.map((game) => ({
      id: game.id,
      date: game.date,
      against: game.against,
      season_id: game.season_id,
      result: game.result,
    }));

    return {
      season_games: typedData,
    };
  } catch (error) {
    return { error: (error as Error).message };
  }
}