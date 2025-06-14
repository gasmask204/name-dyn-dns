import { FetchError } from './error.js'

export interface Record {
  id: number
  answer: string
  domainName: string
  fqdn: string
  host: string
  type: string
  ttl: number
}

export interface RecordsResponse {
  records: Record[]
}

export interface NameApiConfig {
  user: string
  token: string
  endpoint: string
}

export class NameApi {
  private readonly endpoint: string
  private readonly auth: string

  constructor(config: NameApiConfig) {
    this.endpoint = config.endpoint
    this.auth = Buffer.from(config.user + ':' + config.token).toString('base64')
  }

  async listRecords(domain: string): Promise<Record[]> {
    const headers = this.getHeaders()

    const resp = await fetch(`${this.endpoint}/core/v1/domains/${domain}/records`, {
      headers,
    })

    if (resp.ok) {
      const body = (await resp.json()) as RecordsResponse
      return body.records ?? []
    }

    throw new FetchError(resp)
  }

  async updateRecord(record: Record) {
    const headers = this.getHeaders()
    headers.set('Content-Type', 'application/json')

    const resp = await fetch(`${this.endpoint}/core/v1/domains/${record.domainName}/records/${record.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(record),
    })

    if (resp.ok) {
      const body = await resp.json()
      console.log('record update', body)
    } else {
      throw new FetchError(resp)
    }
  }

  private getHeaders() {
    const headers = new Headers()
    headers.set('Authorization', `Basic ${this.auth}`)

    return headers
  }
}
