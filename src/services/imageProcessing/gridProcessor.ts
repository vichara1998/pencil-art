import type {
  CellInfo,
  RGB,
} from '../../types'

import {
  findClosestColor,
  rgbToHex,
} from '../../utils/color'

export function analyzeGrid(
  data: Uint8ClampedArray,
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  gridSize: number,
  palette: RGB[],
): CellInfo[] {
  const cells: CellInfo[] = []

  const cellWidth =
    width / gridSize

  const cellHeight =
    height / gridSize

  for (
    let row = 0;
    row < gridSize;
    row++
  ) {
    for (
      let column = 0;
      column < gridSize;
      column++
    ) {
      const startX = Math.floor(
        column * cellWidth,
      )

      const endX = Math.min(
        width,
        Math.ceil(
          (column + 1) *
            cellWidth,
        ),
      )

      const startY = Math.floor(
        row * cellHeight,
      )

      const endY = Math.min(
        height,
        Math.ceil(
          (row + 1) *
            cellHeight,
        ),
      )

      let red = 0
      let green = 0
      let blue = 0

      let count = 0
      let edgeCount = 0

      for (
        let y = startY;
        y < endY;
        y += 2
      ) {
        for (
          let x = startX;
          x < endX;
          x += 2
        ) {
          const pixelIndex =
            (y * width + x) * 4

          red += data[pixelIndex]
          green += data[pixelIndex + 1]
          blue += data[pixelIndex + 2]

          if (
            edges[y * width + x] > 0
          ) {
            edgeCount++
          }

          count++
        }
      }

      if (count === 0) {
        count = 1
      }

      const average: RGB = [
        Math.round(red / count),
        Math.round(green / count),
        Math.round(blue / count),
      ]

      const colorIndex =
        findClosestColor(
          average,
          palette,
        )

      const selectedColor =
        palette[colorIndex] ??
        [128, 128, 128]

      const coverage =
        edgeCount / count

      cells.push({
        color: rgbToHex(
          selectedColor[0],
          selectedColor[1],
          selectedColor[2],
        ),

        rgb: selectedColor,

        edge: coverage > 0.05,

        coverage,

        colorNumber:
          colorIndex + 1,
      })
    }
  }

  return cells
}