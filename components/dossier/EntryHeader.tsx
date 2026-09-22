import Image from "next/image";
import { formatMonthYear, padNumber } from "@/lib/format";
import { resolveMedia } from "@/lib/media";
import type { NumberedProject } from "@/lib/types";
import SpecTable from "./SpecTable";

export default function EntryHeader({ project }: { project: NumberedProject }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-10">
      <div className="order-1">
        <p className="meta tabular text-mute">{padNumber(project.number)}</p>
        <h1 className="mt-4 font-sans text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.95] tracking-[-0.03em] text-ink">
          {project.title}
        </h1>
        {project.subtitle ? (
          <p className="mt-4 text-lg text-mute">{project.subtitle}</p>
        ) : null}
        <p className="meta tabular mt-6 text-ink">
          {formatMonthYear(project.occurred_on)}
        </p>
      </div>

      <div className="relative order-3 aspect-[4/5] w-full overflow-hidden bg-rule/60 sm:aspect-[4/3] lg:order-2 lg:aspect-square">
        {project.cover_path ? (
          <Image
            src={resolveMedia(project.cover_path)}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 36vw, 100vw"
          />
        ) : null}
      </div>

      <div className="order-2 lg:order-3">
        <SpecTable specs={project.specs} />
      </div>
    </div>
  );
}
