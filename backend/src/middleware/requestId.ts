import { v4 as uuidv4 } from 'uuid'

export function requestIdMiddleware(req: any, res: any, next: any) {
  req.id = req.headers['x-request-id'] || uuidv4()
  res.setHeader('X-Request-ID', req.id)
  next()
}
