"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+<>@?[]{}|/\\^~";
const DURATION_MIN = 3000;
const DURATION_MAX = 4000;
const INTERVAL_MIN = 14000;
const INTERVAL_MAX = 16000;
const FLIP_MIN = 90;
const FLIP_MAX = 200;

function glyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export default function ScrambleName({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  const [display, setDisplay] = useState(text);
  const link = useRef<HTMLAnchorElement>(null);
  const frame = useRef(0);
  const timer = useRef(0);

  const play = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }

    cancelAnimationFrame(frame.current);
    const original = text.split("");
    const chars = original.slice();
    const slots = original
      .map((char, index) => (char === " " ? -1 : index))
      .filter((index) => index >= 0);
    const duration = DURATION_MIN + Math.random() * (DURATION_MAX - DURATION_MIN);
    const start = performance.now();
    let nextFlip = 0;

    const unsettled = () =>
      slots.filter((index) => chars[index] !== original[index]);

    const tick = (now: number) => {
      const progress = (now - start) / duration;

      if (progress >= 1 && unsettled().length === 0) {
        setDisplay(text);
        return;
      }

      if (now >= nextFlip) {
        if (progress < 0.22) {
          chars[pick(slots)] = glyph();
        } else if (progress < 0.68) {
          const flips = Math.random() < 0.3 ? 2 : 1;
          for (let n = 0; n < flips; n += 1) {
            chars[pick(slots)] = glyph();
          }
        } else {
          const pending = unsettled();
          if (pending.length) {
            const restores = pending.length > 4 && Math.random() < 0.3 ? 2 : 1;
            for (let n = 0; n < restores; n += 1) {
              const leftover = unsettled();
              if (!leftover.length) break;
              const index = pick(leftover);
              chars[index] = original[index];
            }
          }
        }

        setDisplay(chars.join(""));
        const pace =
          progress >= 0.68
            ? FLIP_MIN + 20 + Math.random() * (FLIP_MAX - FLIP_MIN)
            : FLIP_MIN + Math.random() * (FLIP_MAX - FLIP_MIN);
        nextFlip = now + pace;
      }

      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
  }, [text]);

  const schedule = useCallback(() => {
    window.clearTimeout(timer.current);
    const wait = INTERVAL_MIN + Math.random() * (INTERVAL_MAX - INTERVAL_MIN);
    timer.current = window.setTimeout(() => {
      play();
      schedule();
    }, wait);
  }, [play]);

  useEffect(() => {
    schedule();
    return () => {
      cancelAnimationFrame(frame.current);
      window.clearTimeout(timer.current);
    };
  }, [schedule]);

  useEffect(() => {
    const node = link.current;
    if (!node) return;

    const onEnter = () => {
      play();
      schedule();
    };

    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("focus", onEnter);
    return () => {
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("focus", onEnter);
    };
  }, [play, schedule]);

  return (
    <Link ref={link} href={href} className="meta shrink-0 whitespace-nowrap text-ink">
      <span className="relative inline-block whitespace-nowrap">
        <span className="sr-only">{text}</span>
        <span aria-hidden="true" className="whitespace-nowrap">
          <span className="invisible whitespace-nowrap">{text}</span>
          <span className="absolute left-0 top-0 whitespace-nowrap">
            {display}
          </span>
        </span>
      </span>
    </Link>
  );
}
