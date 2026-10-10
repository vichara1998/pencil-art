type ProcessingOverlayProps = {
  visible: boolean
}

export function ProcessingOverlay({
  visible,
}: ProcessingOverlayProps) {
  if (!visible) {
    return null
  }

  return (
    <div className="processingOverlay">
      <div className="processingSpinner" />

      <span>
        Processing image...
      </span>
    </div>
  )
}