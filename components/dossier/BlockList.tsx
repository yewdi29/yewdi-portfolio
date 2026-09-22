import Image from "next/image";
import { resolveMedia } from "@/lib/media";
import type { ProjectBlock } from "@/lib/types";

export default function BlockList({ blocks }: { blocks: ProjectBlock[] }) {
  if (!blocks.length) return null;

  return (
    <div className="mx-auto mt-20 max-w-3xl space-y-14 sm:mt-28 sm:space-y-16">
      {blocks.map((block, index) => {
        if (block.type === "text") {
          return (
            <p
              key={`text-${index}`}
              className="text-dossier text-ink/90"
            >
              {block.body}
            </p>
          );
        }

        return (
          <figure key={`image-${index}`}>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-rule/60 sm:aspect-[4/3]">
              <Image
                src={resolveMedia(block.src)}
                alt={block.caption || ""}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 48rem, 100vw"
              />
            </div>
            {block.caption ? (
              <figcaption className="meta mt-3 text-mute">
                {block.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
