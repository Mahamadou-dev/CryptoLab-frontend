import { type NextRequest, NextResponse } from "next/server"
import { caesarEncrypt, vigenereEncrypt } from "@/lib/crypto"

export async function POST(request: NextRequest, { params }: { params: { algo: string } }) {
  try {
    const { text, key, parameters } = await request.json()

    if (!text || !key) {
      return NextResponse.json({ error: "Missing required fields: text and key" }, { status: 400 })
    }

    let cipher: string
    let metadata: Record<string, any> = {}

    switch (params.algo) {
      case "caesar":
        const shift = Number.parseInt(parameters?.shift || "3")
        cipher = caesarEncrypt(text, shift)
        metadata = { shift }
        break

      case "vigenere":
        cipher = vigenereEncrypt(text, key)
        metadata = { keyLength: key.length }
        break

      default:
        return NextResponse.json({ error: `Unknown algorithm: ${params.algo}` }, { status: 400 })
    }

    return NextResponse.json({
      cipher,
      metadata,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`[v0] Encryption error for ${params.algo}:`, error)
    return NextResponse.json(
      { error: "Encryption failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
