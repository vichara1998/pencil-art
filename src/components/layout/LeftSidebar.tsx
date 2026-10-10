import {
  ViewModeControl,
  GridControl,
  ColorControl,
  ImageAdjustmentControl,
  PencilControl,
  ZoomControl,
} from "../controls";

import type { Mode } from "../../types";

type LeftSidebarProps = {
  mode: Mode;
  gridSize: number;
  showNumbers: boolean;
  colorCount: number;

  brightness: number;
  contrast: number;

  pencilSensitivity: number;
  pencilThickness: number;
  pencilDarkness: number;
  pencilColor: string;
  paperBrightness: number;

  zoom: number;

  onModeChange: (mode: Mode) => void;

  onGridSizeChange: (value: number) => void;

  onShowNumbersChange: (value: boolean) => void;

  onColorCountChange: (value: number) => void;

  onBrightnessChange: (value: number) => void;

  onContrastChange: (value: number) => void;

  onResetAdjustments: () => void;

  onPencilSensitivityChange: (value: number) => void;

  onPencilThicknessChange: (value: number) => void;

  onPencilDarknessChange: (value: number) => void;

  onPencilColorChange: (value: string) => void;

  onPaperBrightnessChange: (value: number) => void;

  onZoomChange: (value: number) => void;
  onResetView: () => void;
};

export function LeftSidebar({
  mode,
  gridSize,
  showNumbers,
  colorCount,
  brightness,
  contrast,
  pencilSensitivity,
  pencilThickness,
  pencilDarkness,
  pencilColor,
  paperBrightness,
  zoom,
  onModeChange,
  onGridSizeChange,
  onShowNumbersChange,
  onColorCountChange,
  onBrightnessChange,
  onContrastChange,
  onResetAdjustments,
  onPencilSensitivityChange,
  onPencilThicknessChange,
  onPencilDarknessChange,
  onPencilColorChange,
  onPaperBrightnessChange,
  onZoomChange,
  onResetView,
}: LeftSidebarProps) {
  return (
    <div className="leftSidebarContent">
      <ViewModeControl mode={mode} onChange={onModeChange} />

      <GridControl
        size={gridSize}
        showNumbers={showNumbers}
        onSizeChange={onGridSizeChange}
        onShowNumbersChange={onShowNumbersChange}
      />

      <ColorControl colors={colorCount} onChange={onColorCountChange} />

      <ImageAdjustmentControl
        brightness={brightness}
        contrast={contrast}
        onBrightnessChange={onBrightnessChange}
        onContrastChange={onContrastChange}
        onReset={onResetAdjustments}
      />

      <PencilControl
        sensitivity={pencilSensitivity}
        thickness={pencilThickness}
        darkness={pencilDarkness}
        color={pencilColor}
        paperBrightness={paperBrightness}
        onSensitivityChange={onPencilSensitivityChange}
        onThicknessChange={onPencilThicknessChange}
        onDarknessChange={onPencilDarknessChange}
        onColorChange={onPencilColorChange}
        onPaperBrightnessChange={onPaperBrightnessChange}
      />

      <ZoomControl
        zoom={zoom}
        onChange={onZoomChange}
        onResetView={onResetView}
      />
    </div>
  );
}
