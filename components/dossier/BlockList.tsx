import Image from "next/image";
import { resolveMedia } from "@/lib/media";
import type { ProjectBlock } from "@/lib/types";
import ArchitecturePanel from "./ArchitecturePanel";
import BdmInquiryFlow from "./BdmInquiryFlow";
import BdmNav from "./BdmNav";

function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return <figcaption className="meta mt-3 text-mute">{text}</figcaption>;
}

function sectionLabel(block?: ProjectBlock) {
  if (!block) return undefined;
  if (block.type === "text") return block.title;
  if ("caption" in block && block.caption) {
    return block.caption.split(" — ")[0].trim();
  }
  return undefined;
}

function visibleCaption(
  block: ProjectBlock,
  prev?: ProjectBlock,
  next?: ProjectBlock,
) {
  if (!("caption" in block) || !block.caption) return undefined;
  const label = block.caption.split(" — ")[0].trim();
  if (sectionLabel(prev) === label || sectionLabel(next) === label) {
    return undefined;
  }
  return block.caption;
}

export default function BlockList({ blocks }: { blocks: ProjectBlock[] }) {
  if (!blocks.length) return null;

  return (
    <div className="mt-20 space-y-14 sm:mt-28 sm:space-y-16">
      {blocks.map((block, index) => {
        const caption = visibleCaption(
          block,
          blocks[index - 1],
          blocks[index + 1],
        );
        const followsText = blocks[index - 1]?.type === "text";
        const mediaClass = followsText
          ? "scroll-mt-24 !mt-6"
          : "scroll-mt-24";
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

        if (block.type === "placeholder") {
          return (
            <figure
              key={`placeholder-${index}`}
              id={`section-${index}`}
              className={mediaClass}
            >
              <div className="flex aspect-[16/10] w-full items-center justify-center bg-rule/60">
                <p className="meta px-6 text-center text-mute">{block.label}</p>
              </div>
              <Caption text={caption} />
            </figure>
          );
        }

        if (block.type === "component") {
          return (
            <figure
              key={`component-${index}`}
              id={`section-${index}`}
              className={mediaClass}
            >
              {block.name === "bdm-logo" || block.name === "bdm-nav" ? (
                <BdmNav />
              ) : null}
              {block.name === "bdm-inquiry-flow" ? <BdmInquiryFlow /> : null}
              {block.name === "bdm-architecture" ? <ArchitecturePanel /> : null}
              <Caption text={caption} />
            </figure>
          );
        }

        const isMotion = /\.gif$/i.test(block.src);

        return (
          <figure
            key={`image-${index}`}
            id={`section-${index}`}
            className={mediaClass}
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
            <Caption text={caption} />
          </figure>
        );
      })}
    </div>
  );
}
