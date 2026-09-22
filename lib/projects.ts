import { numberProjects } from "./format";
import { seedProjects } from "./seed";
import { hasSupabase } from "./supabase/env";
import { createClient } from "./supabase/server";
import type { NumberedProject, Project, ProjectBlock } from "./types";

function parseProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    subtitle: (row.subtitle as string | null) ?? null,
    occurred_on: String(row.occurred_on),
    client: (row.client as string | null) ?? null,
    role: (row.role as string | null) ?? null,
    summary: (row.summary as string | null) ?? null,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    accent: String(row.accent ?? "#111111"),
    specs:
      row.specs && typeof row.specs === "object"
        ? (row.specs as Record<string, string>)
        : {},
    cover_path: String(row.cover_path ?? ""),
    blocks: Array.isArray(row.blocks) ? (row.blocks as ProjectBlock[]) : [],
    published: Boolean(row.published),
    created_at: String(row.created_at ?? ""),
    updated_at: String(row.updated_at ?? ""),
  };
}

async function fetchRows(publishedOnly: boolean): Promise<Project[] | null> {
  if (!hasSupabase()) return null;

  const supabase = createClient();
  let query = supabase.from("projects").select("*").order("occurred_on", {
    ascending: true,
  });

  if (publishedOnly) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error || !data) return null;
  return data.map((row) => parseProject(row as Record<string, unknown>));
}

export async function getPublishedProjects(): Promise<NumberedProject[]> {
  const rows = await fetchRows(true);
  const source = rows && rows.length > 0 ? rows : seedProjects.filter((p) => p.published);
  return numberProjects(source);
}

export async function getAllProjects(): Promise<NumberedProject[]> {
  const rows = await fetchRows(false);
  const source = rows ?? seedProjects;
  return numberProjects(source);
}

export async function getProjectBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<NumberedProject | null> {
  const list = options.includeDrafts
    ? await getAllProjects()
    : await getPublishedProjects();
  return list.find((project) => project.slug === slug) ?? null;
}

export async function loadVisibleProject(
  slug: string
): Promise<NumberedProject | null> {
  const published = await getProjectBySlug(slug);
  if (published) return published;
  if (!hasSupabase()) return null;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return getProjectBySlug(slug, { includeDrafts: true });
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (hasSupabase()) {
    const supabase = createClient();
    const { data } = await supabase.from("projects").select("*").eq("id", id).single();
    if (data) return parseProject(data as Record<string, unknown>);
  }
  return seedProjects.find((project) => project.id === id) ?? null;
}
