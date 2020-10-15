import {create as createBusiness} from '../db/business'
// import {validate as validateAuthToken} from '../db/auth-token'

export async function register(
  name: string,
  email: string,
  handle: string,
  website: (string|undefined),
  desciption: (string|undefined),
  logo: (File|undefined),
  authToken: string,
): Promise<string|null> {
  let userID
  try{
    // userID = await validateAuthToken(authToken)
  } catch(err) {
    console.error('invalid authToken', err)
    return null
  }
  userID = '123abc'
  await createBusiness(name, email, handle, website, desciption, logo, userID)
  return handle
}