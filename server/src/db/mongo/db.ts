import {MongoClient, Db} from 'mongodb'

const uri = process.env.MONGO_URL as string
let db: Db

export const errorCodes = {
  namespaceExists: 48,
  dupKey: 11000,
}

export async function connect(): Promise<MongoClient> {
  try {
    const client = await MongoClient.connect(uri, {useUnifiedTopology: true})
    db = client.db('spackle')
    return client
  } catch (err) {
    console.error('Failed to connect to mongodb', uri, err)
    throw new Error('FailedConnectMongo')
  }
}

export function getDB(): Db {
  return db
}
