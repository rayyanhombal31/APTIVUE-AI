export type Route = 'landing' | 'app'

const APP_HASH = '#/app'

export function parseRoute(): Route {
  if (typeof window === 'undefined') return 'landing'
  return window.location.hash.startsWith(APP_HASH) ? 'app' : 'landing'
}

export function navigateToApp(): void {
  window.location.hash = APP_HASH
}

export function navigateToLanding(): void {
  window.location.hash = '#/'
}
