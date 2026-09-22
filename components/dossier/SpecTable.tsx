export default function SpecTable({
  specs,
}: {
  specs: Record<string, string>;
}) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <dl className="border-t border-rule">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-rule py-2.5 sm:grid-cols-[8.5rem_1fr]"
        >
          <dt className="meta text-mute">{key}</dt>
          <dd className="text-[13px] leading-snug text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
