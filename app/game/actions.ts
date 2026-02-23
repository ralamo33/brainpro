"use server";

import { err, ok } from "@/lib/result/result";
import type { Result } from "@/lib/result/result";
import type { Tables } from "@/lib/supabase/types";
import { createServerSupabase } from "@/lib/supabase/server";

export async function createGameSession(faceIds: string[]): Promise<Result<string>> {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from("game_session")
        .insert({ face_ids: faceIds, user_id: user?.id ?? null })
        .select("id")
        .single();

    if (error || !data) return err(error?.message ?? "Failed to create session");
    return ok(data.id);
}

export async function getGameSession(
    sessionId: string,
): Promise<Result<Tables<"game_session">>> {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
        .from("game_session")
        .select("*")
        .eq("id", sessionId)
        .single();

    if (error || !data) return err(error?.message ?? "Session not found");
    return ok(data);
}

export async function submitAnswer(
    sessionId: string,
    faceId: string,
    answer: string,
): Promise<Result<boolean>> {
    const supabase = await createServerSupabase();

    const { data: face, error: faceError } = await supabase
        .from("face")
        .select("name")
        .eq("id", faceId)
        .single();

    if (faceError || !face) return err("Face not found");

    const is_correct = answer.trim().toLowerCase() === face.name.trim().toLowerCase();

    const { error } = await supabase
        .from("game_answer")
        .insert({ session_id: sessionId, face_id: faceId, answer, is_correct });

    if (error) return err(error.message);
    return ok(is_correct);
}

export async function getNextFaceCount(): Promise<Result<number>> {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.rpc("get_user_session_stats");

    if (error) return err(error.message);

    const sessions = data ?? [];

    if (sessions.length === 0) return ok(3);

    const last = sessions[0];
    const isSuccessful = (s: { correct: number; total: number }) =>
        s.total > 0 && s.correct === s.total;
    const withinHour =
        Date.now() - new Date(last.created_at).getTime() < 60 * 60 * 1000;

    if (withinHour) {
        return ok(isSuccessful(last)
            ? last.face_count + 1
            : Math.max(1, last.face_count - 2));
    }

    const lastSuccessful = sessions.find(isSuccessful);
    return ok(Math.max(1, (lastSuccessful?.face_count ?? 3) - 2));
}

export async function getSessionAnswers(
    sessionId: string,
): Promise<Result<Tables<"game_answer">[]>> {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
        .from("game_answer")
        .select("*")
        .eq("session_id", sessionId);

    if (error) return err(error.message);
    return ok(data ?? []);
}
