"use client"

interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div
      className={`w-full rounded-full h-2 overflow-hidden ${className}`}
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div
        className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
