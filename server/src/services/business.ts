import {create as createBusiness} from '../db/business'
// import {validate as validateAuthToken} from '../db/auth-token'

export async function register(
  name: string,
  email: string,
  handle: string,
  website: (string|undefined),
  desciption: (string|undefined),
  logo: (File|undefined),
  userID: number,
): Promise<string|null> {
  await createBusiness(name, email, handle, website, desciption, logo, userID)
  return handle
}