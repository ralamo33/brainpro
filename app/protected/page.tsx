import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProtectedPage() {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }

    return (
        <div className="flex flex-col items-center gap-6 mt-16">
            <h1 className="text-3xl font-bold">Welcome to Face Game!</h1>
            <Link href="/game/study">
                <Button>Start</Button>
            </Link>
        </div>
    );
}
