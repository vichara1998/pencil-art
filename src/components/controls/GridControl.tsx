import {
  PanelSection,
  RangeControl,
  Toggle,
} from '../common'

import { LIMITS } from '../../constants'

type GridControlProps = {
  size: number
  showNumbers: boolean
  onSizeChange: (value: number) => void
  onShowNumbersChange: (
    value: boolean,
  ) => void
}

export function GridControl({
  size,
  showNumbers,
  onSizeChange,
  onShowNumbersChange,
}: GridControlProps) {
  return (
    <PanelSection title="Grid">
      <RangeControl
        label="Grid size"
        value={size}
        min={LIMITS.grid.min}
        max={LIMITS.grid.max}
        step={1}
        onChange={onSizeChange}
      />

      <Toggle
        label="Show cell numbers"
        checked={showNumbers}
        onChange={onShowNumbersChange}
      />
    </PanelSection>
  )
}