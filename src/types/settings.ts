import type {
  ImageAdjustmentSettings,
  PencilSettings,
} from './image'

import type { GridSettings } from './grid'

export type ColorSettings = {
  colors: number
}

export type ZoomSettings = {
  zoom: number
}

export type EditorSettings = {
  mode: import('./app').Mode
  grid: GridSettings
  color: ColorSettings
  image: ImageAdjustmentSettings
  pencil: PencilSettings
  zoom: ZoomSettings
}