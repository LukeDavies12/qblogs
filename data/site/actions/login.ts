"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function login(formData: FormData) {
  const supabase = createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: auth_user, error: auth_user_error } =
    await supabase.auth.signInWithPassword(data);

  if (auth_user_error) {
    return { error: auth_user_error.message };
  }

  const { data: user_metadata, error: user_metadata_error } = await supabase
    .from("user_metadata")
    .select("role")
    .eq("auth_id", auth_user.user.id)
    .single();

  if (user_metadata_error) {
    return { error: user_metadata_error.message };
  }

  if (user_metadata.role === "sa") {
    revalidatePath("/", "layout");
    redirect("/admin");
  } else {
    revalidatePath("/", "layout");
    redirect("/app");
  }
}