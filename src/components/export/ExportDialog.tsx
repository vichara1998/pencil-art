import { X } from "lucide-react";

import type { ExportSize } from "../../services/export";

import { ExportSizeSelector } from "./ExportSizeSelector";

import { ExportFormatSelector } from "./ExportFormatSelector";

type ExportDialogProps = {
  open: boolean;
  size: ExportSize;
  format: "png";
  onSizeChange: (value: ExportSize) => void;
  onFormatChange: (value: "png") => void;
  onClose: () => void;
  onExport: () => void;
  exporting: boolean;
  error: string;
};

export function ExportDialog({
  open,
  size,
  format,
  onSizeChange,
  onFormatChange,
  onClose,
  onExport,
  exporting,
  error,
}: ExportDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="dialogBackdrop">
      <div
        className="exportDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-title"
      >
        <div className="dialogHeader">
          <div>
            <h2 id="export-title">Export image</h2>

            <p>Choose the output size for your painting guide.</p>
          </div>

          <button
            type="button"
            className="iconButton"
            onClick={onClose}
            disabled={exporting}
            aria-label="Close export dialog"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="dialogBody">
          {error && (
            <div className="errorMessage" role="alert">
              {error}
            </div>
          )}

          <ExportSizeSelector value={size} onChange={onSizeChange} />

          <ExportFormatSelector value={format} onChange={onFormatChange} />
        </div>

        <div className="dialogFooter">
          <button
            type="button"
            className="secondaryButton"
            onClick={onClose}
            disabled={exporting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="primaryButton"
            onClick={onExport}
            disabled={exporting}
          >
            {exporting ? "Exporting..." : "Export PNG"}
          </button>
        </div>
      </div>
    </div>
  );
}
