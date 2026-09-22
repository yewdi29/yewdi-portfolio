import type { Project } from "./types";

const now = "2021-03-01T00:00:00.000Z";

export const seedProjects: Project[] = [
  {
    id: "seed-black-diamond",
    slug: "black-diamond",
    title: "Black Diamond",
    subtitle: "Identity",
    occurred_on: "2021-03-01",
    client: "Black Diamond",
    role: "Identity",
    summary:
      "A family-owned oil and gas distributor needed to move from a trusted local mark to one that could travel. I rebuilt the identity, then extended it into a merchandise line when the owners wanted the brand off the field as well as on it.",
    tags: ["identity", "merch"],
    accent: "#1A1A1A",
    specs: {
      Client: "Black Diamond",
      Role: "Identity",
      Medium: "Mark, system, merch",
      "Year one": "+$900k revenue",
      Overseas: "46% of sales",
      List: "700+ subscribers",
    },
    cover_path: "/work/black-diamond-01.jpg",
    blocks: [
      {
        type: "text",
        body: "The work started as positioning and a mark. It ended as a system the owners could wear.",
      },
      { type: "image", src: "/work/black-diamond-02.jpg", caption: "Identity application" },
      { type: "image", src: "/work/black-diamond-03.jpg", caption: "Lockup" },
      { type: "image", src: "/work/black-diamond-04.jpg", caption: "Merchandise extension" },
    ],
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-my-vida-skin",
    slug: "my-vida-skin",
    title: "My Vida Skin",
    subtitle: "Identity and packaging",
    occurred_on: "2021-10-01",
    client: "My Vida Skin",
    role: "Identity, packaging",
    summary:
      "I built the identity around the line “My Vida, My Skin” — skincare as a personal decision. A strong modern face carries the confidence; a script keeps a human register. The palette is neutral on purpose, so it holds across skin tones.",
    tags: ["identity", "packaging"],
    accent: "#C4B8A8",
    specs: {
      Client: "My Vida Skin",
      Role: "Identity, packaging",
      Medium: "Mark, type, pack",
      Line: "My Vida, My Skin",
      Palette: "Neutral, inclusive",
    },
    cover_path: "/work/my-vida-skin-01.jpg",
    blocks: [
      {
        type: "text",
        body: "The pack and the mark had to feel like a choice, not a prescription.",
      },
      { type: "image", src: "/work/my-vida-skin-03.jpg", caption: "Identity system" },
      { type: "image", src: "/work/my-vida-skin-04.jpg", caption: "Packaging" },
    ],
    published: true,
    created_at: now,
    updated_at: now,
  },
  {
    id: "seed-my-vida-origins",
    slug: "my-vida-origins",
    title: "My Vida Origins",
    subtitle: "Packaging",
    occurred_on: "2022-06-01",
    client: "My Vida Origins",
    role: "Packaging",
    summary:
      "A wellness line rooted in natural supplements needed a pack system that could sit next to the Skin brand without repeating it. I designed a brighter, tighter system — then watched it move: followers, sales, and return customers all shifted after the new look landed.",
    tags: ["packaging", "identity"],
    accent: "#D8A23A",
    specs: {
      Client: "My Vida Origins",
      Role: "Packaging",
      Medium: "Pack system, identity",
      Followers: "5k → 36k",
      Sales: "+98% after launch",
      Returning: "77% of sales",
    },
    cover_path: "/work/my-vida-origins-01.jpg",
    blocks: [
      {
        type: "text",
        body: "Same family as Skin. Different temperature. The shelf had to make that obvious.",
      },
      { type: "image", src: "/work/my-vida-origins-02.jpg", caption: "Pack system" },
      { type: "image", src: "/work/my-vida-origins-03.jpg", caption: "Product line" },
      { type: "image", src: "/work/my-vida-origins-04.jpg", caption: "Application" },
    ],
    published: true,
    created_at: now,
    updated_at: now,
  },
];
