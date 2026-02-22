import { createServerSupabase } from "@/lib/supabase/server";
import { isErr } from "@/lib/result/result";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGameSession, getSessionAnswers } from "../../actions";
import { GameFace } from "@/components/gameFace";
import { Button } from "@/components/ui/button";

type Props = {
    params: Promise<{ sessionId: string }>;
};

export default async function ScorePage({ params }: Props) {
    const { sessionId } = await params;

    const [sessionResult, answersResult] = await Promise.all([
        getGameSession(sessionId),
        getSessionAnswers(sessionId),
    ]);

    if (isErr(sessionResult) || isErr(answersResult)) return notFound();

    const session = sessionResult.data;
    const answers = answersResult.data;

    const supabase = await createServerSupabase();
    const { data: faces } = await supabase
        .from("face")
        .select("id, file_path, name")
        .in("id", session.face_ids);

    if (!faces) return notFound();

    const correct = answers.filter((a) => a.is_correct).length;
    const total = answers.length;

    const results = session.face_ids
        .map((faceId) => ({
            face: faces.find((f) => f.id === faceId),
            answer: answers.find((a) => a.face_id === faceId),
        }))
        .filter(
            (
                r,
            ): r is {
                face: (typeof faces)[0];
                answer: (typeof answers)[0];
            } => r.face !== undefined && r.answer !== undefined,
        );

    return (
        <div className="flex flex-col items-center gap-8 mt-8">
            <h1 className="text-3xl font-bold">
                {correct} / {total}
            </h1>
            <div className="grid grid-cols-2 gap-6">
                {results.map(({ face, answer }) => (
                    <div
                        key={face.id}
                        className="flex flex-col items-center gap-2"
                    >
                        <GameFace filePath={face.file_path} />
                        <p className="font-medium">{face.name}</p>
                        <p
                            className={
                                answer.is_correct
                                    ? "text-green-600"
                                    : "text-red-500"
                            }
                        >
                            {answer.answer}
                        </p>
                    </div>
                ))}
            </div>
            <Link href="/game/study">
                <Button>Play Again</Button>
            </Link>
        </div>
    );
}
