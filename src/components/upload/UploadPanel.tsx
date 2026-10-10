import { PanelSection } from "../common";

import { DropZone } from "./DropZone";

type UploadPanelProps = {
  isDragging: boolean;
  error: string;
  onUpload: () => void;
  onDragEnter: (event: React.DragEvent) => void;
  onDragLeave: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
};

export function UploadPanel({
  isDragging,
  error,
  onUpload,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}: UploadPanelProps) {
  return (
    <PanelSection title="Image">
      <DropZone
        isDragging={isDragging}
        onOpenFilePicker={onUpload}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      />

      {error && <div className="errorMessage">{error}</div>}
    </PanelSection>
  );
}
