import { createServerSupabase } from "@/lib/supabase/server";
import { isErr } from "@/lib/result/result";
import { notFound } from "next/navigation";
import { getGameSession } from "../../actions";
import { AnswerClient } from "./AnswerClient";

type Props = {
    params: Promise<{ sessionId: string }>;
};

export default async function AnswerPage({ params }: Props) {
    const { sessionId } = await params;

    const sessionResult = await getGameSession(sessionId);
    if (isErr(sessionResult)) return notFound();

    const session = sessionResult.data;
    const supabase = await createServerSupabase();
    const { data: faces } = await supabase
        .from("face")
        .select("id, file_path")
        .in("id", session.face_ids);

    if (!faces) return notFound();

    const sortedFaces = session.face_ids
        .map((id) => faces.find((f) => f.id === id))
        .filter((f): f is { id: string; file_path: string } => f !== undefined);

    return <AnswerClient sessionId={sessionId} faces={sortedFaces} />;
}
