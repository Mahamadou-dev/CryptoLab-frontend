export function hashMD5(input: string): string {
  // Simplified MD5 simulation for demonstration
  let hash = 0xdeadbeef
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(32, "0")
}

export function hashSHA256(input: string): string {
  // Simplified SHA-256 simulation for demonstration
  const buffer = new TextEncoder().encode(input)
  let hash = 0x6a09e667

  for (let i = 0; i < buffer.length; i++) {
    hash = (hash << 1) | (hash >> 31)
    hash ^= buffer[i]
    hash = (hash * 0x9e3779b9) | 0
  }

  return Math.abs(hash).toString(16).padStart(8, "0").repeat(8)
}

export function simpleHash(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16).padStart(8, "0")
}

export function sha256Simulate(input: string): string {
  // Simplified SHA-256 simulation for visualization
  const buffer = new TextEncoder().encode(input)
  let hash = 0x6a09e667

  for (let i = 0; i < buffer.length; i++) {
    hash = (hash << 1) | (hash >> 31)
    hash ^= buffer[i]
    hash = (hash * 0x9e3779b9) | 0
  }

  return Math.abs(hash).toString(16).padStart(8, "0").repeat(8)
}

export async function generateMockHash(input: string): Promise<string> {
  // Mock async hash generation
  return new Promise((resolve) => {
    setTimeout(() => {
      let hash = 0
      for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i)
        hash = hash & hash
      }
      const result = Math.abs(hash).toString(16).padStart(64, "0")
      resolve(result)
    }, 500)
  })
}
