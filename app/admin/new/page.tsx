import Header from "@/components/dossier/Header";
import Sheet from "@/components/dossier/Sheet";
import ProjectForm from "@/components/admin/ProjectForm";
import { hasSupabase } from "@/lib/supabase/env";

export default function NewProjectPage() {
  return (
    <Sheet>
      <Header />
      <section className="sheet-pad pb-24 pt-16">
        <p className="meta text-mute">New</p>
        <h1 className="mt-3 font-sans text-display text-ink">Entry</h1>
        <div className="mt-12 max-w-3xl">
          {hasSupabase() ? (
            <ProjectForm />
          ) : (
            <p className="text-[13px] text-mute">
              Connect Supabase before adding entries.
            </p>
          )}
        </div>
      </section>
    </Sheet>
  );
}
