import { describe, expect, it } from 'vitest'

import { quantizeColors } from './colorQuantization'
import { thickenEdges } from './edgeDetection'

describe('quantizeColors', () => {
  it('removes duplicate colors from a monochrome image', () => {
    const pixels = new Uint8ClampedArray(
      Array.from({ length: 16 }, () => [40, 80, 120, 255]).flat(),
    )

    expect(quantizeColors(pixels, 4, 4, 8)).toEqual([
      [40, 80, 120],
    ])
  })

  it('keeps distinct colors in the palette', () => {
    const pixels = new Uint8ClampedArray([
      255, 0, 0, 255,
      255, 0, 0, 255,
      0, 0, 255, 255,
      0, 0, 255, 255,
    ])

    expect(quantizeColors(pixels, 4, 1, 4)).toEqual([
      [255, 0, 0],
      [0, 0, 255],
    ])
  })
})

describe('thickenEdges', () => {
  it('uses fractional coverage for subpixel line thicknesses', () => {
    const edges = new Uint8ClampedArray(9)
    edges[4] = 255

    const veryThin = thickenEdges(edges, 3, 3, 0.1)
    const thicker = thickenEdges(edges, 3, 3, 0.25)

    expect(veryThin[4]).toBeGreaterThan(0)
    expect(veryThin[4]).toBeLessThan(thicker[4])
    expect(veryThin[1]).toBe(0)
  })
})