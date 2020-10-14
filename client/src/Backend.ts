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
    })
  }
}
