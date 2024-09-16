'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addGame(formData: FormData) {
  const supabase = createClient();

  const { data: user_metadata, error: user_metadata_error } = await supabase
    .from('user_metadata')
    .select('current_season_id')
    .eq('auth_id', (await supabase.auth.getUser()).data.user?.id) // Moved eq after select
    .single();

  if (user_metadata_error) throw new Error(user_metadata_error.message);

  const newGame = {
    date: formData.get('date') as string,
    season_id: user_metadata?.current_season_id as string,
    against: formData.get('against') as string,
    result: formData.get('result') === 'true',
  };

  const { data, error } = await supabase
    .from('games')
    .insert([newGame])
    .select();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('No data returned from insert');
  revalidatePath('/app/games', 'page');
  redirect('/app/games');
}