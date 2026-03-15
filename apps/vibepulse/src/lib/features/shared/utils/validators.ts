export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0
}

export function isValidPath(path: string): boolean {
  return path.length > 0 && !path.includes('\0')
}

export function isValidCommandName(name: string): boolean {
  return /^[a-z0-9_-]+$/i.test(name)
}
