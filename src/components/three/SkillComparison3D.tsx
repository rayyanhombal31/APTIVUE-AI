import { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {
  DEMO_SKILL_PROFICIENCIES,
  DEMO_TARGET_COMPARISON,
} from '../../data/skillAnalytics'

const categoryColors: Record<string, string> = {
  frontend: '#6a5be0',
  backend: '#3b82f6',
  database: '#06b6d4',
  devops: '#f59e0b',
  soft: '#8b5cf6',
}
// Map skill name to proficiency & category
const proficiencyMap = new Map<string, { proficiency: number; category: string }>()
DEMO_SKILL_PROFICIENCIES.forEach((s) =>
  proficiencyMap.set(s.skill, { proficiency: s.proficiency, category: s.category })
)
const requiredColor = '#f59e0b'
const demoHighlightColor = '#6a5be0' // used for legend
const maxBarHeight = 4
const barWidth = 0.4
const barDepth = 0.4
export function SkillComparison3D() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  // Prepare comparison data combining required flag with proficiency
  const comparisonData = useMemo(() => {
    return DEMO_TARGET_COMPARISON.filter((s) => s.required).map((s) => {
      const meta = proficiencyMap.get(s.skill) ?? {
        proficiency: 0,
        category: 'frontend',
      }
      return {
        skill: s.skill,
        required: true,
        demonstrated: s.demonstrated,
        evidence: s.evidence,
        gap: s.gap,
        proficiency: meta.proficiency,
        category: meta.category,
      }
    })
  }, [])
  const positionRadius = 6
  const positions = useMemo(() => {
    return comparisonData.map((_, i) => {
      const angle = (2 * Math.PI * i) / comparisonData.length
      return new THREE.Vector3(Math.cos(angle) * positionRadius, 0, Math.sin(angle) * positionRadius)
    })
  }, [comparisonData])
  const handleHover = (id: string | null) => {
    setActiveSkill(id)
  }
  const handleSelect = (id: string) => {
    setSelectedSkill((prev) => (prev === id ? null : id))
  }
  return (
    <div className="comparison-graph" style={{ position: 'relative', height: '450px' }}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 5, 12], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <OrbitControls enableZoom enablePan enableRotate dampingFactor={0.1} />
        {comparisonData.map((item, i) => {
          const pos = positions[i]
          const profHeight = (item.proficiency / 100) * maxBarHeight
          const requiredHeight = maxBarHeight
          const colorDem = categoryColors[item.category]
          const isActive = activeSkill === item.skill
          const isSelected = selectedSkill === item.skill
          const emissive = isActive || isSelected ? 0.3 : 0
          return (
            <group
              key={item.skill}
              position={pos}
              onPointerOver={() => handleHover(item.skill)}
              onPointerOut={() => handleHover(null)}
              onClick={(e) => {
                e.stopPropagation()
                handleSelect(item.skill)
              }}
            >
              {/* Required bar – full height */}
              <mesh position={[0, requiredHeight / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[barWidth, requiredHeight, barDepth]} />
                <meshStandardMaterial color={requiredColor} emissiveIntensity={emissive} />
              </mesh>
              {/* Demonstrated bar */}
              {item.demonstrated && profHeight > 0 && (
                <mesh position={[ -barWidth * 1.5, profHeight / 2, 0]} castShadow receiveShadow>
                  <boxGeometry args={[barWidth, profHeight, barDepth]} />
                  <meshStandardMaterial color={colorDem} emissiveIntensity={emissive} />
                </mesh>
              )}
            </group>
          )
        })}
        {/* Gap representation: missing part below required */}
        {comparisonData.map((item, i) => {
          if (!item.gap) return null
          const pos = positions[i]
          const profHeight = (item.proficiency / 100) * maxBarHeight
          const missingHeight = maxBarHeight - profHeight
          if (missingHeight <= 0) return null
          return (
            <mesh
              key={item.skill + '-gap'}
              position={pos.add(new THREE.Vector3(barWidth * 1.5, missingHeight / 2, 0))}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[barWidth, missingHeight, barDepth]} />
              <meshStandardMaterial color="#ff4d4d" emissiveIntensity={0.1} />
            </mesh>
          )
        })}
      </Canvas>
      {/* Hint / tooltip */}
      <div
        className="skill-analytics-constellation__hint"
        style={{
          position: 'absolute',
          left: '1rem',
          bottom: '1rem',
          padding: '6px 12px',
          borderRadius: '9999px',
          background: 'var(--header-bg)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(8px)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }}
      >
        {selectedSkill ? `${selectedSkill} – Selected` : activeSkill ? `${activeSkill} – ${detailLabel(activeSkill)}` : 'Hover over a skill to see details; click to select'}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: requiredColor,
            }}
          />
          <span>Required proficiency</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: demoHighlightColor,
            }}
          />
          <span>Demonstrated proficiency</span>
        </div>
      </div>
    </div>
  )
  function detailLabel(skill: string) {
    const item = comparisonData.find((s) => s.skill === skill)
    if (!item) return ''
    return `${item.category} – ${item.proficiency}% – ${item.gap ? 'Gap' : '✓'}`
  }
}
