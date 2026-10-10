import {
  useCallback,
  useRef,
  useState,
} from 'react'

import type {
  SelectedCell,
} from '../types'

export function useCanvas() {
  const sourceCanvasRef =
    useRef<HTMLCanvasElement>(null)

  const displayCanvasRef =
    useRef<HTMLCanvasElement>(null)

  const [
    selectedCell,
    setSelectedCell,
  ] = useState<SelectedCell>(null)

  const selectCell = useCallback(
    (
      row: number,
      column: number,
      index: number,
    ) => {
      setSelectedCell({
        row,
        column,
        index,
      })
    },
    [],
  )

  const clearSelection =
    useCallback(() => {
      setSelectedCell(null)
    }, [])

  return {
    sourceCanvasRef,
    displayCanvasRef,

    selectedCell,

    setSelectedCell,
    selectCell,
    clearSelection,
  }
}