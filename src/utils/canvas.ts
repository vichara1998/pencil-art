export function createCanvasImageData(
  width: number,
  height: number,
): ImageData {
  return new ImageData(width, height)
}

export function getCanvasContext(
  canvas: HTMLCanvasElement,
): CanvasRenderingContext2D {
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error(
      'Unable to create 2D canvas context.',
    )
  }

  return context
}

export function calculateAspectRatio(
  width: number,
  height: number,
  maxDimension: number,
): {
  width: number
  height: number
} {
  if (width <= maxDimension && height <= maxDimension) {
    return {
      width,
      height,
    }
  }

  const scale =
    maxDimension / Math.max(width, height)

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}