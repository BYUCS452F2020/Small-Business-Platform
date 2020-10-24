import {create as createBusiness} from '../db/business'

export async function register(
  name: string,
  email: string,
  handle: string,
  userID: number,
  website?: string,
  desciption?: string,
  logo?: string,
): Promise<void> {

  await createBusiness(name, email, handle, userID, website, desciption, logo)
}
