import { Minus, Plus, RotateCcw } from "lucide-react";

import { PanelSection } from "../common";

import { LIMITS } from "../../constants";

type ZoomControlProps = {
  zoom: number;
  onChange: (value: number) => void;
  onResetView: () => void;
};

export function ZoomControl({ zoom, onChange, onResetView }: ZoomControlProps) {
  const decreaseZoom = () => {
    onChange(
      Math.max(LIMITS.zoom.min, Number((zoom - LIMITS.zoom.step).toFixed(2))),
    );
  };

  const increaseZoom = () => {
    onChange(
      Math.min(LIMITS.zoom.max, Number((zoom + LIMITS.zoom.step).toFixed(2))),
    );
  };

  return (
    <PanelSection title="Zoom">
      <div className="zoomControl">
        <button
          type="button"
          className="iconButton"
          onClick={decreaseZoom}
          disabled={zoom <= LIMITS.zoom.min}
          aria-label="Zoom out"
          title="Zoom out"
        >
          <Minus size={16} />
        </button>

        <span className="zoomValue">{Math.round(zoom * 100)}%</span>

        <button
          type="button"
          className="iconButton"
          onClick={increaseZoom}
          disabled={zoom >= LIMITS.zoom.max}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <Plus size={16} />
        </button>

        <button
          type="button"
          className="iconButton"
          onClick={onResetView}
          aria-label="Reset view"
          title="Reset view"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </PanelSection>
  );
}
