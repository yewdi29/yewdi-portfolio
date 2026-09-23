"use client";

import { useMemo, useState } from "react";
import { saveProjectAction, uploadBlockImageAction } from "@/app/admin/actions";
import { monthInputValue, slugify } from "@/lib/format";
import type { Project, ProjectBlock } from "@/lib/types";

type SpecRow = { key: string; value: string };

type FormBlock =
  | { type: "text"; body: string }
  | { type: "image"; src: string; caption: string };

function specsToRows(specs: Record<string, string>): SpecRow[] {
  const rows = Object.entries(specs).map(([key, value]) => ({ key, value }));
  return rows.length ? rows : [{ key: "", value: "" }];
}

function projectBlocks(blocks: ProjectBlock[]): FormBlock[] {
  if (!blocks.length) return [{ type: "text", body: "" }];
  return blocks.flatMap((block) => {
    if (block.type === "text") return [{ type: "text" as const, body: block.body }];
    if (block.type === "image") {
      return [{ type: "image" as const, src: block.src, caption: block.caption ?? "" }];
    }
    return [];
  });
}

export default function ProjectForm({ project }: { project?: Project }) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [subtitle, setSubtitle] = useState(project?.subtitle ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [occurredOn, setOccurredOn] = useState(
    project ? monthInputValue(project.occurred_on) : ""
  );
  const [client, setClient] = useState(project?.client ?? "");
  const [role, setRole] = useState(project?.role ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [tags, setTags] = useState(project?.tags.join(", ") ?? "");
  const [accent, setAccent] = useState(project?.accent ?? "#111111");
  const [published, setPublished] = useState(project?.published ?? false);
  const [specs, setSpecs] = useState<SpecRow[]>(specsToRows(project?.specs ?? {}));
  const [blocks, setBlocks] = useState<FormBlock[]>(projectBlocks(project?.blocks ?? []));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const folder = useMemo(() => slugify(slug || title) || "entry", [slug, title]);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    formData.set("specs", JSON.stringify(specs));
    formData.set("blocks", JSON.stringify(blocks));
    try {
      await saveProjectAction(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
      setPending(false);
    }
  }

  async function onBlockImage(index: number, file: File) {
    const data = new FormData();
    data.set("file", file);
    data.set("folder", folder);
    try {
      const path = await uploadBlockImageAction(data);
      setBlocks((current) =>
        current.map((block, i) =>
          i === index && block.type === "image" ? { ...block, src: path } : block
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  return (
    <form action={onSubmit} className="space-y-10">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <input type="hidden" name="cover_path" value={project?.cover_path ?? ""} />

      <fieldset className="grid gap-8 sm:grid-cols-2">
        <Field label="Title">
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Subtitle">
          <input
            name="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Slug">
          <input
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder={slugify(title)}
            className={inputClass}
          />
        </Field>
        <Field label="Month">
          <input
            name="occurred_on"
            type="month"
            value={occurredOn}
            onChange={(e) => setOccurredOn(e.target.value)}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Client">
          <input
            name="client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Role">
          <input
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputClass}
          />
        </Field>
      </fieldset>

      <Field label="Summary">
        <textarea
          name="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="Tags">
          <input
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="identity, packaging"
            className={inputClass}
          />
        </Field>
        <Field label="Accent">
          <input
            name="accent"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="mt-2 h-10 w-16 bg-transparent"
          />
        </Field>
      </div>

      <Field label="Cover">
        <input name="cover" type="file" accept="image/*" className="mt-3 text-[13px]" />
        <p className="meta mt-2 text-mute">
          {project?.cover_path ? "Replace the existing cover, or leave empty." : "Required on first publish."}
        </p>
      </Field>

      <div>
        <div className="flex items-center justify-between">
          <p className="meta text-mute">Spec table</p>
          <button
            type="button"
            className="meta text-ink"
            onClick={() => setSpecs((rows) => [...rows, { key: "", value: "" }])}
          >
            Add row
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {specs.map((row, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-3">
              <input
                value={row.key}
                placeholder="Label"
                onChange={(e) =>
                  setSpecs((rows) =>
                    rows.map((item, i) =>
                      i === index ? { ...item, key: e.target.value } : item
                    )
                  )
                }
                className={inputClass}
              />
              <input
                value={row.value}
                placeholder="Value"
                onChange={(e) =>
                  setSpecs((rows) =>
                    rows.map((item, i) =>
                      i === index ? { ...item, value: e.target.value } : item
                    )
                  )
                }
                className={inputClass}
              />
              <button
                type="button"
                className="meta text-mute"
                onClick={() => setSpecs((rows) => rows.filter((_, i) => i !== index))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="meta text-mute">Blocks</p>
          <div className="flex gap-4">
            <button
              type="button"
              className="meta text-ink"
              onClick={() => setBlocks((items) => [...items, { type: "text", body: "" }])}
            >
              Text
            </button>
            <button
              type="button"
              className="meta text-ink"
              onClick={() =>
                setBlocks((items) => [...items, { type: "image", src: "", caption: "" }])
              }
            >
              Image
            </button>
          </div>
        </div>
        <div className="mt-4 space-y-6">
          {blocks.map((block, index) => (
            <div key={index} className="border-t border-rule pt-4">
              <div className="mb-3 flex justify-between">
                <p className="meta text-mute">{block.type}</p>
                <button
                  type="button"
                  className="meta text-mute"
                  onClick={() => setBlocks((items) => items.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              </div>
              {block.type === "text" ? (
                <textarea
                  value={block.body}
                  rows={3}
                  onChange={(e) =>
                    setBlocks((items) =>
                      items.map((item, i) =>
                        i === index && item.type === "text"
                          ? { ...item, body: e.target.value }
                          : item
                      )
                    )
                  }
                  className={inputClass}
                />
              ) : (
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    className="text-[13px]"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void onBlockImage(index, file);
                    }}
                  />
                  {block.src ? (
                    <p className="meta break-all text-mute">{block.src}</p>
                  ) : null}
                  <input
                    value={block.caption}
                    placeholder="Caption"
                    onChange={(e) =>
                      setBlocks((items) =>
                        items.map((item, i) =>
                          i === index && item.type === "image"
                            ? { ...item, caption: e.target.value }
                            : item
                        )
                      )
                    }
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <span className="meta text-ink">Publish</span>
      </label>

      {error ? <p className="text-[13px] text-ink">{error}</p> : null}

      <button type="submit" disabled={pending} className="meta border-b border-ink pb-1 text-ink">
        {pending ? "Saving" : "Save"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="meta text-mute">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full border-b border-rule bg-transparent py-2 text-[15px] outline-none focus:border-ink";
