import {insert as insertItem} from '../db/portfolio'

export async function insertPortfolioItem(
  description: string,
  file: string,
  businessHandle: string,
): Promise<void> {

  await insertItem(description, file, businessHandle)
}
