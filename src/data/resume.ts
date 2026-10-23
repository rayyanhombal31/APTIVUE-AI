export interface ResumeMeta {
  name: string
  size: number
  type: string
  uploadedAt: string
  uploadedAtLabel: string
}

const STORAGE_KEY = 'aptivue-resume'

export function loadResumeMeta(): ResumeMeta | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ResumeMeta>
    if (typeof parsed.name === 'string' && parsed.name.length > 0) {
      return {
        name: parsed.name,
        size: typeof parsed.size === 'number' ? parsed.size : 0,
        type: typeof parsed.type === 'string' ? parsed.type : 'application/pdf',
        uploadedAt:
          typeof parsed.uploadedAt === 'string' ? parsed.uploadedAt : '',
        uploadedAtLabel:
          typeof parsed.uploadedAtLabel === 'string' ? parsed.uploadedAtLabel : '',
      }
    }
    return null
  } catch {
    return null
  }
}

export function saveResumeMeta(meta: ResumeMeta): ResumeMeta {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meta))
  } catch {
    // Persistence is best-effort (e.g. private browsing may block storage).
  }
  return meta
}

export function clearResumeMeta(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Persistence is best-effort.
  }
}
