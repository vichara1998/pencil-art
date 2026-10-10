import type { RGB } from '../../types'

import { rgbToHex } from '../../utils/color'

import { downloadBlob } from './downloadFile'

export function createGimpPalette(
  palette: RGB[],
): string {
  const lines = [
    'GIMP Palette',
    'Name: Grid Pencil Art',
    'Columns: 4',
    '#',
  ]

  palette.forEach(([red, green, blue], index) => {
    lines.push(
      `${red}\t${green}\t${blue}\tColor ${index + 1}`,
    )
  })

  return `${lines.join('\n')}\n`
}

export function createPaletteCsv(
  palette: RGB[],
): string {
  const lines = [
    'Name,Hex,Red,Green,Blue',
    ...palette.map(([red, green, blue], index) =>
      `Color ${index + 1},${rgbToHex(red, green, blue).toUpperCase()},${red},${green},${blue}`,
    ),
  ]

  return `${lines.join('\r\n')}\r\n`
}

export function createAsePalette(
  palette: RGB[],
): Uint8Array {
  const blocks = palette.map(
    ([red, green, blue], index) => {
      const name = `Color ${index + 1}`
      const nameLength = name.length + 1
      const blockLength = 22 + name.length * 2
      const block = new Uint8Array(6 + blockLength)
      const view = new DataView(block.buffer)

      view.setUint16(0, 0x0001, false)
      view.setUint32(2, blockLength, false)
      view.setUint16(6, nameLength, false)

      let offset = 8

      for (let character = 0; character < name.length; character++) {
        view.setUint16(offset, name.charCodeAt(character), false)
        offset += 2
      }

      view.setUint16(offset, 0, false)
      offset += 2

      block.set([0x52, 0x47, 0x42, 0x20], offset)
      offset += 4

      for (const component of [red, green, blue]) {
        view.setFloat32(offset, component / 255, false)
        offset += 4
      }

      view.setUint16(offset, 0, false)

      return block
    },
  )

  const totalLength = 12 + blocks.reduce(
    (total, block) => total + block.length,
    0,
  )
  const aseFile = new Uint8Array(totalLength)
  const header = new DataView(aseFile.buffer)

  aseFile.set([0x41, 0x53, 0x45, 0x46], 0)
  header.setUint16(4, 1, false)
  header.setUint16(6, 0, false)
  header.setUint32(8, blocks.length, false)

  let offset = 12

  for (const block of blocks) {
    aseFile.set(block, offset)
    offset += block.length
  }

  return aseFile
}

export function downloadPalette(
  palette: RGB[],
  format: 'gpl' | 'ase' | 'csv',
): void {
  if (palette.length === 0) {
    return
  }

  if (format === 'gpl') {
    downloadBlob(
      new Blob([createGimpPalette(palette)], {
        type: 'text/plain;charset=utf-8',
      }),
      'grid-pencil-art-palette.gpl',
    )
    return
  }

  if (format === 'ase') {
    downloadBlob(
      new Blob([createAsePalette(palette)], {
        type: 'application/octet-stream',
      }),
      'grid-pencil-art-palette.ase',
    )
    return
  }

  downloadBlob(
    new Blob([createPaletteCsv(palette)], {
      type: 'text/csv;charset=utf-8',
    }),
    'grid-pencil-art-palette.csv',
  )
}