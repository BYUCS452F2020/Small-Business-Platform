import {createTable as createUserTable} from './user'
import {createTable as createAuthTokenTable} from './auth-token'
import {createTable as createBusinessTable} from './business'
import {createTable as createPortfolioTable} from './portfolio'

export async function createTables(): Promise<void> {
  await Promise.all([
    createUserTable(),
    createAuthTokenTable(),
    createBusinessTable(),
    createPortfolioTable(),
  ])
}
