import { PanelSection, RangeControl } from "../common";

import { LIMITS } from "../../constants";

type PencilControlProps = {
  sensitivity: number;
  thickness: number;
  darkness: number;
  color: string;
  paperBrightness: number;

  onSensitivityChange: (value: number) => void;

  onThicknessChange: (value: number) => void;

  onDarknessChange: (value: number) => void;

  onColorChange: (value: string) => void;

  onPaperBrightnessChange: (value: number) => void;
};

export function PencilControl({
  sensitivity,
  thickness,
  darkness,
  color,
  paperBrightness,
  onSensitivityChange,
  onThicknessChange,
  onDarknessChange,
  onColorChange,
  onPaperBrightnessChange,
}: PencilControlProps) {
  return (
    <PanelSection title="Pencil">
      <RangeControl
        label="Edge sensitivity"
        value={sensitivity}
        min={LIMITS.sensitivity.min}
        max={LIMITS.sensitivity.max}
        step={1}
        onChange={onSensitivityChange}
      />

      <RangeControl
        label="Line thickness"
        value={thickness}
        min={LIMITS.pencilThickness.min}
        max={LIMITS.pencilThickness.max}
        step={LIMITS.pencilThickness.step}
        formatValue={(value) => value.toFixed(2)}
        onChange={onThicknessChange}
      />

      <RangeControl
        label="Line darkness"
        value={darkness}
        min={LIMITS.pencilDarkness.min}
        max={LIMITS.pencilDarkness.max}
        step={1}
        suffix="%"
        onChange={onDarknessChange}
      />

      <div className="colorControl">
        <label htmlFor="pencil-color">Pencil color</label>

        <div className="colorPickerRow">
          <input
            id="pencil-color"
            type="color"
            value={color}
            onChange={(event) => onColorChange(event.target.value)}
          />

          <span>{color.toUpperCase()}</span>
        </div>
      </div>

      <RangeControl
        label="Paper brightness"
        value={paperBrightness}
        min={LIMITS.paperBrightness.min}
        max={LIMITS.paperBrightness.max}
        step={1}
        onChange={onPaperBrightnessChange}
      />
    </PanelSection>
  );
}
