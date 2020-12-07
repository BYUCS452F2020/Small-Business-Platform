import {insert as insertItem} from '../db/mongo/portfolio'
import {get as getPortfolioDb} from '../db/mongo/portfolio'
import {getId as getBusinessId} from '../db/mongo/business'
import Portfolio from '../types/portfolio'

export async function createItem(
  description: string,
  file: string,
  businessHandle: string,
): Promise<void> {
  const businessId = await getBusinessId(businessHandle)
  await insertItem(description, file, businessId)
}

export async function getPortfolio(businessHandle: string): Promise<Portfolio> {
  const businessId = await getBusinessId(businessHandle)
  return await getPortfolioDb(businessId)
}
