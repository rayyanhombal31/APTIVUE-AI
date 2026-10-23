export interface DemoRepo {
  id: string
  name: string
  description: string
  language: string
  stars: number
}

export interface GithubState {
  connected: boolean
  selected: string[]
}

export const DEMO_ACCOUNT_HANDLE = 'aptivue-demo'

// ---------------------------------------------------------------------------
// SAMPLE DATA — illustrative demo repositories only. These are NOT real
// repositories belonging to the user.
// ---------------------------------------------------------------------------
export const DEMO_REPOS: DemoRepo[] = [
  {
    id: 'job-tracker',
    name: 'job-tracker',
    description: 'Full-stack job application tracker with an analytics dashboard.',
    language: 'TypeScript',
    stars: 128,
  },
  {
    id: 'react-ui-kit',
    name: 'react-ui-kit',
    description: 'Reusable React component library with built-in theming.',
    language: 'TypeScript',
    stars: 342,
  },
  {
    id: 'algo-practice',
    name: 'algo-practice',
    description: 'Data structures and algorithms solutions in Python.',
    language: 'Python',
    stars: 210,
  },
  {
    id: 'dev-portfolio',
    name: 'dev-portfolio',
    description: 'Personal portfolio built with Next.js and Tailwind CSS.',
    language: 'TypeScript',
    stars: 96,
  },
  {
    id: 'rest-api-boilerplate',
    name: 'rest-api-boilerplate',
    description: 'Node.js REST API starter with auth, validation, and tests.',
    language: 'JavaScript',
    stars: 154,
  },
  {
    id: 'cli-tools',
    name: 'cli-tools',
    description: 'A collection of command-line utilities written in Go.',
    language: 'Go',
    stars: 88,
  },
  {
    id: 'data-pipeline',
    name: 'data-pipeline',
    description: 'ETL pipeline with PostgreSQL and Python.',
    language: 'Python',
    stars: 73,
  },
  {
    id: 'wasm-experiments',
    name: 'wasm-experiments',
    description: 'WebAssembly experiments compiled from Rust.',
    language: 'Rust',
    stars: 45,
  },
]

export const DEMO_LANGUAGES: string[] = Array.from(
  new Set(DEMO_REPOS.map((repo) => repo.language)),
).sort()

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  Go: '#00add8',
  Rust: '#dea584',
}

const STORAGE_KEY = 'aptivue-github-state'

export function loadGithubState(): GithubState {
  if (typeof window === 'undefined') return { connected: false, selected: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { connected: false, selected: [] }
    const parsed = JSON.parse(raw) as Partial<GithubState>
    const validIds = new Set(DEMO_REPOS.map((repo) => repo.id))
    const selected = Array.isArray(parsed.selected)
      ? parsed.selected.filter(
          (id): id is string => typeof id === 'string' && validIds.has(id),
        )
      : []
    return {
      connected: parsed.connected === true,
      selected,
    }
  } catch {
    return { connected: false, selected: [] }
  }
}

export function saveGithubState(state: GithubState): GithubState {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Persistence is best-effort (e.g. private browsing may block storage).
  }
  return state
}
