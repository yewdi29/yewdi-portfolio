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

const OVERSHOOT = 12;

export default function ProjectOverlay({
  slug,
  title,
  children,
}: {
  slug: string;
  title: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [origin, setOrigin] = useState<ExpandOrigin | null>(null);
  const [titleDest, setTitleDest] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [canScroll, setCanScroll] = useState(false);

  const finishClose = useCallback(() => {
    document.documentElement.classList.remove("is-project-open");
    document
      .querySelector(`[data-project-title="${slug}"]`)
      ?.closest("li")
      ?.classList.remove("is-opening-row");
    document
      .querySelector(`[data-project-title="${slug}"]`)
      ?.classList.remove("is-flying");
    clearExpandOrigin();
    router.replace("/", { scroll: false });
  }, [router, slug]);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setCanScroll(false);
    document.documentElement.classList.remove("is-project-open");

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
      document.documentElement.classList.add("is-project-open");
      document
        .querySelector(`[data-project-title="${slug}"]`)
        ?.closest("li")
        ?.classList.add("is-opening-row");
      document
        .querySelector(`[data-project-title="${slug}"]`)
        ?.classList.add("is-flying");

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
      title,
      top: window.innerHeight,
      bottom: 0,
      titleTop: 28,
      titleLeft: 0,
      titleWidth: 0,
      titleHeight: 0,
      lineLeft: 0,
      lineWidth: 0,
      lineTop: window.innerHeight,
      lineBottom: window.innerHeight,
      monthTop: 0,
      monthLeft: 0,
      monthText: "",
      tagsTop: 0,
      tagsLeft: 0,
      tags: [],
    });
    setPhase("open");
    setCanScroll(true);
  }, [slug, title]);

  useEffect(() => {
    if (!origin || origin.titleWidth <= 0) return;
    const destTop = window.matchMedia("(min-width: 640px)").matches ? 32 : 24;
    const destLeft = origin.lineLeft + origin.lineWidth - origin.titleWidth;
    setTitleDest({
      top: destTop,
      left: Math.max(origin.lineLeft + 96, destLeft),
    });
  }, [origin]);

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
      document.documentElement.classList.remove("is-project-open");
      document
        .querySelector(`[data-project-title="${slug}"]`)
        ?.closest("li")
        ?.classList.remove("is-opening-row");
      document
        .querySelector(`[data-project-title="${slug}"]`)
        ?.classList.remove("is-flying");
    };
  }, [slug]);

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

  const from = origin;
  const expanded = phase === "open";
  const flying = Boolean(origin && origin.titleWidth > 0);
  const style: CSSProperties = expanded
    ? { top: 0, bottom: 0 }
    : {
        top: from?.top ?? 0,
        bottom: from?.bottom ?? 0,
      };

  const titleStyle: CSSProperties | undefined = flying
    ? expanded && titleDest
      ? { top: titleDest.top, left: titleDest.left }
      : {
          top: origin?.titleTop,
          left: origin?.titleLeft,
        }
    : undefined;

  const live = phase === "armed" || phase === "open" || phase === "closing";
  const topLineStyle: CSSProperties | undefined = from
    ? {
        left: from.lineLeft,
        width: from.lineWidth,
        top: expanded ? from.lineTop - OVERSHOOT : from.lineTop,
      }
    : undefined;
  const bottomLineStyle: CSSProperties | undefined = from
    ? {
        left: from.lineLeft,
        width: from.lineWidth,
        top: expanded ? from.lineBottom + OVERSHOOT : from.lineBottom,
      }
    : undefined;

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
          flying ? "has-flight" : "",
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
          <Header onClose={close} title={title} />
          {children}
        </div>
      </div>
      {flying ? (
        <p className={`project-flight-title${live ? " is-live" : ""}`} style={titleStyle}>
          {origin?.title ?? title}
        </p>
      ) : null}
      {flying && origin?.monthText ? (
        <span
          className={`project-flight-meta meta tabular text-mute${
            live ? " is-live" : ""
          }${expanded ? " is-gone" : ""}`}
          style={{ top: origin.monthTop, left: origin.monthLeft }}
        >
          {origin.monthText}
        </span>
      ) : null}
      {flying && origin && origin.tags.length > 0 ? (
        <span
          className={`project-flight-tags${live ? " is-live" : ""}${
            expanded ? " is-gone" : ""
          }`}
          style={{ top: origin.tagsTop, left: origin.tagsLeft }}
        >
          {origin.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-rule px-1.5 py-px text-[8px] uppercase tracking-meta text-mute"
            >
              {tag}
            </span>
          ))}
        </span>
      ) : null}
      {from && from.lineWidth > 0 ? (
        <>
          <span
            className={`project-flight-line${live ? " is-live" : ""}${
              phase === "open" ? " is-behind" : ""
            }`}
            style={topLineStyle}
          />
          <span
            className={`project-flight-line${live ? " is-live" : ""}${
              phase === "open" ? " is-behind" : ""
            }`}
            style={bottomLineStyle}
          />
        </>
      ) : null}
    </>
  );
}
