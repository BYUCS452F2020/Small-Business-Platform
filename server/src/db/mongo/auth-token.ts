import {getDB, errorCodes} from './db'
import {v4 as uuid} from 'uuid'

const tokenDuration = 1000 * 60 * 60 * 2 // two hours

export async function init(): Promise<void> {
  try {
    await getDB().createCollection('authTokens')
  } catch (err) {
    if (err.code === errorCodes.namespaceExists) {
      return
    }

    console.error('Unexpected error initializing auth token collection', err)
    throw new Error('FailedInitAuthTokens')
  }

  try {
    await getDB().collection('authTokens').createIndex({token: 1}, {unique: true})
  } catch (err) {
    console.error('Unexpected error creating username index', err)
    throw new Error('FailedInitAuthTokens')
  }

  // TODO: auto-delete old tokens at some point
}

export async function create(userId: string): Promise<string> {
  const token = uuid()

  try {
    await getDB().collection('authTokens').insertOne({
      token,
      userId,
      expireTime: new Date(Date.now() + tokenDuration),
    })
    return token
  } catch (err) {
    console.error('Unexpected error creating auth token', userId, err)
    throw new Error('FailedCreateAuthToken')
  }
}

export async function getUserId(token: string): Promise<string> {
  let result
  try {
    result = await getDB().collection('authTokens').findOne({
      token,
      expireTime: {$gte: new Date()},
    })
  } catch (err) {
    console.error('Unexpected error getting user id', token, err)
    throw new Error('FailedGetUserId')
  }

  if (result === null) {
    throw new Error('TokenNotFound')
  }

  return result.userId
}
