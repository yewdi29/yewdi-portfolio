import { notFound } from "next/navigation";
import Header from "@/components/dossier/Header";
import Sheet from "@/components/dossier/Sheet";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectById } from "@/lib/projects";
import { hasSupabase } from "@/lib/supabase/env";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectById(params.id);
  if (!project) notFound();

  return (
    <Sheet>
      <Header />
      <section className="sheet-pad pb-24 pt-16">
        <p className="meta text-mute">Edit</p>
        <h1 className="mt-3 font-sans text-display text-ink">{project.title}</h1>
        <div className="mt-12 max-w-3xl">
          {hasSupabase() ? (
            <ProjectForm project={project} />
          ) : (
            <p className="text-[13px] text-mute">
              Connect Supabase before editing entries.
            </p>
          )}
        </div>
      </section>
    </Sheet>
  );
}
