import { useEffect, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { Icon } from '../components/Icon'
import {
  clearResumeMeta,
  loadResumeMeta,
  saveResumeMeta,
} from '../data/resume'
import type { ResumeMeta } from '../data/resume'
import {
  DEMO_GAPS,
  DEMO_MATCH_SCORE,
  DEMO_SKILL_GROUPS,
  DEMO_STRENGTHS,
  DEMO_SUGGESTIONS,
} from '../data/resumeAnalysis'
import { loadTargetJob } from '../data/targetJob'
import type { TargetJobData } from '../data/targetJob'

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const ACCEPTED_EXT = '.pdf'

function isPdf(file: File): boolean {
  return (
    file.type === 'application/pdf' || file.name.toLowerCase().endsWith(ACCEPTED_EXT)
  )
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function buildMeta(file: File): ResumeMeta {
  const now = new Date()
  return {
    name: file.name,
    size: file.size,
    type: file.type || 'application/pdf',
    uploadedAt: now.toISOString(),
    uploadedAtLabel: now.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  }
}

function ScoreRing({ score }: { score: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  const offset = c * (1 - score / 100)
  return (
    <svg className="score-ring" viewBox="0 0 120 120" aria-hidden="true">
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth="10"
      />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
      />
      <text
        x="60"
        y="60"
        textAnchor="middle"
        dominantBaseline="central"
        className="score-ring__value"
      >
        {score}
      </text>
    </svg>
  )
}

interface ResumeAnalysisProps {
  onNavigate: (id: string) => void
}

export function ResumeAnalysis({ onNavigate }: ResumeAnalysisProps) {
  const [file, setFile] = useState<File | null>(null)
  const [meta, setMeta] = useState<ResumeMeta | null>(() => loadResumeMeta())
  const [targetJob] = useState<TargetJobData | null>(() => loadTargetJob())
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)

  // Revoke any outstanding object URL on unmount.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  // Simulated upload progress (no backend).
  useEffect(() => {
    if (!processing) return
    const interval = window.setInterval(() => {
      setProgress((prev) => Math.min(100, prev + 20))
    }, 160)
    const timeout = window.setTimeout(() => {
      window.clearInterval(interval)
      setProgress(100)
      setProcessing(false)
    }, 900)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [processing])

  const acceptFile = (selected: File | undefined | null) => {
    setError(null)
    if (!selected) return
    if (!isPdf(selected)) {
      setError('Please upload a PDF file.')
      return
    }
    if (selected.size > MAX_SIZE_BYTES) {
      setError('File is too large. Maximum size is 10 MB.')
      return
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const url = URL.createObjectURL(selected)
    previewUrlRef.current = url
    setPreviewUrl(url)

    setFile(selected)
    setMeta(saveResumeMeta(buildMeta(selected)))
    setProgress(0)
    setProcessing(true)
  }

  const handleBrowse = () => inputRef.current?.click()

  const handleInputChange = (fileList: FileList | null) => {
    acceptFile(fileList?.[0] ?? null)
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragActive(false)
    acceptFile(event.dataTransfer.files?.[0] ?? null)
  }

  const handleRemove = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    setPreviewUrl(null)
    setFile(null)
    setMeta(null)
    setError(null)
    setProcessing(false)
    clearResumeMeta()
    if (inputRef.current) inputRef.current.value = ''
  }

  const hasResume = meta !== null

  return (
    <div className="page resume-page">
      <header className="page__header">
        <p className="page__eyebrow">APTIVUE AI</p>
        <h1 className="page__title">Resume Analysis</h1>
        <p className="page__desc">
          Understand how your resume aligns with your target role and discover
          what to improve.
        </p>
      </header>

      {processing ? (
        <section className="resume-card resume-progress" role="status">
          <div className="resume-progress__head">
            <span className="resume-progress__icon">
              <Icon name="doc" size={22} />
            </span>
            <div className="resume-progress__text">
              <h2 className="resume-progress__title">Uploading your resume</h2>
              <p className="resume-progress__file">{meta?.name}</p>
            </div>
          </div>
          <div
            className="resume-progress__track"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="resume-progress__bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>
      ) : hasResume ? (
        <div className="resume-results">
          <div className="resume-top">
            <section className="resume-card resume-score">
              <div className="resume-score__ring">
                <ScoreRing score={DEMO_MATCH_SCORE} />
              </div>
              <div className="resume-score__body">
                <span className="resume-score__label">Resume match score</span>
                <span className="resume-score__value">
                  {DEMO_MATCH_SCORE} / 100
                </span>
                <span className="sample-tag">Sample data</span>
              </div>
            </section>

            <section
              className={`resume-card target-job-banner${
                targetJob ? '' : ' target-job-banner--empty'
              }`}
            >
              {targetJob ? (
                <>
                  <span className="target-job-banner__icon">
                    <Icon name="target" size={18} />
                  </span>
                  <div className="target-job-banner__body">
                    <span className="target-job-banner__label">
                      Comparing against
                    </span>
                    <span className="target-job-banner__title">
                      {targetJob.title}
                      {targetJob.company ? ` · ${targetJob.company}` : ''}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <span className="target-job-banner__icon">
                    <Icon name="alert" size={18} />
                  </span>
                  <div className="target-job-banner__body">
                    <span className="target-job-banner__label">
                      No target job configured
                    </span>
                    <span className="target-job-banner__text">
                      Set a target role to enable role-specific analysis.
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
          </div>

          <section className="resume-card resume-file">
            <div className="resume-file__head">
              <span className="resume-file__icon">
                <Icon name="doc" size={20} />
              </span>
              <div className="resume-file__meta">
                <span className="resume-file__name">{meta?.name}</span>
                <span className="resume-file__details">
                  {meta ? formatBytes(meta.size) : ''} · PDF · Uploaded{' '}
                  {meta?.uploadedAtLabel || 'recently'}
                </span>
              </div>
              <div className="resume-file__actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleBrowse}
                >
                  Replace Resume
                </button>
                <button
                  type="button"
                  className="btn btn--ghost resume-file__remove"
                  onClick={handleRemove}
                >
                  <Icon name="trash" size={16} />
                  Remove
                </button>
              </div>
            </div>

            <div className="resume-file__preview">
              {file && previewUrl ? (
                <iframe
                  className="resume-file__iframe"
                  src={previewUrl}
                  title={`Preview of ${meta?.name ?? 'resume'}`}
                />
              ) : (
                <div className="resume-file__preview-empty">
                  <Icon name="doc" size={24} />
                  <p>
                    Preview unavailable after a refresh. Select the file again
                    to preview it.
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="resume-grid">
            <section className="list-card">
              <div className="list-card__header">
                <span className="list-card__icon list-card__icon--strength">
                  <Icon name="check" size={16} />
                </span>
                <h2 className="list-card__title">Key strengths</h2>
              </div>
              <ul className="list-card__list">
                {DEMO_STRENGTHS.map((strength) => (
                  <li key={strength.id} className="list-item">
                    <span className="list-item__marker list-item__marker--strength" />
                    <div className="list-item__body">
                      <span className="list-item__label">{strength.label}</span>
                      <span className="list-item__note">{strength.note}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="list-card">
              <div className="list-card__header">
                <span className="list-card__icon list-card__icon--suggest">
                  <Icon name="arrow-right" size={16} />
                </span>
                <h2 className="list-card__title">Improvement suggestions</h2>
              </div>
              <ul className="list-card__list">
                {DEMO_SUGGESTIONS.map((suggestion, i) => (
                  <li key={i} className="list-item">
                    <span className="list-item__marker list-item__marker--suggest" />
                    <div className="list-item__body">
                      <span className="list-item__note">{suggestion}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="resume-card resume-skills">
            <div className="resume-card__head">
              <h2 className="resume-card__title">Skills identified</h2>
              <span className="sample-tag">Sample data</span>
            </div>
            <div className="resume-skills__groups">
              {DEMO_SKILL_GROUPS.map((group) => (
                <div key={group.category} className="skill-group">
                  <span className="skill-group__category">{group.category}</span>
                  <div className="skill-group__badges">
                    {group.skills.map((skill) => (
                      <span key={skill} className="badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="resume-card resume-gaps">
            <div className="resume-card__head">
              <h2 className="resume-card__title">Skill gaps</h2>
              <span className="sample-tag">Sample data</span>
            </div>
            <p className="resume-gaps__intro">
              {targetJob
                ? `Relative to “${targetJob.title}”, consider strengthening these areas.`
                : 'Role-specific gaps require a configured target job.'}
            </p>
            <ul className="resume-gaps__list">
              {DEMO_GAPS.map((gap) => (
                <li key={gap} className="resume-gaps__item">
                  <Icon name="alert" size={15} />
                  {gap}
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <section
          className={`resume-card dropzone${
            dragActive ? ' dropzone--active' : ''
          }`}
          onDragOver={(event) => {
            event.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <span className="dropzone__icon">
            <Icon name="upload" size={28} />
          </span>
          <h2 className="dropzone__title">Upload your resume</h2>
          <p className="dropzone__copy">
            Drag and drop your resume here, or browse to select a file.
          </p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleBrowse}
          >
            Browse files
          </button>
          <p className="dropzone__guidance">PDF · up to 10 MB</p>

          {error && (
            <p className="upload-error" role="alert">
              <Icon name="alert" size={15} />
              {error}
            </p>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="dropzone__input"
            onChange={(e) => handleInputChange(e.target.files)}
          />
        </section>
      )}
    </div>
  )
}
