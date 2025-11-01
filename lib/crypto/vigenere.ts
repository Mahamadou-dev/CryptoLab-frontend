function charToNum(char: string): number {
  return char.toUpperCase().charCodeAt(0) - 65
}

function numToChar(num: number): string {
  return String.fromCharCode((num % 26) + 65)
}

export function vigenereEncrypt(plaintext: string, key: string): string {
  const cleanKey = key.replace(/[^a-zA-Z]/g, "").toUpperCase()
  if (!cleanKey) throw new Error("Key must contain at least one letter")

  let keyIndex = 0
  return plaintext
    .split("")
    .map((char) => {
      if (/[a-zA-Z]/.test(char)) {
        const shift = charToNum(cleanKey[keyIndex % cleanKey.length])
        keyIndex++
        const charNum = charToNum(char)
        const encrypted = (charNum + shift) % 26
        return char.toUpperCase() === char ? numToChar(encrypted) : numToChar(encrypted).toLowerCase()
      }
      return char
    })
    .join("")
}

export function vigenereDecrypt(ciphertext: string, key: string): string {
  const cleanKey = key.replace(/[^a-zA-Z]/g, "").toUpperCase()
  if (!cleanKey) throw new Error("Key must contain at least one letter")

  let keyIndex = 0
  return ciphertext
    .split("")
    .map((char) => {
      if (/[a-zA-Z]/.test(char)) {
        const shift = charToNum(cleanKey[keyIndex % cleanKey.length])
        keyIndex++
        const charNum = charToNum(char)
        const decrypted = (charNum - shift + 26) % 26
        return char.toUpperCase() === char ? numToChar(decrypted) : numToChar(decrypted).toLowerCase()
      }
      return char
    })
    .join("")
}
