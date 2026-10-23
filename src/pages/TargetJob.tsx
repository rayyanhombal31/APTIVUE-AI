import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Icon } from '../components/Icon'
import { loadTargetJob, saveTargetJob } from '../data/targetJob'
import type { TargetJobData } from '../data/targetJob'

const MAX_DESCRIPTION = 5000

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

interface FormState {
  title: string
  company: string
  description: string
}

interface FormErrors {
  title?: string
  description?: string
}

function buildInitialForm(): FormState {
  const existing = loadTargetJob()
  return {
    title: existing?.title ?? '',
    company: existing?.company ?? '',
    description: existing?.description ?? '',
  }
}

export function TargetJob() {
  const [saved, setSaved] = useState<TargetJobData | null>(() => loadTargetJob())
  const [form, setForm] = useState<FormState>(buildInitialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)

  const titleRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleTitle = (value: string) => {
    setForm((prev) => ({ ...prev, title: value }))
    setErrors((prev) => ({ ...prev, title: undefined }))
    setSuccess(false)
  }

  const handleCompany = (value: string) => {
    setForm((prev) => ({ ...prev, company: value }))
    setSuccess(false)
  }

  const handleDescription = (value: string) => {
    setForm((prev) => ({ ...prev, description: value }))
    setErrors((prev) => ({ ...prev, description: undefined }))
    setSuccess(false)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: FormErrors = {}
    if (!form.title.trim()) nextErrors.title = 'Job title is required.'
    if (!form.description.trim()) {
      nextErrors.description = 'Job description is required.'
    }
    setErrors(nextErrors)
    if (nextErrors.title || nextErrors.description) return

    setSaved(saveTargetJob(form))
    setSuccess(true)
  }

  const handleEdit = () => {
    formRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    })
    titleRef.current?.focus()
  }

  return (
    <div className="page target-job-page">
      <header className="page__header">
        <p className="page__eyebrow">APTIVUE AI</p>
        <h1 className="page__title">Target Job</h1>
        <p className="page__desc">
          Define the role you're preparing for. APTIVUE AI will use it to
          personalize your career readiness analysis.
        </p>
      </header>

      <div className="target-job__layout">
        <form
          className="tjob-card tjob-form"
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="tjob-card__header">
            <h2 className="tjob-card__title">
              {saved ? 'Edit target job' : 'Configure your target job'}
            </h2>
            <p className="tjob-card__subtitle">
              Describe the role you want to be ready for.
            </p>
          </div>

          {success && (
            <div className="form-success" role="status">
              <Icon name="check" size={16} />
              Target job saved
            </div>
          )}

          <div className="field">
            <label className="field__label" htmlFor="tjob-title">
              Job title <span className="field__required">*</span>
            </label>
            <input
              id="tjob-title"
              ref={titleRef}
              className="field__input"
              type="text"
              value={form.title}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder="Full-Stack Developer"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'tjob-title-error' : undefined}
            />
            {errors.title && (
              <p className="field__error" id="tjob-title-error">
                {errors.title}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="tjob-company">
              Company <span className="field__optional">(optional)</span>
            </label>
            <input
              id="tjob-company"
              className="field__input"
              type="text"
              value={form.company}
              onChange={(e) => handleCompany(e.target.value)}
              placeholder="Company name"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="tjob-description">
              Job description <span className="field__required">*</span>
            </label>
            <textarea
              id="tjob-description"
              className="field__textarea"
              value={form.description}
              onChange={(e) => handleDescription(e.target.value)}
              placeholder="Paste the full job description here — responsibilities, required skills, and qualifications."
              maxLength={MAX_DESCRIPTION}
              rows={8}
              aria-invalid={Boolean(errors.description)}
              aria-describedby="tjob-description-counter"
            />
            <div className="field__meta">
              {errors.description ? (
                <p className="field__error" id="tjob-description-error">
                  {errors.description}
                </p>
              ) : (
                <span className="field__hint">
                  Paste as much detail as you have.
                </span>
              )}
              <span className="field__counter" id="tjob-description-counter">
                {form.description.length} / {MAX_DESCRIPTION}
              </span>
            </div>
          </div>

          <div className="tjob-form__actions">
            <button type="submit" className="btn btn--primary">
              Save Target Job
            </button>
          </div>
        </form>

        <section className="tjob-card tjob-summary">
          <div className="tjob-card__header">
            <h2 className="tjob-card__title">Current target job</h2>
          </div>

          {saved ? (
            <div className="tjob-summary__body">
              <div className="tjob-summary__row">
                <span className="tjob-summary__label">Job title</span>
                <span className="tjob-summary__value">{saved.title}</span>
              </div>
              {saved.company && (
                <div className="tjob-summary__row">
                  <span className="tjob-summary__label">Company</span>
                  <span className="tjob-summary__value">{saved.company}</span>
                </div>
              )}
              <div className="tjob-summary__row tjob-summary__row--stack">
                <span className="tjob-summary__label">Description</span>
                <p className="tjob-summary__preview">{saved.description}</p>
              </div>
              <div className="tjob-summary__meta">
                <span>
                  Configured {saved.updatedAtLabel || 'recently'}
                </span>
              </div>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={handleEdit}
              >
                Edit Target Job
              </button>
              <p className="tjob-summary__note">
                Saved locally in your browser for this demo.
              </p>
            </div>
          ) : (
            <div className="tjob-empty">
              <span className="tjob-empty__icon">
                <Icon name="target" size={26} />
              </span>
              <h3 className="tjob-empty__title">No target job yet</h3>
              <p className="tjob-empty__text">
                Set a target role to personalize your readiness score, skill
                gap analysis, and interview practice.
              </p>
              <p className="tjob-empty__note">
                Saved locally in your browser for this demo.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
