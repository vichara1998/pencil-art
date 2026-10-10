import type { MouseEvent, RefObject } from "react";
import type { CellInfo } from "../../types";

import { CanvasViewport, EmptyCanvas, ProcessingOverlay } from "../canvas";

type CenterWorkspaceProps = {
  hasImage: boolean;
  canvasRef: RefObject<HTMLCanvasElement>;
  zoom: number;
  gridSize: number;
  cells: CellInfo[];
  showNumbers: boolean;
  resetViewKey: number;
  busy: boolean;
  error: string;
  uploadError: string;
  isDragging: boolean;
  onUpload: () => void;
  onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onZoomChange: (value: number) => void;
  onCanvasClick?: (event: MouseEvent<HTMLCanvasElement>) => void;
};

export function CenterWorkspace({
  hasImage,
  canvasRef,
  zoom,
  gridSize,
  cells,
  showNumbers,
  resetViewKey,
  busy,
  error,
  uploadError,
  isDragging,
  onUpload,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onZoomChange,
  onCanvasClick,
}: CenterWorkspaceProps) {
  return (
    <div
      className={`centerWorkspace ${
        isDragging && hasImage ? "centerWorkspaceDropActive" : ""
      }`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {!hasImage ? (
        <EmptyCanvas
          isDragging={isDragging}
          error={uploadError}
          onUpload={onUpload}
        />
      ) : (
        <>
          <CanvasViewport
            canvasRef={canvasRef}
            zoom={zoom}
            gridSize={gridSize}
            cells={cells}
            showNumbers={showNumbers}
            resetViewKey={resetViewKey}
            onZoomChange={onZoomChange}
            onClick={onCanvasClick}
          />

          <ProcessingOverlay visible={busy} />
        </>
      )}
      {hasImage && error && (
        <div className="errorMessage" role="alert">
          {error}
        </div>
      )}
      {hasImage && uploadError && (
        <div className="errorMessage" role="alert">
          {uploadError}
        </div>
      )}
    </div>
  );
}
