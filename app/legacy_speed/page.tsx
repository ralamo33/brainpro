"use client";

import { useState } from "react";
import { Speed } from "./speed";
import { Effect } from "effect";

export default function Home() {
    const [text, setText] = useState(example);
    const [processedWords, setProcessedWords] = useState<string[]>([]);

    if (processedWords.length > 0) {
        return <Speed text={text} />;
    }

    const processText = () => {
        const words = text.split(" ");
        setProcessedWords(words);
    };

    return (
        <div>
            <h1 className="text-center text-5xl">Input your text</h1>
            <div className=" mx-4 mt-4">
                <textarea
                    className="rounded-xl p-4 text-lg border-blue-400 border w-full"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <button
                className="bg-red-400 border border-black rounded-lg"
                onClick={processText}
            >
                Activate
            </button>
        </div>
    );
}

const example = `Physics uses the scientific method to help uncover the basic principles governing light and matter, and to discover the implications of those laws. It assumes that there are rules by which the universe functions, and that those laws can be at least partially understood by humans. It is also commonly believed that those laws could be used to predict everything about the universe’s future if complete information was available about the present state of all light and matter.

Matter is generally considered to be anything that has mass and volume. Many concepts integral to the study of classical physics involve theories and laws that explain matter and its motion. The law of conservation of mass, for example, states that mass cannot be created or destroyed. Further experiments and calculations in physics, therefore, take this law into account when formulating hypotheses to try to explain natural phenomena.

Physics aims to describe the function of everything around us, from the movement of tiny charged particles to the motion of people, cars, and spaceships. In fact, almost everything around you can be described quite accurately by the laws of physics. Consider a smart phone; physics describes how electricity interacts with the various circuits inside the device. This knowledge helps engineers select the appropriate materials and circuit layout when building the smart phone. Next, consider a GPS system; physics describes the relationship between the speed of an object, the distance over which it travels, and the time it takes to travel that distance. When you use a GPS device in a vehicle, it utilizes these physics equations to determine the travel time from one location to another. The study of physics is capable of making significant contributions through advances in new technologies that arise from theoretical breakthroughs.`;
