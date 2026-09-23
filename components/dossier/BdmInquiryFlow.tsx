"use client";

import { useState } from "react";

type Tone = "plain" | "accent" | "mute";
type NodeId =
  | "unverified"
  | "sellers"
  | "ai"
  | "buyers"
  | "contact"
  | "middlemen";

const NODES: Record<
  NodeId,
  { title: string; subtitle: string; tone: Tone }
> = {
  unverified: {
    title: "Unverified",
    subtitle: "guests · no account",
    tone: "mute",
  },
  sellers: {
    title: "Sellers",
    subtitle: "AI listings · account",
    tone: "plain",
  },
  ai: {
    title: "AI Verification",
    subtitle: "listings · members",
    tone: "accent",
  },
  buyers: {
    title: "Buyers",
    subtitle: "product pages · enquiry",
    tone: "plain",
  },
  contact: {
    title: "Direct Contact",
    subtitle: "email · phone · human to human",
    tone: "plain",
  },
  middlemen: {
    title: "Middlemen",
    subtitle: "brokers · gatekeepers",
    tone: "mute",
  },
};

const PATHS: Record<NodeId, NodeId[]> = {
  unverified: ["unverified", "ai"],
  sellers: ["sellers", "ai", "contact"],
  ai: ["sellers", "ai", "buyers", "contact"],
  buyers: ["buyers", "ai", "contact"],
  contact: ["ai", "contact"],
  middlemen: ["contact", "middlemen"],
};

function NodeCard({
  id,
  active,
  className = "",
  onHover,
  onLeave,
  onClick,
}: {
  id: NodeId;
  active: boolean;
  className?: string;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const node = NODES[id];
  const accent = node.tone === "accent";
  const mute = node.tone === "mute";

  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onClick={onClick}
      className={`rounded-full border px-3 py-2 text-center transition-all duration-200 ${className}`}
      style={{
        background: accent ? "#FFF4EF" : mute ? "#F3F4F5" : "#FFFFFF",
        borderColor: accent ? "#FF6B35" : "#E8E9EA",
        opacity: active ? 1 : 0.4,
        boxShadow: active && !mute ? "0 6px 16px rgba(26,29,32,0.04)" : "none",
      }}
    >
      <span
        className="block text-[12px] font-medium leading-tight"
        style={{ color: mute ? "#6B6E73" : "#1A1D20" }}
      >
        {node.title}
      </span>
      <span
        className="mt-0.5 block text-[9px] leading-tight sm:whitespace-nowrap"
        style={{ color: mute ? "#9A9DA2" : "#FF6B35" }}
      >
        {node.subtitle}
      </span>
    </button>
  );
}

function Mark({ ok, active }: { ok: boolean; active: boolean }) {
  return (
    <span
      className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full text-[7px] leading-none"
      style={{
        background: ok ? "#22C55E" : "#FF6B35",
        color: "#FFFFFF",
        opacity: active ? 1 : 0.35,
      }}
      aria-hidden
    >
      {ok ? "✓" : "×"}
    </span>
  );
}

function VLine({ ok, active }: { ok: boolean; active: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="h-2.5 w-px"
        style={{ background: "#E8E9EA", opacity: active ? 1 : 0.35 }}
      />
      <Mark ok={ok} active={active} />
      <span
        className="h-2.5 w-px"
        style={{ background: "#E8E9EA", opacity: active ? 1 : 0.35 }}
      />
    </div>
  );
}

export default function BdmInquiryFlow() {
  const [focus, setFocus] = useState<NodeId | null>(null);
  const [pinned, setPinned] = useState<NodeId | null>(null);
  const current = focus ?? pinned;
  const lit = current ? new Set(PATHS[current]) : null;

  function isActive(id: NodeId) {
    return !lit || lit.has(id);
  }

  function bind(id: NodeId) {
    return {
      id,
      active: isActive(id),
      onHover: () => setFocus(id),
      onLeave: () => setFocus(null),
      onClick: () => setPinned((value) => (value === id ? null : id)),
    };
  }

  return (
    <div
      className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-dashed border-[#E8E9EA] bg-[#FCFCFC] px-4 py-5 sm:px-8 sm:py-7"
      style={{ fontFamily: "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.08em] text-[#B0B3B7]">
        AI Verification Flow
      </p>

      <div className="flex flex-col items-center md:hidden">
        <NodeCard {...bind("unverified")} className="w-full max-w-[240px]" />
        <VLine ok={false} active={!lit || lit.has("unverified")} />
        <NodeCard {...bind("sellers")} className="w-full max-w-[240px]" />
        <VLine ok active={isActive("sellers")} />
        <NodeCard {...bind("ai")} className="w-full max-w-[240px]" />
        <VLine ok active={isActive("buyers")} />
        <NodeCard {...bind("buyers")} className="w-full max-w-[240px]" />
        <VLine ok active={!lit || lit.has("contact")} />
        <NodeCard {...bind("contact")} className="w-full max-w-[240px]" />
        <VLine ok={false} active={!lit || lit.has("middlemen")} />
        <NodeCard {...bind("middlemen")} className="w-full max-w-[240px]" />
      </div>

      <div className="hidden flex-col items-center md:flex">
        <NodeCard {...bind("unverified")} className="w-[148px]" />
        <VLine ok={false} active={!lit || lit.has("unverified")} />

        <div className="flex w-full min-w-0 items-center gap-1.5">
          <NodeCard {...bind("sellers")} className="min-w-0 flex-1" />
          <Mark ok active={isActive("sellers")} />
          <NodeCard {...bind("ai")} className="min-w-0 flex-[1.15]" />
          <Mark ok active={isActive("buyers")} />
          <NodeCard {...bind("buyers")} className="min-w-0 flex-1" />
        </div>

        <VLine ok active={!lit || lit.has("contact")} />
        <NodeCard {...bind("contact")} className="w-[210px]" />
        <VLine ok={false} active={!lit || lit.has("middlemen")} />
        <NodeCard {...bind("middlemen")} className="w-[148px]" />
      </div>
    </div>
  );
}
