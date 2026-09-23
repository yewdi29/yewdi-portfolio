import Image from "next/image";
import { resolveMedia } from "@/lib/media";
import type { NumberedProject } from "@/lib/types";

export default function EntryHeader({ project }: { project: NumberedProject }) {
  if (!project.cover_path) return null;

  return (
    <div className="relative w-full bg-rule/60">
      <Image
        src={resolveMedia(project.cover_path)}
        alt={project.title}
        width={1920}
        height={1280}
        priority
        unoptimized={/\.gif$/i.test(project.cover_path)}
        className="h-auto w-full"
        style={{ width: "100%", height: "auto" }}
        sizes="(min-width: 1024px) 58vw, 100vw"
      />
    </div>
  );
}
