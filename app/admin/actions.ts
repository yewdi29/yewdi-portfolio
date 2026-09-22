"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { monthToOccurredOn, slugify } from "@/lib/format";
import { hasSupabase } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { ProjectBlock } from "@/lib/types";

function requireSupabase() {
  if (!hasSupabase()) {
    throw new Error("Supabase is not configured.");
  }
  return createClient();
}

export async function loginAction(formData: FormData) {
  const supabase = requireSupabase();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/admin/login?error=1");
  }
  redirect("/admin");
}

export async function logoutAction() {
  if (!hasSupabase()) redirect("/admin/login");
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

async function uploadFile(
  supabase: ReturnType<typeof createClient>,
  file: File,
  folder: string
) {
  if (!file || file.size === 0) return null;
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("projects").upload(path, file, {
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

function parseSpecs(raw: string): Record<string, string> {
  try {
    const value = JSON.parse(raw) as { key: string; value: string }[];
    return Object.fromEntries(
      value
        .filter((row) => row.key.trim() && row.value.trim())
        .map((row) => [row.key.trim(), row.value.trim()])
    );
  } catch {
    return {};
  }
}

function parseBlocks(raw: string): ProjectBlock[] {
  try {
    const value = JSON.parse(raw) as ProjectBlock[];
    return value.filter((block) => {
      if (block.type === "text") return Boolean(block.body?.trim());
      return Boolean(block.src);
    });
  } catch {
    return [];
  }
}

export async function saveProjectAction(formData: FormData) {
  const supabase = requireSupabase();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);
  const occurred_on = monthToOccurredOn(String(formData.get("occurred_on") ?? ""));
  const client = String(formData.get("client") ?? "").trim() || null;
  const role = String(formData.get("role") ?? "").trim() || null;
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  const accent = String(formData.get("accent") ?? "#111111");
  const published = formData.get("published") === "on";
  const specs = parseSpecs(String(formData.get("specs") ?? "[]"));
  const blocks = parseBlocks(String(formData.get("blocks") ?? "[]"));
  let cover_path = String(formData.get("cover_path") ?? "");

  const cover = formData.get("cover") as File | null;
  if (cover && cover.size > 0) {
    const uploaded = await uploadFile(supabase, cover, slug);
    if (uploaded) cover_path = uploaded;
  }

  const payload = {
    slug,
    title,
    subtitle,
    occurred_on,
    client,
    role,
    summary,
    tags,
    accent,
    specs,
    cover_path,
    blocks,
    published,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("projects").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProjectAction(formData: FormData) {
  const supabase = requireSupabase();
  const id = String(formData.get("id") ?? "");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function uploadBlockImageAction(formData: FormData) {
  const supabase = requireSupabase();
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") ?? "blocks");
  if (!file) throw new Error("Missing file");
  const path = await uploadFile(supabase, file, folder);
  if (!path) throw new Error("Upload failed");
  return path;
}
