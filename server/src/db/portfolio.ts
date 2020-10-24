import pool from './pool'

export async function createTable(): Promise<void> {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS portfolio (
            portfolioID  SERIAL PRIMARY KEY,
            userID       INTEGER NOT NULL, 
            description  VARCHAR(10485759) NOT NULL,
            file         BYTEA NOT NULL
        )`,
  )
}

export async function insert(
  description: string,
  file: string,
  userID: number,
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO portfolio (userID, description, file)
            VALUES($1, $2, $3)
            RETURNING portfolioID`,
      [userID, description, file],
    )
  } catch (err) {
    throw new Error('FailedCreateBusiness')
  }
}