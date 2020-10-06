import pool from './pool'
import {v4 as uuid} from 'uuid'

export async function createTable(): Promise<void> {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS auth_token (
      token       VARCHAR(64) PRIMARY KEY,
      user_id     INTEGER REFERENCES "user" (id) ON DELETE CASCADE,
      expire_time TIMESTAMP(0) NOT NULL
    )`
  )

  // TODO: auto-delete old tokens at some point
}

export async function create(userId: number): Promise<string> {
  const token = uuid()

  try {
    await pool.query(
      `INSERT INTO auth_token (token, user_id, expire_time)
      VALUES ($1, $2, $3)`,
      [token, userId, new Date()]
    )

    return token
  } catch (err) {
    console.error('Unexpected error creating auth token', err)
    throw new Error('FailedCreateAuthToken')
  }
}
