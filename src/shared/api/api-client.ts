import { ApiError } from './api-error'

const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')

if (!apiUrl) {
  throw new Error('VITE_API_URL is not configured')
}

let accessToken: string | null = null

export function setApiAccessToken(token: string | null) {
  accessToken = token
}

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  headers.set('Accept', 'application/json')

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(`${apiUrl}/${path.replace(/^\//, '')}`, {
    ...options,
    headers,
    credentials: 'include',
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (response.status === 204) {
    return undefined as T
  }

  const payload = await parseResponse(response)

  if (!response.ok) {
    throw ApiError.fromResponse(response.status, payload)
  }

  return payload as T
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text || null
}
