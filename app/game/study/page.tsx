import { createServerSupabase } from "@/lib/supabase/server";
import { StudyClient } from "./StudyClient";

const FACES = 1;
const MILLISECONDS_PER_FACE = 5000;

export default async function StudyPage() {
    const supabase = await createServerSupabase();
    const { data: faces } = await supabase
        .from("face")
        .select("*")
        .limit(FACES);

    if (!faces || faces.length === 0) {
        return <p>Something went wrong loading faces.</p>;
    }

    return (
        <StudyClient
            faces={faces}
            millisecondsPerFace={MILLISECONDS_PER_FACE}
        />
    );
}
