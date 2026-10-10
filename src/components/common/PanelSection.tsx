import type { ReactNode } from "react";

type PanelSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function PanelSection({
  title,
  children,
  className = "",
}: PanelSectionProps) {
  return (
    <section className={`panelSection ${className}`.trim()}>
      <div className="sectionTitle">{title}</div>

      {children}
    </section>
  );
}
