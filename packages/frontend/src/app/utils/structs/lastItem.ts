export const lastItem = <T = any>(items: T[]): T | undefined => {
  return items[items.length - 1]
}
