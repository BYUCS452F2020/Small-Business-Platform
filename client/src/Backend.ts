import Business from './types/business'
import axios from 'axios'

export default class Backend {
  baseUrl: string
  authToken?: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async registerBusiness(business: Business): Promise<void> {
    const url = `${this.baseUrl}/business/register`

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
    }).catch((err) => {
      if (err.response.data.error === 'BusinessNameTaken') {
        throw new Error('BusinessNameTaken')
      }
      else if (err.response.data.error === 'BusinessHandleTaken') {
        throw new Error('BusinessHandleTaken')
      }
      else{
        throw new Error('Sorry, an unexpected error occurred. Please try again later.')
      }
    });
  }
}
