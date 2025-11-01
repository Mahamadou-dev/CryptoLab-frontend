import { type NextRequest, NextResponse } from "next/server"
import { caesarDecrypt, vigenereDecrypt } from "@/lib/crypto"

export async function POST(request: NextRequest, { params }: { params: { algo: string } }) {
  try {
    const { cipher, key } = await request.json()

    if (!cipher || !key) {
      return NextResponse.json({ error: "Missing required fields: cipher and key" }, { status: 400 })
    }

    let text: string

    switch (params.algo) {
      case "caesar":
        const shift = Number.parseInt(key)
        text = caesarDecrypt(cipher, shift)
        break

      case "vigenere":
        text = vigenereDecrypt(cipher, key)
        break

      default:
        return NextResponse.json({ error: `Unknown algorithm: ${params.algo}` }, { status: 400 })
    }

    return NextResponse.json({
      text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`[v0] Decryption error for ${params.algo}:`, error)
    return NextResponse.json(
      { error: "Decryption failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
