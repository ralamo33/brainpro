"use client";

import type { Tables } from "@/database/types";
import { isOk } from "@/lib/result/result";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GameFace } from "@/components/gameFace";
import { Button } from "@/components/ui/button";
import { createGameSession } from "../actions";

type Props = {
    faces: Tables<"face">[];
    millisecondsPerFace: number;
};

export function StudyClient({ faces, millisecondsPerFace }: Props) {
    const [round, setRound] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (round >= faces.length) return;
        const id = setTimeout(() => setRound(round + 1), millisecondsPerFace);
        return () => clearTimeout(id);
    }, [round, millisecondsPerFace, faces.length]);

    const handleContinue = async () => {
        setIsSubmitting(true);
        setError(null);
        const result = await createGameSession(faces.map((f) => f.id));
        if (isOk(result)) {
            router.push(`/game/${result.data}/answer`);
        } else {
            setError(result.error);
            setIsSubmitting(false);
        }
    };

    if (round >= faces.length) {
        return (
            <div className="flex flex-col items-center gap-4 mt-8">
                <p className="text-xl">All done! Ready to be tested?</p>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button onClick={handleContinue} disabled={isSubmitting}>
                    {isSubmitting ? "Loading..." : "Continue"}
                </Button>
            </div>
        );
    }

    const face = faces[round];
    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-sm text-gray-500">
                {round + 1} / {faces.length}
            </p>
            <GameFace filePath={face.file_path} />
            <p className="text-xl font-medium">{face.name}</p>
        </div>
    );
}
