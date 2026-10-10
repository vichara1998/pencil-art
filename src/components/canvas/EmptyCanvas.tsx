import { ImagePlus } from "lucide-react";

type EmptyCanvasProps = {
  isDragging: boolean;
  error: string;
  onUpload: () => void;
};

export function EmptyCanvas({ isDragging, error, onUpload }: EmptyCanvasProps) {
  return (
    <div className={`emptyCanvas ${isDragging ? "emptyCanvasActive" : ""}`}>
      <div className="emptyCanvasContent">
        <div className="emptyCanvasIcon">
          <ImagePlus size={28} />
        </div>

        <h2 className="emptyCanvasTitle">Drop an image to begin</h2>

        <p className="emptyCanvasText">
          Or browse for a PNG, JPG, WEBP, BMP, or GIF.
        </p>

        <button type="button" className="primaryButton" onClick={onUpload}>
          <ImagePlus size={17} />
          <span>Browse images</span>
        </button>

        {error && (
          <div className="errorMessage" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
