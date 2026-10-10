import { describe, expect, it } from 'vitest'
import type { RGB } from '../../types'

import {
  createAsePalette,
  createGimpPalette,
  createPaletteCsv,
} from './paletteExport'

const palette: RGB[] = [
  [255, 0, 128],
  [0, 64, 255],
]

describe('palette exports', () => {
  it('creates a named GIMP GPL palette', () => {
    const gpl = createGimpPalette(palette)

    expect(gpl).toContain('GIMP Palette\n')
    expect(gpl).toContain('255\t0\t128\tColor 1')
    expect(gpl).toContain('0\t64\t255\tColor 2')
  })

  it('creates an ASE file with a valid header and color block count', () => {
    const ase = createAsePalette(palette)
    const view = new DataView(ase.buffer)

    expect(String.fromCharCode(...ase.slice(0, 4))).toBe('ASEF')
    expect(view.getUint16(4, false)).toBe(1)
    expect(view.getUint16(6, false)).toBe(0)
    expect(view.getUint32(8, false)).toBe(2)
    expect(view.getUint16(12, false)).toBe(1)
    expect(view.getUint32(14, false)).toBe(36)
    expect(view.getUint16(18, false)).toBe(8)

    const colorModelOffset = 12 + 24
    expect(String.fromCharCode(...ase.slice(colorModelOffset, colorModelOffset + 4))).toBe('RGB ')
    expect(view.getFloat32(colorModelOffset + 4, false)).toBe(1)
    expect(view.getFloat32(colorModelOffset + 8, false)).toBe(0)
    expect(view.getFloat32(colorModelOffset + 12, false)).toBeCloseTo(128 / 255)
  })

  it('creates a CSV with hex and RGB channels', () => {
    expect(createPaletteCsv(palette)).toBe(
      'Name,Hex,Red,Green,Blue\r\nColor 1,#FF0080,255,0,128\r\nColor 2,#0040FF,0,64,255\r\n',
    )
  })
})