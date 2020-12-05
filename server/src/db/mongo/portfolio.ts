import {getDB, errorCodes} from './db'

export async function init(): Promise<void> {
  try {
    await getDB().createCollection('portfolio')
  } catch (err) {
    if (err.code === errorCodes.namespaceExists) {
      return
    }

    console.error('Unexpected error initializing portfolio collection', err)
    throw new Error('FailedInitPortfolio')
  }

  try{
    await getDB().collection('portfolio').createIndex({businessId: 1})
  } catch(err) {
    console.error('Unexpected error creating businessId index', err)
    throw new Error('FailedInitPortfolio')
  }
}

export async function insert(
  description: string,
  file: string,
  businessId: string,
): Promise<void> {
  try{
    const result = await getDB().collection("portfolio").insertOne({
      description, file, businessId
    })
    return result.insertedId.toHexString()
  } catch (err){
    console.error('Unexpected error inserting portfolio', err)
    throw new Error('FailedInsertPortfolioItem')
  }
}

interface Portfolio {
  id: string
  file: string
  description: string
  businessID: string
}

export async function get(businessId: string): Promise<Array<Portfolio>> {
  let result : Portfolio[] = [];
  try{
    result = await getDB().collection("portfolio").find(
      { businessId: businessId}
    ).toArray();
  } catch(err) {
    console.error('unexpected error getting portfolio', businessId, err)
    throw new Error('FailedGetPortfolio')
  }
  return result;
}
