"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function nextStringLength() {
    const supabase = await createServerSupabase();
}
