import {
  RotateCcw,
} from 'lucide-react'

import {
  PanelSection,
  RangeControl,
} from '../common'

import { LIMITS } from '../../constants'

type ImageAdjustmentControlProps = {
  brightness: number
  contrast: number
  onBrightnessChange: (
    value: number,
  ) => void
  onContrastChange: (
    value: number,
  ) => void
  onReset: () => void
}

export function ImageAdjustmentControl({
  brightness,
  contrast,
  onBrightnessChange,
  onContrastChange,
  onReset,
}: ImageAdjustmentControlProps) {
  return (
    <PanelSection title="Adjustments">
      <RangeControl
        label="Brightness"
        value={brightness}
        min={LIMITS.brightness.min}
        max={LIMITS.brightness.max}
        step={1}
        onChange={onBrightnessChange}
      />

      <RangeControl
        label="Contrast"
        value={contrast}
        min={LIMITS.contrast.min}
        max={LIMITS.contrast.max}
        step={1}
        onChange={onContrastChange}
      />

      <button
        type="button"
        className="secondaryButton fullWidth"
        onClick={onReset}
      >
        <RotateCcw size={15} />
        Reset adjustments
      </button>
    </PanelSection>
  )
}