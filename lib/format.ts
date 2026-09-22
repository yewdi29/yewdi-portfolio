import type { NumberedProject, Project } from "./types";

export function padNumber(n: number): string {
  return String(n).padStart(3, "0");
}

export function formatMonth(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date
    .toLocaleString("en-US", { month: "short" })
    .toUpperCase();
}

export function formatMonthYear(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date
    .toLocaleString("en-US", { month: "short", year: "numeric" })
    .toUpperCase()
    .replace(" ", " ");
}

export function yearOf(iso: string): number {
  return new Date(`${iso}T00:00:00`).getFullYear();
}

export function monthInputValue(iso: string): string {
  return iso.slice(0, 7);
}

export function monthToOccurredOn(monthValue: string): string {
  return `${monthValue}-01`;
}

export function numberProjects(projects: Project[]): NumberedProject[] {
  return [...projects]
    .sort((a, b) => a.occurred_on.localeCompare(b.occurred_on))
    .map((project, index) => ({ ...project, number: index + 1 }));
}

export function groupByYear(projects: NumberedProject[]) {
  const groups: { year: number; projects: NumberedProject[] }[] = [];

  for (const project of projects) {
    const year = yearOf(project.occurred_on);
    const last = groups[groups.length - 1];
    if (!last || last.year !== year) {
      groups.push({ year, projects: [project] });
    } else {
      last.projects.push(project);
    }
  }

  return groups
    .reverse()
    .map((group) => ({ ...group, projects: [...group.projects].reverse() }));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
