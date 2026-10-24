import { useState, useMemo } from 'react'
import { ConstellationCanvas } from './constellation'
import type { OrbitNode } from './constellation'
import { fibonacciSpherePoint } from './constellation-utils'
import { DEMO_SKILL_PROFICIENCIES } from '../../data/skillAnalytics'
import { useTheme } from '../../theme'

const RADIUS = 2.5
const ACCENT_LIGHT = '#6a5be0'
const ACCENT_DARK = '#8d7bf7'
const READINESS_LIGHT = '#6a5be0'
const READINESS_DARK = '#8d7bf7'

const categoryColors: Record<string, string> = {
  frontend: '#6a5be0',
  backend: '#3b82f6',
  database: '#06b6d4',
  devops: '#f59e0b',
  soft: '#8b5cf6',
}

export function SkillAnalyticsConstellation() {
  const { theme } = useTheme()
  const accent = theme === 'dark' ? ACCENT_DARK : ACCENT_LIGHT
  const readinessColor = theme === 'dark' ? READINESS_DARK : READINESS_LIGHT
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Overall readiness score from metrics (72%)
  const readinessScore = 72

  // Build nodes from skill proficiencies
  const nodes: OrbitNode[] = useMemo(() => {
    return DEMO_SKILL_PROFICIENCIES.map((skill, i) => {
      const color = categoryColors[skill.category] || accent
      // Size based on proficiency: higher = larger
      const baseScale = 0.12 + (skill.proficiency / 100) * 0.18
      return {
        id: skill.skill,
        label: skill.skill,
        level: skill.proficiency,
        category: skill.category,
        color,
        position: fibonacciSpherePoint(i, DEMO_SKILL_PROFICIENCIES.length, RADIUS),
        size: baseScale,
      }
    })
  }, [accent])

  const activeSkill = DEMO_SKILL_PROFICIENCIES.find((skill) => skill.skill === activeId) ?? null
  const selectedSkill = DEMO_SKILL_PROFICIENCIES.find((skill) => skill.skill === selectedId) ?? null

  const handleHover = (id: string | null) => {
    setActiveId(id)
  }

  const handleSelect = (id: string) => {
    setSelectedId(prev => prev === id ? null : id)
  }

  return (
    <div className="skill-analytics-constellation">
      <div className="skill-analytics-constellation__stage">
        <ConstellationCanvas
          nodes={nodes}
          accent={accent}
          activeId={activeId}
          selectedId={selectedId}
          onHover={handleHover}
          onSelect={handleSelect}
          centerNode={{
            label: 'Job Readiness',
            value: readinessScore,
            color: readinessColor,
          }}
          camera={{ position: [0, 0, 7], fov: 45 }}
          spinSpeed={0.08}
        />
        <div className="skill-analytics-constellation__hint">
          {selectedSkill
            ? `${selectedSkill.skill} · ${selectedSkill.category} · ${selectedSkill.proficiency}% (Selected)`
            : activeSkill
            ? `${activeSkill.skill} · ${activeSkill.category} · ${activeSkill.proficiency}%`
            : `Job Readiness: ${readinessScore}% — Hover for details, click to select`}
        </div>
      </div>

      <ul className="skill-analytics-constellation__legend">
        <li className="skill-analytics-constellation__legend-item skill-analytics-constellation__legend-item--center">
          <span
            className="skill-analytics-constellation__legend-dot"
            style={{ background: readinessColor, boxShadow: `0 0 8px ${readinessColor}` }}
          />
          <span className="skill-analytics-constellation__legend-label">Job Readiness</span>
          <span className="skill-analytics-constellation__legend-value">{readinessScore}%</span>
        </li>
        {DEMO_SKILL_PROFICIENCIES.map((skill) => (
          <li
            key={skill.skill}
            className={`skill-analytics-constellation__legend-item${
              (activeId === skill.skill || selectedId === skill.skill) ? ' skill-analytics-constellation__legend-item--active' : ''
            }`}
            onMouseEnter={() => setActiveId(skill.skill)}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => setSelectedId(prev => prev === skill.skill ? null : skill.skill)}
          >
            <span
              className="skill-analytics-constellation__legend-dot"
              style={{ background: categoryColors[skill.category] || accent }}
            />
            <span className="skill-analytics-constellation__legend-label">{skill.skill}</span>
            <span className="skill-analytics-constellation__legend-category">{skill.category}</span>
            <span className="skill-analytics-constellation__legend-value">{skill.proficiency}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}