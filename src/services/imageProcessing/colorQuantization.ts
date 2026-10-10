import type { RGB } from '../../types'

import {
  colorDistance,
} from '../../utils/color'

export function quantizeColors(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  colorCount: number,
): RGB[] {
  const pixels: RGB[] = []

  const totalPixels = width * height

  const sampleStep = Math.max(
    1,
    Math.floor(
      Math.sqrt(totalPixels / 12000),
    ),
  )

  for (
    let y = 0;
    y < height;
    y += sampleStep
  ) {
    for (
      let x = 0;
      x < width;
      x += sampleStep
    ) {
      const index =
        (y * width + x) * 4

      pixels.push([
        data[index],
        data[index + 1],
        data[index + 2],
      ])
    }
  }

  if (pixels.length === 0) {
    return [[128, 128, 128]]
  }

  const actualColorCount = Math.min(
    colorCount,
    pixels.length,
  )

  const centers: RGB[] = []

  for (
    let index = 0;
    index < actualColorCount;
    index++
  ) {
    const pixelIndex = Math.floor(
      (index * pixels.length) /
        actualColorCount,
    )

    centers.push([
      pixels[pixelIndex][0],
      pixels[pixelIndex][1],
      pixels[pixelIndex][2],
    ])
  }

  for (let iteration = 0; iteration < 6; iteration++) {
    const sums = centers.map(() => [
      0,
      0,
      0,
      0,
    ])

    for (const pixel of pixels) {
      let closestIndex = 0
      let closestDistance = Infinity

      centers.forEach(
        (center, centerIndex) => {
          const distance =
            colorDistance(pixel, center)

          if (
            distance < closestDistance
          ) {
            closestDistance = distance
            closestIndex = centerIndex
          }
        },
      )

      sums[closestIndex][0] += pixel[0]
      sums[closestIndex][1] += pixel[1]
      sums[closestIndex][2] += pixel[2]
      sums[closestIndex][3] += 1
    }

    for (
      let index = 0;
      index < centers.length;
      index++
    ) {
      const count = sums[index][3]

      if (count > 0) {
        centers[index] = [
          Math.round(
            sums[index][0] / count,
          ),
          Math.round(
            sums[index][1] / count,
          ),
          Math.round(
            sums[index][2] / count,
          ),
        ]
      }
    }
  }

  const uniqueCenters = new Map<string, RGB>()

  for (const center of centers) {
    uniqueCenters.set(center.join(','), center)
  }

  return [...uniqueCenters.values()]
}