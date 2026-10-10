import type { EditorSettings } from '../types'

export const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  mode: 'pencil-grid',

  grid: {
    size: 40,
    showNumbers: true,
  },

  color: {
    colors: 12,
  },

  image: {
    brightness: 0,
    contrast: 0,
  },

  pencil: {
    sensitivity: 90,
    thickness: 0.25,
    darkness: 80,
    color: '#222222',
    paperBrightness: 245,
  },

  zoom: {
    zoom: 1,
  },
}

export const DEFAULT_PANEL_VISIBILITY = {
  left: true,
  right: true,
}