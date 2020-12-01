import {getDB, errorCodes} from './db'

export async function init(): Promise<void> {
  try {
    await getDB().createCollection('users')
  } catch (err) {
    if (err.code === errorCodes.namespaceExists) {
      return
    }

    console.error('Unexpected error initializing user collection', err)
    throw new Error('FailedInitUsers')
  }

  try {
    await getDB().collection('users').createIndex({username: 1}, {unique: true})
  } catch (err) {
    console.error('Unexpected error creating username index', err)
    throw new Error('FailedInitUsers')
  }
}

export async function create(
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  email: string,
): Promise<string> {
  try {
    const result = await getDB().collection('users').insertOne({
      firstName, lastName, username, password, email,
    })

    return result.insertedId.toHexString()
  } catch (err) {
    if (err.code === errorCodes.dupKey) {
      throw new Error('UsernameTaken')
    }

    console.error('Unexpected error creating user', err)
    throw new Error('FailedCreateUser')
  }
}

interface AuthInfo {
  id: string
  password: string
}

export async function getAuthInfo(username: string): Promise<AuthInfo> {
  let user
  try {
    user = await getDB().collection('users').findOne({username})
  } catch (err) {
    console.error('Unexpected error getting auth info', username, err)
    throw new Error('FailedGetAuthInfo')
  }

  if (user === null) {
    throw new Error('UserNotFound')
  }

  return {
    id: user._id.toHexString(),
    password: user.password,
  }
}
