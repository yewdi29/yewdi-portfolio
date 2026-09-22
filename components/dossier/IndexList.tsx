import { formatMonth, groupByYear } from "@/lib/format";
import type { NumberedProject } from "@/lib/types";
import ProjectLink from "./ProjectLink";
import Rise from "./Rise";

export default function IndexList({
  projects,
  delay = 0,
}: {
  projects: NumberedProject[];
  delay?: number;
}) {
  const groups = groupByYear(projects);
  let offset = 0;

  return (
    <div>
      {groups.map((group) => {
        const start = delay + offset;
        offset += 50 + group.projects.length * 55;
        return (
          <YearGroup
            key={group.year}
            year={group.year}
            projects={group.projects}
            delay={start}
          />
        );
      })}
    </div>
  );
}

function YearGroup({
  year,
  projects,
  delay,
}: {
  year: number;
  projects: NumberedProject[];
  delay: number;
}) {
  return (
    <div className="mb-12 last:mb-0">
      <Rise delay={delay}>
        <p className="meta tabular mb-4 text-mute">{year}</p>
      </Rise>
      <ul>
        {projects.map((project, index) => (
          <Rise
            key={project.id}
            as="li"
            delay={delay + 40 + index * 55}
            className="border-t border-rule last:border-b"
          >
            <ProjectLink
              slug={project.slug}
              title={project.title}
              className="grid grid-cols-1 items-baseline gap-x-6 py-3 sm:grid-cols-[4.5rem_1fr_auto] sm:py-4"
            >
              <span
                data-project-month
                className="meta tabular hidden text-mute sm:inline"
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
    </div>
  );
}
