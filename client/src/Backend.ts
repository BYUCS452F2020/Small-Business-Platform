import Business, { isBusiness } from './types/business'
import User from './types/user'
import PortfolioItem, {arePortfolioItems} from './types/portfolioItem'
import axios, { AxiosResponse } from 'axios'

const baseUrl = 'http://localhost:8000'
const authTokenExpireDuration = 1000 * 60 * 60 * 2 - 5000 // almost 2 hours

function getAuthToken(): string | undefined {
  if (localStorage.authTokenExpireTime &&
      parseInt(localStorage.authTokenExpireTime) <= Date.now()) {
    setAuthToken(undefined)
    return undefined
  }

  return localStorage.authToken
}

function setAuthToken(token: string | undefined): void {
  if (token === undefined) {
    delete localStorage.authToken
    delete localStorage.authTokenExpireTime
  } else {
    localStorage.authToken = token
    localStorage.authTokenExpireTime = Date.now() + authTokenExpireDuration
  }
}

export function hasAuthToken(): boolean {
  return !!localStorage.authToken &&
    !!localStorage.authTokenExpireTime &&
    parseInt(localStorage.authTokenExpireTime) > Date.now()
}

export async function signup(user: User, password: string): Promise<void> {
  try {
    const response = await request<{ authToken: string }>('/user/register', 'post', {
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
  try {
    const response = await request<{ authToken: string }>('/user/login', 'post', {
      username,
      password,
    })

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
  try {
    await request('/business/register', 'post', {
      name: business.name,
      handle: business.handle,
      email: business.email,
      website: business.website,
      description: business.description,
      logo: business.logo,
    })
  } catch (err) {
    if (err.response && err.response.data) {
      if (err.response.data.error === 'BusinessNameTaken') {
        throw new Error('BusinessNameTaken')
      } else if (err.response.data.error === 'BusinessHandleTaken') {
        throw new Error('BusinessHandleTaken')
      }
    }

    if (err.message === 'UnauthorizedRequest') {
      throw err
    }

    console.error('unexpected error registering business', business, err)
    throw new Error('FailedRegisterBusiness')
  }
}

export async function getBusiness(handle: string): Promise<Business> {
  let response
  try {
    response = await request<Business>(`/business/${handle}`, 'get')
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw new Error('BusinessNotFound')
    }

    console.error('unexpected error getting business', handle, err)
    throw new Error('FailedGetBusiness')
  }

  if (!isBusiness(response.data)) {
    console.error('expecting response data to be a business, got', response.data)
    throw new Error('FailedGetBusiness')
  }

  return response.data
}

export async function addPortfolioItem(
  description: string,
  file: string,
  handle: string,
): Promise<void> {
  try {
    await request(`/business/${handle}/portfolio`, 'post', {
      description,
      file,
    })
  } catch (err) {
    if (err.message === 'UnauthorizedRequest') {
      throw err
    }

    console.log('unexpected error adding portfolio item', err)
    throw new Error('FailedAddPortfolioItem')
  }
}

export async function getPortfolio(handle: string): Promise<PortfolioItem[]> {
  let response

  try {
    response = await request<{items: PortfolioItem[]}>(
      `business/${handle}/portfolio`,
      'get',
    )
  } catch (err) {
    console.log('unexpected error getting portfolio', handle, err)
    throw new Error('FailedGetPortfolio')
  }

  if (!arePortfolioItems(response.data.items)) {
    console.log('expecting response data to be portfolio, got', response.data)
    throw new Error('FailedGetPortfolio')
  }

  return response.data.items
}

async function request<T>(
  url: string,
  method: 'get' | 'post',
  data?: Record<string, unknown>,
): Promise<AxiosResponse<T>> {
  const headers = getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}

  try {
    return await axios.request<T>({ method, url, baseURL: baseUrl, data, headers })
  } catch (err) {
    if (err.response && err.response.status === 401) {
      throw new Error('UnauthorizedRequest')
    }

    throw err
  }
}

