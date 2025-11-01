"use client"

import type { Algorithm } from "@/lib/algorithms"

interface AlgorithmInfoCardProps {
  algorithm: Algorithm
}

export function AlgorithmInfoCard({ algorithm }: AlgorithmInfoCardProps) {
  return (
    <div className="glass p-6 rounded-2xl space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-accent-secondary mb-1">Algorithm</h3>
        <p className="text-foreground">{algorithm.name}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-accent-secondary mb-1">Description</h3>
        <p className="text-sm text-foreground-secondary">{algorithm.description}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-accent-secondary mb-2">Common Uses</h3>
        <ul className="space-y-1">
          {algorithm.uses.map((use) => (
            <li key={use} className="text-sm text-foreground-secondary flex items-center gap-2">
              <span className="text-accent-primary">•</span>
              {use}
            </li>
          ))}
        </ul>
      </div>

      {algorithm.keySize && (
        <div>
          <h3 className="text-sm font-semibold text-accent-secondary mb-1">Key Size</h3>
          <p className="text-sm text-foreground-secondary">{algorithm.keySize}</p>
        </div>
      )}

      {algorithm.blockSize && (
        <div>
          <h3 className="text-sm font-semibold text-accent-secondary mb-1">Block Size</h3>
          <p className="text-sm text-foreground-secondary">{algorithm.blockSize}</p>
        </div>
      )}
    </div>
  )
}
