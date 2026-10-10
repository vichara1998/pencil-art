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
}

export function RightInspector({
  palette,
  selectedCell,
  selectedRow,
  selectedColumn,
  selectedColorIndex,
}: RightInspectorProps) {
  return (
    <div className="rightInspectorContent">
      <PalettePreview
        palette={palette}
        selectedColor={
          selectedColorIndex
        }
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