"server only"

import { createClient } from "@/utils/supabase/server";

export async function getTeamQBs(qbIds: number[]) {
  const supabase = createClient();

  const { data: teamQBs, error } = await supabase
    .from("team_qbs")
    .select("*")
    .in("id", qbIds);

  if (error) {
    throw new Error(error.message);
  }

  return teamQBs;
}