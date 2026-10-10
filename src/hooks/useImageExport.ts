import {
  useCallback,
  useState,
} from 'react'

import {
  exportImage,
  type ExportSize,
} from '../services/export'

export function useImageExport(
  canvasRef: React.RefObject<HTMLCanvasElement>,
) {
  const [
    isExportOpen,
    setIsExportOpen,
  ] = useState(false)

  const [
    exportSize,
    setExportSize,
  ] = useState<ExportSize>(
    'original',
  )

  const [
    exportFormat,
    setExportFormat,
  ] = useState<'png'>('png')

  const [
    exporting,
    setExporting,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const openExport =
    useCallback(() => {
      setError('')
      setIsExportOpen(true)
    }, [])

  const closeExport =
    useCallback(() => {
      if (exporting) {
        return
      }

      setIsExportOpen(false)
    }, [exporting])

  const exportCurrentImage =
    useCallback(async () => {
      const canvas =
        canvasRef.current

      if (!canvas) {
        setError(
          'There is no image available to export.',
        )
        return
      }

      setExporting(true)
      setError('')

      try {
        await exportImage(
          canvas,
          {
            size: exportSize,
            filename:
              `grid-pencil-art-${exportSize}.png`,
          },
        )

        setIsExportOpen(false)
      } catch (exportError) {
        console.error(
          exportError,
        )

        setError(
          'Unable to export the image.',
        )
      } finally {
        setExporting(false)
      }
    }, [
      canvasRef,
      exportSize,
    ])

  return {
    isExportOpen,

    exportSize,
    exportFormat,

    exporting,
    error,

    setExportSize,
    setExportFormat,

    openExport,
    closeExport,

    exportCurrentImage,
  }
}