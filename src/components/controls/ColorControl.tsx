import {
  Palette,
} from 'lucide-react'

import {
  PanelSection,
  RangeControl,
} from '../common'

import { LIMITS } from '../../constants'

type ColorControlProps = {
  colors: number
  onChange: (value: number) => void
}

export function ColorControl({
  colors,
  onChange,
}: ColorControlProps) {
  return (
    <PanelSection title="Colors">
      <div className="controlDescription">
        <Palette size={15} />

        <span>
          Reduce the image to a
          manageable painting palette.
        </span>
      </div>

      <RangeControl
        label="Color count"
        value={colors}
        min={LIMITS.colors.min}
        max={LIMITS.colors.max}
        step={1}
        onChange={onChange}
      />
    </PanelSection>
  )
}