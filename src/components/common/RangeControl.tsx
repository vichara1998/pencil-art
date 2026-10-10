type RangeControlProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export function RangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  formatValue,
  disabled = false,
  onChange,
}: RangeControlProps) {
  return (
    <div className="rangeControl">
      <div className="rangeHeader">
        <span>{label}</span>

        <span className="valueBadge">
          {formatValue ? formatValue(value) : value}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
