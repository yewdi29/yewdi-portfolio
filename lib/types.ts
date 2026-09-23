export type ProjectBlock =
  | { type: "image"; src: string; caption?: string }
  | { type: "text"; title?: string; body: string }
  | { type: "placeholder"; label: string; caption?: string }
  | { type: "component"; name: string; caption?: string };

export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  occurred_on: string;
  client: string | null;
  role: string | null;
  summary: string | null;
  tags: string[];
  accent: string;
  specs: Record<string, string>;
  cover_path: string;
  blocks: ProjectBlock[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type NumberedProject = Project & { number: number };
