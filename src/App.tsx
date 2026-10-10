import {
  useCallback,
  useEffect,
} from 'react'

import type {
  MouseEvent,
} from 'react'

import {
  AppHeader,
  CenterWorkspace,
  LeftSidebar,
  RightInspector,
  Workspace,
} from '../components/layout'

import {
  ExportDialog,
} from '../components/export'

import {
  useCanvas,
  useEditorSettings,
  useImageExport,
  useImageProcessing,
  useImageUpload,
  usePanelVisibility,
} from '../hooks'

import type {
  Mode,
} from '../types'

export default function App() {
  /*
  |--------------------------------------------------------------------------
  | Editor settings
  |--------------------------------------------------------------------------
  */

  const settings =
    useEditorSettings()

  /*
  |--------------------------------------------------------------------------
  | Image upload
  |--------------------------------------------------------------------------
  */

  const upload =
    useImageUpload()

  /*
  |--------------------------------------------------------------------------
  | Canvas
  |--------------------------------------------------------------------------
  */

  const canvas =
    useCanvas()

  /*
  |--------------------------------------------------------------------------
  | Panel visibility
  |--------------------------------------------------------------------------
  */

  const panels =
    usePanelVisibility()

  /*
  |--------------------------------------------------------------------------
  | Image processing
  |--------------------------------------------------------------------------
  */

  const processing =
    useImageProcessing({
      image: upload.image,

      mode: settings.mode,

      gridSize: settings.gridSize,

      colorCount: settings.colorCount,

      showNumbers:
        settings.showNumbers,

      brightness:
        settings.brightness,

      contrast:
        settings.contrast,

      pencilSensitivity:
        settings.pencilSensitivity,

      pencilThickness:
        settings.pencilThickness,

      pencilDarkness:
        settings.pencilDarkness,

      pencilColor:
        settings.pencilColor,

      paperBrightness:
        settings.paperBrightness,

      sourceCanvasRef:
        canvas.sourceCanvasRef,

      displayCanvasRef:
        canvas.displayCanvasRef,
    })

  /*
  |--------------------------------------------------------------------------
  | Export
  |--------------------------------------------------------------------------
  */

  const imageExport =
    useImageExport(
      canvas.displayCanvasRef,
    )

  /*
  |--------------------------------------------------------------------------
  | Mode change
  |--------------------------------------------------------------------------
  */

  const handleModeChange =
    useCallback(
      (mode: Mode) => {
        settings.setMode(mode)

        canvas.clearSelection()
      },
      [
        settings,
        canvas,
      ],
    )

  /*
  |--------------------------------------------------------------------------
  | Upload image
  |--------------------------------------------------------------------------
  */

  const handleUpload =
    useCallback(
      (file: File) => {
        upload.loadFile(file)

        canvas.clearSelection()
      },
      [
        upload,
        canvas,
      ],
    )

  /*
  |--------------------------------------------------------------------------
  | Canvas cell selection
  |--------------------------------------------------------------------------
  */

  const handleCanvasClick =
    useCallback(
      (
        event: MouseEvent<HTMLCanvasElement>,
      ) => {
        const displayCanvas =
          canvas.displayCanvasRef.current

        if (!displayCanvas) {
          return
        }

        if (
          processing.cells.length === 0
        ) {
          return
        }

        /*
         * Cell selection is only available
         * in grid modes.
         */

        if (
          settings.mode !==
            'pencil-grid' &&
          settings.mode !==
            'color-grid'
        ) {
          return
        }

        const rect =
          displayCanvas.getBoundingClientRect()

        if (
          rect.width === 0 ||
          rect.height === 0
        ) {
          return
        }

        /*
         * Convert browser coordinates
         * into actual canvas coordinates.
         *
         * This works correctly even when
         * the canvas is zoomed using CSS
         * transform: scale(...).
         */

        const scaleX =
          displayCanvas.width /
          rect.width

        const scaleY =
          displayCanvas.height /
          rect.height

        const x =
          (event.clientX - rect.left) *
          scaleX

        const y =
          (event.clientY - rect.top) *
          scaleY

        /*
         * Calculate cell dimensions.
         */

        const cellWidth =
          displayCanvas.width /
          settings.gridSize

        const cellHeight =
          displayCanvas.height /
          settings.gridSize

        const column =
          Math.floor(
            x / cellWidth,
          )

        const row =
          Math.floor(
            y / cellHeight,
          )

        /*
         * Make sure the selected cell
         * is inside the grid.
         */

        if (
          row < 0 ||
          row >= settings.gridSize ||
          column < 0 ||
          column >= settings.gridSize
        ) {
          return
        }

        const index =
          row *
            settings.gridSize +
          column

        /*
         * Make sure the cell actually
         * exists in the processed result.
         */

        if (
          index < 0 ||
          index >=
            processing.cells.length
        ) {
          return
        }

        canvas.selectCell(
          row,
          column,
          index,
        )
      },
      [
        canvas,
        processing.cells.length,
        settings.mode,
        settings.gridSize,
      ],
    )

  /*
  |--------------------------------------------------------------------------
  | Clear selected cell when leaving
  | grid mode.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      settings.mode !==
        'pencil-grid' &&
      settings.mode !==
        'color-grid'
    ) {
      canvas.clearSelection()
    }
  }, [
    settings.mode,
    canvas,
  ])

  /*
  |--------------------------------------------------------------------------
  | Clear selection if the grid size
  | changes and the selected cell no
  | longer exists.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      !canvas.selectedCell
    ) {
      return
    }

    if (
      canvas.selectedCell.index >=
      processing.cells.length
    ) {
      canvas.clearSelection()
    }
  }, [
    canvas,
    processing.cells.length,
    settings.gridSize,
  ])

  /*
  |--------------------------------------------------------------------------
  | Selected cell information
  |--------------------------------------------------------------------------
  */

  const selectedCellData =
    canvas.selectedCell
      ? processing.cells[
          canvas.selectedCell.index
        ] ?? null
      : null

  /*
  |--------------------------------------------------------------------------
  | Render application
  |--------------------------------------------------------------------------
  */

  return (
    <div className="app">
      {/*
       * --------------------------------------------------------------------
       * Header
       * --------------------------------------------------------------------
       */}

      <AppHeader
        onUpload={
          upload.openFilePicker
        }
        onExport={
          imageExport.openExport
        }
        hasImage={
          Boolean(upload.image)
        }
      />

      {/*
       * --------------------------------------------------------------------
       * Main workspace
       * --------------------------------------------------------------------
       */}

      <Workspace
        leftVisible={
          panels.panels.left
        }
        rightVisible={
          panels.panels.right
        }

        onToggleLeft={
          panels.toggleLeftPanel
        }

        onToggleRight={
          panels.toggleRightPanel
        }

        leftPanel={
          <LeftSidebar
            image={
              upload.image
            }

            uploadError={
              upload.error
            }

            isDragging={
              upload.isDragging
            }

            fileInputRef={
              upload.fileInputRef
            }

            onFileChange={
              upload.handleFileChange
            }

            onDragEnter={
              upload.handleDragEnter
            }

            onDragLeave={
              upload.handleDragLeave
            }

            onDragOver={
              upload.handleDragOver
            }

            onDrop={
              upload.handleDrop
            }

            onOpenFilePicker={
              upload.openFilePicker
            }

            mode={
              settings.mode
            }

            onModeChange={
              handleModeChange
            }

            gridSize={
              settings.gridSize
            }

            onGridSizeChange={
              settings.setGridSize
            }

            showNumbers={
              settings.showNumbers
            }

            onShowNumbersChange={
              settings.setShowNumbers
            }

            colorCount={
              settings.colorCount
            }

            onColorCountChange={
              settings.setColorCount
            }

            brightness={
              settings.brightness
            }

            contrast={
              settings.contrast
            }

            onBrightnessChange={
              settings.setBrightness
            }

            onContrastChange={
              settings.setContrast
            }

            onResetAdjustments={
              settings.resetImageAdjustments
            }

            pencilSensitivity={
              settings.pencilSensitivity
            }

            pencilThickness={
              settings.pencilThickness
            }

            pencilDarkness={
              settings.pencilDarkness
            }

            pencilColor={
              settings.pencilColor
            }

            paperBrightness={
              settings.paperBrightness
            }

            onPencilSensitivityChange={
              settings.setPencilSensitivity
            }

            onPencilThicknessChange={
              settings.setPencilThickness
            }

            onPencilDarknessChange={
              settings.setPencilDarkness
            }

            onPencilColorChange={
              settings.setPencilColor
            }

            onPaperBrightnessChange={
              settings.setPaperBrightness
            }

            zoom={
              settings.zoom
            }

            onZoomChange={
              settings.setZoom
            }
          />
        }

        centerPanel={
          <CenterWorkspace
            image={
              upload.image
            }

            canvasRef={
              canvas.displayCanvasRef
            }

            zoom={
              settings.zoom
            }

            isProcessing={
              processing.isProcessing
            }

            processingError={
              processing.error
            }

            onCanvasClick={
              handleCanvasClick
            }
          />
        }

        rightPanel={
          <RightInspector
            palette={
              processing.palette
            }

            cells={
              processing.cells
            }

            selectedCell={
              canvas.selectedCell
            }

            selectedCellData={
              selectedCellData
            }
          />
        }
      />

      {/*
       * --------------------------------------------------------------------
       * Hidden source canvas
       *
       * This canvas is used internally for image
       * processing and should not be visible.
       * --------------------------------------------------------------------
       */}

      <canvas
        ref={
          canvas.sourceCanvasRef
        }
        style={{
          display: 'none',
        }}
        aria-hidden="true"
      />

      {/*
       * --------------------------------------------------------------------
       * Hidden file input
       *
       * The actual file picker is controlled
       * through useImageUpload().
       * --------------------------------------------------------------------
       */}

      <input
        ref={
          upload.fileInputRef
        }
        type="file"
        accept="image/png,image/jpeg,image/webp,image/bmp,image/gif"
        onChange={
          upload.handleFileChange
        }
        style={{
          display: 'none',
        }}
      />

      {/*
       * --------------------------------------------------------------------
       * Export dialog
       * --------------------------------------------------------------------
       */}

      {imageExport.isExportOpen && (
        <ExportDialog
          exportSize={
            imageExport.exportSize
          }

          exportFormat={
            imageExport.exportFormat
          }

          exporting={
            imageExport.exporting
          }

          error={
            imageExport.error
          }

          onSizeChange={
            imageExport.setExportSize
          }

          onFormatChange={
            imageExport.setExportFormat
          }

          onCancel={
            imageExport.closeExport
          }

          onExport={
            imageExport.exportCurrentImage
          }
        />
      )}
    </div>
  )
}