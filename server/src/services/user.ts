import {hashPassword} from '../util/hash'
import {create as createUser} from '../db/user'
import {create as createAuthToken} from '../db/auth-token'

export async function register(
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  email: string,
): Promise<string|null> {
  password = await hashPassword(password)
  const id = await createUser(firstName, lastName, username, password, email)

  try {
    return await createAuthToken(id)
  } catch (err) {
    console.error('Unexpected error creating auth token', err)

    // user creation succeeded, so don't throw error - client can attempt to
    // use login route to get an auth token
    return null
  }
}
