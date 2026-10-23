import { Icon } from '../components/Icon'
import { SkillConstellation } from '../components/three/SkillConstellation'
import {
  DEMO_IMPROVEMENTS,
  DEMO_METRICS,
  DEMO_STRENGTHS,
  DEMO_TARGET_JOB,
} from '../data/demoDashboard'
import type { AssessmentItem, Metric } from '../data/demoDashboard'

interface OverviewProps {
  onNavigate: (id: string) => void
}

function StatCard({ metric }: { metric: Metric }) {
  return (
    <div className="stat-card">
      <span className="stat-card__icon">
        <Icon name={metric.icon} size={18} />
      </span>
      <div className="stat-card__value">{metric.value}</div>
      <div className="stat-card__label">{metric.label}</div>
      <div className="stat-card__hint">{metric.hint}</div>
    </div>
  )
}

function AssessmentList({
  title,
  items,
  tone,
}: {
  title: string
  items: AssessmentItem[]
  tone: 'strength' | 'improve'
}) {
  return (
    <div className="list-card">
      <div className="list-card__header">
        <span className={`list-card__icon list-card__icon--${tone}`}>
          <Icon name={tone === 'strength' ? 'check' : 'alert'} size={16} />
        </span>
        <div className="list-card__heading">
          <h2 className="list-card__title">{title}</h2>
          <span className="sample-tag">Sample</span>
        </div>
      </div>
      <ul className="list-card__list">
        {items.map((item) => (
          <li key={item.id} className="list-item">
            <span className={`list-item__marker list-item__marker--${tone}`} />
            <div className="list-item__body">
              <span className="list-item__label">{item.label}</span>
              <span className="list-item__note">{item.note}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Overview({ onNavigate }: OverviewProps) {
  return (
    <div className="page overview">
      <header className="overview__header">
        <p className="page__eyebrow">Overview</p>
        <h1 className="page__title">Your Career Intelligence</h1>
        <p className="page__desc">
          Track your readiness, uncover skill gaps, and prepare for your next
          opportunity.
        </p>

        {DEMO_TARGET_JOB ? (
          <div className="target-bar">
            <span className="target-bar__icon">
              <Icon name="target" size={18} />
            </span>
            <div className="target-bar__body">
              <span className="target-bar__label">Target job</span>
              <span className="target-bar__value">
                {DEMO_TARGET_JOB.title} · {DEMO_TARGET_JOB.level}
                <span className="sample-tag">Sample data</span>
              </span>
            </div>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => onNavigate('target-job')}
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="target-bar target-bar--empty">
            <span className="target-bar__icon">
              <Icon name="target" size={18} />
            </span>
            <div className="target-bar__body">
              <span className="target-bar__label">Target job</span>
              <span className="target-bar__value">
                No target job configured yet
              </span>
            </div>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onNavigate('target-job')}
            >
              Configure target job
            </button>
          </div>
        )}
      </header>

      <div className="demo-note">
        <span className="sample-tag">Sample data</span>
        <span>
          Metrics and assessments below are illustrative demo values, not real
          AI-generated results.
        </span>
      </div>

      <section className="stat-grid" aria-label="Readiness overview">
        {DEMO_METRICS.map((metric) => (
          <StatCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="panel" aria-label="Skill constellation">
        <div className="panel__header">
          <h2 className="panel__title">Skill Constellation</h2>
          <span className="panel__meta">Sample data</span>
        </div>
        <SkillConstellation />
      </section>

      <section className="duo">
        <AssessmentList
          title="Current strengths"
          items={DEMO_STRENGTHS}
          tone="strength"
        />
        <AssessmentList
          title="Skills to improve"
          items={DEMO_IMPROVEMENTS}
          tone="improve"
        />
      </section>

      <section className="next-action">
        <div className="next-action__body">
          <h2 className="next-action__title">Recommended next step</h2>
          <p className="next-action__text">
            Your readiness is solid, but practice will close the gap. Start a
            personalized mock interview to sharpen your responses.
          </p>
          <div className="next-action__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onNavigate('mock-interview')}
            >
              <Icon name="chat" size={16} />
              Start a mock interview
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onNavigate('target-job')}
            >
              Refine your target job
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
