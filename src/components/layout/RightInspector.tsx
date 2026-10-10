import {
  PalettePreview,
  SelectedCellInfo,
  WorkflowInfo,
} from '../inspector'

import type {
  CellInfo,
  RGB,
} from '../../types'

type RightInspectorProps = {
  palette: RGB[]
  selectedCell: CellInfo | null
  selectedRow: number | null
  selectedColumn: number | null
  selectedColorIndex?: number
  filterSelectedColors: number[]
  filterEnabled: boolean
  onToggleFilterColor: (index: number) => void
  onFilterEnabledChange: (enabled: boolean) => void
}

export function RightInspector({
  palette,
  selectedCell,
  selectedRow,
  selectedColumn,
  selectedColorIndex,
  filterSelectedColors,
  filterEnabled,
  onToggleFilterColor,
  onFilterEnabledChange,
}: RightInspectorProps) {
  return (
    <div className="rightInspectorContent">
      <PalettePreview
        palette={palette}
        selectedColor={
          selectedColorIndex
        }
        filterSelectedColors={filterSelectedColors}
        filterEnabled={filterEnabled}
        onToggleFilterColor={onToggleFilterColor}
        onFilterEnabledChange={onFilterEnabledChange}
      />

      <SelectedCellInfo
        cell={selectedCell}
        row={selectedRow}
        column={selectedColumn}
      />

      <WorkflowInfo />
    </div>
  )
}