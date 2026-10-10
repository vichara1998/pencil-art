import type { ReactNode } from "react";

import { PanelToggle } from "./PanelToggle";

type WorkspaceProps = {
  hasImage: boolean;
  leftPanel?: ReactNode;
  centerPanel: ReactNode;
  rightPanel?: ReactNode;
  leftVisible: boolean;
  rightVisible: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
};

export function Workspace({
  hasImage,
  leftPanel,
  centerPanel,
  rightPanel,
  leftVisible,
  rightVisible,
  onToggleLeft,
  onToggleRight,
}: WorkspaceProps) {
  return (
    <main
      className={[
        "workspace",
        !hasImage || !leftVisible ? "leftPanelHidden" : "",
        !hasImage || !rightVisible ? "rightPanelHidden" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {hasImage && (
        <PanelToggle
          side="left"
          visible={leftVisible}
          onToggle={onToggleLeft}
        />
      )}

      {hasImage && leftVisible && (
        <aside className="sidebar">{leftPanel}</aside>
      )}

      <section className="canvasArea">{centerPanel}</section>

      {hasImage && rightVisible && (
        <aside className="inspector">{rightPanel}</aside>
      )}

      {hasImage && (
        <PanelToggle
          side="right"
          visible={rightVisible}
          onToggle={onToggleRight}
        />
      )}
    </main>
  );
}
