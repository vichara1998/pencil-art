import { useEffect } from "react";

type HomeConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function HomeConfirmDialog({
  open,
  onClose,
  onConfirm,
}: HomeConfirmDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="dialogBackdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="homeConfirmDialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="home-confirm-title"
        aria-describedby="home-confirm-description"
      >
        <div className="dialogHeader">
          <div>
            <h2 className="dialogTitle" id="home-confirm-title">
              Close current project?
            </h2>
            <p className="dialogSubtitle" id="home-confirm-description">
              Your current image and saved project will be cleared. You can
              start again from the upload screen.
            </p>
          </div>
        </div>

        <div className="dialogFooter">
          <button type="button" className="secondaryButton" onClick={onClose}>
            Keep project open
          </button>
          <button type="button" className="primaryButton" onClick={onConfirm}>
            Close project
          </button>
        </div>
      </div>
    </div>
  );
}
