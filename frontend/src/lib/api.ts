const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()
const apiBaseUrl = configuredApiBaseUrl && !/^https?:\/\//i.test(configuredApiBaseUrl)
  ? `https://${configuredApiBaseUrl}`
  : configuredApiBaseUrl.replace(/\/$/, '')

export function apiFetch(path: string, init?: RequestInit) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return fetch(`${apiBaseUrl}${normalizedPath}`, init)
}