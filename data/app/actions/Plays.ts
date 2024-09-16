'use server'

import { FormationStrength, Play, PlayHash, PlayPersonnel, PlayResult } from "@/data/types/logPlayTypes";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function logGamePlay(formData: FormData, gameDriveId: number) {
  const supabase = createClient();

  const currentTeamQbId = await getCurrentTeamQbId();

  const newPlay: Play = {
    game_drive_id: BigInt(gameDriveId),
    hash: formData.get('hash') as PlayHash,
    yard_line: parseInt(formData.get('yard_line') as string),
    down: parseInt(formData.get('down') as string),
    distance: parseInt(formData.get('distance') as string),
    personnel: formData.get('personnel') as PlayPersonnel,
    formation_name: formData.get('formation_name') as string,
    back_alignment: formData.get('back_alignment') as string,
    formation_strength: formData.get('formation_strength') as FormationStrength,
    pass_protection: formData.get('pass_protection') as string,
    play_call: formData.get('play_call') as string,
    play_call_strength: formData.get('play_call_strength') as FormationStrength,
    result: formData.get('result') as PlayResult,
    yards: parseInt(formData.get('yards') as string),
    team_qb_id: currentTeamQbId,
    turnover_worthy_play: formData.get('turnover_worthy_play') === 'true',
    qb_pressured: formData.get('qb_pressured') === 'true',
    missed_check: formData.get('missed_check') === 'true',
    pass_read: formData.get('pass_read') === 'true',
    pass_ball_placement: formData.get('pass_ball_placement') === 'true',
    outstanding_qb_play: formData.get('outstanding_qb_play') === 'true',
    run_rpo_key_read: formData.get('run_rpo_key_read') === 'true',
    off_schedule_play_on_qb: formData.get('off_schedule_play_on_qb') === 'true',
    bad_play_reason: formData.get('bad_play_reason') as string,
    play_call_grouping: formData.get('play_call_grouping') as string,
    notes: formData.get('notes') as string,
    qb_run_execution: formData.get('qb_run_execution') === 'true',
    qb_run_read_key: formData.get('qb_run_read_key') === 'true',
    motion: formData.get('motion') as string,
    call_tag: formData.get('call_tag') as string,
  };

  Object.keys(newPlay).forEach(key => {
    if (newPlay[key as keyof Play] === undefined) {
      delete newPlay[key as keyof Play];
    }
  });
  const { data, error } = await supabase
    .from('plays')
    .insert([newPlay])
    .select();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('No data returned from insert');

  revalidatePath('/app/games', 'page');
  redirect('/app/games');
}

async function getCurrentTeamQbId() {
  const supabase = createClient();

  const { data: user_metadata, error: user_metadata_error } = await supabase
    .from('user_metadata')
    .select('team_id')
    .eq('auth_id', (await supabase.auth.getUser()).data.user?.id) // Moved eq after select
    .single();

  if (user_metadata_error) throw new Error(user_metadata_error.message);

  const { data: team_qb1, error: team_qb1_error } = await supabase
    .from('teams')
    .select('qb1')
    .eq('team_id', user_metadata?.team_id)
    .single();

  if (team_qb1_error) throw new Error(team_qb1_error.message);

  const  { data: team_qb_id, error: team_qb_id_error } = await supabase
    .from('team_qbs')
    .select('id')
    .eq('id', team_qb1?.qb1)
    .single();

  if (team_qb_id_error) throw new Error(team_qb_id_error.message);

  return team_qb_id?.id;
}