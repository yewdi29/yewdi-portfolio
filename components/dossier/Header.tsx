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
      <header className="sheet-pad sticky top-0 z-10 grid grid-cols-1 items-start gap-2 bg-transparent pt-6 sm:pt-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)] lg:items-baseline lg:gap-10">
        <button
          type="button"
          onClick={onClose}
          className="meta cursor-pointer justify-self-start border-0 bg-transparent p-0 text-ink"
        >
          ← Return
        </button>
        {title ? (
          <h1 className="project-header-title max-w-full justify-self-start text-balance text-left text-[1.05rem] font-normal leading-snug tracking-[-0.02em] text-ink sm:text-[1.15rem]">
            {title}
          </h1>
        ) : null}
      </header>
    );
  }

  return (
    <header className="sheet-pad sticky top-0 z-10 flex items-baseline justify-between gap-6 bg-transparent pt-6 sm:pt-8">
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
