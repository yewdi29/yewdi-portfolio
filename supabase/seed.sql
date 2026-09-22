-- Optional: load the three opening entries after running 001_projects.sql.
-- Images live in /public/work on the Next.js app.

insert into public.projects (
  slug, title, subtitle, occurred_on, client, role, summary, tags, accent, specs, cover_path, blocks, published
) values
(
  'black-diamond',
  'Black Diamond',
  'Identity',
  '2021-03-01',
  'Black Diamond',
  'Identity',
  'A family-owned oil and gas distributor needed to move from a trusted local mark to one that could travel. I rebuilt the identity, then extended it into a merchandise line when the owners wanted the brand off the field as well as on it.',
  array['identity','merch'],
  '#1A1A1A',
  '{"Client":"Black Diamond","Role":"Identity","Medium":"Mark, system, merch","Year one":"+$900k revenue","Overseas":"46% of sales","List":"700+ subscribers"}'::jsonb,
  '/work/black-diamond-01.jpg',
  '[{"type":"text","body":"The work started as positioning and a mark. It ended as a system the owners could wear."},{"type":"image","src":"/work/black-diamond-02.jpg","caption":"Identity application"},{"type":"image","src":"/work/black-diamond-03.jpg","caption":"Lockup"},{"type":"image","src":"/work/black-diamond-04.jpg","caption":"Merchandise extension"}]'::jsonb,
  true
),
(
  'my-vida-skin',
  'My Vida Skin',
  'Identity and packaging',
  '2021-10-01',
  'My Vida Skin',
  'Identity, packaging',
  'I built the identity around the line “My Vida, My Skin” — skincare as a personal decision. A strong modern face carries the confidence; a script keeps a human register. The palette is neutral on purpose, so it holds across skin tones.',
  array['identity','packaging'],
  '#C4B8A8',
  '{"Client":"My Vida Skin","Role":"Identity, packaging","Medium":"Mark, type, pack","Line":"My Vida, My Skin","Palette":"Neutral, inclusive"}'::jsonb,
  '/work/my-vida-skin-01.jpg',
  '[{"type":"text","body":"The pack and the mark had to feel like a choice, not a prescription."},{"type":"image","src":"/work/my-vida-skin-03.jpg","caption":"Identity system"},{"type":"image","src":"/work/my-vida-skin-04.jpg","caption":"Packaging"}]'::jsonb,
  true
),
(
  'my-vida-origins',
  'My Vida Origins',
  'Packaging',
  '2022-06-01',
  'My Vida Origins',
  'Packaging',
  'A wellness line rooted in natural supplements needed a pack system that could sit next to the Skin brand without repeating it. I designed a brighter, tighter system — then watched it move: followers, sales, and return customers all shifted after the new look landed.',
  array['packaging','identity'],
  '#D8A23A',
  '{"Client":"My Vida Origins","Role":"Packaging","Medium":"Pack system, identity","Followers":"5k → 36k","Sales":"+98% after launch","Returning":"77% of sales"}'::jsonb,
  '/work/my-vida-origins-01.jpg',
  '[{"type":"text","body":"Same family as Skin. Different temperature. The shelf had to make that obvious."},{"type":"image","src":"/work/my-vida-origins-02.jpg","caption":"Pack system"},{"type":"image","src":"/work/my-vida-origins-03.jpg","caption":"Product line"},{"type":"image","src":"/work/my-vida-origins-04.jpg","caption":"Application"}]'::jsonb,
  true
)
on conflict (slug) do nothing;
