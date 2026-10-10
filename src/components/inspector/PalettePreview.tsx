import type { RGB } from "../../types";
import { rgbToHex } from "../../utils/color";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, Download } from "lucide-react";

import { PanelSection } from "../common";
import { downloadPalette } from "../../services/export";

type PalettePreviewProps = {
  palette: RGB[];
  selectedColor?: number;
};

export function PalettePreview({
  palette,
  selectedColor,
}: PalettePreviewProps) {
  const [openColorIndex, setOpenColorIndex] = useState<number | null>(null);
  const [copiedColorIndex, setCopiedColorIndex] = useState<number | null>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!paletteRef.current?.contains(event.target as Node)) {
        setOpenColorIndex(null);
        setCopiedColorIndex(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenColorIndex(null);
        setCopiedColorIndex(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <PanelSection title="Palette">
      {palette.length === 0 ? (
        <div className="emptyInspector">No palette yet.</div>
      ) : (
        <div className="paletteGrid" ref={paletteRef}>
          {palette.map((color, index) => {
            const [r, g, b] = color;
            const hexCode = rgbToHex(r, g, b).toUpperCase();

            return (
              <div
                className={[
                  "paletteItemWrap",
                  selectedColor === index || openColorIndex === index
                    ? "paletteItemWrapSelected"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={`${r}-${g}-${b}-${index}`}
              >
                <button
                  type="button"
                  className={[
                    "paletteItem",
                    selectedColor === index ? "paletteItemSelected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    setCopiedColorIndex(null);
                    setOpenColorIndex((current) =>
                      current === index ? null : index,
                    );
                  }}
                  aria-expanded={openColorIndex === index}
                  aria-label={`Color ${index + 1}`}
                  title={`Color ${index + 1}`}
                >
                  <div
                    className="paletteSwatch"
                    style={{
                      backgroundColor: `rgb(${r}, ${g}, ${b})`,
                    }}
                  />

                  <span className="paletteName">{index + 1}</span>
                </button>

                {openColorIndex === index && (
                  <div className="paletteColorBubble" role="status">
                    <strong>Color {index + 1}</strong>
                    <code>{hexCode}</code>
                    <button
                      type="button"
                      className="paletteCopyButton"
                      aria-label={`Copy color code ${hexCode}`}
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(hexCode);
                          setCopiedColorIndex(index);
                        } catch {
                          setCopiedColorIndex(null);
                        }
                      }}
                    >
                      {copiedColorIndex === index ? (
                        <Check size={13} />
                      ) : (
                        <Copy size={13} />
                      )}
                      <span>
                        {copiedColorIndex === index ? "Copied" : "Copy"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {palette.length > 0 && (
        <div className="paletteExportActions" aria-label="Export palette">
          <button
            type="button"
            className="secondaryButton paletteExportButton"
            onClick={() => downloadPalette(palette, "gpl")}
            aria-label="Export GIMP palette"
            title="Export GIMP palette"
          >
            <Download size={13} />
            <span>GPL</span>
          </button>

          <button
            type="button"
            className="secondaryButton paletteExportButton"
            onClick={() => downloadPalette(palette, "ase")}
            aria-label="Export Photoshop swatches"
            title="Export Photoshop swatches"
          >
            <Download size={13} />
            <span>ASE</span>
          </button>

          <button
            type="button"
            className="secondaryButton paletteExportButton"
            onClick={() => downloadPalette(palette, "csv")}
            aria-label="Export palette as CSV"
            title="Export palette as CSV"
          >
            <Download size={13} />
            <span>CSV</span>
          </button>
        </div>
      )}
    </PanelSection>
  );
}
