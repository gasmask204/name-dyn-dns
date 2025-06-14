export class FetchError extends Error {
  constructor(resp: Response) {
    super(`${resp.status} - ${resp.statusText}`)
  }
}
