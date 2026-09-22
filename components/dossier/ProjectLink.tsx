"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { setExpandOrigin } from "@/lib/expand-origin";

export default function ProjectLink({
  slug,
  className,
  children,
}: {
  slug: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/work/${slug}`}
      scroll={false}
      className={className}
      onClick={(event) => {
        const target = event.currentTarget.closest("li") ?? event.currentTarget;
        const rect = target.getBoundingClientRect();
        setExpandOrigin({
          slug,
          top: Math.max(0, rect.top),
          bottom: Math.max(0, window.innerHeight - rect.bottom),
        });
      }}
    >
      {children}
    </Link>
  );
}
