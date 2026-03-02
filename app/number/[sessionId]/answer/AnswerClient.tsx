"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { submitNumberAnswer } from "../../actions";

type Props = {
    sessionId: string;
};

export function AnswerClient({ sessionId }: Props) {
    const [answer, setAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!answer.trim() || isSubmitting) return;
        setIsSubmitting(true);
        await submitNumberAnswer(sessionId, answer.trim());
        router.push(`/number/${sessionId}/score`);
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-xl">What was the number?</p>
            <input
                type="text"
                inputMode="numeric"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Type the number..."
                className="border border-gray-300 rounded px-3 py-2 text-center text-2xl tabular-nums w-48"
                autoFocus
            />
            <Button onClick={handleSubmit} disabled={isSubmitting || !answer.trim()}>
                Submit
            </Button>
        </div>
    );
}
