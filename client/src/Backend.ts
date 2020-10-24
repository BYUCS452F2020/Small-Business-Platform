import Business from './types/business'
import User from './types/user'
import PortfolioItem from './types/portfolioItem'
import axios from 'axios'

const baseUrl = 'http://localhost:8000'

function getAuthToken(): string|undefined {
  return localStorage.authToken
}

function setAuthToken(token: string|undefined): void {
  if (token === undefined) {
    delete localStorage.authToken
  } else {
    localStorage.authToken = token
  }
}

export function hasAuthToken(): boolean {
  return !!localStorage.authToken
}

export async function signup(user: User, password: string): Promise<void> {
  const url = `${baseUrl}/user/register`

  try {
    const response = await axios.post(url, {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      password: password,
    })

    setAuthToken(response.data.authToken)
  } catch (err) {
    if (err.response && err.response.status === 409) {
      throw new Error('UsernameTaken')
    }

    console.error('unexpected error registering user', err)
    throw new Error('SignupFailed')
  }
}

export async function login(username: string, password: string): Promise<void> {
  const url = `${baseUrl}/user/login`

  try {
    const response = await axios.post(url, {username, password})
    setAuthToken(response.data.authToken)
  } catch (err) {
    if (err.response) {
      switch (err.response.status) {
      case 404:
        throw new Error('UserNotFound')
      case 401:
        throw new Error('IncorrectPassword')
      }
    }

    console.error('unexpected error logging user in', err)
    throw new Error('LoginFailed')
  }
}

export async function registerBusiness(business: Business): Promise<void> {
  const url = `${baseUrl}/business/register`
  try {
    await axios.post(url, {
      name: business.name,
      handle: business.handle,
      email: business.email,
      website: business.website,
      description: business.description,
      logo: business.logo,
    }, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })
  }
  catch (err) {
    if (err.response.data.error === 'BusinessNameTaken') {
      throw new Error('BusinessNameTaken')
    }
    else if (err.response.data.error === 'BusinessHandleTaken') {
      throw new Error('BusinessHandleTaken')
    }
    else {
      throw new Error('Sorry, an unexpected error occurred. Please try again later.')
    }
  }
}

export async function addPortfolio(portfolioItem: PortfolioItem): Promise<void> {
  const url = `${baseUrl}/business/portfolio`
  try {
    await axios.post(url, {
      description: portfolioItem.description,
      file: portfolioItem.file
    }, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    })
  }
  catch(err){
    throw new Error('Sorry, an unexpected error occurred. Please try again later.')
  }
}
