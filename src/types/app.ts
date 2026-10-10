export type Mode =
  | 'original'
  | 'pencil'
  | 'color'
  | 'pencil-grid'
  | 'color-grid'

export type RGB = [
  number,
  number,
  number,
]

export type CellInfo = {
  color: string
  rgb: RGB
  edge: boolean
  coverage: number
  colorNumber: number
}

export type PanelVisibility = {
  left: boolean
  right: boolean
}

export type SelectedCell = {
  index: number
  row: number
  column: number
} | null