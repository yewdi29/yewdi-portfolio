"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { setExpandOrigin } from "@/lib/expand-origin";

export default function ProjectLink({
  slug,
  title,
  className,
  children,
}: {
  slug: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/work/${slug}`}
      scroll={false}
      className={className}
      onClick={(event) => {
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
    </Link>
  );
}
