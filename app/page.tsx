import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function HomePage() {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getClaims();
    const isLoggedIn = !!data?.claims;

    return (
        <div className="flex flex-col items-center gap-6 mt-16">
            <h1 className="text-3xl font-bold">Brain Training</h1>
            <div className="flex gap-3">
                <Link href="/game/study">
                    <Button>Face Game</Button>
                </Link>
                <Link href="/number">
                    <Button>Number Game</Button>
                </Link>
                {isLoggedIn && (
                    <Link href="/analysis">
                        <Button variant="outline">My Progress</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
