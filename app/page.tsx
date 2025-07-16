import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data, error } = await supabase.auth.getUser();
  
  // If user is signed in, redirect to dashboard
  if (data?.user && !error) {
    redirect("/dashboard");
  }
  
  // If not signed in, redirect to login
  redirect("/auth/login");
}
