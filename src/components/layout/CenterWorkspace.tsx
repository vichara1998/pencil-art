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
  processingProgress: number;
  processingStage: string;
  uploadProgress: {
    phase: 'reading' | 'decoding'
    progress: number
  } | null;
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
  processingProgress,
  processingStage,
  uploadProgress,
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
  const isUploading = uploadProgress !== null
  const progressStage = isUploading
    ? uploadProgress.phase === 'reading'
      ? 'Loading image'
      : 'Opening image'
    : processingStage
  const currentProgress = isUploading
    ? uploadProgress.progress
    : processingProgress

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
      )}
      <ProcessingOverlay
        visible={isUploading || (hasImage && busy)}
        progress={currentProgress}
        stage={progressStage}
      />
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
