import { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'

const stageColors: Record<string, string> = {
  Foundation: '#6a5be0',
  Intermediate: '#3b82f6',
  Advanced: '#06b6d4',
  JobReady: '#f59e0b',
}

function getStage(proficiency: number): string {
  if (proficiency < 50) return 'Foundation'
  if (proficiency < 70) return 'Intermediate'
  if (proficiency < 90) return 'Advanced'
  return 'JobReady'
}

interface SkillGap {
  skill: string
  current: number
  target: number
  gap: number
  estimateHours: number
  resources: { title: string; type: string; duration: string; link?: string }[]
}

interface LearningPath3DProps {
  skills: SkillGap[]
  completed: Record<string, boolean>
  selectedSkillId: string | null
  onSkillSelect: (id: string) => void
  onSkillToggle: (id: string) => void
}

// Constants for the path
const PATH_LENGTH = 25
const ARC_HEIGHT = 8

export function LearningPath3D({
  skills,
  completed,
  selectedSkillId,
  onSkillSelect,
  onSkillToggle
}: LearningPath3DProps) {
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null)

  // Filter to only gap skills (those needing learning)
  const gapSkills = skills.filter(s => s.gap > 0)

  // Create the path: points arranged along an arc
  const pathData = useMemo(() => {
    // Sort gapSkills by current proficiency ascending
    const sorted = [...gapSkills].sort((a, b) => a.current - b.current)
    const total = sorted.length
    const points: THREE.Vector3[] = []
    const skillPositions: Record<string, THREE.Vector3> = {}

    sorted.forEach((skill, idx) => {
      const t = total > 1 ? idx / (total - 1) : 0
      // x: from -PATH_LENGTH/2 to +PATH_LENGTH/2
      const x = t * PATH_LENGTH - PATH_LENGTH / 2
      // y: arc shape: sin(pi * t) * ARC_HEIGHT
      const y = Math.sin(Math.PI * t) * ARC_HEIGHT
      // z: slight oscillation for variety
      const z = Math.sin(t * Math.PI * 2) * 1.5
      const position = new THREE.Vector3(x, y, z)
      points.push(position)
      skillPositions[skill.skill] = position
    })

    return { points, skillPositions }
  }, [gapSkills])

  // Precompute geometries and materials to avoid creating new objects each render
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 16, 16), [])
  const torusGeometry = useMemo(() => new THREE.TorusGeometry(1.2, 0.3, 16, 32), [])
  const coneGeometry = useMemo(() => new THREE.ConeGeometry(1, 3, 8), [])
  const baseSphereMaterial = useMemo(() => new THREE.MeshStandardMaterial({}), [])
  const baseToriiMaterial = useMemo(() => new THREE.MeshStandardMaterial({}), [])

  // Handle hover and click
  const handleHover = (id: string | null) => {
    setHoveredSkillId(id)
    if (id) onSkillSelect(id)
  }

  const handleClick = (id: string) => {
    onSkillToggle(id)
  }

  return (
    <div className="learning-path-3d" style={{ position: 'relative', width: '100%', height: '600px' }}>
      <Canvas
        camera={{ position: [0, 15, 30], fov: 45 }}
        style={{ background: '#0a0a1a' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1.8} color={0x6a5be0} />
        <hemisphereLight
          intensity={0.6}
        />
        <OrbitControls
          enableZoom
          enablePan
          enableRotate
          dampingFactor={0.1}
          target={new THREE.Vector3(0, 6, 0)}
        />
        {/* Draw the path as a thick line with glow */}
        <Line
          points={pathData.points}
          color={0x6a5be0}
          linewidth={8}
        />
        {/* Optional: add a thinner bright line on top for glow */}
        <Line
          points={pathData.points}
          color={0xffffff}
          linewidth={2}
        />

        {/* Render skill nodes as spheres */}
        {gapSkills.map((skill) => {
          const pos = pathData.skillPositions[skill.skill]
          const isCompleted = completed[skill.skill] || false
          const isSelected = selectedSkillId === skill.skill
          const isHovered = hoveredSkillId === skill.skill
          const baseScale = 0.6
          const scale = isSelected ? baseScale * 2.0 : isHovered ? baseScale * 1.5 : baseScale
          const stage = getStage(skill.current)
          const color = stageColors[stage]
          // Clone base materials and set color for this instance
          const sphereMaterial = baseSphereMaterial.clone()
          sphereMaterial.color.set(color)
          sphereMaterial.emissive.set(color)
          sphereMaterial.emissiveIntensity = isCompleted ? 0.9 : isSelected ? 0.7 : 0.4
          sphereMaterial.roughness = isCompleted ? 0.1 : 0.2
          sphereMaterial.metalness = isCompleted ? 0.05 : 0.1
          return (
            <group
              key={skill.skill}
              position={pos}
              onPointerOver={() => handleHover(skill.skill)}
              onPointerOut={() => handleHover(null)}
              onClick={(e) => {
                e.stopPropagation()
                handleClick(skill.skill)
              }}
            >
              <mesh geometry={sphereGeometry} material={sphereMaterial} />
              {/* Optional: add a outer glow layer for selected */}
              {isSelected && (
                <mesh scale={scale * 2.2} geometry={sphereGeometry} material={
                  new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.2,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending,
                  })
                } />
              )}
            </group>
          )
        })}
        {/* Stage markers: place torus at 25%, 50%, 75% along the x-axis (path length) */}
        {[0, 0.5, 1].map((t, idx) => {
          const x = t * PATH_LENGTH - PATH_LENGTH / 2
          const y = Math.sin(Math.PI * t) * ARC_HEIGHT
          const z = 0
          const pos = new THREE.Vector3(x, y, z)
          const stageLabel = idx === 0 ? 'Foundation' : idx === 1 ? 'Intermediate' : idx === 2 ? 'Advanced' : 'JobReady'
          const color = stageColors[stageLabel as keyof typeof stageColors]
          // Clone torus material and set color
          const torusMaterial = baseToriiMaterial.clone()
          torusMaterial.color.set(color)
          torusMaterial.emissiveIntensity = 0.5
          torusMaterial.roughness = 0.2
          torusMaterial.metalness = 0.3
          return (
            <group key={`stage-${idx}`} position={pos}>
              <mesh geometry={torusGeometry} material={torusMaterial} />
            </group>
          )
        })}
        {/* Start marker at the beginning of the path */}
        <group position={pathData.points[0]}>
          <mesh geometry={coneGeometry}>
            <meshStandardMaterial color={0x00ff00} emissiveIntensity={0.4} />
          </mesh>
        </group>
        {/* End marker at the end of the path */}
        <group position={pathData.points[pathData.points.length - 1]}>
          <mesh geometry={coneGeometry}>
            <meshStandardMaterial color={0xff0000} emissiveIntensity={0.4} />
          </mesh>
        </group>
      </Canvas>
      {/* Tooltip / hint */}
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
        {hoveredSkillId
          ? `${hoveredSkillId} – ${getStage(
              skills.find((s) => s.skill === hoveredSkillId)?.current ?? 0
            )} – ${
                completed[hoveredSkillId] ? 'Completed' : 'In Progress'
              }`
          : 'Hover over a node to see details; click to select'}
      </div>
    </div>
  )
}