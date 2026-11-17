import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Header } from "./Header";

export async function HeaderServer() {
  // `connection()` opts this component out of prerendering —
  // it must run at request time since it reads cookies for auth.
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userInfo: {
    email: string;
    fullName?: string | null;
    avatarUrl?: string | null;
  } | null = null;

  if (user) {
    userInfo = {
      email: user.email ?? "",
      fullName:
        (user.user_metadata?.full_name as string | undefined) ?? null,
      avatarUrl:
        (user.user_metadata?.avatar_url as string | undefined) ?? null,
    };
  }

  return <Header user={userInfo} />;
}
