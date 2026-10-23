import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import {
  DEMO_ACCOUNT_HANDLE,
  DEMO_LANGUAGES,
  DEMO_REPOS,
  LANGUAGE_COLORS,
  loadGithubState,
  saveGithubState,
} from '../data/github'
import {
  DEMO_GAPS,
  DEMO_LIMITED_EVIDENCE,
  DEMO_RELEVANT_SKILLS,
  DEMO_SKILL_EVIDENCE,
  DEMO_SKILLS_IDENTIFIED,
  DEMO_SUGGESTIONS,
} from '../data/githubAnalysis'
import { loadTargetJob } from '../data/targetJob'
import type { TargetJobData } from '../data/targetJob'

interface GithubAnalysisProps {
  onNavigate: (id: string) => void
}

export function GithubAnalysis({ onNavigate }: GithubAnalysisProps) {
  const [state, setState] = useState(() => loadGithubState())
  const [targetJob] = useState<TargetJobData | null>(() => loadTargetJob())
  const [view, setView] = useState<'selection' | 'results'>('selection')
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState<string>('all')

  const connected = state.connected
  const selectedIds = state.selected

  const selectedRepos = useMemo(
    () => DEMO_REPOS.filter((repo) => selectedIds.includes(repo.id)),
    [selectedIds],
  )

  const selectedLanguages = useMemo(
    () => Array.from(new Set(selectedRepos.map((repo) => repo.language))).sort(),
    [selectedRepos],
  )

  const filteredRepos = useMemo(() => {
    const query = search.trim().toLowerCase()
    return DEMO_REPOS.filter((repo) => {
      const matchesSearch =
        query.length === 0 ||
        repo.name.toLowerCase().includes(query) ||
        repo.description.toLowerCase().includes(query)
      const matchesLanguage =
        language === 'all' || repo.language === language
      return matchesSearch && matchesLanguage
    })
  }, [search, language])

  const handleConnect = () => setState(saveGithubState({ ...state, connected: true }))

  const handleDisconnect = () => {
    setState(saveGithubState({ connected: false, selected: [] }))
    setView('selection')
  }

  const toggleRepo = (id: string) => {
    const selected = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id]
    setState(saveGithubState({ ...state, selected }))
  }

  const clearSelection = () =>
    setState(saveGithubState({ ...state, selected: [] }))

  const handleAnalyze = () => {
    if (selectedIds.length > 0) setView('results')
  }

  return (
    <div className="page github-page">
      <header className="page__header">
        <p className="page__eyebrow">APTIVUE AI</p>
        <h1 className="page__title">GitHub Analysis</h1>
        <p className="page__desc">
          Discover the skills your projects demonstrate and how your work
          aligns with your target role.
        </p>
      </header>

      {/* Connection panel */}
      <section className="github-card github-connect">
        {connected ? (
          <div className="github-connect__row">
            <span className="github-connect__icon">
              <Icon name="github" size={22} />
            </span>
            <div className="github-connect__body">
              <span className="github-connect__label">Connected</span>
              <span className="github-connect__handle">
                @{DEMO_ACCOUNT_HANDLE}
                <span className="sample-tag">Demo account</span>
              </span>
              <span className="github-connect__note">
                Actual GitHub authorization will be integrated later. Private
                repositories are not accessed.
              </span>
            </div>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="github-connect__empty">
            <span className="github-connect__icon">
              <Icon name="github" size={26} />
            </span>
            <div className="github-connect__empty-body">
              <h2 className="github-connect__title">
                Connect your GitHub account
              </h2>
              <p className="github-connect__copy">
                Review selected repositories to identify the technical skills
                and project evidence they demonstrate.
              </p>
            </div>
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleConnect}
            >
              Connect GitHub
            </button>
            <p className="github-connect__demo-note">
              Demo connection only — actual GitHub OAuth will be integrated in a
              later phase.
            </p>
          </div>
        )}
      </section>

      {connected && view === 'selection' && (
        <>
          <section
            className={`github-card github-target-banner${
              targetJob ? '' : ' github-target-banner--empty'
            }`}
          >
            {targetJob ? (
              <>
                <span className="github-target-banner__icon">
                  <Icon name="target" size={18} />
                </span>
                <div className="github-target-banner__body">
                  <span className="github-target-banner__label">
                    Aligning to
                  </span>
                  <span className="github-target-banner__title">
                    {targetJob.title}
                    {targetJob.company ? ` · ${targetJob.company}` : ''}
                  </span>
                </div>
              </>
            ) : (
              <>
                <span className="github-target-banner__icon">
                  <Icon name="alert" size={18} />
                </span>
                <div className="github-target-banner__body">
                  <span className="github-target-banner__label">
                    No target job configured
                  </span>
                  <span className="github-target-banner__text">
                    Role-specific alignment requires a target job. You can
                    still select repositories.
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => onNavigate('target-job')}
                >
                  Configure target job
                </button>
              </>
            )}
          </section>

          <div className="github-layout">
            <section className="github-card github-repos">
              <div className="github-repos__head">
                <h2 className="github-repos__title">Select repositories</h2>
                <span className="github-repos__count">
                  {selectedIds.length} selected
                </span>
              </div>

              <div className="github-repos__controls">
                <div className="github-search">
                  <Icon name="search" size={16} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search repositories…"
                    aria-label="Search repositories"
                  />
                </div>
                <select
                  className="github-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  aria-label="Filter by language"
                >
                  <option value="all">All languages</option>
                  {DEMO_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {filteredRepos.length === 0 ? (
                <p className="github-repos__empty">
                  No repositories match your search.
                </p>
              ) : (
                <ul className="repo-list">
                  {filteredRepos.map((repo) => {
                    const selected = selectedIds.includes(repo.id)
                    return (
                      <li key={repo.id}>
                        <label className="repo-item">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleRepo(repo.id)}
                          />
                          <div className="repo-item__body">
                            <div className="repo-item__top">
                              <span className="repo-item__name">
                                {repo.name}
                              </span>
                              <span className="repo-item__visibility">
                                Public
                              </span>
                            </div>
                            <p className="repo-item__desc">{repo.description}</p>
                            <div className="repo-item__meta">
                              <span className="repo-item__lang">
                                <i
                                  className="repo-item__dot"
                                  style={{
                                    background:
                                      LANGUAGE_COLORS[repo.language] ??
                                      'var(--accent)',
                                  }}
                                />
                                {repo.language}
                              </span>
                              <span className="repo-item__stars">
                                <Icon name="star" size={14} />
                                {repo.stars}
                              </span>
                            </div>
                          </div>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>

            <aside className="github-card github-summary">
              <h2 className="github-summary__title">Selected repositories</h2>

              {selectedRepos.length === 0 ? (
                <p className="github-summary__empty">
                  Select repositories to see a summary here.
                </p>
              ) : (
                <>
                  <div className="github-summary__stat">
                    <span className="github-summary__stat-value">
                      {selectedRepos.length}
                    </span>
                    <span className="github-summary__stat-label">
                      repositories
                    </span>
                  </div>

                  <div className="github-summary__block">
                    <span className="github-summary__label">Repositories</span>
                    <ul className="github-summary__names">
                      {selectedRepos.map((repo) => (
                        <li key={repo.id}>{repo.name}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="github-summary__block">
                    <span className="github-summary__label">Languages</span>
                    <div className="github-summary__langs">
                      {selectedLanguages.map((lang) => (
                        <span key={lang} className="badge">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="github-summary__actions">
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={handleAnalyze}
                    >
                      Analyze Selected Repositories
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={clearSelection}
                    >
                      Clear selection
                    </button>
                  </div>
                </>
              )}
            </aside>
          </div>
        </>
      )}

      {connected && view === 'results' && (
        <div className="github-results">
          <div className="github-results__bar">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setView('selection')}
            >
              Back to repositories
            </button>
            <span className="sample-tag">Demo analysis</span>
          </div>

          <section className="github-card github-skills">
            <div className="github-card__head">
              <h2 className="github-card__title">Skills identified</h2>
              <span className="sample-tag">Sample data</span>
            </div>
            <div className="github-skills__badges">
              {DEMO_SKILLS_IDENTIFIED.map((skill) => (
                <span key={skill} className="badge">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="github-card github-evidence">
            <div className="github-card__head">
              <h2 className="github-card__title">Project evidence</h2>
              <span className="sample-tag">Sample data</span>
            </div>
            <ul className="github-evidence__list">
              {DEMO_SKILL_EVIDENCE.map((item) => (
                <li key={item.skill} className="github-evidence__item">
                  <div className="github-evidence__head">
                    <span className="github-evidence__skill">{item.skill}</span>
                    <span className="github-evidence__project">
                      <Icon name="code" size={14} />
                      {item.project}
                    </span>
                  </div>
                  <p className="github-evidence__note">{item.note}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="github-card github-alignment">
            <div className="github-card__head">
              <h2 className="github-card__title">Target job alignment</h2>
              <span className="sample-tag">Sample data</span>
            </div>

            {targetJob ? (
              <>
                <p className="github-alignment__intro">
                  Compared against{' '}
                  <strong>
                    {targetJob.title}
                    {targetJob.company ? ` · ${targetJob.company}` : ''}
                  </strong>
                  .
                </p>
                <div className="github-alignment__grid">
                  <div className="github-alignment__block">
                    <h3 className="github-alignment__subtitle">
                      Relevant skills
                    </h3>
                    <div className="github-alignment__badges">
                      {DEMO_RELEVANT_SKILLS.map((skill) => (
                        <span key={skill} className="badge badge--ok">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="github-alignment__block">
                    <h3 className="github-alignment__subtitle">
                      Limited evidence
                    </h3>
                    <div className="github-alignment__badges">
                      {DEMO_LIMITED_EVIDENCE.map((skill) => (
                        <span key={skill} className="badge badge--warn">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="github-alignment__grid">
                  <div className="github-alignment__block">
                    <h3 className="github-alignment__subtitle">
                      Potential gaps
                    </h3>
                    <ul className="github-alignment__list">
                      {DEMO_GAPS.map((gap) => (
                        <li key={gap}>
                          <Icon name="alert" size={15} />
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="github-alignment__block">
                    <h3 className="github-alignment__subtitle">Suggestions</h3>
                    <ul className="github-alignment__list">
                      {DEMO_SUGGESTIONS.map((suggestion) => (
                        <li key={suggestion}>
                          <Icon name="arrow-right" size={15} />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="github-alignment__empty">
                <Icon name="alert" size={22} />
                <p>
                  Configure a target job to see role-specific alignment.
                </p>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => onNavigate('target-job')}
                >
                  Configure target job
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
