import type { CSSProperties, ElementType, ReactNode } from "react";

type RiseProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
};

export default function Rise({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RiseProps) {
  return (
    <Tag
      className={`rise ${className}`.trim()}
      style={{ "--rise-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
