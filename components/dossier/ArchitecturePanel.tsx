const GROUPS = [
  {
    title: "Client",
    items: [
      "Next.js App Router",
      "Public routes — home, search, listings, about, pricing, how-it-works, journal, sellers",
      "Dashboard — seller desk for listings, media, and membership",
      "Auth — login and signup",
    ],
  },
  {
    title: "Services",
    items: [
      "Auth and sessions — accounts, roles, and BD Verified",
      "Catalog — listings, specs, photos, and search indexes",
      "Stripe — Free, Starter, Pro, Max, and Enterprise",
      "Anthropic — listing generation, verification grading, and inquiry screening",
    ],
  },
  {
    title: "Objects",
    items: [
      "User — guest → member → verified seller / org seat",
      "Listing — media, specs, price or RFQ, location, status",
      "Inquiry — buyer → seller, gated by auth",
      "Membership — plan, listing cap, badges, placements",
      "Journal — content, SEO, trust",
    ],
  },
] as const;

export default function ArchitecturePanel() {
  return (
    <div className="grid gap-8 border-t border-rule pt-6 sm:gap-10 lg:grid-cols-3 lg:gap-8">
      {GROUPS.map((group) => (
        <div key={group.title} className="min-w-0">
          <p className="meta text-mute">{group.title}</p>
          <ul className="mt-4 space-y-3">
            {group.items.map((item) => (
              <li
                key={item}
                className="grid grid-cols-[0.6rem_minmax(0,1fr)] gap-x-2 text-[15px] leading-snug text-ink/90 sm:text-[16px]"
              >
                <span aria-hidden className="mt-[0.35em] text-[11px] text-mute">
                  ●
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
