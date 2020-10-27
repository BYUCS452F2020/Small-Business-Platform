export default interface Business {
  name: string
  handle: string
  email: string
  website?: string
  description?: string
  logo?: string
  editable?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isBusiness(x: any): x is Business {
  return x &&
    x.name && typeof x.name === 'string' &&
    x.handle && typeof x.handle === 'string' &&
    x.email && typeof x.email === 'string' &&
    (!x.website || typeof x.website === 'string') &&
    (!x.description || typeof x.description === 'string') &&
    (!x.logo || typeof x.logo === 'string') &&
    (!x.editable || typeof x.editable === 'boolean')
}
