import { describe, expect, it } from 'vitest'

import {
  calculateExportDimensions,
} from './canvasExport'

describe('export dimensions', () => {
  it('preserves original dimensions for Original', () => {
    expect(calculateExportDimensions(1200, 800, 'original')).toEqual({
      width: 1200,
      height: 800,
    })
  })

  it.each([
    ['1080p', 1920],
    ['2k', 2560],
    ['4k', 3840],
  ] as const)('scales landscape output to %s', (size, longEdge) => {
    expect(calculateExportDimensions(1200, 800, size)).toEqual({
      width: longEdge,
      height: Math.round((800 / 1200) * longEdge),
    })
  })

  it('scales portrait output along its longer height edge', () => {
    expect(calculateExportDimensions(800, 1200, '2k')).toEqual({
      width: Math.round((800 / 1200) * 2560),
      height: 2560,
    })
  })
})
