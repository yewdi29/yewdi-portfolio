import Link from "next/link";
import { site } from "@/lib/site";
import Rise from "./Rise";

export default function Header({ onClose }: { onClose?: () => void }) {
  const name = onClose ? (
    <button
      type="button"
      onClick={onClose}
      className="meta cursor-pointer border-0 bg-transparent p-0 text-ink"
    >
      {site.name}
    </button>
  ) : (
    <Link href="/#index" className="meta text-ink">
      {site.name}
    </Link>
  );

  return (
    <header
      className={
        onClose
          ? "sheet-pad sticky top-0 z-10 bg-sheet pt-6 sm:pt-8"
          : "sheet-pad relative z-10 pt-6 sm:pt-8"
      }
    >
      {onClose ? (
        <span className="inline-block">{name}</span>
      ) : (
        <Rise as="span" className="inline-block">
          {name}
        </Rise>
      )}
    </header>
  );
}
