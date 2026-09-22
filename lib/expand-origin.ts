export type ExpandOrigin = {
  slug: string;
  title: string;
  top: number;
  bottom: number;
  titleTop: number;
  titleLeft: number;
  titleWidth: number;
  titleHeight: number;
  lineLeft: number;
  lineWidth: number;
  lineTop: number;
  lineBottom: number;
  monthTop: number;
  monthLeft: number;
  monthText: string;
  tagsTop: number;
  tagsLeft: number;
  tags: string[];
};

let origin: ExpandOrigin | null = null;

export function setExpandOrigin(next: ExpandOrigin) {
  origin = next;
}

export function peekExpandOrigin(slug: string): ExpandOrigin | null {
  if (!origin || origin.slug !== slug) return null;
  return origin;
}

export function clearExpandOrigin() {
  origin = null;
}
