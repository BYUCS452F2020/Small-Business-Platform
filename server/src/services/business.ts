import {create as createBusiness} from '../db/mongo/business'

export async function register(
  name: string,
  email: string,
  handle: string,
  userID: string,
  website?: string,
  desciption?: string,
  logo?: string,
): Promise<void> {

  await createBusiness(name, email, handle, userID, website, desciption, logo)
}
