import BlockList from "./BlockList";
import EntryHeader from "./EntryHeader";
import Rise from "./Rise";
import type { NumberedProject } from "@/lib/types";

export default function ProjectArticle({
  project,
  rise = true,
}: {
  project: NumberedProject;
  rise?: boolean;
}) {
  const summary = project.summary ? (
    <p className="mx-auto mt-16 max-w-3xl text-dossier text-ink/90 sm:mt-20">
      {project.summary}
    </p>
  ) : null;

  if (!rise) {
    return (
      <article className="sheet-pad pb-24 pt-12 sm:pb-32 sm:pt-16">
        <EntryHeader project={project} />
        {summary}
        <BlockList blocks={project.blocks} />
      </article>
    );
  }

  return (
    <article className="sheet-pad pb-24 pt-12 sm:pb-32 sm:pt-16">
      <Rise delay={80}>
        <EntryHeader project={project} />
      </Rise>
      {project.summary ? (
        <Rise
          delay={200}
          as="p"
          className="mx-auto mt-16 max-w-3xl text-dossier text-ink/90 sm:mt-20"
        >
          {project.summary}
        </Rise>
      ) : null}
      <Rise delay={320}>
        <BlockList blocks={project.blocks} />
      </Rise>
    </article>
  );
}
