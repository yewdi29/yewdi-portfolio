import type { NumberedProject } from "./types";

export type ProjectSection = {
  id: string;
  label: string;
};

export function getProjectSections(project: NumberedProject): ProjectSection[] {
  const sections: ProjectSection[] = [{ id: "overview", label: "Overview" }];
  let notes = 0;

  project.blocks.forEach((block, index) => {
    if (block.type === "text") {
      notes += 1;
      const label =
        block.title ||
        (notes === 1 ? "Note" : `Note ${String(notes).padStart(2, "0")}`);
      const last = sections[sections.length - 1];
      if (last?.label === label) return;
      sections.push({
        id: `section-${index}`,
        label,
      });
      return;
    }

    if (block.type === "placeholder" || block.type === "component") {
      if (!block.caption) return;
      const label = block.caption.split(" — ")[0].trim();
      const last = sections[sections.length - 1];
      if (last?.label === label) return;
      sections.push({ id: `section-${index}`, label });
      return;
    }

    if (!block.caption) return;

    const label = block.caption.split(" — ")[0].trim();
    const last = sections[sections.length - 1];
    if (last?.label === label) return;

    sections.push({
      id: `section-${index}`,
      label,
    });
  });

  return sections;
}
