import config from 'config'
import { NameApi } from './name.js'

const user = config.get<string>('user')
const token = config.get<string>('token')
const endpoint = config.get<string>('endpoint')
const domain = config.get<string>('domain')
const ttl = 900 // 15 minutes

async function getIp() {
  const resp = await fetch('https://checkip.amazonaws.com/')

  if (resp.ok) {
    const ip = await resp.text()

    return ip.trim()
  }

  throw new Error('IPError')
}

async function main() {
  const api = new NameApi({
    user,
    token,
    endpoint,
  })

  const ip = await getIp()
  console.log(`IP: [${ip}]`)

  const records = await api.listRecords(domain)

  records.forEach((r) => {
    console.log(`Record: ${r.fqdn} [${r.answer}]`)
  })

  for (const record of records) {
    if (record.type === 'A' && record.answer !== ip) {
      console.error(`record needs updating: ${record.fqdn} [${record.answer}] -> [${ip}]`)

      record.answer = ip
      record.ttl = ttl

      await api.updateRecord(record)
    }
  }
}

await main()
