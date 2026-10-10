import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

type IconButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: ReactNode
    label: string
  }

export function IconButton({
  icon,
  label,
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`iconButton ${className}`.trim()}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  )
}