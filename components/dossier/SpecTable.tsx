function domainHref(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

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
          className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 border-b border-rule py-2"
        >
          <dt className="meta text-mute">{key}</dt>
          <dd className="text-[13px] leading-snug text-ink">
            {key.toLowerCase() === "domain" ? (
              <a
                href={domainHref(value)}
                target="_blank"
                rel="noreferrer"
                className="mail-link inline-flex items-baseline gap-1 text-ink"
              >
                <span>{value.replace(/^https?:\/\//i, "")}</span>
                <span aria-hidden className="text-[11px] leading-none">
                  ↗
                </span>
              </a>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
