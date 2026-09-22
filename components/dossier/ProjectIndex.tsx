"use client";

import { useEffect, useState } from "react";
import type { ProjectSection } from "@/lib/project-sections";

export default function ProjectIndex({
  sections,
}: {
  sections: ProjectSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const root = document.querySelector(".project-overlay");
    if (!root) return;

    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      {
        root,
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.1, 0.25, 0.5],
      }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sections]);

  function goTo(id: string) {
    const root = document.querySelector(".project-overlay");
    const target = document.getElementById(id);
    if (!root || !target) return;

    const next =
      target.getBoundingClientRect().top -
      root.getBoundingClientRect().top +
      root.scrollTop -
      88;

    root.scrollTo({ top: next, behavior: "smooth" });
    setActive(id);
  }

  return (
    <nav aria-label="Project index">
      <ol>
        {sections.map((section) => (
          <li key={section.id}>
            <button
              type="button"
              onClick={() => goTo(section.id)}
              className={`meta block w-full cursor-pointer border-0 bg-transparent py-1.5 pl-0 text-left ${
                active === section.id ? "text-ink" : "text-mute"
              }`}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
