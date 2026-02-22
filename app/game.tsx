"use client";

import { Tables } from "@/database/types";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
    faces: Tables<"face">[];
    milisecondsPerFace: number;
};

export function Game({ faces, milisecondsPerFace }: Props) {
    const [round, setRound] = useState(0);
    const face = faces[round];
    const bucketName = "brain_pro_faces";

    useEffect(() => {
        if (round >= faces.length - 1) {
            return;
        }

        const newId = setTimeout(() => setRound(round + 1), milisecondsPerFace);
        return () => clearTimeout(newId);
    }, [round, milisecondsPerFace, faces]);

    const advance = () => setRound((r) => Math.min(r + 1, faces.length - 1));

    return (
        <div>
            <Answer
                imageUrl={`https://storage.googleapis.com/${bucketName}/${face.file_path}`}
                onSubmit={advance}
            />
        </div>
    );
}

function Answer({ imageUrl, onSubmit }: { imageUrl: string; onSubmit: () => void }) {
    const [value, setValue] = useState("");

    const handleSubmit = () => {
        onSubmit();
        setValue("");
    };

    return (
        <div className="flex flex-col items-center mt-8 gap-4">
            <Image src={imageUrl} width={178} height={200} alt="human face" />
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Type the name..."
                className="border border-gray-300 rounded px-3 py-2 text-center"
            />
            <button type="button" onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
                Submit
            </button>
        </div>
    );
}
