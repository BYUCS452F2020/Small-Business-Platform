import pool from './pool'
import {v4 as uuid} from 'uuid'

const tokenDuration = 1000 * 60 * 60 * 2 // two hours

export async function createTable(): Promise<void> {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS auth_token (
      token       VARCHAR(64) PRIMARY KEY,
      user_id     INTEGER REFERENCES "user" (id) ON DELETE CASCADE,
      expire_time TIMESTAMP(0) NOT NULL
    )`,
  )

  // TODO: auto-delete old tokens at some point
}

export async function create(userId: number): Promise<string> {
  const token = uuid()

  try {
    await pool.query(
      `INSERT INTO auth_token (token, user_id, expire_time)
      VALUES ($1, $2, $3)`,
      [token, userId, new Date(Date.now() + tokenDuration)],
    )

    return token
  } catch (err) {
    console.error('Unexpected error creating auth token', err)
    throw new Error('FailedCreateAuthToken')
  }
}

export async function getUserId(token: string): Promise<number> {
  let result
  try {
    result = await pool.query(
      `SELECT user_id
      FROM auth_token
      WHERE token = $1 AND expire_time > $2`,
      [token, new Date()],
    )
  } catch (err) {
    console.error('Unexpected error getting user id from auth token', err)
    throw new Error('FailedGetUserId')
  }

  if (result.rows.length === 0) {
    throw new Error('TokenNotFound')
  }

  return result.rows[0].user_id
}
