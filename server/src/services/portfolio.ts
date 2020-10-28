import {insert as insertItem} from '../db/portfolio'
import {getId as getBusinessId} from '../db/business'

export async function createItem(
  description: string,
  file: string,
  businessHandle: string,
): Promise<void> {
  const businessId = await getBusinessId(businessHandle)
  await insertItem(description, file, businessId)
}
