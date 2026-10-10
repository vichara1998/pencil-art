import {
  Grid3X3,
  Image,
  Pencil,
  Palette,
} from 'lucide-react'

import type { Mode } from '../../types'

import {
  PanelSection,
} from '../common'

type ViewModeControlProps = {
  mode: Mode
  onChange: (mode: Mode) => void
}

const modes: {
  value: Mode
  label: string
  icon: React.ReactNode
}[] = [
  {
    value: 'original',
    label: 'Original',
    icon: <Image size={16} />,
  },
  {
    value: 'pencil',
    label: 'Pencil',
    icon: <Pencil size={16} />,
  },
  {
    value: 'color',
    label: 'Color',
    icon: <Palette size={16} />,
  },
  {
    value: 'pencil-grid',
    label: 'Pencil + Grid',
    icon: <Grid3X3 size={16} />,
  },
  {
    value: 'color-grid',
    label: 'Color + Grid',
    icon: <Grid3X3 size={16} />,
  },
]

export function ViewModeControl({
  mode,
  onChange,
}: ViewModeControlProps) {
  return (
    <PanelSection title="View">
      <div className="modeGrid">
        {modes.map((item) => (
          <button
            key={item.value}
            type="button"
            className={[
              'modeButton',
              mode === item.value
                ? 'modeButtonActive'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() =>
              onChange(item.value)
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </PanelSection>
  )
}