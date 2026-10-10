import type { RGB } from '../types'

export function rgbToHex(
  red: number,
  green: number,
  blue: number,
): string {
  return (
    '#' +
    [red, green, blue]
      .map((value) =>
        Math.max(0, Math.min(255, Math.round(value)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}

export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace('#', '')

  if (cleanHex.length !== 6) {
    return [0, 0, 0]
  }

  return [
    parseInt(cleanHex.substring(0, 2), 16),
    parseInt(cleanHex.substring(2, 4), 16),
    parseInt(cleanHex.substring(4, 6), 16),
  ]
}

export function colorDistance(
  first: RGB,
  second: RGB,
): number {
  const red = first[0] - second[0]
  const green = first[1] - second[1]
  const blue = first[2] - second[2]

  return Math.sqrt(
    red * red +
      green * green +
      blue * blue,
  )
}

export function findClosestColor(
  color: RGB,
  palette: RGB[],
): number {
  if (palette.length === 0) {
    return 0
  }

  let closestIndex = 0
  let smallestDistance = Infinity

  palette.forEach((paletteColor, index) => {
    const currentDistance = colorDistance(
      color,
      paletteColor,
    )

    if (currentDistance < smallestDistance) {
      smallestDistance = currentDistance
      closestIndex = index
    }
  })

  return closestIndex
}