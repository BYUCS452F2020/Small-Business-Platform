export default interface PortfolioItem {
  id: string
  description: string
  file: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function arePortfolioItems(x: any): x is PortfolioItem[] {
  return x && x instanceof Array && (x.length === 0 || x.reduce((p, c) => {
    return p && c &&
      typeof c.id === 'string' &&
      typeof c.description === 'string' &&
      typeof c.file === 'string'
  }, true))
}
