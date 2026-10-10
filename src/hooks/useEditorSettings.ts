import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  DEFAULT_EDITOR_SETTINGS,
} from '../constants'

import type {
  EditorSettings,
  Mode,
} from '../types'

const SETTINGS_STORAGE_KEY =
  'grid-pencil-art:editor-settings:v1'

function loadEditorSettings(): EditorSettings {
  try {
    const savedSettings =
      window.localStorage.getItem(
        SETTINGS_STORAGE_KEY,
      )

    if (!savedSettings) {
      return DEFAULT_EDITOR_SETTINGS
    }

    const parsed = JSON.parse(
      savedSettings,
    ) as Partial<EditorSettings> | null

    if (!parsed || typeof parsed !== 'object') {
      return DEFAULT_EDITOR_SETTINGS
    }

    return {
      ...DEFAULT_EDITOR_SETTINGS,
      ...parsed,
      grid: {
        ...DEFAULT_EDITOR_SETTINGS.grid,
        ...parsed.grid,
      },
      color: {
        ...DEFAULT_EDITOR_SETTINGS.color,
        ...parsed.color,
      },
      image: {
        ...DEFAULT_EDITOR_SETTINGS.image,
        ...parsed.image,
      },
      pencil: {
        ...DEFAULT_EDITOR_SETTINGS.pencil,
        ...parsed.pencil,
      },
      zoom: {
        ...DEFAULT_EDITOR_SETTINGS.zoom,
        ...parsed.zoom,
      },
    }
  } catch {
    return DEFAULT_EDITOR_SETTINGS
  }
}

export function useEditorSettings() {
  const [initialSettings] = useState(
    loadEditorSettings,
  )

  const [
    mode,
    setModeState,
  ] = useState<Mode>(
    initialSettings.mode,
  )

  const [
    gridSize,
    setGridSizeState,
  ] = useState(
    initialSettings.grid.size,
  )

  const [
    showNumbers,
    setShowNumbersState,
  ] = useState(
    initialSettings.grid.showNumbers,
  )

  const [
    colorCount,
    setColorCountState,
  ] = useState(
    initialSettings.color.colors,
  )

  const [
    brightness,
    setBrightnessState,
  ] = useState(
    initialSettings.image.brightness,
  )

  const [
    contrast,
    setContrastState,
  ] = useState(
    initialSettings.image.contrast,
  )

  const [
    pencilSensitivity,
    setPencilSensitivityState,
  ] = useState(
    initialSettings.pencil.sensitivity,
  )

  const [
    pencilThickness,
    setPencilThicknessState,
  ] = useState(
    initialSettings.pencil.thickness,
  )

  const [
    pencilDarkness,
    setPencilDarknessState,
  ] = useState(
    initialSettings.pencil.darkness,
  )

  const [
    pencilColor,
    setPencilColorState,
  ] = useState(
    initialSettings.pencil.color,
  )

  const [
    paperBrightness,
    setPaperBrightnessState,
  ] = useState(
    initialSettings.pencil.paperBrightness,
  )

  const [
    zoom,
    setZoomState,
  ] = useState(
    initialSettings.zoom.zoom,
  )

  const setMode = useCallback(
    (value: Mode) => {
      setModeState(value)
    },
    [],
  )

  const setGridSize = useCallback(
    (value: number) => {
      setGridSizeState(value)
    },
    [],
  )

  const setShowNumbers =
    useCallback(
      (value: boolean) => {
        setShowNumbersState(value)
      },
      [],
    )

  const setColorCount =
    useCallback(
      (value: number) => {
        setColorCountState(value)
      },
      [],
    )

  const setBrightness =
    useCallback(
      (value: number) => {
        setBrightnessState(value)
      },
      [],
    )

  const setContrast =
    useCallback(
      (value: number) => {
        setContrastState(value)
      },
      [],
    )

  const setPencilSensitivity =
    useCallback(
      (value: number) => {
        setPencilSensitivityState(
          value,
        )
      },
      [],
    )

  const setPencilThickness =
    useCallback(
      (value: number) => {
        setPencilThicknessState(
          value,
        )
      },
      [],
    )

  const setPencilDarkness =
    useCallback(
      (value: number) => {
        setPencilDarknessState(
          value,
        )
      },
      [],
    )

  const setPencilColor =
    useCallback(
      (value: string) => {
        setPencilColorState(value)
      },
      [],
    )

  const setPaperBrightness =
    useCallback(
      (value: number) => {
        setPaperBrightnessState(
          value,
        )
      },
      [],
    )

  const setZoom = useCallback(
    (value: number) => {
      setZoomState(value)
    },
    [],
  )

  const resetImageAdjustments =
    useCallback(() => {
      setBrightnessState(
        DEFAULT_EDITOR_SETTINGS.image
          .brightness,
      )

      setContrastState(
        DEFAULT_EDITOR_SETTINGS.image
          .contrast,
      )
    }, [])

    useEffect(() => {
      const editorSettings: EditorSettings = {
        mode,
        grid: {
          size: gridSize,
          showNumbers,
        },
        color: {
          colors: colorCount,
        },
        image: {
          brightness,
          contrast,
        },
        pencil: {
          sensitivity: pencilSensitivity,
          thickness: pencilThickness,
          darkness: pencilDarkness,
          color: pencilColor,
          paperBrightness,
        },
        zoom: {
          zoom,
        },
      }

      try {
        window.localStorage.setItem(
          SETTINGS_STORAGE_KEY,
          JSON.stringify(editorSettings),
        )
      } catch {
        return
      }
    }, [
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
    ])

  return {
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

    setMode,
    setGridSize,
    setShowNumbers,
    setColorCount,

    setBrightness,
    setContrast,

    setPencilSensitivity,
    setPencilThickness,
    setPencilDarkness,
    setPencilColor,
    setPaperBrightness,

    setZoom,

    resetImageAdjustments,
  }
}