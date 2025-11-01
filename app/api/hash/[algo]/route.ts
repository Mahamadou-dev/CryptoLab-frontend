import { type NextRequest, NextResponse } from "next/server"
import { hashMD5, hashSHA256 } from "@/lib/crypto"

export async function POST(request: NextRequest, { params }: { params: { algo: string } }) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Missing required field: text" }, { status: 400 })
    }

    let hash: string

    switch (params.algo) {
      case "md5":
        hash = hashMD5(text)
        break

      case "sha256":
        hash = hashSHA256(text)
        break

      default:
        return NextResponse.json({ error: `Unknown hash algorithm: ${params.algo}` }, { status: 400 })
    }

    return NextResponse.json({
      hash,
      algorithm: params.algo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`[v0] Hash error for ${params.algo}:`, error)
    return NextResponse.json(
      { error: "Hashing failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
