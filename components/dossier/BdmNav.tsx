"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const SILHOUETTE =
  "M120.296 9.46431L115.617 1.16648C115.249 0.466591 114.531 0.0374427 113.749 0.0316823L93.2805 0C92.5007 0 91.7769 0.432029 91.409 1.12903L87.0688 9.15037C86.6392 9.95682 86.7657 10.9534 87.3895 11.6273L101.911 27.7679C102.747 28.6608 104.159 28.6665 104.998 27.7737L119.966 11.9413C120.59 11.2731 120.723 10.2765 120.296 9.46431Z";

function facetPath(angle: number) {
  const points: [number, number][] = [];
  let d = "";

  for (let i = 0; i < 8; i += 1) {
    const theta = ((angle + (360 * i) / 8) * Math.PI) / 180;
    const cos = Math.cos(theta);
    if (cos <= 0) continue;
    const sin = Math.sin(theta);
    const midX = 103.6 + 16.6 * sin;
    const midY = 10.43 + 1.15 * cos;
    const topX = 103.6 + 10.2 * sin;
    d += `M${topX.toFixed(2)} 0L${midX.toFixed(2)} ${midY.toFixed(2)}L103.45 28.44`;
    points.push([midX, midY]);
  }

  points.sort((a, b) => a[0] - b[0]);
  d += "M83.00 10.43";
  for (const [x, y] of points) {
    d += `L${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d}L${(103.6 + 16.6 + 4).toFixed(2)} 10.43`;
}

function easeInOutQuint(t: number) {
  return t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2;
}

function roundedRectPath(
  width: number,
  height: number,
  radius: number,
): [number, number][] {
  const n = Math.min(radius, width / 2, height / 2);
  const corner = (Math.PI / 2) * n;
  const straightX = Math.max(0, width - 2 * n);
  const straightY = Math.max(0, height - 2 * n);
  const total = 2 * straightX + 2 * straightY + 4 * corner;
  if (total === 0) return [];

  const points: [number, number][] = [];
  for (let i = 0; i < 300; i += 1) {
    const a = (i / 300) * total;
    let consumed = 0;
    let x = 0;
    let y = 0;
    let done = false;

    if (a < consumed + straightX) {
      x = n + (straightX > 0 ? (a - consumed) / straightX : 0) * straightX;
      y = 0;
      done = true;
    }
    consumed += straightX;
    if (!done && a < consumed + corner) {
      const t = -Math.PI / 2 + (Math.PI / 2) * (corner > 0 ? (a - consumed) / corner : 0);
      x = width - n + n * Math.cos(t);
      y = n + n * Math.sin(t);
      done = true;
    }
    consumed += corner;
    if (!done && a < consumed + straightY) {
      const t = straightY > 0 ? (a - consumed) / straightY : 0;
      x = width;
      y = n + t * straightY;
      done = true;
    }
    consumed += straightY;
    if (!done && a < consumed + corner) {
      const t = (Math.PI / 2) * (corner > 0 ? (a - consumed) / corner : 0);
      x = width - n + n * Math.cos(t);
      y = height - n + n * Math.sin(t);
      done = true;
    }
    consumed += corner;
    if (!done && a < consumed + straightX) {
      x = width - n - (straightX > 0 ? (a - consumed) / straightX : 0) * straightX;
      y = height;
      done = true;
    }
    consumed += straightX;
    if (!done && a < consumed + corner) {
      const t = Math.PI / 2 + (Math.PI / 2) * (corner > 0 ? (a - consumed) / corner : 0);
      x = n + n * Math.cos(t);
      y = height - n + n * Math.sin(t);
      done = true;
    }
    consumed += corner;
    if (!done && a < consumed + straightY) {
      x = 0;
      y = height - n - (straightY > 0 ? (a - consumed) / straightY : 0) * straightY;
      done = true;
    }
    consumed += straightY;
    if (!done) {
      const t = Math.PI + (Math.PI / 2) * (corner > 0 ? Math.min((a - consumed) / corner, 1) : 0);
      x = n + n * Math.cos(t);
      y = n + n * Math.sin(t);
    }
    points.push([x, y]);
  }
  return points;
}

function BdmWordmark() {
  const rawId = useId().replace(/:/g, "");
  const silId = `bd-sil-${rawId}`;
  const clipId = `bd-clip-${rawId}`;
  const [angle, setAngle] = useState(22.5);
  const angleRef = useRef(22.5);
  const run = useRef<{ from: number; to: number; t0: number; dur: number } | null>(
    null,
  );
  const frame = useRef<number | null>(null);

  const play = useCallback(() => {
    if (run.current) return;
    const from = angleRef.current;
    run.current = {
      from,
      to: from + 180,
      t0: performance.now(),
      dur: 950,
    };

    const tick = (now: number) => {
      const current = run.current;
      if (!current) return;
      const t = Math.min(1, (now - current.t0) / current.dur);
      const next = current.from + (current.to - current.from) * easeInOutQuint(t);
      if (t < 1) {
        angleRef.current = next;
        setAngle(next);
        frame.current = requestAnimationFrame(tick);
        return;
      }
      const landed = 22.5 + ((((current.to - 22.5) % 45) + 45) % 45);
      run.current = null;
      angleRef.current = landed;
      setAngle(landed);
      frame.current = null;
    };
    frame.current = requestAnimationFrame(tick);
  }, []);

  useEffect(
    () => () => {
      if (frame.current != null) cancelAnimationFrame(frame.current);
    },
    [],
  );

  return (
    <button
      type="button"
      onMouseEnter={play}
      className="relative block shrink-0 border-0 bg-transparent p-0"
      style={{ height: 23, width: 196, aspectRatio: "244 / 29" }}
      aria-label="Black Diamond"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/work/bd-wordmark.svg"
        alt=""
        width={244}
        height={29}
        className="block h-full w-full"
      />
      <svg
        viewBox="86.6 -0.15 34.5 28.75"
        aria-hidden
        className="pointer-events-none absolute overflow-visible"
        style={{ left: "35.49%", top: "-0.52%", width: "14.14%", height: "99.14%" }}
      >
        <defs>
          <path
            id={silId}
            fill="none"
            stroke="#000000"
            strokeWidth="4.8"
            d={SILHOUETTE}
          />
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <use href={`#${silId}`} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <use href={`#${silId}`} fill="none" stroke="#000000" strokeWidth="4.8" />
          <path
            d={facetPath(angle)}
            fill="none"
            stroke="#000000"
            strokeWidth="2.4"
          />
        </g>
      </svg>
    </button>
  );
}

function paintGlow(
  surface: HTMLCanvasElement,
  path: [number, number][],
  opacity: number,
  pos: number,
) {
  const ctx = surface.getContext("2d");
  if (!ctx || path.length === 0) return;
  ctx.clearRect(0, 0, surface.width, surface.height);
  if (opacity <= 0) return;

  ctx.save();
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = `rgba(255, 107, 53, ${0.18 * opacity})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  path.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x + 10, y + 10);
    else ctx.lineTo(x + 10, y + 10);
  });
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  const half = 30;
  const center = Math.floor(pos);
  for (let offset = -half; offset <= half; offset += 1) {
    const index = (((center + Math.round(offset)) % 300) + 300) % 300;
    const [x, y] = path[index];
    const [nx, ny] = path[(index + 1) % 300];
    const falloff = (1 - Math.abs(offset) / half) ** 2.2;
    if (falloff < 0.01) continue;
    ctx.save();
    ctx.shadowBlur = 12 * falloff;
    ctx.shadowColor = `rgba(255, 120, 60, ${0.95 * falloff * opacity})`;
    ctx.strokeStyle = `rgba(255, 150, 80, ${falloff * opacity})`;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 10);
    ctx.lineTo(nx + 10, ny + 10);
    ctx.stroke();
    ctx.restore();
    if (falloff > 0.7) {
      ctx.save();
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(255, 200, 150, ${falloff * opacity})`;
      ctx.strokeStyle = `rgba(255, 220, 180, ${falloff * opacity})`;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x + 10, y + 10);
      ctx.lineTo(nx + 10, ny + 10);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function BdmSearch() {
  const form = useRef<HTMLFormElement>(null);
  const pill = useRef<HTMLLabelElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const points = useRef<[number, number][]>([]);
  const state = useRef({
    active: false,
    opacity: 0,
    pos: 0,
    speed: 0,
    targetSpeed: 0,
  });
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const node = form.current;
    if (!node) return;
    const sync = () => setFocused(node.contains(document.activeElement));
    const onOut = () => requestAnimationFrame(sync);
    node.addEventListener("focusin", sync);
    node.addEventListener("focusout", onOut);
    sync();
    return () => {
      node.removeEventListener("focusin", sync);
      node.removeEventListener("focusout", onOut);
    };
  }, []);

  useEffect(() => {
    const node = pill.current;
    const surface = canvas.current;
    if (!node || !surface) return;

    const resize = () => {
      const width = node.offsetWidth;
      const height = node.offsetHeight;
      if (!width || !height) return;
      const radius = parseFloat(getComputedStyle(node).borderTopLeftRadius);
      surface.width = width + 20;
      surface.height = height + 20;
      surface.style.left = "-10px";
      surface.style.top = "-10px";
      points.current = roundedRectPath(
        width,
        height,
        Number.isFinite(radius) && radius > 0 ? radius : 100,
      );
    };

    const observer = new ResizeObserver(resize);
    observer.observe(node);
    resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const now = state.current;
    now.active = focused;
    if (focused) {
      now.speed = 1.2;
      now.targetSpeed = 0.18;
    } else {
      now.targetSpeed = 0;
    }

    let raf: number | null = null;
    const tick = () => {
      const surface = canvas.current;
      now.speed += (now.targetSpeed - now.speed) * 0.03;
      now.pos = (now.pos + now.speed + 300) % 300;
      now.opacity = now.active
        ? Math.min(1, now.opacity + 0.08)
        : Math.max(0, now.opacity - 0.04);
      if (surface) paintGlow(surface, points.current, now.opacity, now.pos);
      if (now.active || now.opacity > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [focused]);

  const pillStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    height: 34,
    borderRadius: 100,
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "border-color 0.15s",
  };

  return (
    <form
      ref={form}
      className="relative w-full max-w-[360px]"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="relative">
        <canvas
          ref={canvas}
          className="pointer-events-none absolute z-0"
          aria-hidden
        />
        <label
          ref={pill}
          className="flex w-full items-center overflow-hidden border-[1.5px] border-[#E8E9EA] focus-within:border-[#FF6B35]"
          style={pillStyle}
        >
          <span className="shrink-0 pl-3 text-[#9A9DA2]">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search equipment..."
            className="h-full min-w-0 flex-1 bg-transparent px-2 text-[13px] text-[#1A1D20] outline-none placeholder:text-[#9A9DA2]"
          />
          <button
            type="submit"
            aria-label="Search"
            className="shrink-0 border-0 bg-transparent pr-2.5 text-[#9A9DA2] transition-colors hover:text-[#FF6B35]"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </label>
      </div>
    </form>
  );
}

function useClickPulse() {
  const [pressed, setPressed] = useState(false);

  function pulse() {
    setPressed(true);
    window.setTimeout(() => setPressed(false), 170);
  }

  return { pressed, pulse };
}

export default function BdmNav() {
  const sell = useClickPulse();
  const signIn = useClickPulse();

  return (
    <div
      className="w-full overflow-visible px-1 py-3"
      style={{ fontFamily: "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      <div
        className="grid items-center"
        style={{
          gridTemplateColumns: "auto minmax(0,1fr) auto",
          gap: 16,
          height: 52,
        }}
      >
        <BdmWordmark />
        <div className="flex justify-center">
          <BdmSearch />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onPointerDown={sell.pulse}
            className="whitespace-nowrap border-0 bg-transparent text-[13px] font-medium text-[#4A4D52] transition-[color,transform] duration-150 ease-out hover:text-[#1A1D20] active:text-[#FF6B35]"
            style={{
              color: sell.pressed ? "#FF6B35" : undefined,
              transform: sell.pressed ? "scale(0.96)" : undefined,
            }}
          >
            Sell With Us
          </button>
          <button
            type="button"
            onPointerDown={signIn.pulse}
            className="whitespace-nowrap rounded-full border-0 bg-[#FF6B35] px-3.5 py-1 text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(255,107,53,0.3)] transition-[background-color,transform,box-shadow] duration-150 ease-out hover:bg-[#FF8255]"
            style={{
              background: signIn.pressed ? "#E85A28" : undefined,
              transform: signIn.pressed ? "scale(0.95)" : undefined,
              boxShadow: signIn.pressed
                ? "0 1px 6px rgba(255,107,53,0.22)"
                : undefined,
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
