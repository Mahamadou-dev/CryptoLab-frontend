export function caesarEncrypt(text: string, shift = 3): string {
  const normalizedShift = ((shift % 26) + 26) % 26
  return text
    .split("")
    .map((char) => {
      if (/[a-z]/.test(char)) {
        return String.fromCharCode(((char.charCodeAt(0) - 97 + normalizedShift) % 26) + 97)
      }
      if (/[A-Z]/.test(char)) {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + normalizedShift) % 26) + 65)
      }
      return char
    })
    .join("")
}

export function caesarDecrypt(text: string, shift = 3): string {
  return caesarEncrypt(text, -shift)
}
