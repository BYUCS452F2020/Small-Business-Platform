import {MongoClient, Db} from 'mongodb'

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/?ssl=false`
let db: Db

export async function connect(): Promise<void> {
  try {
    const client = await MongoClient.connect(uri, {useUnifiedTopology: true})
    db = client.db('spackle')
  } catch (err) {
    console.error('Failed to connect to mongodb', uri, err)
  }
}

export function getDB(): Db {
  return db
}
