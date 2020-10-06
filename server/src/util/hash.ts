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

export async function compare(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (err) {
    console.error('bcrypt compare failed', err)
    throw new Error('FailedComparePassword')
  }
}
