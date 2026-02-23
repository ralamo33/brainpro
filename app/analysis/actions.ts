"use server";

import { err, ok } from "@/lib/result/result";
import type { Result } from "@/lib/result/result";
import { createServerSupabase } from "@/lib/supabase/server";

export type SessionStat = {
    id: string;
    created_at: string;
    face_count: number;
    correct: number;
    total: number;
};

export async function getUserSessionStats(): Promise<Result<SessionStat[]>> {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.rpc("get_user_session_stats");

    if (error) return err(error.message);
    return ok(data ?? []);
}
