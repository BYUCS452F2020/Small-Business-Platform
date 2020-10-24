import Business from './types/business'
import User from './types/user'
import axios from 'axios'

export default class Backend {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private get authToken(): string|undefined {
    return localStorage.authToken
  }

  private set authToken(token: string|undefined) {
    localStorage.authToken = token
  }

  static hasAuthToken(): boolean {
    return !!localStorage.authToken
  }

  async signup(user: User, password: string): Promise<void> {
    const url = `${this.baseUrl}/user/register`

    try {
      const response = await axios.post(url, {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        password: password,
      })

      this.authToken = response.data.authToken
    } catch (err) {
      if (err.response && err.response.status === 409) {
        throw new Error('UsernameTaken')
      }

      console.error('unexpected error registering user', err)
      throw new Error('SignupFailed')
    }
  }

  async login(username: string, password: string): Promise<void> {
    const url = `${this.baseUrl}/user/login`

    try {
      const response = await axios.post(url, {username, password})

      this.authToken = response.data.authToken
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

  async registerBusiness(business: Business): Promise<void> {
    const url = `${this.baseUrl}/business/register`
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
          Authorization: `Bearer ${this.authToken}`,
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
}
