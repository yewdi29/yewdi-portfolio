import { formatMonth } from "@/lib/format";
import type { NumberedProject } from "@/lib/types";
import ProjectLink from "./ProjectLink";
import Rise from "./Rise";

function previewImages(project: NumberedProject) {
  const seen = new Set<string>();
  const images: string[] = [];

  const add = (src?: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    images.push(src);
  };

  add(project.cover_path);
  for (const block of project.blocks) {
    if (block.type === "image") add(block.src);
  }

  return images;
}

export default function IndexList({
  projects,
  delay = 0,
}: {
  projects: NumberedProject[];
  delay?: number;
}) {
  const rows = [...projects].sort((a, b) =>
    b.occurred_on.localeCompare(a.occurred_on),
  );

  return (
    <ul>
      {rows.map((project, index) => (
        <Rise
          key={project.id}
          as="li"
          delay={delay + index * 55}
          className="border-t border-rule last:border-b"
        >
          <ProjectLink
            slug={project.slug}
            title={project.title}
            images={previewImages(project)}
            className="grid grid-cols-1 items-baseline gap-x-6 py-3 sm:grid-cols-[6.25rem_1fr_auto] sm:py-4"
          >
            <span
              data-project-month
              className="meta tabular hidden whitespace-nowrap text-mute sm:inline"
            >
              {formatMonth(project.occurred_on)}
            </span>
            <span className="min-w-0">
              <span
                data-project-title={project.slug}
                className="block text-[1.05rem] leading-snug tracking-[-0.02em] text-ink sm:text-[1.15rem]"
              >
                {project.title}
              </span>
              <span
                data-project-month
                className="meta mt-1 block tabular text-mute sm:hidden"
              >
                {formatMonth(project.occurred_on)}
              </span>
            </span>
            <span
              data-project-tags
              className="mt-2 flex flex-wrap gap-1 sm:mt-0 sm:justify-end"
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  data-project-tag
                  className="rounded-full border border-rule px-1.5 py-px text-[8px] uppercase tracking-meta text-mute"
                >
                  {tag}
                </span>
              ))}
            </span>
          </ProjectLink>
        </Rise>
      ))}
    </ul>
  );
}
