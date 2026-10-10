type ExportFormatSelectorProps = {
  value: 'png'
  onChange: (
    value: 'png',
  ) => void
}

export function ExportFormatSelector({
  value,
  onChange,
}: ExportFormatSelectorProps) {
  return (
    <div className="exportOptionGroup">
      <div className="exportOptionTitle">
        Format
      </div>

      <div className="exportFormatOptions">
        <button
          type="button"
          className={[
            'formatButton',
            value === 'png'
              ? 'formatButtonActive'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() =>
            onChange('png')
          }
        >
          PNG
        </button>
      </div>
    </div>
  )
}