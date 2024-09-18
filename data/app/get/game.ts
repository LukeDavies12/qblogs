import { GameDrive, IndividualGame } from "@/data/types/games";
import { Play } from "@/data/types/logPlayTypes";
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

  const gameDrivesWithPlays: GameDrive[] = await Promise.all(
    drivesData.map(async (drive) => {
      const { data: playsData, error: playsError } = await supabase
        .from("plays")
        .select("*")
        .eq("game_drive_id", drive.id);

      if (playsError) {
        throw new Error(playsError.message);
      }

      const plays: Play[] = playsData.map((play): Play => ({
        id: play.id,
        practice_block_id: play.practice_block_id,
        game_drive_id: play.game_drive_id,
        num_in_game_drive: play.num_in_game_drive,
        hash: play.hash,
        yard_line: play.yard_line,
        down: play.down,
        distance: play.distance,
        personnel: play.personnel,
        formation_name: play.formation_name,
        back_alignment: play.back_alignment,
        formation_strength: play.formation_strength,
        pass_protection: play.pass_protection,
        play_call: play.play_call,
        play_call_strength: play.play_call_strength,
        result: play.result,
        yards: play.yards,
        team_qb_id: play.team_qb_id,
        turnover_worthy_play: play.turnover_worthy_play,
        qb_pressured: play.qb_pressured,
        missed_check: play.missed_check,
        pass_read: play.pass_read,
        pass_ball_placement: play.pass_ball_placement,
        outstanding_qb_play: play.outstanding_qb_play,
        run_rpo_key_read: play.run_rpo_key_read,
        off_schedule_play_on_qb: play.off_schedule_play_on_qb,
        bad_play_reason: play.bad_play_reason,
        play_call_grouping: play.play_call_grouping,
        notes: play.notes,
        qb_run_execution: play.qb_run_execution,
        qb_run_read_key: play.qb_run_read_key,
        motion: play.motion,
        call_tag: play.call_tag,
        on_schedule: play.on_schedule,
        play_call_family: play.play_call_family,
      }));

      return {
        id: drive.id,
        game_id: id,
        number_in_game: drive.number_in_game,
        plays,
      };
    })
  );

  const seasonGame: IndividualGame = {
    ...gameData,
    game_drives: gameDrivesWithPlays,
  };

  return seasonGame;
}
