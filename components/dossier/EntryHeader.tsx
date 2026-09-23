import Image from "next/image";
import { isVideoPath, resolveMedia } from "@/lib/media";
import type { NumberedProject } from "@/lib/types";

export default function EntryHeader({ project }: { project: NumberedProject }) {
  if (!project.cover_path) return null;

  const src = resolveMedia(project.cover_path);

  return (
    <div className="relative w-full bg-rule/60">
      {isVideoPath(project.cover_path) ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-auto w-full"
          style={{ width: "100%", height: "auto" }}
        />
      ) : (
        <Image
          src={src}
          alt={project.title}
          width={1920}
          height={1280}
          priority
          unoptimized={/\.gif$/i.test(project.cover_path)}
          className="h-auto w-full"
          style={{ width: "100%", height: "auto" }}
          sizes="(min-width: 1024px) 58vw, 100vw"
        />
      )}
    </div>
  );
}
