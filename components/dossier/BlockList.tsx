import Image from "next/image";
import { resolveMedia } from "@/lib/media";
import type { ProjectBlock } from "@/lib/types";

export default function BlockList({ blocks }: { blocks: ProjectBlock[] }) {
  if (!blocks.length) return null;

  return (
    <div className="mt-20 space-y-14 sm:mt-28 sm:space-y-16">
      {blocks.map((block, index) => {
        if (block.type === "text") {
          const paragraphs = block.body.split(/\n\n+/).filter(Boolean);

          return (
            <div
              key={`text-${index}`}
              id={`section-${index}`}
              className="scroll-mt-24 space-y-6"
            >
              {block.title ? (
                <p className="meta text-mute">{block.title}</p>
              ) : null}
              {paragraphs.map((paragraph, paragraphIndex) => (
                <p
                  key={`text-${index}-${paragraphIndex}`}
                  className="whitespace-pre-line text-dossier text-ink/90"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          );
        }

        const isMotion = /\.gif$/i.test(block.src);

        return (
          <figure
            key={`image-${index}`}
            id={`section-${index}`}
            className="scroll-mt-24"
          >
            <div className="relative w-full bg-rule/60">
              <Image
                src={resolveMedia(block.src)}
                alt={block.caption || ""}
                width={1920}
                height={1280}
                unoptimized={isMotion}
                className="h-auto w-full"
                style={{ width: "100%", height: "auto" }}
                sizes="(min-width: 1024px) 58vw, 100vw"
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
