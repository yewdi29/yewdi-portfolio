import { site } from "@/lib/site";
import Rise from "./Rise";
import ScrambleName from "./ScrambleName";

export default function Header({
  onClose,
  title,
}: {
  onClose?: () => void;
  title?: string;
}) {
  if (onClose) {
    return (
      <header className="sheet-pad sticky top-0 z-10 flex items-baseline justify-between gap-6 bg-sheet pt-6 sm:pt-8">
        <button
          type="button"
          onClick={onClose}
          className="meta cursor-pointer border-0 bg-transparent p-0 text-ink"
        >
          ← Return
        </button>
        {title ? (
          <h1 className="project-header-title text-[1.05rem] font-normal leading-snug tracking-[-0.02em] text-ink sm:text-[1.15rem]">
            {title}
          </h1>
        ) : null}
      </header>
    );
  }

  return (
    <header className="sheet-pad relative z-10 flex items-baseline justify-between gap-6 pt-6 sm:pt-8">
      <Rise as="span" className="inline-block shrink-0 whitespace-nowrap">
        <ScrambleName href="/#index" text={site.name} />
      </Rise>
      <Rise as="span" className="inline-block" delay={40}>
        <a
          href={`mailto:${site.email}`}
          className="mail-link text-meta text-ink"
        >
          {site.email}
        </a>
      </Rise>
    </header>
  );
}
