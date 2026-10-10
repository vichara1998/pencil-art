import {
  createExportCanvas,
  type ExportSize,
} from './canvasExport'

import {
  downloadBlob,
} from './downloadFile'

export type ExportImageOptions = {
  size: ExportSize
  filename?: string
}

export async function exportImage(
  sourceCanvas: HTMLCanvasElement,
  options: ExportImageOptions,
): Promise<void> {
  const exportCanvas =
    createExportCanvas(
      sourceCanvas,
      options.size,
    )

  const blob =
    await canvasToBlob(
      exportCanvas,
    )

  const filename =
    options.filename ??
    `grid-pencil-art-${options.size}.png`

  downloadBlob(
    blob,
    filename,
  )
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
): Promise<Blob> {
  return new Promise(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                'Unable to create PNG image.',
              ),
            )

            return
          }

          resolve(blob)
        },
        'image/png',
        1,
      )
    },
  )
}