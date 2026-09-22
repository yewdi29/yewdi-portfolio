import Image from "next/image";
import { formatMonthYear } from "@/lib/format";
import { resolveMedia } from "@/lib/media";
import type { NumberedProject } from "@/lib/types";
import SpecTable from "./SpecTable";

export default function EntryHeader({ project }: { project: NumberedProject }) {
  const specs = {
    Date: formatMonthYear(project.occurred_on),
    ...project.specs,
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-10">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-rule/60 sm:aspect-[4/3] lg:aspect-square">
        {project.cover_path ? (
          <Image
            src={resolveMedia(project.cover_path)}
            alt={project.title}
            fill
            priority
            unoptimized={/\.gif$/i.test(project.cover_path)}
            className="object-cover"
            sizes="(min-width: 1024px) 36vw, 100vw"
          />
        ) : null}
      </div>
      <SpecTable specs={specs} />
    </div>
  );
}
