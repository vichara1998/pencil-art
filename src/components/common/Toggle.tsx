type ToggleProps = {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export function Toggle({
  label,
  checked,
  disabled = false,
  onChange,
}: ToggleProps) {
  return (
    <label className="toggleRow">
      <span className="toggleLabel">{label}</span>

      <span
        className={`toggle ${
          checked ? "checked" : ""
        } ${disabled ? "disabled" : ""}`}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />

        <span className="toggleTrack" aria-hidden="true">
          <span className="toggleThumb" />
        </span>
      </span>
    </label>
  );
}
