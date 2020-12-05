import {getDB, errorCodes} from './db'
import Portfolio from '../../types/portfolio'

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


export async function get(businessId: string): Promise<Portfolio> {
  let result : Portfolio = [];
  try{
    result = (await getDB().collection("portfolio").find(
      { businessId: businessId}
    ).toArray()).map(item => ({
      id: item._id.toHexString(),
      file: item.file,
      description: item.description,
    }));
  } catch(err) {
    console.error('unexpected error getting portfolio', businessId, err)
    throw new Error('FailedGetPortfolio')
  }
  return result;
}
