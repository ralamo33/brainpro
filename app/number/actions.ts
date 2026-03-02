"use server";

import { err, ok } from "@/lib/result/result";
import type { Result } from "@/lib/result/result";
import type { Tables } from "@/lib/supabase/types";
import { createServerSupabase } from "@/lib/supabase/server";

export async function getNextNumberLength(): Promise<Result<number>> {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return ok(3);

    const { data, error } = await supabase
        .from("number_session")
        .select("id, created_at, number, number_answer(answer)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

    if (error || !data || data.length === 0) return ok(3);

    const toStats = (s: typeof data[0]) => {
        const length = s.number.length;
        const answer = s.number_answer[0]?.answer ?? "";
        const correct = answer === s.number;
        return { length, correct, created_at: s.created_at };
    };

    const sessions = data.map(toStats);
    const last = sessions[0];
    const withinHour = Date.now() - new Date(last.created_at).getTime() < 60 * 60 * 1000;

    if (withinHour) {
        return ok(last.correct ? last.length + 1 : Math.max(1, last.length - 2));
    }

    const lastSuccessful = sessions.find((s) => s.correct);
    return ok(Math.max(1, (lastSuccessful?.length ?? 3) - 2));
}

export async function createNumberSession(number: string): Promise<Result<string>> {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return err("Not authenticated");

    const { data, error } = await supabase
        .from("number_session")
        .insert({ number, user_id: user.id })
        .select("id")
        .single();

    if (error || !data) return err(error?.message ?? "Failed to create session");
    return ok(data.id);
}

export async function getNumberSession(
    sessionId: string,
): Promise<Result<Tables<"number_session">>> {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
        .from("number_session")
        .select("*")
        .eq("id", sessionId)
        .single();

    if (error || !data) return err(error?.message ?? "Session not found");
    return ok(data);
}

export async function submitNumberAnswer(
    sessionId: string,
    answer: string,
): Promise<Result<boolean>> {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return err("Not authenticated");

    const { data: session, error: sessionError } = await supabase
        .from("number_session")
        .select("number")
        .eq("id", sessionId)
        .single();

    if (sessionError || !session) return err("Session not found");

    const is_correct = answer.trim() === session.number;

    const { error } = await supabase
        .from("number_answer")
        .insert({ number_session_id: sessionId, answer: answer.trim(), user_id: user.id });

    if (error) return err(error.message);
    return ok(is_correct);
}

export async function getNumberAnswer(
    sessionId: string,
): Promise<Result<Tables<"number_answer">>> {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
        .from("number_answer")
        .select("*")
        .eq("number_session_id", sessionId)
        .single();

    if (error || !data) return err(error?.message ?? "Answer not found");
    return ok(data);
}
