export function makeSlide(definition) {
  return {
    includeInDeck: true,
    notes: [],
    ...definition,
  }
}

export function rich(...segments) {
  return segments
}

export function text(textValue, options = {}) {
  return { text: textValue, ...options }
}

export function breakLine() {
  return { break: true }
}

export function codeLines(...lines) {
  return lines.flat()
}
