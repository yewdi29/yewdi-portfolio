"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type TransitionEvent,
} from "react";
import {
  clearExpandOrigin,
  peekExpandOrigin,
  type ExpandOrigin,
} from "@/lib/expand-origin";
import Header from "./Header";

type Phase = "idle" | "from" | "armed" | "open" | "closing";

export default function ProjectOverlay({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [origin, setOrigin] = useState<ExpandOrigin | null>(null);
  const [canScroll, setCanScroll] = useState(false);

  const finishClose = useCallback(() => {
    clearExpandOrigin();
    router.replace("/", { scroll: false });
  }, [router]);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setCanScroll(false);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }

    setPhase("closing");
  }, [finishClose]);

  useEffect(() => {
    const stored = peekExpandOrigin(slug);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (stored) {
      setOrigin(stored);
      if (reduced) {
        setPhase("open");
        setCanScroll(true);
        return;
      }
      setPhase("from");
      const arm = window.setTimeout(() => setPhase("armed"), 60);
      return () => window.clearTimeout(arm);
    }

    setOrigin({
      slug,
      top: window.innerHeight,
      bottom: 0,
    });
    setPhase("open");
    setCanScroll(true);
  }, [slug]);

  useEffect(() => {
    if (phase !== "armed") return;
    const frame = requestAnimationFrame(() => setPhase("open"));
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    const previousBody = document.body.style.overflow;
    const previousHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBody;
      document.documentElement.style.overflow = previousHtml;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (phase !== "closing") return;
    const timeout = window.setTimeout(finishClose, 1000);
    return () => window.clearTimeout(timeout);
  }, [phase, finishClose]);

  const onTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== overlayRef.current) return;
    if (event.propertyName !== "top") return;

    if (phase === "open") {
      setCanScroll(true);
      overlayRef.current?.focus();
    }

    if (phase === "closing") finishClose();
  };

  const from = origin ?? { top: 0, bottom: 0, slug };
  const expanded = phase === "open";
  const style: CSSProperties = expanded
    ? { top: 0, bottom: 0 }
    : { top: from.top, bottom: from.bottom };

  return (
    <>
      <div className="project-overlay-scrim" aria-hidden="true" />
      <div
        ref={overlayRef}
        className={[
          "project-overlay",
          phase === "armed" ? "is-armed" : "",
          expanded ? "is-open" : "",
          phase === "closing" ? "is-closing" : "",
          canScroll ? "is-scrollable" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={style}
        data-phase={phase}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onTransitionEnd={onTransitionEnd}
      >
        <div className="project-overlay-inner">
          <Header onClose={close} />
          {children}
        </div>
      </div>
    </>
  );
}
