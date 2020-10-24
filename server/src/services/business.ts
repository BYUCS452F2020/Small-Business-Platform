import {create as createBusiness} from '../db/business'

export async function register(
  name: string,
  email: string,
  handle: string,
  website: (string|undefined),
  desciption: (string|undefined),
  logo: (string|undefined),
  userID: number,
): Promise<void> {

  await createBusiness(name, email, handle, website, desciption, logo, userID)
}