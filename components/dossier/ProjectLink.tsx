"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { setExpandOrigin } from "@/lib/expand-origin";
import { resolveMedia } from "@/lib/media";

const MAX = 280;
const GAP = 18;
const CYCLE = 300;

function frameSize(width: number, height: number) {
  if (!width || !height) return { width: MAX, height: MAX };
  if (width >= height) {
    return { width: MAX, height: Math.max(1, Math.round((MAX * height) / width)) };
  }
  return { width: Math.max(1, Math.round((MAX * width) / height)), height: MAX };
}

function placePreview(x: number, y: number, height: number) {
  return {
    left: x + GAP,
    top: y - GAP - height,
  };
}

export default function ProjectLink({
  slug,
  title,
  images = [],
  className,
  children,
}: {
  slug: string;
  title: string;
  images?: string[];
  className?: string;
  children: ReactNode;
}) {
  const [hover, setHover] = useState(false);
  const [frame, setFrame] = useState(0);
  const [box, setBox] = useState({ width: MAX, height: MAX });
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const [mounted, setMounted] = useState(false);
  const link = useRef<HTMLAnchorElement>(null);
  const cursor = useRef({ x: 0, y: 0 });
  const boxRef = useRef({ width: MAX, height: MAX });
  const imagesRef = useRef(images);
  imagesRef.current = images;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!hover || images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % images.length);
    }, CYCLE);
    return () => window.clearInterval(timer);
  }, [hover, images.length]);

  useEffect(() => {
    const node = link.current;
    if (!node) return;

    const canPreview = () =>
      imagesRef.current.length > 0 &&
      !window.matchMedia("(hover: none)").matches &&
      !document.documentElement.classList.contains("is-project-open");

    const onEnter = (event: PointerEvent) => {
      if (!canPreview()) return;
      const paths = imagesRef.current;
      cursor.current = { x: event.clientX, y: event.clientY };
      setFrame(0);
      setBox({ width: MAX, height: MAX });
      setPos(placePreview(event.clientX, event.clientY, MAX));
      setHover(true);
      paths.forEach((path) => {
        const preload = new window.Image();
        preload.src = resolveMedia(path);
      });
    };

    const onMove = (event: PointerEvent) => {
      if (!canPreview()) return;
      cursor.current = { x: event.clientX, y: event.clientY };
      setPos(placePreview(event.clientX, event.clientY, boxRef.current.height));
    };

    const onLeave = () => setHover(false);

    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);
    return () => {
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const src = images[frame] ? resolveMedia(images[frame]) : "";

  return (
    <Link
      ref={link}
      href={`/work/${slug}`}
      scroll={false}
      className={className}
      onClick={(event) => {
        setHover(false);
        const row = event.currentTarget.closest("li") ?? event.currentTarget;
        const titleNode =
          row.querySelector<HTMLElement>("[data-project-title]") ??
          event.currentTarget;
        const monthNode = Array.from(
          row.querySelectorAll<HTMLElement>("[data-project-month]"),
        ).find((node) => node.offsetParent !== null);
        const tagsNode = row.querySelector<HTMLElement>("[data-project-tags]");
        const rowRect = row.getBoundingClientRect();
        const titleRect = titleNode.getBoundingClientRect();
        const monthRect = monthNode?.getBoundingClientRect();
        const tagsRect = tagsNode?.getBoundingClientRect();

        setExpandOrigin({
          slug,
          title,
          top: Math.max(0, rowRect.top),
          bottom: Math.max(0, window.innerHeight - rowRect.bottom),
          titleTop: titleRect.top,
          titleLeft: titleRect.left,
          titleWidth: titleRect.width,
          titleHeight: titleRect.height,
          lineLeft: rowRect.left,
          lineWidth: rowRect.width,
          lineTop: rowRect.top,
          lineBottom: rowRect.bottom,
          monthTop: monthRect?.top ?? 0,
          monthLeft: monthRect?.left ?? 0,
          monthText: monthNode?.textContent?.trim() ?? "",
          tagsTop: tagsRect?.top ?? 0,
          tagsLeft: tagsRect?.left ?? 0,
          tags: Array.from(
            tagsNode?.querySelectorAll("[data-project-tag]") ?? [],
          ).map((node) => node.textContent?.trim() ?? ""),
        });
      }}
    >
      {children}
      {mounted && hover && src
        ? createPortal(
            <div
              aria-hidden="true"
              className="pointer-events-none fixed z-[30] overflow-hidden border border-rule bg-sheet"
              style={{
                left: pos.left,
                top: pos.top,
                width: box.width,
                height: box.height,
              }}
            >
              <img
                src={src}
                alt=""
                className="block h-full w-full object-contain"
                onLoad={(event) => {
                  const next = frameSize(
                    event.currentTarget.naturalWidth,
                    event.currentTarget.naturalHeight,
                  );
                  boxRef.current = next;
                  setBox(next);
                  setPos(
                    placePreview(cursor.current.x, cursor.current.y, next.height),
                  );
                }}
              />
            </div>,
            document.body,
          )
        : null}
    </Link>
  );
}
