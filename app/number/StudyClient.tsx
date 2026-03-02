"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createNumberSession } from "./actions";
import { isOk } from "@/lib/result/result";

type Props = {
    number: string;
    millisecondsPerDigit: number;
};

export function StudyClient({ number, millisecondsPerDigit }: Props) {
    const [index, setIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (index >= number.length) return;
        const id = setTimeout(() => setIndex(index + 1), millisecondsPerDigit);
        return () => clearTimeout(id);
    }, [index, number.length, millisecondsPerDigit]);

    const handleContinue = async () => {
        setIsSubmitting(true);
        setError(null);
        const result = await createNumberSession(number);
        if (isOk(result)) {
            router.push(`/number/${result.data}/answer`);
        } else {
            setError(result.error);
            setIsSubmitting(false);
        }
    };

    if (index >= number.length) {
        return (
            <div className="flex flex-col items-center gap-4 mt-8">
                <p className="text-xl">All done! Ready to type it back?</p>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button onClick={handleContinue} disabled={isSubmitting}>
                    {isSubmitting ? "Loading..." : "Continue"}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-sm text-gray-500">
                {index + 1} / {number.length}
            </p>
            <p className="text-8xl font-bold tabular-nums">{number[index]}</p>
        </div>
    );
}
