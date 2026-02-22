import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    return (
        <div className="flex flex-col items-center gap-6 mt-16">
            <h1 className="text-3xl font-bold">Welcome to Face Game!</h1>
            <Link href="/game/study">
                <Button>Start</Button>
            </Link>
        </div>
    );
}
