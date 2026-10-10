import { clamp } from '../../utils/math'

export function detectEdges(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  sensitivity: number,
): Uint8ClampedArray {
  const grayscale =
    new Float32Array(width * height)

  for (
    let index = 0;
    index < width * height;
    index++
  ) {
    const pixelIndex = index * 4

    grayscale[index] =
      data[pixelIndex] * 0.299 +
      data[pixelIndex + 1] * 0.587 +
      data[pixelIndex + 2] * 0.114
  }

  const edges =
    new Uint8ClampedArray(
      width * height,
    )

  const threshold = Math.max(
    10,
    140 - sensitivity,
  )

  for (
    let y = 1;
    y < height - 1;
    y++
  ) {
    for (
      let x = 1;
      x < width - 1;
      x++
    ) {
      const topLeft =
        grayscale[
          (y - 1) * width + (x - 1)
        ]

      const top =
        grayscale[
          (y - 1) * width + x
        ]

      const topRight =
        grayscale[
          (y - 1) * width + (x + 1)
        ]

      const left =
        grayscale[y * width + (x - 1)]

      const right =
        grayscale[y * width + (x + 1)]

      const bottomLeft =
        grayscale[
          (y + 1) * width + (x - 1)
        ]

      const bottom =
        grayscale[
          (y + 1) * width + x
        ]

      const bottomRight =
        grayscale[
          (y + 1) * width + (x + 1)
        ]

      const gx =
        -topLeft +
        topRight -
        2 * left +
        2 * right -
        bottomLeft +
        bottomRight

      const gy =
        -topLeft -
        2 * top -
        topRight +
        bottomLeft +
        2 * bottom +
        bottomRight

      const magnitude = Math.sqrt(
        gx * gx + gy * gy,
      )

      edges[y * width + x] =
        magnitude > threshold
          ? 255
          : 0
    }
  }

  return edges
}

export function thickenEdges(
  edges: Uint8ClampedArray,
  width: number,
  height: number,
  thicknessMm: number,
): Uint8ClampedArray {
  const pixelThickness =
    Math.max(0.1, thicknessMm) *
    (96 / 25.4)

  if (pixelThickness < 1) {
    const coverage = Math.round(
      pixelThickness * 255,
    )

    const result =
      new Uint8ClampedArray(edges.length)

    for (let index = 0; index < edges.length; index++) {
      if (edges[index] > 0) {
        result[index] = coverage
      }
    }

    return result
  }

  let result = new Uint8ClampedArray(edges)

  const wholePasses = clamp(
    Math.floor(pixelThickness) - 1,
    0,
    3,
  )

  for (
    let pass = 0;
    pass < wholePasses;
    pass++
  ) {
    result = dilateEdges(result, width, height)
  }

  const fractionalPass =
    pixelThickness - Math.floor(pixelThickness)

  if (fractionalPass > 0 && wholePasses < 3) {
    const expanded =
      dilateEdges(result, width, height)

    const coverage = Math.round(
      fractionalPass * 255,
    )

    for (let index = 0; index < result.length; index++) {
      if (result[index] === 0 && expanded[index] > 0) {
        result[index] = coverage
      }
    }
  }

  return result
}

function dilateEdges(
  edges: Uint8ClampedArray,
  width: number,
  height: number,
): Uint8ClampedArray {
  const expanded = new Uint8ClampedArray(edges)

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = y * width + x

      if (
        edges[index] > 0 ||
        edges[index - 1] > 0 ||
        edges[index + 1] > 0 ||
        edges[index - width] > 0 ||
        edges[index + width] > 0
      ) {
        expanded[index] = 255
      }
    }
  }

  return expanded
}