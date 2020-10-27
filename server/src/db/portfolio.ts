import pool from './pool'

export async function createTable(): Promise<void> {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS portfolio (
       itemID       SERIAL PRIMARY KEY,
       businessID   INTEGER NOT NULL, 
       description  VARCHAR(100) NOT NULL,
       file         BYTEA NOT NULL
     )`,
  )
}

export async function insert(
  description: string,
  file: string,
  businessId: number,
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO portfolio (businessID, description, file)
      VALUES($1, $2, $3)`,
      [businessId, description, file],
    )
  } catch (err) {
    console.error(
      'unexpected error creating portfolio item',
      description,
      file,
      businessId,
      err,
    )
    throw new Error('FailedInsertPortfolioItem')
  }
}
