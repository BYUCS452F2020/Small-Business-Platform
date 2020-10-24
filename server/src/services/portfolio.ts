import {insert as insertItem} from '../db/portfolio'

export async function insertPortfolioItem(
  description: string,
  file: string,
  userId: number
): Promise<void> {

  await insertItem(description, file, userId)
}
