"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameFace } from "@/components/gameFace";
import { Button } from "@/components/ui/button";
import { submitAnswer } from "../../actions";

type Face = {
    id: string;
    file_path: string;
};

type Props = {
    sessionId: string;
    faces: Face[];
};

export function AnswerClient({ sessionId, faces }: Props) {
    const [round, setRound] = useState(0);
    const [answer, setAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const face = faces[round];

    const handleSubmit = async () => {
        if (!answer.trim() || isSubmitting) return;
        setIsSubmitting(true);

        await submitAnswer(sessionId, face.id, answer.trim());

        const next = round + 1;
        if (next >= faces.length) {
            router.push(`/game/${sessionId}/score`);
        } else {
            setRound(next);
            setAnswer("");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-sm text-gray-500">
                {round + 1} / {faces.length}
            </p>
            <GameFace filePath={face.file_path} />
            <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Type the name..."
                className="border border-gray-300 rounded px-3 py-2 text-center"
                autoFocus
            />
            <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !answer.trim()}
            >
                Submit
            </Button>
        </div>
    );
}
