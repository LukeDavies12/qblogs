"use server";

import {
  FormationStrength,
  Play,
  PlayHash,
  PlayPersonnel,
  PlayResult,
} from "@/data/types/logPlayTypes";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseIntOrNull(value: string | null): number | null {
  if (value === null) return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

export async function logGamePlay(formData: FormData, gameDriveId: number) {
  const supabase = createClient();

  const currentTeamQbId = await getCurrentTeamQbId();
  const down = parseIntOrNull(formData.get("down") as string);
  const distance = parseIntOrNull(formData.get("distance") as string);
  const yards = parseIntOrNull(formData.get("yards") as string);

  if (down === null || distance === null || yards === null) {
    throw new Error(
      "Invalid input: down, distance, and yards must be valid numbers"
    );
  }

  let on_schedule = false;

  if (down === 1 && distance - yards <= 6) {
    on_schedule = true;
  } else if (down === 2 && distance - yards <= distance / 2) {
    on_schedule = true;
  } else if ((down === 3 || down === 4) && yards >= distance) {
    on_schedule = true;
  }

  const newPlay: Omit<Play, "game_drive_id"> & { game_drive_id: number } = {
    num_in_game_drive: parseInt(formData.get("num_in_game_drive") as string),
    game_drive_id: gameDriveId, // Use number instead of BigInt
    hash: formData.get("hash") as PlayHash,
    yard_line: parseInt(formData.get("yard_line") as string),
    down,
    distance,
    personnel: formData.get("personnel") as PlayPersonnel,
    formation_name: formData.get("formation_name") as string,
    back_alignment: formData.get("back_alignment") as string,
    formation_strength: formData.get("formation_strength") as FormationStrength,
    pass_protection: formData.get("pass_protection") as string,
    play_call: formData.get("play_call") as string,
    play_call_strength: formData.get("play_call_strength") as FormationStrength,
    result: formData.get("result") as PlayResult,
    yards,
    team_qb_id: currentTeamQbId,
    turnover_worthy_play: formData.get("turnover_worthy_play") === "true",
    qb_pressured: formData.get("qb_pressured") === "true",
    missed_check: formData.get("missed_check") === "true",
    pass_read: formData.get("pass_read") === "true",
    pass_ball_placement: formData.get("pass_ball_placement") === "true",
    outstanding_qb_play: formData.get("outstanding_qb_play") === "true",
    run_rpo_key_read: formData.get("run_rpo_key_read") === "true",
    off_schedule_play_on_qb: formData.get("off_schedule_play_on_qb") === "true",
    bad_play_reason: formData.get("bad_play_reason") as string,
    play_call_grouping: formData.get("play_call_grouping") as string,
    notes: formData.get("notes") as string,
    qb_run_execution: formData.get("qb_run_execution") === "true",
    qb_run_read_key: formData.get("qb_run_read_key") === "true",
    motion: formData.get("motion") as string,
    call_tag: formData.get("call_tag") as string,
    play_call_family: formData.get("play_call_family") as string,
    on_schedule,
  };

  Object.keys(newPlay).forEach((key) => {
    if (newPlay[key as keyof typeof newPlay] === undefined) {
      delete newPlay[key as keyof typeof newPlay];
    }
  });

  const { data, error } = await supabase
    .from("plays")
    .insert([newPlay])
    .select();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned from insert");

  revalidatePath(`/app/game/drive/${gameDriveId}`, "page");
  redirect(`/app/game/drive/${gameDriveId}`);
}

async function getCurrentTeamQbId() {
  const supabase = createClient();

  const { data: user_metadata, error: user_metadata_error } = await supabase
    .from("user_metadata")
    .select("current_team_id")
    .eq("auth_id", (await supabase.auth.getUser()).data.user?.id) // Moved eq after select
    .single();

  if (user_metadata_error) throw new Error(user_metadata_error.message);

  const { data: team_qb1, error: team_qb1_error } = await supabase
    .from("teams")
    .select("qb1")
    .eq("id", user_metadata?.current_team_id)
    .single();

  if (team_qb1_error) throw new Error(team_qb1_error.message);

  const { data: team_qb_id, error: team_qb_id_error } = await supabase
    .from("team_qbs")
    .select("id")
    .eq("id", team_qb1?.qb1)
    .single();

  if (team_qb_id_error) throw new Error(team_qb_id_error.message);

  return team_qb_id?.id;
}

export async function updatePlay(formData: FormData, playId: number): Promise<void> {
  const supabase = createClient();

  const down = parseInt(formData.get("down") as string);
  const distance = parseInt(formData.get("distance") as string);
  const yards = parseInt(formData.get("yards") as string);

  if (isNaN(down) || isNaN(distance) || isNaN(yards)) {
    throw new Error("Invalid input: down, distance, and yards must be valid numbers");
  }

  const updatedPlay: Partial<Play> = {
    num_in_game_drive: parseInt(formData.get("num_in_game_drive") as string),
    hash: formData.get("hash") as PlayHash,
    yard_line: parseInt(formData.get("yard_line") as string),
    down,
    distance,
    personnel: formData.get("personnel") as PlayPersonnel,
    formation_name: formData.get("formation_name") as string,
    back_alignment: formData.get("back_alignment") as string,
    formation_strength: formData.get("formation_strength") as FormationStrength,
    pass_protection: formData.get("pass_protection") as string,
    play_call: formData.get("play_call") as string,
    play_call_strength: formData.get("play_call_strength") as FormationStrength,
    result: formData.get("result") as PlayResult,
    yards,
    turnover_worthy_play: formData.get("turnover_worthy_play") === "true",
    qb_pressured: formData.get("qb_pressured") === "true",
    missed_check: formData.get("missed_check") === "true",
    pass_read: formData.get("pass_read") === "true",
    pass_ball_placement: formData.get("pass_ball_placement") === "true",
    outstanding_qb_play: formData.get("outstanding_qb_play") === "true",
    run_rpo_key_read: formData.get("run_rpo_key_read") === "true",
    off_schedule_play_on_qb: formData.get("off_schedule_play_on_qb") === "true",
    bad_play_reason: formData.get("bad_play_reason") as string,
    play_call_grouping: formData.get("play_call_grouping") as string,
    notes: formData.get("notes") as string,
    qb_run_execution: formData.get("qb_run_execution") === "true",
    qb_run_read_key: formData.get("qb_run_read_key") === "true",
    motion: formData.get("motion") as string,
    call_tag: formData.get("call_tag") as string,
    play_call_family: formData.get("play_call_family") as string,
  };

  Object.keys(updatedPlay).forEach((key) => {
    if (updatedPlay[key as keyof typeof updatedPlay] === undefined) {
      delete updatedPlay[key as keyof typeof updatedPlay];
    }
  });

  const { data, error } = await supabase
    .from("plays")
    .update(updatedPlay)
    .eq("id", playId)
    .select();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("No data returned from update");

  revalidatePath(`/app/game/drive/${data[0].game_drive_id}`, "page");
  redirect(`/app/game/drive/${data[0].game_drive_id}`);
}
