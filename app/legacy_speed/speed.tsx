"use client";

import { useState } from "react";
import { max } from "lodash-es";

export function Speed({ words }: { words: string[] }) {
    const [currentWord, setCurrentWord] = useState(0);
    // state to maintain...
    // which word are we currently on
    // whats the current WPM?
    // when do we switch to the next word

    return (
        <div>
            <p>{words[max([words.length - 1, currentWord])]}</p>
        </div>
    );
}
