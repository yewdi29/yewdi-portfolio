import { getProjectSections } from "@/lib/project-sections";
import type { NumberedProject } from "@/lib/types";
import BlockList from "./BlockList";
import EntryHeader from "./EntryHeader";
import ProjectIndex from "./ProjectIndex";
import Rise from "./Rise";

export default function ProjectArticle({
  project,
  rise = true,
}: {
  project: NumberedProject;
  rise?: boolean;
}) {
  const body = (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)] lg:items-start lg:gap-10">
      <aside className="lg:sticky lg:top-24">
        <ProjectIndex sections={getProjectSections(project)} />
      </aside>
      <div>
        <section id="overview" className="scroll-mt-24">
          <EntryHeader project={project} />
          {project.summary ? (
            <p className="mt-16 max-w-3xl text-dossier text-ink/90 sm:mt-20">
              {project.summary}
            </p>
          ) : null}
        </section>
        <BlockList blocks={project.blocks} />
      </div>
    </div>
  );

  if (!rise) {
    return (
      <article className="sheet-pad pb-24 pt-12 sm:pb-32 sm:pt-16">{body}</article>
    );
  }

  return (
    <article className="sheet-pad pb-24 pt-12 sm:pb-32 sm:pt-16">
      <Rise delay={80}>{body}</Rise>
    </article>
  );
}
