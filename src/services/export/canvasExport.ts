import {
  calculateAspectRatio,
  getCanvasContext,
} from '../../utils'

export type ExportSize =
  | 'original'
  | '1080p'
  | '2k'
  | '4k'

export type ExportDimensions = {
  width: number
  height: number
}

function getTargetLongEdge(
  size: ExportSize,
): number | null {
  switch (size) {
    case '1080p':
      return 1920

    case '2k':
      return 2560

    case '4k':
      return 3840

    case 'original':
    default:
      return null
  }
}

export function calculateExportDimensions(
  sourceWidth: number,
  sourceHeight: number,
  size: ExportSize,
): ExportDimensions {
  const targetLongEdge =
    getTargetLongEdge(size)

  if (!targetLongEdge) {
    return {
      width: sourceWidth,
      height: sourceHeight,
    }
  }

  return calculateAspectRatio(
    sourceWidth,
    sourceHeight,
    targetLongEdge,
  )
}

export function createExportCanvas(
  sourceCanvas: HTMLCanvasElement,
  size: ExportSize,
): HTMLCanvasElement {
  const dimensions =
    calculateExportDimensions(
      sourceCanvas.width,
      sourceCanvas.height,
      size,
    )

  const canvas =
    document.createElement('canvas')

  canvas.width = dimensions.width
  canvas.height = dimensions.height

  const context =
    getCanvasContext(canvas)

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality =
    'high'

  context.drawImage(
    sourceCanvas,
    0,
    0,
    dimensions.width,
    dimensions.height,
  )

  return canvas
}