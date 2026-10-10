import type {
  ExportSize,
} from '../../services/export'

type ExportSizeSelectorProps = {
  value: ExportSize
  onChange: (
    value: ExportSize,
  ) => void
}

const options: {
  value: ExportSize
  label: string
  description: string
}[] = [
  {
    value: 'original',
    label: 'Original',
    description:
      'Use the processed image size',
  },
  {
    value: '1080p',
    label: '1080p',
    description:
      '1920px maximum dimension',
  },
  {
    value: '2k',
    label: '2K',
    description:
      '2560px maximum dimension',
  },
  {
    value: '4k',
    label: '4K',
    description:
      '3840px maximum dimension',
  },
]

export function ExportSizeSelector({
  value,
  onChange,
}: ExportSizeSelectorProps) {
  return (
    <div className="exportOptionGroup">
      <div className="exportOptionTitle">
        Image size
      </div>

      <div className="exportOptions">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={[
              'exportOption',
              value === option.value
                ? 'exportOptionActive'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() =>
              onChange(option.value)
            }
          >
            <strong>
              {option.label}
            </strong>

            <span>
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}