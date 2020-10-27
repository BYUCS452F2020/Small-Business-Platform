import pool from './pool'

const businessNameTaken = 'business_name_key'
const businessHandleTaken = 'business_handle_key'

export async function createTable(): Promise<void> {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS "business" (
            businessID   SERIAL PRIMARY KEY,
            userID       INTEGER NOT NULL, 
            name         VARCHAR(32) NOT NULL UNIQUE,
            handle       VARCHAR(20) NOT NULL UNIQUE,
            email        VARCHAR(32) NOT NULL,
            logo         BYTEA,
            website      VARCHAR(32),
            description  VARCHAR(100)
        )`,
  )
}

export async function create(
  name: string,
  email: string,
  handle: string,
  userID: number,
  website?: string,
  desciption?: string,
  logo?: string,
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO "business" (name, email, handle, website, description, logo, userID)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING businessID`,
      [name, email, handle, website, desciption, logo, userID],
    )
  } catch (err) {
    if (err.constraint === businessNameTaken) {
      throw new Error('BusinessNameTaken')
    } else if (err.constraint === businessHandleTaken) {
      throw new Error('BusinessHandleTaken')
    } else {
      console.log('err: ', err)
      throw new Error('FailedCreateBusiness')
    }
  }
}

interface Business {
  name: string
  email: string
  handle: string
  userId: number
  website?: string
  logo?: string
  description?: string
}

export async function get(handle: string): Promise<Business> {
  let result
  try {
    result = await pool.query(
      `SELECT name, email, handle, website, description, logo, userID
       FROM business
       WHERE handle = $1`,
      [handle],
    )
  } catch (err) {
    console.error('Unexpected error getting business', handle, err)
    throw new Error('FailedGetBusiness')
  }

  if (result.rows.length === 0) {
    throw new Error('BusinessNotFound')
  }

  return {
    name: result.rows[0].name,
    handle: result.rows[0].handle,
    email: result.rows[0].email,
    userId: result.rows[0].userid,
    website: result.rows[0].website || undefined,
    logo: result.rows[0].logo && result.rows[0].logo.toString() || undefined,
    description: result.rows[0].description || undefined,
  }
}
