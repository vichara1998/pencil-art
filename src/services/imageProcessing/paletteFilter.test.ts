import { describe, expect, it } from 'vitest'
import type { RGB } from '../../types'

import {
  createPaletteFilteredPixels,
} from './renderResult'

describe('palette color filtering', () => {
  it('keeps selected palette colors and turns other pixels white', () => {
    const source = new Uint8ClampedArray([
      248, 8, 6, 255,
      8, 248, 6, 255,
      8, 6, 248, 255,
    ])
    const palette: RGB[] = [
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
    ]

    expect(
      createPaletteFilteredPixels(
        source,
        palette,
        [0, 2],
      ),
    ).toEqual(
      new Uint8ClampedArray([
        255, 0, 0, 255,
        255, 255, 255, 255,
        0, 0, 255, 255,
      ]),
    )
  })

  it('shows white for every pixel when none of its palette colors are selected', () => {
    const source = new Uint8ClampedArray([248, 8, 6, 255])

    expect(
      createPaletteFilteredPixels(source, [[255, 0, 0]], []),
    ).toEqual(new Uint8ClampedArray([255, 255, 255, 255]))
  })
})
