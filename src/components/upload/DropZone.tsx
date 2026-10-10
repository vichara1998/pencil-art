import type { DragEvent } from "react";
import { Upload } from "lucide-react";

type DropZoneProps = {
  isDragging: boolean;
  onOpenFilePicker: () => void;
  onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
};

export function DropZone({
  isDragging,
  onOpenFilePicker,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}: DropZoneProps) {
  return (
    <div
      className={`dropzone ${isDragging ? "dropzoneActive" : ""}`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="dropzoneIcon">
        <Upload size={20} />
      </div>

      <p className="dropzoneTitle">Drop an image here</p>

      <p className="dropzoneText">PNG, JPG, WEBP, BMP or GIF</p>

      <button
        type="button"
        className="secondaryButton"
        onClick={onOpenFilePicker}
      >
        Choose image
      </button>
    </div>
  );
}
