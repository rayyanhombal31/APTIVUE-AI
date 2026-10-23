export interface TargetJobData {
  title: string
  company: string
  description: string
  updatedAt: string
  updatedAtLabel: string
}

const STORAGE_KEY = 'aptivue-target-job'

// Load and validate the persisted target job. Returns null when absent or
// malformed so the UI can fall back to an empty state safely.
export function loadTargetJob(): TargetJobData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<TargetJobData>
    if (
      typeof parsed.title === 'string' &&
      parsed.title.trim().length > 0 &&
      typeof parsed.description === 'string' &&
      parsed.description.trim().length > 0
    ) {
      return {
        title: parsed.title.trim(),
        company: typeof parsed.company === 'string' ? parsed.company.trim() : '',
        description: parsed.description.trim(),
        updatedAt:
          typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
        updatedAtLabel:
          typeof parsed.updatedAtLabel === 'string' ? parsed.updatedAtLabel : '',
      }
    }
    return null
  } catch {
    return null
  }
}

export function saveTargetJob(input: {
  title: string
  company: string
  description: string
}): TargetJobData {
  const now = new Date()
  const record: TargetJobData = {
    title: input.title.trim(),
    company: input.company.trim(),
    description: input.description.trim(),
    updatedAt: now.toISOString(),
    updatedAtLabel: now.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    // Persistence is best-effort (e.g. private browsing may block storage).
  }
  return record
}
