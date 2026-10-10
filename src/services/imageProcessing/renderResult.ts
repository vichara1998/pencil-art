import type {
  Mode,
  RGB,
} from '../../types'

import {
  hexToRgb,
} from '../../utils/color'

export type RenderOptions = {
  mode: Mode
  pencilColor: string
  pencilDarkness: number
  paperBrightness: number
  gridSize: number
  zoom: number
  paletteFilter?: {
    enabled: boolean
    selectedColorIndices: number[]
  }
}

export function renderResult(
  canvas: HTMLCanvasElement,
  source: ImageData,
  edges: Uint8ClampedArray,
  palette: RGB[],
  options: RenderOptions,
): void {
  const {
    mode,
    pencilColor,
    pencilDarkness,
    paperBrightness,
    gridSize,
    zoom,
    paletteFilter,
  } = options

  canvas.width = source.width
  canvas.height = source.height

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Unable to create canvas context.')
  }

  context.clearRect(0, 0, canvas.width, canvas.height)

  if (
    paletteFilter?.enabled &&
    paletteFilter.selectedColorIndices.length > 0
  ) {
    renderPaletteFilter(
      context,
      source,
      palette,
      paletteFilter.selectedColorIndices,
    )

    if (mode === 'pencil-grid' || mode === 'color-grid') {
      drawGrid(
        context,
        canvas.width,
        canvas.height,
        gridSize,
        zoom,
      )
    }

    return
  }

  if (mode === 'original') {
    context.putImageData(source, 0, 0)
    return
  }

  if (mode === 'color' || mode === 'color-grid') {
    renderColorImage(context, source, palette)
  }

  if (mode === 'pencil' || mode === 'pencil-grid') {
    renderPencilImage(
      context,
      source,
      edges,
      pencilColor,
      pencilDarkness,
      paperBrightness,
    )
  }

  if (mode === 'pencil-grid' || mode === 'color-grid') {
    drawGrid(
      context,
      canvas.width,
      canvas.height,
      gridSize,
      zoom,
    )
  }
}

function renderPaletteFilter(
  context: CanvasRenderingContext2D,
  source: ImageData,
  palette: RGB[],
  selectedColorIndices: number[],
): void {
  const output = new ImageData(
    createPaletteFilteredPixels(
      source.data,
      palette,
      selectedColorIndices,
    ),
    source.width,
    source.height,
  )
  context.putImageData(output, 0, 0)
}

export function createPaletteFilteredPixels(
  source: Uint8ClampedArray,
  palette: RGB[],
  selectedColorIndices: number[],
): Uint8ClampedArray {
  const output = new Uint8ClampedArray(source.length)
  const selectedIndices = new Set(selectedColorIndices)

  for (let offset = 0; offset < source.length; offset += 4) {
    let closestIndex = -1
    let smallestDistance = Infinity

    for (let colorIndex = 0; colorIndex < palette.length; colorIndex++) {
      const color = palette[colorIndex]
      const red = source[offset] - color[0]
      const green = source[offset + 1] - color[1]
      const blue = source[offset + 2] - color[2]
      const distance = red * red + green * green + blue * blue

      if (distance < smallestDistance) {
        smallestDistance = distance
        closestIndex = colorIndex
      }
    }

    const selectedColor = selectedIndices.has(closestIndex)
      ? palette[closestIndex]
      : null

    output[offset] = selectedColor?.[0] ?? 255
    output[offset + 1] = selectedColor?.[1] ?? 255
    output[offset + 2] = selectedColor?.[2] ?? 255
    output[offset + 3] = 255
  }

  return output
}

function renderColorImage(
  context: CanvasRenderingContext2D,
  source: ImageData,
  palette: RGB[],
): void {
  const output =
    new ImageData(
      source.width,
      source.height,
    )

  for (
    let index = 0;
    index < source.data.length;
    index += 4
  ) {
    let closestColor = palette[0]
    let smallestDistance = Infinity

    for (const color of palette) {
      const red =
        source.data[index] -
        color[0]

      const green =
        source.data[index + 1] -
        color[1]

      const blue =
        source.data[index + 2] -
        color[2]

      const distance =
        red * red +
        green * green +
        blue * blue

      if (
        distance < smallestDistance
      ) {
        smallestDistance = distance
        closestColor = color
      }
    }

    output.data[index] =
      closestColor[0]

    output.data[index + 1] =
      closestColor[1]

    output.data[index + 2] =
      closestColor[2]

    output.data[index + 3] = 255
  }

  context.putImageData(
    output,
    0,
    0,
  )
}

function renderPencilImage(
  context: CanvasRenderingContext2D,
  source: ImageData,
  edges: Uint8ClampedArray,
  pencilColor: string,
  pencilDarkness: number,
  paperBrightness: number,
): void {
  const output = new ImageData(source.width, source.height)
  const pencil = hexToRgb(pencilColor)
  const lineOpacity = pencilDarkness / 100

  for (let index = 0; index < edges.length; index++) {
    const pixelIndex = index * 4
    const opacity = lineOpacity * (edges[index] / 255)

    output.data[pixelIndex] = Math.round(
      paperBrightness * (1 - opacity) + pencil[0] * opacity,
    )
    output.data[pixelIndex + 1] = Math.round(
      paperBrightness * (1 - opacity) + pencil[1] * opacity,
    )
    output.data[pixelIndex + 2] = Math.round(
      paperBrightness * (1 - opacity) + pencil[2] * opacity,
    )
    output.data[pixelIndex + 3] = 255
  }

  context.putImageData(output, 0, 0)
}

function drawGrid(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  gridSize: number,
  zoom: number,
): void {
  const cellWidth =
    width / gridSize

  const cellHeight =
    height / gridSize

  context.save()

  context.strokeStyle =
    'rgba(20, 20, 20, 0.48)'

  context.lineWidth =
    Math.max(
      0.8,
      Math.min(
        1.5,
        1 / Math.sqrt(zoom),
      ),
    )

  context.beginPath()

  for (
    let column = 0;
    column <= gridSize;
    column++
  ) {
    const x =
      Math.round(
        column * cellWidth,
      ) + 0.5

    context.moveTo(x, 0)
    context.lineTo(x, height)
  }

  for (
    let row = 0;
    row <= gridSize;
    row++
  ) {
    const y =
      Math.round(
        row * cellHeight,
      ) + 0.5

    context.moveTo(0, y)
    context.lineTo(width, y)
  }

  context.stroke()

  context.restore()
}