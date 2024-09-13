import { roleMap, titleMap } from "@/data/types/userTypes";
import { createClient } from "@/utils/supabase/server";

type UserMetadata = {
  full_name: string;
  role: string;
  title: string;
  current_team_id: string;
};

type TeamData = {
  name: string;
};

type UserDataResult = {
  user_metadata: UserMetadata;
  team: TeamData;
};

type CombinedResult = {
  role?: string;
  roleCode?: string;
  title?: string;
  titleCode?: string;
  full_name?: string;
  team_name?: string;
  team_id?: string;
  error?: string;
  isUser: boolean;
};

export async function getUserData(): Promise<CombinedResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc("get_user_data").single();

    if (error) {
      throw new Error(error.message);
    }

    if (data && typeof data === "object" && "error" in data) {
      throw new Error((data as { error: string }).error);
    }

    const typedData = data as UserDataResult;
    const userData = typedData.user_metadata;
    const teamData = typedData.team;

    return {
      role: roleMap[userData.role as keyof typeof roleMap] || userData.role,
      roleCode: userData.role,
      title:
        titleMap[userData.title as keyof typeof titleMap] || userData.title,
      titleCode: userData.title,
      full_name: userData.full_name,
      team_name: teamData?.name,
      team_id: userData.current_team_id,
      isUser: true,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      isUser: false,
    };
  }
}
