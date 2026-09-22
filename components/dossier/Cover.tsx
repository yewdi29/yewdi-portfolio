import Image from "next/image";
import Header from "./Header";
import IndexList from "./IndexList";
import Rise from "./Rise";
import type { NumberedProject } from "@/lib/types";

export default function Cover({ projects }: { projects: NumberedProject[] }) {
  return (
    <section className="relative flex min-h-screen flex-col">
      <Header />

      <div className="sheet-pad flex flex-1 flex-col pb-24 pt-12 sm:pt-16">
        <Rise delay={80} as="p" className="text-[18px] leading-7 text-ink">
          My name is Yewdiel Venzor, a Brand and Digital Product Designer
          based in Austin, Texas, with 8+ years building and evolving brands
          across oil and gas, DTC, and cosmetics. My approach pairs
          foundational branding and user experience with hyperfast prototyping
          and AI-driven experimentation — turning strategic vision into real,
          testable products fast. I believe the strongest brands are built
          with consistency and purpose, yet flexible enough to adapt as
          markets shift. I design with both creative vision and business
          insight, helping brands grow with meaning, not just momentum.
        </Rise>

        <div className="mt-12 flex flex-col gap-10 sm:mt-16 sm:flex-row sm:items-start sm:gap-12">
          <Rise delay={320} className="shrink-0">
            <Image
              src="/photos/profile-v3.jpg"
              alt="Yewdiel Venzor, side profile"
              width={160}
              height={192}
              priority
              className="h-32 w-28 object-cover object-[center_20%] sm:h-36 sm:w-32"
            />
          </Rise>
          <div id="index" className="min-w-0 flex-1">
            <Rise
              delay={380}
              as="h2"
              className="mb-8 font-sans text-[clamp(1.75rem,3vw,2.75rem)] leading-none tracking-[-0.03em] text-ink sm:mb-10"
            >
              Work
            </Rise>
            <IndexList projects={projects} delay={440} />
          </div>
        </div>
      </div>
    </section>
  );
}
