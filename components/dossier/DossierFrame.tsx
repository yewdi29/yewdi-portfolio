"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function DossierFrame({
  home,
  children,
}: {
  home: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const overlay = pathname.startsWith("/work/");

  return (
    <>
      <div aria-hidden={overlay} className={overlay ? "pointer-events-none" : undefined}>
        {home}
      </div>
      {children}
    </>
  );
}
