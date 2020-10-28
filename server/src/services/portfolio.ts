import {insert as insertItem} from '../db/portfolio'
import {get as getPortfolioDb} from '../db/portfolio'
import {getId as getBusinessId} from '../db/business'

export async function createItem(
  description: string,
  file: string,
  businessHandle: string,
): Promise<void> {
  const businessId = await getBusinessId(businessHandle)
  await insertItem(description, file, businessId)
}

interface Portfolio {
  file: string,
  description: string
}


export async function getPortfolio(
  businessHandle: string,
): Promise<Array<Portfolio>> {
  const businessId = await getBusinessId(businessHandle)
  return await getPortfolioDb(businessId)
}
