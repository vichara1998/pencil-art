import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  LIMITS,
} from '../constants'

import {
  adjustImage,
  analyzeGrid,
  detectEdges,
  quantizeColors,
  renderResult,
  thickenEdges,
} from '../services/imageProcessing'

import type {
  CellInfo,
  EditorSettings,
  RGB,
} from '../types'

import {
  calculateAspectRatio,
  getCanvasContext,
} from '../utils/canvas'

type UseImageProcessingOptions = {
  image: HTMLImageElement | null
  sourceCanvasRef: React.RefObject<HTMLCanvasElement | null>
  displayCanvasRef: React.RefObject<HTMLCanvasElement | null>
  settings: EditorSettings & {
    paletteFilter: {
      enabled: boolean
      selectedColorIndices: number[]
    }
  }
}

export function useImageProcessing({
  image,
  sourceCanvasRef,
  displayCanvasRef,
  settings,
}: UseImageProcessingOptions) {
  const [
    palette,
    setPalette,
  ] = useState<RGB[]>([])

  const [
    cells,
    setCells,
  ] = useState<CellInfo[]>([])

  const [
    busy,
    setBusy,
  ] = useState(false)

  const [
    progress,
    setProgress,
  ] = useState(0)

  const [
    stage,
    setStage,
  ] = useState('Preparing image')

  const [
    error,
    setError,
  ] = useState('')

  const requestIdRef = useRef(0)

  const processImage =
    useCallback(async () => {
      const requestId = ++requestIdRef.current

      if (!image) {
        setBusy(false)
        setProgress(0)
        return
      }

      const sourceCanvas =
        sourceCanvasRef.current

      const displayCanvas =
        displayCanvasRef.current

      if (
        !sourceCanvas ||
        !displayCanvas
      ) {
        return
      }

      const isCurrentRequest = () =>
        requestId === requestIdRef.current
      const yieldToBrowser = () =>
        new Promise<void>((resolve) => {
          window.setTimeout(resolve, 0)
        })

      setBusy(true)
      setError('')
      setProgress(3)
      setStage('Preparing image')

      try {
        await yieldToBrowser()
        if (!isCurrentRequest()) return

        const dimensions =
          calculateAspectRatio(
            image.naturalWidth || image.width,
            image.naturalHeight || image.height,
            LIMITS.processing.maxDimension,
          )

        sourceCanvas.width = dimensions.width
        sourceCanvas.height = dimensions.height

        const sourceContext =
          getCanvasContext(sourceCanvas)

        sourceContext.clearRect(
          0,
          0,
          dimensions.width,
          dimensions.height,
        )

        sourceContext.drawImage(
          image,
          0,
          0,
          dimensions.width,
          dimensions.height,
        )

        const originalData =
          sourceContext.getImageData(
            0,
            0,
            dimensions.width,
            dimensions.height,
          )

        setProgress(18)
        setStage('Adjusting image')
        await yieldToBrowser()
        if (!isCurrentRequest()) return

        const adjustedData =
          adjustImage(
            originalData,
            settings.image.brightness,
            settings.image.contrast,
          )

        setProgress(36)
        setStage('Building color palette')
        await yieldToBrowser()
        if (!isCurrentRequest()) return

        const newPalette =
          quantizeColors(
            adjustedData.data,
            dimensions.width,
            dimensions.height,
            settings.color.colors,
          )

        setProgress(51)
        setStage('Detecting pencil edges')
        await yieldToBrowser()
        if (!isCurrentRequest()) return

        const edges =
          detectEdges(
            adjustedData.data,
            dimensions.width,
            dimensions.height,
            settings.pencil.sensitivity,
          )

        setProgress(65)
        setStage('Refining edges')
        await yieldToBrowser()
        if (!isCurrentRequest()) return

        const thickEdges =
          thickenEdges(
            edges,
            dimensions.width,
            dimensions.height,
            settings.pencil.thickness,
          )

        setProgress(77)
        setStage('Analyzing grid')
        await yieldToBrowser()
        if (!isCurrentRequest()) return

        const newCells =
          analyzeGrid(
            adjustedData.data,
            thickEdges,
            dimensions.width,
            dimensions.height,
            settings.grid.size,
            newPalette,
          )

        setProgress(91)
        setStage('Rendering artwork')
        await yieldToBrowser()
        if (!isCurrentRequest()) return

        renderResult(
          displayCanvas,
          adjustedData,
          thickEdges,
          newPalette,
          {
            mode: settings.mode,
            pencilColor: settings.pencil.color,
            pencilDarkness: settings.pencil.darkness,
            paperBrightness: settings.pencil.paperBrightness,
            gridSize: settings.grid.size,
            zoom: settings.zoom.zoom,
            paletteFilter: settings.paletteFilter,
          },
        )

        setPalette(newPalette)
        setCells(newCells)
        setProgress(100)
        setBusy(false)
      } catch (processingError) {
        if (isCurrentRequest()) {
          console.error(processingError)
          setError('Unable to process the image.')
          setBusy(false)
        }
      }
    }, [
      image,
      sourceCanvasRef,
      displayCanvasRef,
      settings,
    ])

  useEffect(() => {
    void processImage()

    return () => {
      requestIdRef.current++
    }
  }, [processImage])

  return {
    palette,
    cells,

    busy,
    progress,
    stage,
    error,

    processImage,
  }
}