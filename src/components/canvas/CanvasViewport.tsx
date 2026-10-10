import type { CSSProperties, PointerEvent, RefObject } from "react";

import { useEffect, useRef, useState } from "react";

import { LIMITS } from "../../constants";
import type { CellInfo } from "../../types";

type CanvasViewportProps = {
  canvasRef: RefObject<HTMLCanvasElement>;
  zoom: number;
  gridSize: number;
  cells: CellInfo[];
  showNumbers: boolean;
  resetViewKey: number;
  onZoomChange: (value: number) => void;
  onClick?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
};

export function CanvasViewport({
  canvasRef,
  zoom,
  gridSize,
  cells,
  showNumbers,
  resetViewKey,
  onZoomChange,
  onClick,
}: CanvasViewportProps) {
  const [pan, setPan] = useState({
    x: 0,
    y: 0,
  });

  const [isPanning, setIsPanning] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const dragStartRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    panX: number;
    panY: number;
    moved: boolean;
  } | null>(null);

  const backgroundDragRef = useRef<{
    pointerId: number;
    x: number;
    y: number;
    panX: number;
    panY: number;
    moved: boolean;
  } | null>(null);

  const suppressClickRef = useRef(false);

  const canvasWidth = canvasRef.current?.width ?? 0;
  const canvasHeight = canvasRef.current?.height ?? 0;
  const cellSize = Math.min(canvasWidth / gridSize, canvasHeight / gridSize);
  const showCellNumbers = showNumbers && cellSize * zoom >= 8;

  useEffect(() => {
    setPan({ x: 0, y: 0 });
  }, [resetViewKey]);

  const canvasStyle: CSSProperties = {
    width: canvasWidth,
    height: canvasHeight,
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0 || !event.isPrimary) {
      return;
    }

    dragStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);

    setIsPanning(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const start = dragStartRef.current;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (!start.moved && Math.hypot(deltaX, deltaY) < 3) {
      return;
    }

    start.moved = true;

    setPan({
      x: start.panX + deltaX,
      y: start.panY + deltaY,
    });
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    const start = dragStartRef.current;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    dragStartRef.current = null;
    setIsPanning(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (start.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  };

  const handleViewportPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.target !== event.currentTarget ||
      event.button !== 0 ||
      !event.isPrimary
    ) {
      return;
    }

    backgroundDragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPanning(true);
  };

  const handleViewportPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = backgroundDragRef.current;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (!start.moved && Math.hypot(deltaX, deltaY) < 3) {
      return;
    }

    start.moved = true;

    setPan({
      x: start.panX + deltaX,
      y: start.panY + deltaY,
    });
  };

  const handleViewportPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = backgroundDragRef.current;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    backgroundDragRef.current = null;
    setIsPanning(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      suppressClickRef.current = false;
      return;
    }

    onClick?.(event);
  };

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const handleWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault();

      const direction = event.deltaY < 0 ? 1 : -1;
      const nextZoom = Number((zoom + direction * LIMITS.zoom.step).toFixed(2));

      onZoomChange(
        Math.min(LIMITS.zoom.max, Math.max(LIMITS.zoom.min, nextZoom)),
      );
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener("wheel", handleWheel);
    };
  }, [zoom, onZoomChange]);

  return (
    <div
      ref={viewportRef}
      className={`canvasViewport ${isPanning ? "canvasViewportPanning" : ""}`}
      onPointerDown={handleViewportPointerDown}
      onPointerMove={handleViewportPointerMove}
      onPointerUp={handleViewportPointerUp}
      onPointerCancel={handleViewportPointerUp}
    >
      <div className="resultCanvasStage" style={canvasStyle}>
        <canvas
          ref={canvasRef}
          className={`resultCanvas ${isPanning ? "resultCanvasPanning" : ""}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleClick}
        />

        {showCellNumbers && (
          <div
            className="gridNumberOverlay"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
              fontSize: `${Math.min(18, Math.max(6, cellSize * 0.52))}px`,
            }}
            aria-hidden="true"
          >
            {cells.map((cell, index) => (
              <span className="gridNumber" key={index}>
                {cell.colorNumber}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
