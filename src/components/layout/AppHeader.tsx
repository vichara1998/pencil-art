import { Download, ImagePlus, Moon, Sun } from "lucide-react";
import logo from "../../assets/grid-pencil-art-logo.png";

type AppHeaderProps = {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  onUpload: () => void;
  onDownload: () => void;
  canDownload: boolean;
  hasImage: boolean;
};

export function AppHeader({
  theme,
  onThemeChange,
  onUpload,
  onDownload,
  canDownload,
  hasImage,
}: AppHeaderProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <img
          className="brandLogo"
          src={logo}
          alt="Grid Pencil Art — Photo to Painting Guide"
        />

        <span className={hasImage ? "statusPill active" : "statusPill"}>
          {hasImage ? "Ready to export" : "Waiting for image"}
        </span>
      </div>

      <div className="topbarActions">
        <div className="themeToggle" role="group" aria-label="Color theme">
          <button
            type="button"
            className={
              theme === "light"
                ? "themeButton themeButtonActive"
                : "themeButton"
            }
            onClick={() => onThemeChange("light")}
            aria-label="Light theme"
            aria-pressed={theme === "light"}
            title="Light theme"
          >
            <Sun size={16} />
          </button>

          <button
            type="button"
            className={
              theme === "dark" ? "themeButton themeButtonActive" : "themeButton"
            }
            onClick={() => onThemeChange("dark")}
            aria-label="Dark theme"
            aria-pressed={theme === "dark"}
            title="Dark theme"
          >
            <Moon size={16} />
          </button>
        </div>

        <button
          type="button"
          className="secondaryButton"
          onClick={onUpload}
          aria-label="Upload image"
          title="Upload image"
        >
          <ImagePlus size={17} />
          <span>Upload image</span>
        </button>

        <button
          type="button"
          className="primaryButton"
          disabled={!canDownload}
          onClick={onDownload}
          aria-label="Save PNG"
          title="Save PNG"
        >
          <Download size={17} />
          <span>Save PNG</span>
        </button>
      </div>
    </header>
  );
}
