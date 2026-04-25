import { supabase } from "./supabaseClient";

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Auth error:", error.message);
      return null;
    }

    if (!data?.user) {
      return null;
    }

    return data.user;
  } catch (err: any) {
    console.error("Unexpected error:", err.message);
    return null;
  }
}