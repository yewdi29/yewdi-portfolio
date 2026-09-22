import Image from "next/image";
import Header from "./Header";
import IndexList from "./IndexList";
import Resume from "./Resume";
import Rise from "./Rise";
import type { NumberedProject } from "@/lib/types";

export default function Cover({ projects }: { projects: NumberedProject[] }) {
  return (
    <section className="relative flex min-h-screen flex-col">
      <Header />

      <div className="sheet-pad flex flex-1 flex-col pb-24 pt-12 sm:pt-16">
        <div>
          <div className="space-y-5 text-[18px] leading-7 text-ink">
            <Rise delay={80} as="p">
              My name is Yewdiel Venzor, a Brand Designer based in Austin, Texas.
            </Rise>
            <Rise delay={160} as="p">
              I’m a brand designer with over 7 years of experience studying,
              building, and evolving brands across industries like oil &amp; gas,
              DTC supplements, cosmetics, and more. My entrepreneurial mindset
              and passion for self-improvement have fueled a career rooted in
              intentional design, business strategy, and creative storytelling.
              I believe great branding is more than surface-level aesthetics — it’s
              a long-term commitment to positioning, credibility, and clarity.
            </Rise>
            <Rise delay={240} as="p">
              I especially enjoy working on brands from inside a company, where
              design has the power to influence real business growth over time.
              To me, the strongest brands are the ones nurtured for years with
              consistency and purpose. I approach every project with both
              creative vision and business insight, helping brands grow with
              meaning, not just momentum. Computer science sits underneath that
              work; agentic coding is how I prototype and ship — models and
              tools in the loop, then refined by hand.
            </Rise>
          </div>

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
            <Resume delay={380} />
          </div>
        </div>

        <div id="index" className="mt-20 pt-16 sm:mt-28 sm:pt-20">
          <Rise delay={920} as="h2" className="mb-10 font-sans text-[clamp(1.75rem,3vw,2.75rem)] leading-none tracking-[-0.03em] text-ink sm:mb-12">
            Work
          </Rise>
          <IndexList projects={projects} delay={1000} />
        </div>
      </div>
    </section>
  );
}
