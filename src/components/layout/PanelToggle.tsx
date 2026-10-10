import { PanelLeft, PanelRight } from "lucide-react";

type PanelToggleProps = {
  side: "left" | "right";
  visible: boolean;
  onToggle: () => void;
};

export function PanelToggle({ side, visible, onToggle }: PanelToggleProps) {
  const isLeft = side === "left";

  return (
    <button
      type="button"
      className={`panelToggle ${side}`}
      onClick={onToggle}
      aria-label={visible ? `Hide ${side} panel` : `Show ${side} panel`}
      title={visible ? `Hide ${side} panel` : `Show ${side} panel`}
    >
      {isLeft ? <PanelLeft size={17} /> : <PanelRight size={17} />}
    </button>
  );
}
