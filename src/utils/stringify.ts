function replacer(key: unknown, value: unknown) {
  if (value instanceof Map) {
    return Array.from(value.entries())
  }

  if (value instanceof Set) {
    return Array.from(value)
  }

  return value
}

export const stringify = (obj: object) => {
  return JSON.stringify(obj, replacer, 2)
}
