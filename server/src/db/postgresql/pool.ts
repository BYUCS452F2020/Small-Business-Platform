import {Pool} from 'pg'

const pool = new Pool()

export default pool

// log any unexpected errors on idle clients
pool.on('error', err => console.error('Unexpected error on idle client', err))
