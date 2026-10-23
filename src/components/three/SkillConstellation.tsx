import { useState } from 'react'
import { ConstellationCanvas } from './constellation'
import type { OrbitNode } from './constellation'
import { fibonacciSpherePoint } from './constellation-utils'
import { DEMO_SKILLS } from '../../data/demoDashboard'
import { useTheme } from '../../theme'

const RADIUS = 2.3
const ACCENT_LIGHT = '#6a5be0'
const ACCENT_DARK = '#8d7bf7'

export function SkillConstellation() {
  const { theme } = useTheme()
  const accent = theme === 'dark' ? ACCENT_DARK : ACCENT_LIGHT
  const [activeId, setActiveId] = useState<string | null>(null)

  const nodes: OrbitNode[] = DEMO_SKILLS.map((skill, i) => ({
    id: skill.id,
    label: skill.label,
    level: skill.level,
    color: accent,
    position: fibonacciSpherePoint(i, DEMO_SKILLS.length, RADIUS),
  }))

  const activeSkill = DEMO_SKILLS.find((skill) => skill.id === activeId) ?? null

  return (
    <div className="constellation">
      <div className="constellation__stage">
        <ConstellationCanvas
          nodes={nodes}
          accent={accent}
          activeId={activeId}
          onHover={setActiveId}
        />
        <div className="constellation__hint">
          {activeSkill
            ? `${activeSkill.label} · ${activeSkill.level}`
            : 'Hover a node to inspect a skill'}
        </div>
      </div>

      <ul className="constellation__legend">
        {DEMO_SKILLS.map((skill) => (
          <li
            key={skill.id}
            className={`constellation__legend-item${
              activeId === skill.id ? ' constellation__legend-item--active' : ''
            }`}
            onMouseEnter={() => setActiveId(skill.id)}
            onMouseLeave={() => setActiveId(null)}
          >
            <span
              className="constellation__legend-dot"
              style={{ background: accent }}
            />
            <span className="constellation__legend-label">{skill.label}</span>
            <span className="constellation__legend-level">{skill.level}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
