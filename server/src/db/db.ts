import {createTable as createUserTable} from './user'
import {createTable as createAuthTokenTable} from './auth-token'

export async function createTables(): Promise<void> {
  await Promise.all([
    createUserTable(),
    createAuthTokenTable(),
  ])
}
