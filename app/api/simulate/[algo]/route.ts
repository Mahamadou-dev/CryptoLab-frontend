import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { algo: string } }) {
  try {
    const { text, key, parameters } = await request.json()

    if (!text || !key) {
      return NextResponse.json({ error: "Missing required fields: text and key" }, { status: 400 })
    }

    let steps: any[] = []

    switch (params.algo) {
      case "caesar":
        const shift = Number.parseInt(parameters?.shift || "3")
        steps = generateCaesarSteps(text, shift)
        break

      case "vigenere":
        steps = generateVigenereSteps(text, key)
        break

      default:
        return NextResponse.json({ error: `Unknown algorithm: ${params.algo}` }, { status: 400 })
    }

    return NextResponse.json({
      algorithm: params.algo,
      steps,
      totalSteps: steps.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`[v0] Simulation error for ${params.algo}:`, error)
    return NextResponse.json(
      { error: "Simulation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

function generateCaesarSteps(text: string, shift: number) {
  const steps = []
  let result = ""

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    let encrypted = char

    if (/[a-zA-Z]/.test(char)) {
      const base = char.charCodeAt(0) <= 90 ? 65 : 97
      encrypted = String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base)
    }

    result += encrypted

    steps.push({
      step: i + 1,
      character: char,
      encrypted,
      result,
      position: i,
    })
  }

  return steps
}

function generateVigenereSteps(text: string, key: string) {
  const steps = []
  let result = ""
  let keyIndex = 0

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    let encrypted = char

    if (/[a-zA-Z]/.test(char)) {
      const keyChar = key[keyIndex % key.length].toUpperCase()
      const shift = keyChar.charCodeAt(0) - 65
      const base = char.charCodeAt(0) <= 90 ? 65 : 97
      encrypted = String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base)
      keyIndex++
    }

    result += encrypted

    steps.push({
      step: i + 1,
      character: char,
      encrypted,
      result,
      position: i,
      keyPosition: keyIndex - 1,
    })
  }

  return steps
}
