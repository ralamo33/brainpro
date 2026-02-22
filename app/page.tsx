import { createServerSupabase } from "@/lib/supabase/server";
import { Game } from "./game";
import { getBucket } from "@/lib/storage/storage";
import { isErr, unwrap } from "@/lib/result/result";

export default async function NamePage() {
    const FACES = 10;
    const MILISECONDS_PER_FACE = 5000;

    const supabase = await createServerSupabase();
    const { data: faces } = await supabase
        .from("face")
        .select("*")
        .limit(FACES);
    const bucket = await getBucket();

    if (!faces || isErr(bucket)) {
        return <p>Something went wrong!</p>;
    }

    return (
        <div>
            <Game faces={faces} milisecondsPerFace={MILISECONDS_PER_FACE} />
        </div>
    );
}
