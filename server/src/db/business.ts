import pool from './pool'

export async function createTable(): Promise<void>{
  await pool.query(
    `CREATE TABLE IF NOT EXISTS "business" (
            businessID   SERIAL PRIMARY KEY,
            userID       INTEGER NOT NULL, 
            name         VARCHAR(20) NOT NULL UNIQUE,
            hadle        VARCHAR(20) NOT NULL UNIQUE,
            email        VARCHAR(20) NOT NULL,
            logo         BLOB,
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
  userID: string,
): Promise<number> {
  try{
    const result = await pool.query(
      `INSERT INTO "business" (name, email, handle, website description, logo, userID)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING businessID`,
      [name, email, handle, website, desciption, logo, userID],
    )
    return result.rows[0].businessID

  }catch(err){
    console.log('db error: ', err)
    // if( err.message == "this means that the business name already existed")
    throw new Error('Business Name or Business Handle Taken Probably?')
    // }

    // if( err.message == "this means that the business handle is already existed")
    // throw new Error('BusinessHandletaken')
    // }

    // console.error('Unexpected error creating business', err)
    // throw new Error('FailedCreateBusiness')
  }
}
