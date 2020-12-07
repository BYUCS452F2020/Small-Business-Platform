import { getDB, errorCodes } from './db'

export async function init(): Promise<void> {
  try {
    await getDB().createCollection('business')
  } catch (err) {
    if (err.code === errorCodes.namespaceExists) {
      return
    }
    console.error('Unexpected error initializing business', err)
    throw new Error('FailedInitBusiness')
  }

  try {
    // Two separate indices to ensure uniqueness across businesses
    await getDB().collection('business').createIndex({name: 1}, {unique: true})
    await getDB().collection('business').createIndex({handle: 1}, {unique: true})
  } catch (err) {
    throw new Error('FailedInitBusiness')
  }
}

export async function create(
  name: string,
  email: string,
  handle: string,
  userID: string,
  website?: string,
  description?: string,
  logo?: string,
): Promise<string> {
  try {
    const result = await getDB().collection('business').insertOne({
      name, email, handle, userID, website, description, logo,
    })

    return result.insertedId.toHexString()
  } catch (err) {
    if (err.code === errorCodes.dupKey) {
      // Throw error based off of the key pattern that was violated
      console.log('Error', err)
      if (err.keyPattern && err.keyPattern.name) {
        throw new Error('BusinessNameTaken')
      } else if (err.keyPattern && err.keyPattern.handle) {
        throw new Error('BusinessHandleTaken')
      }
    }

    throw new Error('FailedCreateBusiness')
  }
}

interface Business {
  name: string,
  email: string,
  handle: string,
  userId: string,
  website?: string,
  description?: string,
  logo?: string
}

export async function get(handle: string) : Promise<Business> {
  let business
  try {
    business = await getDB().collection('business').findOne({handle})
  } catch (err) {
    console.log('Unexpected error finding the business', handle, err)
    throw new Error('FailedGetBusiness')
  }

  if (business === null) {
    throw new Error('BusinessNotFound')
  }

  return {
    name: business.name,
    email: business.email,
    handle: business.handle,
    userId: business.userID,
    website: business.website || undefined,
    description: business.description || undefined,
    logo: business.logo || undefined,
  }
}

export async function getId(handle: string): Promise<string> {
  let result
  try {
    result = await getDB().collection('business').findOne({'handle': handle})
  } catch (err) {
    console.log('Unexpected error getting business ID:', handle, err)
  }

  if (result === null) {
    throw new Error('BusinessNotFound')
  }

  return result._id.toHexString()
}

