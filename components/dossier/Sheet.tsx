export default function Sheet({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-sheet text-ink">{children}</div>;
}
