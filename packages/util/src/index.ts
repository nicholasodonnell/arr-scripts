export const pick =
  <T, K extends keyof T>(key: K) =>
  (obj: T): T[K] => {
    return obj[key]
  }

export const rejectUndefined = <T>(value: T | undefined): value is T => {
  return value !== undefined
}
