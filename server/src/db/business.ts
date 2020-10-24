import pool from './pool'

const businessNameTaken = 'business_name_key';
const businessHandleTaken = 'business_handle_key'

export async function createTable(): Promise<void>{
  await pool.query(
    `CREATE TABLE IF NOT EXISTS "business" (
            businessID   SERIAL PRIMARY KEY,
            userID       INTEGER NOT NULL, 
            name         VARCHAR(20) NOT NULL UNIQUE,
            handle       VARCHAR(20) NOT NULL UNIQUE,
            email        VARCHAR(20) NOT NULL,
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
  website: (string|undefined),
  desciption: (string|undefined),
  logo: (File|undefined),
  userID: number,
): Promise<number> {
  try{
    const result = await pool.query(
      `INSERT INTO "business" (name, email, handle, website, description, logo, userID)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING businessID`,
      [name, email, handle, website, desciption, logo, userID],
    )
    return result.rows[0].businessID

  }catch(err){
    if (err.constraint === businessNameTaken) {
      throw new Error('BusinessNameTaken')
    } else if (err.constraint === businessHandleTaken) {
      throw new Error('BusinessHandleTaken')
    } else {
      throw new Error('FailedCreateBusiness')
    }
  }
}
