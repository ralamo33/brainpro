import { createServerSupabase } from "@/lib/supabase/server";

export default async function NamePage() {
    const supabase = await createServerSupabase();
    const { data: faces } = await supabase.from("face").select("*").limit(100);

    if (!faces) {
        return <p>Something went wrong!</p>;
    }

    return (
        <div>
            {faces.map((f, idx) => {
                return <p key={`Face ${f.id} ${idx}`}>{f.name}</p>;
            })}
        </div>
    );
}
