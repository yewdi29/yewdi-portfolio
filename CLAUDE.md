# Yewdiel Venzor — Portfolio Website

## What this is
A cinematic, interactive personal portfolio for identity/brand design and
software engineering work. Built to impress recruiters on first load.

## Tech stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Three.js (particle systems, 3D brain graph)
- GSAP (intro animation timeline)
- Framer Motion (page transitions)
- Supabase (projects CMS and storage)
- Vercel (hosting)

## Experience flow
1. Visitor lands → full-screen black screen
2. Side profile photo fades in slowly
3. Crossfade to front-facing photo (simulates head turn)
4. Eye close-up fades in, front photo fades out
5. Eye photo zooms to scale 22 with power4.in easing
6. Blur ramps quadratically as zoom progresses (p * p * 28)
7. Three.js canvas fades in underneath at ~60% zoom progress
8. Eye fades to zero — warp tunnel is fully visible
9. Warp tunnel decelerates → digital brain graph appears
10. Brain is interactive — cursor moves it, hover nodes show case studies

## Photos (already exist)
Located at:
  public/photos/profile-side.jpg
  public/photos/profile-front.jpg
  public/photos/eye-close.jpg

Reference in code as: /photos/profile-side.jpg (no import needed)

## Key technical decisions
- transformOrigin on eye photo must match actual iris position in the shot
  Default is '50% 50%' — adjust if iris is off-center
- Three.js canvas initializes at page load, opacity 0, runs hidden
  It must already be rendering before the handoff moment
- Blur is NOT a CSS transition — it is set inline on every GSAP tick
  via onUpdate: eyePhoto.style.filter = `blur(${p * p * 28}px)`
- All photo layers are position: fixed, inset: 0, z-index: 100
  Three.js canvas sits at z-index: 10 behind them
- Use 'use client' on all canvas and animation components
- Wrap Three.js init in useEffect — no window on server

## File architecture
app/
  page.tsx              ← root page, mounts IntroSequence + ThreeCanvas
  layout.tsx            ← fonts, metadata, no nav
  globals.css           ← resets, body overflow hidden
  about/page.tsx
  contact/page.tsx
  admin/
    layout.tsx
    page.tsx

components/
  intro/
    IntroSequence.tsx   ← orchestrates full GSAP timeline
    ProfileMorph.tsx    ← handles photo crossfade layers
    EyeZoom.tsx         ← handles scale + blur + handoff
  canvas/
    ThreeCanvas.tsx     ← WebGL renderer, scene, camera, RAF loop
    WarpTunnel.tsx      ← 15k particle warp effect
    DigitalBrain.tsx    ← force-directed graph, cursor reactive
    BrainNode.tsx       ← individual project node mesh
  ui/
    CaseStudyCard.tsx   ← hover card over brain nodes
    Navigation.tsx      ← corner nav overlay
    PageOverlay.tsx     ← slide-in wrapper for About/Contact
  admin/
    ProjectForm.tsx

lib/
  gsap/
    intro-timeline.ts   ← GSAP master timeline factory
  three/
    scene.ts
    particles.ts
    brain-graph.ts
    shaders/
      particle.vert
      particle.frag
  supabase/
    client.ts
    server.ts
    queries.ts

hooks/
  useMousePosition.ts
  useThreeScene.ts
  useProjects.ts

types/
  project.ts
  brain.ts

supabase/
  migrations/
    001_projects.sql

public/
  photos/
    profile-side.jpg
    profile-front.jpg
    eye-close.jpg

## Build phases
Phase 1 (current): Intro sequence — photos, GSAP timeline, handoff stub
Phase 2: Three.js canvas — warp tunnel particle system
Phase 3: Digital brain — force graph, node interaction, case study cards
Phase 4: Supabase CMS — projects table, admin panel, live updates
Phase 5: About, Contact pages, final polish

## Environment variables needed (.env.local)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=