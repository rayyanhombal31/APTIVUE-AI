import { useId } from 'react'

interface LogoMarkProps {
  size?: number
}

export function LogoMark({ size = 32 }: LogoMarkProps) {
  const rawId = useId()
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '')
  const gradientId = `${id}-g`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#7c6cf0" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9"
        fill={`url(#${gradientId})`}
      />
      <path d="M16 7 24 25h-4.2L16 15.5 12.2 25H8Z" fill="#ffffff" />
    </svg>
  )
}
