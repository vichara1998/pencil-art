import type { CellInfo } from "../../types";

import { PanelSection } from "../common";

type SelectedCellInfoProps = {
  cell: CellInfo | null;
  row: number | null;
  column: number | null;
};

export function SelectedCellInfo({ cell, row, column }: SelectedCellInfoProps) {
  return (
    <PanelSection title="Selected cell">
      {!cell ? (
        <div className="emptyInspector">Click a grid cell to inspect it.</div>
      ) : (
        <div className="cellInspector" aria-live="polite">
          <div className="cellColorPreview">
            <div
              className="cellColorSwatch"
              role="img"
              aria-label={`Color ${cell.colorNumber} swatch`}
              style={{
                backgroundColor: cell.color,
              }}
            />

            <div className="cellColorInfo">
              <p className="cellColorName">Color {cell.colorNumber}</p>

              <p className="cellColorValue">{cell.color.toUpperCase()}</p>

              <p className="cellColorValue">RGB {cell.rgb.join(", ")}</p>
            </div>
          </div>

          <div className="cellDetails">
            <div className="cellDetail">
              <span className="cellDetailLabel">Row</span>
              <strong className="cellDetailValue">{(row ?? 0) + 1}</strong>
            </div>

            <div className="cellDetail">
              <span className="cellDetailLabel">Column</span>
              <strong className="cellDetailValue">{(column ?? 0) + 1}</strong>
            </div>

            <div className="cellDetail">
              <span className="cellDetailLabel">Coverage</span>
              <strong className="cellDetailValue">
                {Math.round(cell.coverage * 100)}%
              </strong>
            </div>

            <div className="cellDetail">
              <span className="cellDetailLabel">Edge</span>
              <strong className="cellDetailValue">
                {cell.edge ? "Yes" : "No"}
              </strong>
            </div>
          </div>
        </div>
      )}
    </PanelSection>
  );
}
