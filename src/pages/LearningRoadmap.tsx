import { useEffect, useState } from 'react'
import { LearningPath3D } from '../components/three/LearningPath3D'
import {
  DEMO_TARGET_COMPARISON,
  DEMO_SKILL_PROFICIENCIES,
} from '../data/skillAnalytics'

interface SkillGap {
  skill: string
  current: number
  target: number
  gap: number
  estimateHours: number
  resources: Resource[]
}

interface Resource {
  title: string
  type: string
  duration: string
  link?: string
}

const STORAGE_KEY = 'learning-roadmap-progress'

export function LearningRoadmap() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)

  // Load progress from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        setCompleted(JSON.parse(raw))
      } catch {}
    }
  }, [])

  // Save progress on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  }, [completed])

  // Build skill gaps from demo data
  const gaps: SkillGap[] = DEMO_TARGET_COMPARISON.filter((s) => s.gap).map((s) => {
    const meta = DEMO_SKILL_PROFICIENCIES.find((p) => p.skill === s.skill) ?? {
      skill: s.skill,
      proficiency: 0,
      category: 'frontend',
    }
    const target = s.demonstrated ? meta.proficiency : 100 // target proficiency if not demonstrated
    const estimateHours = Math.max(10, (100 - meta.proficiency) * 0.1)
    return {
      skill: s.skill,
      current: meta.proficiency,
      target: target,
      gap: target - meta.proficiency,
      estimateHours,
      resources: [
        {
          title: 'Intro to ' + s.skill,
          type: 'Course',
          duration: `${estimateHours} hrs`,
          link: 'https://example.com',
        },
      ],
    }
  })

  // Compute overview stats
  const totalProficiency = gaps.reduce((sum, s) => sum + (s.target - s.gap), 0)
  const totalGap = gaps.reduce((sum, s) => sum + s.gap, 0)
  const overallProgress = Math.round(((totalProficiency - totalGap) / totalProficiency) * 100)

  // Prepare skill details if a skill is selected
  let skillDetails = null
  if (selectedSkillId) {
    const skill = gaps.find((s) => s.skill === selectedSkillId)
    if (skill) {
      skillDetails = (
        <>
          <div className="skill-detail-item">
            <span className="label">Skill:</span>
            <span className="value">{skill.skill}</span>
          </div>
          <div className="skill-detail-item">
            <span className="label">Current Proficiency:</span>
            <span className="value">{skill.current}%</span>
          </div>
          <div className="skill-detail-item">
            <span className="label">Target Proficiency:</span>
            <span className="value">{skill.target}%</span>
          </div>
          <div className="skill-detail-item">
            <span className="label">Skill Gap:</span>
            <span className="value">{skill.gap}%</span>
          </div>
          <div className="skill-detail-item">
            <span className="label">Estimated Learning Time:</span>
            <span className="value">{skill.estimateHours} hrs</span>
          </div>
          <div className="skill-detail-item">
            <span className="label">Status:</span>
            <span className="value">
              {completed[selectedSkillId] ? 'Completed' : 'In Progress'}
            </span>
          </div>
          <div className="skill-detail-item">
            <span className="label">Resources:</span>
            <ul className="resources-list">
              {skill.resources.map((r, i) => (
                <li key={i}>
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noreferrer"
                    className="resource-link"
                  >
                    {r.title} ({r.type}, {r.duration})
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )
    }
  }

  return (
    <div className="page learning-roadmap-page">
      <header className="page__header">
        <p className="page__eyebrow">APTIVUE AI</p>
        <h1 className="page__title">Learning Roadmap</h1>
        <p className="page__desc">A personalized path from where you are to job‑ready.</p>
      </header>

      <section className="analytics-card roadmap-overview">
        <div className="analytics-card__head">
          <h2 className="analytics-card__title">Roadmap Overview</h2>
        </div>
        <div className="roadmap-stats grid grid-cols-2 gap-4">
          <div>
            <span className="stat-label">Skills to Improve</span>
            <span className="stat-value">{gaps.length}</span>
          </div>
          <div>
            <span className="stat-label">Estimated Duration</span>
            <span className="stat-value">{gaps.reduce((s, c) => s + c.estimateHours, 0)} hrs</span>
          </div>
          <div>
            <span className="stat-label">Overall Progress</span>
            <span className="stat-value">{overallProgress}%</span>
          </div>
          <div>
            <span className="stat-label">Completion Status</span>
            <span className="stat-value">{Object.values(completed).filter(Boolean).length}/{gaps.length}</span>
          </div>
        </div>
      </section>

      <section className="roadmap-container">
        <div className="roadmap-header">
          <h2 className="roadmap-title">Your 3D Learning Journey</h2>
          <p className="roadmap-subtitle">
            Explore your path from foundation to job readiness in an immersive 3D road.
          </p>
        </div>

        <div className="roadmap-main">
          <LearningPath3D
            skills={gaps}
            completed={completed}
            selectedSkillId={selectedSkillId}
            onSkillSelect={setSelectedSkillId}
            onSkillToggle={(id) => setCompleted((prev) => ({ ...prev, [id]: !prev[id] }))}
          />
          {selectedSkillId && (
            <aside className="skill-details-panel">
              <div className="skill-details-header">
                <h3>Skill Details</h3>
                <button
                  onClick={() => setSelectedSkillId(null)}
                  className="btn btn--secondary btn--small"
                >
                  Close
                </button>
              </div>
              <div className="skill-details-content">
                {skillDetails}
              </div>
            </aside>
          )}
        </div>
      </section>
    </div>
  )
}