import { useCallback, useEffect, useMemo, useState } from "react";

import type { MouseEvent } from "react";

import {
  AppHeader,
  CenterWorkspace,
  LeftSidebar,
  RightInspector,
  Workspace,
} from "../components/layout";

import { ExportDialog } from "../components/export";

import {
  useCanvas,
  useEditorSettings,
  useImageExport,
  useImageProcessing,
  useImageUpload,
  usePanelVisibility,
  useTheme,
} from "../hooks";

import type { Mode } from "../types";

export default function App() {
  const { theme, setTheme } = useTheme();

  /*
  |--------------------------------------------------------------------------
  | Editor settings
  |--------------------------------------------------------------------------
  */

  const settings = useEditorSettings();
  const [viewResetKey, setViewResetKey] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | Image upload
  |--------------------------------------------------------------------------
  */

  const upload = useImageUpload();

  /*
  |--------------------------------------------------------------------------
  | Canvas
  |--------------------------------------------------------------------------
  */

  const canvas = useCanvas();

  /*
  |--------------------------------------------------------------------------
  | Panel visibility
  |--------------------------------------------------------------------------
  */

  const panels = usePanelVisibility();

  useEffect(() => {
    if (!upload.image || !window.matchMedia("(max-width: 680px)").matches) {
      return;
    }

    panels.hideLeftPanel();
    panels.hideRightPanel();
  }, [upload.image, panels.hideLeftPanel, panels.hideRightPanel]);

  /*
  |--------------------------------------------------------------------------
  | Image processing
  |--------------------------------------------------------------------------
  */

  const processingSettings = useMemo(
    () => ({
      mode: settings.mode,
      grid: {
        size: settings.gridSize,
        showNumbers: settings.showNumbers,
      },
      color: {
        colors: settings.colorCount,
      },
      image: {
        brightness: settings.brightness,
        contrast: settings.contrast,
      },
      pencil: {
        sensitivity: settings.pencilSensitivity,
        thickness: settings.pencilThickness,
        darkness: settings.pencilDarkness,
        color: settings.pencilColor,
        paperBrightness: settings.paperBrightness,
      },
      zoom: {
        zoom: settings.zoom,
      },
    }),
    [
      settings.mode,
      settings.gridSize,
      settings.showNumbers,
      settings.colorCount,
      settings.brightness,
      settings.contrast,
      settings.pencilSensitivity,
      settings.pencilThickness,
      settings.pencilDarkness,
      settings.pencilColor,
      settings.paperBrightness,
      settings.zoom,
    ],
  );

  const processing = useImageProcessing({
    image: upload.image,
    sourceCanvasRef: canvas.sourceCanvasRef,
    displayCanvasRef: canvas.displayCanvasRef,
    settings: processingSettings,
  });

  const imageExport = useImageExport(canvas.displayCanvasRef);

  const handleResetView = useCallback(() => {
    settings.setZoom(1);
    setViewResetKey((current) => current + 1);
  }, [settings.setZoom]);

  /*
  |--------------------------------------------------------------------------
  | Mode change
  |--------------------------------------------------------------------------
  */

  const handleModeChange = useCallback(
    (mode: Mode) => {
      settings.setMode(mode);

      canvas.clearSelection();
    },
    [settings, canvas],
  );

  /*
  |--------------------------------------------------------------------------
  | Canvas cell selection
  |--------------------------------------------------------------------------
  */

  const handleCanvasClick = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      const displayCanvas = canvas.displayCanvasRef.current;

      if (!displayCanvas) {
        return;
      }

      if (processing.cells.length === 0) {
        return;
      }

      /*
       * Cell selection is only available
       * in grid modes.
       */

      if (settings.mode !== "pencil-grid" && settings.mode !== "color-grid") {
        return;
      }

      const rect = displayCanvas.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      /*
       * Convert browser coordinates
       * into actual canvas coordinates.
       *
       * This works correctly even when
       * the canvas is zoomed using CSS
       * transform: scale(...).
       */

      const scaleX = displayCanvas.width / rect.width;

      const scaleY = displayCanvas.height / rect.height;

      const x = (event.clientX - rect.left) * scaleX;

      const y = (event.clientY - rect.top) * scaleY;

      /*
       * Calculate cell dimensions.
       */

      const cellWidth = displayCanvas.width / settings.gridSize;

      const cellHeight = displayCanvas.height / settings.gridSize;

      const column = Math.floor(x / cellWidth);

      const row = Math.floor(y / cellHeight);

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
        return;
      }

      const index = row * settings.gridSize + column;

      /*
       * Make sure the cell actually
       * exists in the processed result.
       */

      if (index < 0 || index >= processing.cells.length) {
        return;
      }

      canvas.selectCell(row, column, index);
    },
    [canvas, processing.cells.length, settings.mode, settings.gridSize],
  );

  /*
  |--------------------------------------------------------------------------
  | Clear selected cell when leaving
  | grid mode.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (settings.mode !== "pencil-grid" && settings.mode !== "color-grid") {
      canvas.clearSelection();
    }
  }, [settings.mode, canvas]);

  /*
  |--------------------------------------------------------------------------
  | Clear selection if the grid size
  | changes and the selected cell no
  | longer exists.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!canvas.selectedCell) {
      return;
    }

    if (canvas.selectedCell.index >= processing.cells.length) {
      canvas.clearSelection();
    }
  }, [canvas, processing.cells.length, settings.gridSize]);

  /*
  |--------------------------------------------------------------------------
  | Selected cell information
  |--------------------------------------------------------------------------
  */

  const selectedCellData = canvas.selectedCell
    ? (processing.cells[canvas.selectedCell.index] ?? null)
    : null;

  /*
  |--------------------------------------------------------------------------
  | Render application
  |--------------------------------------------------------------------------
  */

  return (
    <div className="app" data-theme={theme}>
      {/*
       * --------------------------------------------------------------------
       * Header
       * --------------------------------------------------------------------
       */}

      <AppHeader
        theme={theme}
        onThemeChange={setTheme}
        onUpload={upload.openFilePicker}
        onDownload={imageExport.openExport}
        canDownload={Boolean(upload.image)}
        hasImage={Boolean(upload.image)}
      />

      {/*
       * --------------------------------------------------------------------
       * Main workspace
       * --------------------------------------------------------------------
       */}

      <Workspace
        hasImage={Boolean(upload.image)}
        leftVisible={panels.panels.left}
        rightVisible={panels.panels.right}
        onToggleLeft={panels.toggleLeftPanel}
        onToggleRight={panels.toggleRightPanel}
        leftPanel={
          <LeftSidebar
            mode={settings.mode}
            onModeChange={handleModeChange}
            gridSize={settings.gridSize}
            onGridSizeChange={settings.setGridSize}
            showNumbers={settings.showNumbers}
            onShowNumbersChange={settings.setShowNumbers}
            colorCount={settings.colorCount}
            onColorCountChange={settings.setColorCount}
            brightness={settings.brightness}
            contrast={settings.contrast}
            onBrightnessChange={settings.setBrightness}
            onContrastChange={settings.setContrast}
            onResetAdjustments={settings.resetImageAdjustments}
            pencilSensitivity={settings.pencilSensitivity}
            pencilThickness={settings.pencilThickness}
            pencilDarkness={settings.pencilDarkness}
            pencilColor={settings.pencilColor}
            paperBrightness={settings.paperBrightness}
            onPencilSensitivityChange={settings.setPencilSensitivity}
            onPencilThicknessChange={settings.setPencilThickness}
            onPencilDarknessChange={settings.setPencilDarkness}
            onPencilColorChange={settings.setPencilColor}
            onPaperBrightnessChange={settings.setPaperBrightness}
            zoom={settings.zoom}
            onZoomChange={settings.setZoom}
            onResetView={handleResetView}
          />
        }
        centerPanel={
          <CenterWorkspace
            hasImage={Boolean(upload.image)}
            canvasRef={canvas.displayCanvasRef}
            zoom={settings.zoom}
            gridSize={settings.gridSize}
            cells={processing.cells}
            showNumbers={settings.showNumbers}
            resetViewKey={viewResetKey}
            busy={processing.busy}
            error={processing.error}
            uploadError={upload.error}
            isDragging={upload.isDragging}
            onUpload={upload.openFilePicker}
            onDragEnter={upload.handleDragEnter}
            onDragLeave={upload.handleDragLeave}
            onDragOver={upload.handleDragOver}
            onDrop={upload.handleDrop}
            onZoomChange={settings.setZoom}
            onCanvasClick={handleCanvasClick}
          />
        }
        rightPanel={
          <RightInspector
            palette={processing.palette}
            selectedCell={selectedCellData}
            selectedRow={canvas.selectedCell?.row ?? null}
            selectedColumn={canvas.selectedCell?.column ?? null}
            selectedColorIndex={
              selectedCellData ? selectedCellData.colorNumber - 1 : undefined
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
        ref={canvas.sourceCanvasRef}
        style={{
          display: "none",
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
        ref={upload.fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/bmp,image/gif"
        onChange={upload.handleFileChange}
        style={{
          display: "none",
        }}
      />

      {/*
       * --------------------------------------------------------------------
       * Export dialog
       * --------------------------------------------------------------------
       */}

      {imageExport.isExportOpen && (
        <ExportDialog
          open={imageExport.isExportOpen}
          size={imageExport.exportSize}
          format={imageExport.exportFormat}
          error={imageExport.error}
          onSizeChange={imageExport.setExportSize}
          onFormatChange={imageExport.setExportFormat}
          onClose={imageExport.closeExport}
          onExport={imageExport.exportCurrentImage}
          exporting={imageExport.exporting}
        />
      )}
    </div>
  );
}
