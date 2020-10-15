import pool from './pool'

const uniqueViolationCode = '23505'

export async function createTable(): Promise<void> {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS "user" (
      id          SERIAL PRIMARY KEY,
      first_name  VARCHAR(20) NOT NULL,
      last_name   VARCHAR(20) NOT NULL,
      username    VARCHAR(20) NOT NULL UNIQUE,
      password    CHAR(60) NOT NULL,
      email       VARCHAR(32) NOT NULL
    )`,
  )
}

export async function create(
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  email: string,
): Promise<number> {
  try {
    const result = await pool.query(
      `INSERT INTO "user" (first_name, last_name, username, password, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id`,
      [firstName, lastName, username, password, email],
    )

    return result.rows[0].id
  } catch (err) {
    if (err.code === uniqueViolationCode) {
      throw new Error('UsernameTaken')
    }

    console.error('Unexpected error creating user', err)
    throw new Error('FailedCreateUser')
  }
}

interface AuthInfo {
  id: number
  password: string
}

export async function getAuthInfo(username: string): Promise<AuthInfo> {
  let result
  try {
    result = await pool.query(
      'SELECT id, password FROM "user" WHERE username = $1',
      [username],
    )
  } catch (err) {
    console.error('Unexpected error getting password', err)
    throw new Error('FailedGetAuthInfo')
  }

  if (result.rows.length === 0) {
    throw new Error('UserNotFound')
  }

  return result.rows[0]
}
