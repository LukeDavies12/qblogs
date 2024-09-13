"server only"

import { createClient } from "@/utils/supabase/server";

export async function seasonCheck() {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user) {
    return { error: "User not found", isUser: false };
  }

  const { data: user_metadata, error: user_metadata_error } = await supabase
    .from("user_metadata")
    .select("current_season_id")
    .eq("auth_id", user.data.user?.id)
    .single();

  if (user_metadata_error) {
    return { error: user_metadata_error.message, isUser: false };
  }

  const { data: season, error: season_error } = await supabase
    .from("seasons")
    .select("*")
    .eq("id", user_metadata.current_season_id)
    .single();

  if (season_error) {
    return { error: season_error.message, isUser: false };
  }

  const hasCurrentSeason = season ? true : false;

  return {
    hasCurrentSeason: hasCurrentSeason,
    seasonId: season.id,
    seasonYear: season.year,
    isFall: season.is_fall,
    teamId: season.team_id
  };
}