import {
  useCallback,
  useEffect,
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
  settings: EditorSettings
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
    error,
    setError,
  ] = useState('')

  const processImage =
    useCallback(() => {
      if (!image) {
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

      setBusy(true)
      setError('')

      window.requestAnimationFrame(
        () => {
          try {
            const dimensions =
              calculateAspectRatio(
                image.naturalWidth ||
                  image.width,
                image.naturalHeight ||
                  image.height,
                LIMITS.processing
                  .maxDimension,
              )

            sourceCanvas.width =
              dimensions.width

            sourceCanvas.height =
              dimensions.height

            const sourceContext =
              getCanvasContext(
                sourceCanvas,
              )

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

            const adjustedData =
              adjustImage(
                originalData,
                settings.image
                  .brightness,
                settings.image
                  .contrast,
              )

            const newPalette =
              quantizeColors(
                adjustedData.data,
                dimensions.width,
                dimensions.height,
                settings.color.colors,
              )

            const edges =
              detectEdges(
                adjustedData.data,
                dimensions.width,
                dimensions.height,
                settings.pencil
                  .sensitivity,
              )

            const thickEdges =
              thickenEdges(
                edges,
                dimensions.width,
                dimensions.height,
                settings.pencil
                  .thickness,
              )

            const newCells =
              analyzeGrid(
                adjustedData.data,
                thickEdges,
                dimensions.width,
                dimensions.height,
                settings.grid.size,
                newPalette,
              )

            renderResult(
              displayCanvas,
              adjustedData,
              thickEdges,
              newPalette,
              {
                mode: settings.mode,

                pencilColor:
                  settings.pencil
                    .color,

                pencilDarkness:
                  settings.pencil
                    .darkness,

                paperBrightness:
                  settings.pencil
                    .paperBrightness,

                gridSize:
                  settings.grid.size,

                zoom:
                  settings.zoom.zoom,
              },
            )

            setPalette(
              newPalette,
            )

            setCells(
              newCells,
            )

            setBusy(false)
          } catch (processingError) {
            console.error(
              processingError,
            )

            setError(
              'Unable to process the image.',
            )

            setBusy(false)
          }
        },
      )
    }, [
      image,
      sourceCanvasRef,
      displayCanvasRef,
      settings,
    ])

  useEffect(() => {
    processImage()
  }, [processImage])

  return {
    palette,
    cells,

    busy,
    error,

    processImage,
  }
}