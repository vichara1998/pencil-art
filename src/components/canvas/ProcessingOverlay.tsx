type ProcessingOverlayProps = {
  visible: boolean
  progress: number
  stage: string
}

export function ProcessingOverlay({
  visible,
  progress,
  stage,
}: ProcessingOverlayProps) {
  if (!visible) {
    return null
  }

  return (
    <div className="processingOverlay" role="status" aria-live="polite">
      <div className="processingCard">
        <div className="processingCardHeader">
          <span className="processingStage">{stage}</span>
          <span className="processingPercent">{progress}%</span>
        </div>

        <div
          className="processingProgressTrack"
          role="progressbar"
          aria-label={stage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span
            className="processingProgressValue"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}