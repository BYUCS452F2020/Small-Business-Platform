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
  businessHandle: string,
): Promise<void> {
  try {
    const result = await pool.query(
      `SELECT businessID
      FROM business
      WHERE handle = $1`,
      [businessHandle],
    )
    if(result.rows && result.rows[0] && result.rows[0].businessid){
      const businessID = result.rows[0].businessid
      await pool.query(
        `INSERT INTO portfolio (userID, description, file)
              VALUES($1, $2, $3)
              RETURNING portfolioID`,
        [businessID, description, file],
      )
    }
  } catch (err) {
    throw new Error('FailedCreatePortfolio')
  }
}