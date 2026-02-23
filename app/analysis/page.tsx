import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { isErr } from "@/lib/result/result";
import { getUserSessionStats } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";

function accuracyColor(correct: number, total: number): string {
    if (total === 0) return "text-muted-foreground";
    const pct = correct / total;
    if (pct >= 0.7) return "text-green-600";
    if (pct >= 0.4) return "text-yellow-500";
    return "text-red-500";
}

export default async function AnalysisPage() {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) redirect("/auth/login");

    const statsResult = await getUserSessionStats();
    if (isErr(statsResult)) redirect("/auth/login");

    const sessions = statsResult.data;

    const totalSessions = sessions.length;
    const totalCorrect = sessions.reduce((acc, s) => acc + s.correct, 0);
    const totalAnswered = sessions.reduce((acc, s) => acc + s.total, 0);
    const overallPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : null;

    return (
        <div className="flex flex-col items-center gap-8 mt-8 px-4 max-w-2xl mx-auto w-full">
            <h1 className="text-3xl font-bold">My Progress</h1>

            <div className="grid grid-cols-2 gap-4 w-full">
                <Card className="text-center">
                    <CardContent>
                        <p className="text-4xl font-bold">{totalSessions}</p>
                        <CardDescription className="mt-1">Sessions</CardDescription>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardContent>
                        <p className="text-4xl font-bold">
                            {overallPct !== null ? `${overallPct}%` : "—"}
                        </p>
                        <CardDescription className="mt-1">Overall Accuracy</CardDescription>
                    </CardContent>
                </Card>
            </div>

            {sessions.length === 0 ? (
                <p className="text-muted-foreground">No sessions yet. Play a game to see your progress!</p>
            ) : (
                <div className="w-full flex flex-col gap-2">
                    {sessions.map((session) => {
                        const pct = session.total > 0
                            ? Math.round((session.correct / session.total) * 100)
                            : 0;
                        const date = new Date(session.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        });
                        return (
                            <Card key={session.id} className="py-0 gap-0">
                                <CardContent className="flex justify-between items-center py-3">
                                    <CardDescription>{date}</CardDescription>
                                    <span className={`font-semibold ${accuracyColor(session.correct, session.total)}`}>
                                        {session.correct} / {session.total} ({pct}%)
                                    </span>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Link href="/game/study">
                <Button>Play Again</Button>
            </Link>
        </div>
    );
}
