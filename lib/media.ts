const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function isRemotePath(path: string): boolean {
  return path.startsWith("http://") || path.startsWith("https://");
}

export function isVideoPath(path: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(path);
}

export function resolveMedia(path: string): string {
  if (!path) return "";
  if (path.startsWith("/") || isRemotePath(path)) return path;
  if (!SUPABASE_URL) return `/${path}`;
  return `${SUPABASE_URL}/storage/v1/object/public/projects/${path}`;
}
