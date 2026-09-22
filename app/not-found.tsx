import Link from "next/link";
import Header from "@/components/dossier/Header";
import Sheet from "@/components/dossier/Sheet";

export default function NotFound() {
  return (
    <Sheet>
      <Header />
      <section className="sheet-pad flex min-h-[70vh] flex-col justify-center pb-24">
        <p className="meta text-mute">404</p>
        <h1 className="mt-4 font-sans text-display text-ink">Not in the dossier</h1>
        <Link href="/#index" className="meta mt-10 text-ink">
          Return to index
        </Link>
      </section>
    </Sheet>
  );
}
