import { useState } from 'react'
import { ConstellationCanvas } from './constellation'
import type { OrbitNode } from './constellation'
import { fibonacciSpherePoint } from './constellation-utils'
import { useTheme } from '../../theme'

const ACCENT_LIGHT = '#6a5be0'
const ACCENT_DARK = '#8d7bf7'
const EVIDENCE_LIGHT = '#3b82f6'
const EVIDENCE_DARK = '#60a5fa'

const SKILLS = [
  { id: 'react', label: 'React', level: 84 },
  { id: 'typescript', label: 'TypeScript', level: 78 },
  { id: 'system-design', label: 'System Design', level: 62 },
  { id: 'algorithms', label: 'Algorithms', level: 70 },
  { id: 'communication', label: 'Communication', level: 88 },
  { id: 'cloud', label: 'Cloud', level: 55 },
]

const EVIDENCE = [
  { id: 'open-source', label: 'Open Source', level: 60 },
  { id: 'portfolio', label: 'Portfolio', level: 72 },
  { id: 'hackathon', label: 'Hackathon', level: 65 },
  { id: 'technical-blog', label: 'Technical Blog', level: 50 },
]

const SKILL_RADIUS = 2.6
const EVIDENCE_RADIUS = 1.7

export function HeroConstellation() {
  const { theme } = useTheme()
  const accent = theme === 'dark' ? ACCENT_DARK : ACCENT_LIGHT
  const evidence = theme === 'dark' ? EVIDENCE_DARK : EVIDENCE_LIGHT
  const [activeId, setActiveId] = useState<string | null>(null)

  const skillNodes: OrbitNode[] = SKILLS.map((skill, i) => ({
    id: skill.id,
    label: skill.label,
    level: skill.level,
    color: accent,
    position: fibonacciSpherePoint(i, SKILLS.length, SKILL_RADIUS),
  }))

  const evidenceNodes: OrbitNode[] = EVIDENCE.map((item, i) => ({
    id: item.id,
    label: item.label,
    level: item.level,
    color: evidence,
    size: 0.16,
    position: fibonacciSpherePoint(i, EVIDENCE.length, EVIDENCE_RADIUS),
  }))

  const nodes: OrbitNode[] = [...skillNodes, ...evidenceNodes]
  const activeNode = nodes.find((node) => node.id === activeId) ?? null

  return (
    <div className="hero-constellation">
      <div className="hero-constellation__stage">
        <ConstellationCanvas
          nodes={nodes}
          accent={accent}
          activeId={activeId}
          selectedId={null}
          onHover={setActiveId}
          onSelect={() => {}}
          camera={{ position: [0, 0, 7.5], fov: 42 }}
          spinSpeed={0.1}
        />
        <div className="hero-constellation__hint">
          {activeNode ? activeNode.label : 'Skills · Evidence · Readiness'}
        </div>
      </div>

      <div className="hero-constellation__key">
        <span className="hero-key">
          <i className="hero-key__dot" style={{ background: accent }} />
          Skills
        </span>
        <span className="hero-key">
          <i className="hero-key__dot" style={{ background: evidence }} />
          Projects & evidence
        </span>
        <span className="hero-key">
          <i className="hero-key__dot hero-key__dot--ring" style={{ borderColor: accent }} />
          Career readiness
        </span>
      </div>
    </div>
  )
}
