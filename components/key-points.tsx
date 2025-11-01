"use client"

interface KeyPointsProps {
  points: string[]
}

export function KeyPoints({ points }: KeyPointsProps) {
  return (
    <div className="glass p-6 rounded-2xl">
      <h3 className="text-lg font-bold mb-4">Key Points</h3>
      <ul className="space-y-3">
        {points.map((point, index) => (
          <li key={index} className="flex gap-3">
            <span className="text-accent-primary font-bold min-w-fit">•</span>
            <span className="text-foreground-secondary">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
