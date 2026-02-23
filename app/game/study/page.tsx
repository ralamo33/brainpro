import { createServerSupabase } from "@/lib/supabase/server";
import { StudyClient } from "./StudyClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getNextFaceCount } from "../actions";
import { isErr } from "@/lib/result/result";

const MILLISECONDS_PER_FACE = 5000;

export default async function StudyPage() {
    const supabase = await createServerSupabase();

    const countResult = await getNextFaceCount();
    const count = isErr(countResult) ? 3 : countResult.data;

    const { data: faces } = await supabase.rpc("get_unseen_random_faces", { count });

    if (!faces || faces.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 mt-8 max-w-md mx-auto px-4">
                <Alert>
                    <AlertTitle>No new faces available</AlertTitle>
                    <AlertDescription>
                        You've seen all available faces. Check back later for new additions.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {faces.length < count && (
                <div className="w-full max-w-md px-4">
                    <Alert>
                        <AlertTitle>Running low on new faces</AlertTitle>
                        <AlertDescription>
                            Only {faces.length} unseen face{faces.length === 1 ? "" : "s"} remaining.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
            <StudyClient
                faces={faces}
                millisecondsPerFace={MILLISECONDS_PER_FACE}
            />
        </div>
    );
}
