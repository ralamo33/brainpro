import { isErr } from "@/lib/result/result";
import { getNextNumberLength } from "./actions";
import { StudyClient } from "./StudyClient";

const MILLISECONDS_PER_DIGIT = 1000;

function generateNumber(length: number): string {
    const first = Math.floor(Math.random() * 9) + 1;
    const rest = Array.from({ length: length - 1 }, () => Math.floor(Math.random() * 10));
    return [first, ...rest].join("");
}

export default async function NumberPage() {
    const lengthResult = await getNextNumberLength();
    const length = isErr(lengthResult) ? 3 : lengthResult.data;
    const number = generateNumber(length);

    return (
        <div className="flex flex-col items-center gap-4">
            <StudyClient number={number} millisecondsPerDigit={MILLISECONDS_PER_DIGIT} />
        </div>
    );
}
