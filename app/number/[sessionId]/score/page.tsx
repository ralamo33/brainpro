import { isErr } from "@/lib/result/result";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getNumberSession, getNumberAnswer } from "../../actions";

type Props = {
    params: Promise<{ sessionId: string }>;
};

export default async function NumberScorePage({ params }: Props) {
    const { sessionId } = await params;

    const [sessionResult, answerResult] = await Promise.all([
        getNumberSession(sessionId),
        getNumberAnswer(sessionId),
    ]);

    if (isErr(sessionResult) || isErr(answerResult)) return notFound();

    const correct = sessionResult.data.number;
    const given = answerResult.data.answer;

    return (
        <div className="flex flex-col items-center gap-8 mt-8">
            <h1 className="text-3xl font-bold">
                {correct === given ? "Perfect!" : "Not quite"}
            </h1>
            <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1">
                    {correct.split("").map((digit, i) => (
                        <span
                            key={i}
                            className={`text-4xl font-bold tabular-nums w-10 text-center ${
                                given[i] === digit ? "text-green-600" : "text-red-500"
                            }`}
                        >
                            {digit}
                        </span>
                    ))}
                </div>
                <div className="flex gap-1">
                    {correct.split("").map((_, i) => (
                        <span
                            key={i}
                            className={`text-4xl tabular-nums w-10 text-center ${
                                given[i] === correct[i] ? "text-green-600" : "text-red-500"
                            }`}
                        >
                            {given[i] ?? "—"}
                        </span>
                    ))}
                </div>
            </div>
            <Link href="/number">
                <Button>Play Again</Button>
            </Link>
        </div>
    );
}
