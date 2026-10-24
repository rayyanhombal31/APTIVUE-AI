import { useState, useMemo } from 'react'
import { Icon } from '../components/Icon'
import { SkillAnalyticsConstellation } from '../components/three/SkillAnalyticsConstellation'
import { SkillComparison3D } from '../components/three/SkillComparison3D'
import {
  DEMO_METRICS,
  DEMO_SKILL_PROFICIENCIES,
  DEMO_STRENGTHS,
  DEMO_IMPROVEMENTS,
  DEMO_EVIDENCE_SOURCES,
  DEMO_PROGRESS_TREND,
} from '../data/skillAnalytics'
import { loadTargetJob } from '../data/targetJob'
import type { TargetJobData } from '../data/targetJob'

interface SkillAnalyticsProps {
  onNavigate: (id: string) => void
}

export function SkillAnalytics({ onNavigate }: SkillAnalyticsProps) {
  const [targetJob] = useState<TargetJobData | null>(() => loadTargetJob())
  const [timeframe, setTimeframe] = useState<'4w' | '8w' | '12w'>('8w')

  const sortedProficiencies = useMemo(
    () => [...DEMO_SKILL_PROFICIENCIES].sort((a, b) => b.proficiency - a.proficiency),
    []
  )

  const categoryColors: Record<string, string> = {
    frontend: '#6a5be0',
    backend: '#3b82f6',
    database: '#06b6d4',
    devops: '#f59e0b',
    soft: '#8b5cf6',
  }

  return (
    <div className="page skill-analytics-page">
      <header className="page__header">
        <p className="page__eyebrow">APTIVUE AI</p>
        <h1 className="page__title">Skill Analytics</h1>
        <p className="page__desc">
          Understand your strengths, identify skill gaps, and track your progress
          toward your target role.
        </p>
      </header>

      <section className={`github-card target-job-banner ${targetJob ? '' : ' target-job-banner--empty'}`}>
        {targetJob ? (
          <>
            <span className="target-job-banner__icon">
              <Icon name="target" size={18} />
            </span>
            <div className="target-job-banner__body">
              <span className="target-job-banner__label">Analyzing for</span>
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
              <span className="target-job-banner__label">No target job configured</span>
              <span className="target-job-banner__text">
                Configure a target role for personalized skill gap analysis.
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
        <div className="demo-note">
          <span className="sample-tag">Sample data</span>
          <span>
            All metrics, charts, and analysis below are illustrative demo values,
            not real AI-generated results.
          </span>
        </div>
      </section>

      {/* 3D Skill Constellation Visualization */}
      <section className="analytics-card skill-constellation-card">
        <div className="analytics-card__head">
          <h2 className="analytics-card__title">Skill Constellation</h2>
          <span className="sample-tag">Interactive 3D visualization</span>
        </div>
        <div className="skill-constellation-wrapper">
          <SkillAnalyticsConstellation />
        </div>
      </section>

      <section className="analytics-grid" aria-label="Readiness overview">
        {DEMO_METRICS.map((metric) => (
          <div key={metric.id} className="stat-card analytics-metric">
            <span className="stat-card__icon">
              <Icon
                name={metric.id === 'readiness' ? 'target' : metric.id === 'technical' ? 'code' : metric.id === 'interview' ? 'chat' : 'map'}
                size={18}
              />
            </span>
            <div className="stat-card__value">
              {typeof metric.value === 'number' ? `${metric.value}` : metric.value}
              {metric.id !== 'readiness' ? <span className="stat-card__unit">%</span> : null}
            </div>
            <div className="stat-card__label">{metric.label}</div>
            <div className="stat-card__desc">{metric.description}</div>
          </div>
        ))}
      </section>

      <section className="analytics-card skill-proficiency">
        <div className="analytics-card__head">
          <h2 className="analytics-card__title">Skill Proficiency</h2>
          <span className="sample-tag">Sample data</span>
        </div>
        <div className="proficiency-chart">
          {sortedProficiencies.map((skill) => {
            return (
              <div key={skill.skill} className="proficiency-bar">
                <div className="proficiency-bar__meta">
                  <span className="proficiency-bar__skill">{skill.skill}</span>
                  <span className="proficiency-bar__value">{skill.proficiency}</span>
                </div>
                <div className="proficiency-bar__track">
                  <div className="proficiency-bar__fill" style={{ width: `${skill.proficiency}%` }} />
                </div>
              </div>
            )
          })}
        </div>
        <div className="proficiency-table">
          <table>
            <thead>
              <tr>
                <th scope="col">Skill</th>
                <th scope="col">Category</th>
                <th scope="col">Proficiency</th>
              </tr>
            </thead>
            <tbody>
              {sortedProficiencies.map((skill) => (
                <tr key={skill.skill}>
                  <td>{skill.skill}</td>
                  <td>
                    <span className="badge" style={{ backgroundColor: categoryColors[skill.category] || 'var(--accent)20', color: categoryColors[skill.category] || 'var(--accent)' }}>
                      {skill.category}
                    </span>
                  </td>
                  <td>
                    <div className="table-proficiency">
                      <div className="table-proficiency__bar" style={{ backgroundColor: categoryColors[skill.category] || 'var(--accent)' }} />
                      <span>{skill.proficiency}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="analytics-card target-comparison">
        <div className="analytics-card__head">
          <h2 className="analytics-card__title">Target Job Skill Comparison</h2>
          <span className="sample-tag">Sample data</span>
        </div>
        <div className="comparison-grid">
          {targetJob ? (
            <SkillComparison3D />
          ) : (
            <div className="comparison-empty">
              <Icon name="alert" size={24} />
              <p>Configure a target job to see a detailed skill gap analysis.</p>
              <button type="button" className="btn btn--secondary" onClick={() => onNavigate('target-job')}>Configure target job</button>
            </div>
          )}
        </div>
      </section>

      <section className="strengths-cards">
        <section className="analytics-card strengths-card">
          <div className="analytics-card__head">
            <span className="analytics-card__icon analytics-card__icon--strength">
              <Icon name="check" size={16} />
            </span>
            <h2 className="analytics-card__title">Current Strengths</h2>
            <span className="sample-tag">Sample data</span>
          </div>
          <ul className="strengths-list">
            {DEMO_STRENGTHS.map((item) => (
              <li key={item.skill} className="strength-item">
                <div className="strength-item__header">
                  <span className="strength-item__skill">{item.skill}</span>
                  <span className="strength-item__proficiency">{item.proficiency}</span>
                </div>
                <p className="strength-item__evidence">{item.evidence}</p>
                <p className="strength-item__action">{item.action}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="analytics-card improvements-card">
          <div className="analytics-card__head">
            <span className="analytics-card__icon analytics-card__icon--improve">
              <Icon name="alert" size={16} />
            </span>
            <h2 className="analytics-card__title">Improvement Areas</h2>
            <span className="sample-tag">Sample data</span>
          </div>
          <ul className="improvements-list">
            {DEMO_IMPROVEMENTS.map((item) => (
              <li key={item.skill} className="improvement-item">
                <div className="improvement-item__header">
                  <span className="improvement-item__skill">{item.skill}</span>
                  <span className="improvement-item__proficiency">{item.proficiency}</span>
                </div>
                <p className="improvement-item__evidence">{item.evidence}</p>
                <p className="improvement-item__action">{item.action}</p>
              </li>
            ))}
          </ul>
        </section>
      </section>

      <section className="evidence-sources">
        <div className="analytics-card__head">
          <h2 className="analytics-card__title">Evidence Sources</h2>
          <span className="sample-tag">Sample data</span>
        </div>
        <p className="evidence-intro">
          Skill evidence is aggregated from multiple sources. Actual analysis
            integration will happen later.
        </p>
        <ul className="evidence-list">
          {DEMO_EVIDENCE_SOURCES.map((src) => (
            <li key={src.source} className="evidence-item">
              <div className="evidence-item__main">
                <span className="evidence-item__source">{src.source}</span>
                <span className={`evidence-status evidence-status--${src.status}`}>
                  {src.status === 'connected' ? 'Connected' : src.status === 'available' ? 'Available' : 'Pending'}
                </span>
              </div>
              <p className="evidence-item__desc">{src.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="progress-trend">
        <div className="analytics-card__head">
          <h2 className="analytics-card__title">Readiness Progress</h2>
          <span className="sample-tag">Sample data</span>
        </div>

        <div className="timeframe-selector">
          <select className="github-select" value={timeframe} onChange={(e) => setTimeframe(e.target.value as '4w' | '8w' | '12w')}>
            <option value="4w">4 Weeks</option>
            <option value="8w">8 Weeks</option>
            <option value="12w">12 Weeks</option>
          </select>
        </div>

        <div className="progress-chart" role="img" aria-label="Readiness trend over time">
          {DEMO_PROGRESS_TREND.map((point) => (
            <div key={point.date} className="progress-point">
              <div className="progress-point__line" style={{ height: `${Math.max(0, Math.min(100, ((point.readiness - 50) / 30) * 100))}%` }} />
              <span className="progress-point__label">{point.readiness}</span>
              <span className="progress-point__date">{point.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}