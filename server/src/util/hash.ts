import bcrypt from 'bcrypt'

const saltRounds = 10

export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, saltRounds)
  } catch (err) {
    console.error('bcrypt hash failed', err)
    throw new Error('FailedHashPassword')
  }
}
