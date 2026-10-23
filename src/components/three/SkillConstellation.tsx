import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import type { ReactNode } from 'react'
import { DEMO_SKILLS } from '../../data/demoDashboard'
import type { SkillNode } from '../../data/demoDashboard'
import { useTheme } from '../../theme'

const RADIUS = 2.3
const CENTER = new THREE.Vector3(0, 0, 0)

const ACCENT_LIGHT = '#6a5be0'
const ACCENT_DARK = '#8d7bf7'

// Evenly distribute nodes on a sphere using a Fibonacci spiral.
function fibonacciSpherePoint(
  index: number,
  count: number,
  radius: number,
): THREE.Vector3 {
  const y = 1 - (2 * (index + 0.5)) / count
  const phi = Math.acos(y)
  const theta = Math.PI * (1 + Math.sqrt(5)) * index
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  )
}

const POSITIONS = DEMO_SKILLS.map((_, i) =>
  fibonacciSpherePoint(i, DEMO_SKILLS.length, RADIUS),
)

interface SkillNodeMeshProps {
  skill: SkillNode
  position: THREE.Vector3
  accent: string
  active: boolean
  onHover: (id: string | null) => void
}

function SkillNodeMesh({
  skill,
  position,
  accent,
  active,
  onHover,
}: SkillNodeMeshProps) {
  const ref = useRef<Mesh>(null)
  const baseScale = 0.16 + (skill.level / 100) * 0.14

  useFrame(() => {
    if (!ref.current) return
    const target = active ? baseScale * 1.7 : baseScale
    const current = ref.current.scale.x
    ref.current.scale.setScalar(current + (target - current) * 0.16)
  })

  return (
    <mesh
      ref={ref}
      position={position}
      scale={baseScale}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
        onHover(skill.id)
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
        onHover(null)
      }}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={accent}
        emissive={accent}
        emissiveIntensity={active ? 1.1 : 0.45}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  )
}

// Outer group applies pointer-based parallax; inner group spins continuously.
function Rig({ children }: { children: ReactNode }) {
  const tilt = useRef<Group>(null)
  const spin = useRef<Group>(null)

  useFrame((state, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 0.12
    if (tilt.current) {
      const targetX = state.pointer.y * 0.18
      const targetZ = -state.pointer.x * 0.18
      tilt.current.rotation.x += (targetX - tilt.current.rotation.x) * 0.06
      tilt.current.rotation.z += (targetZ - tilt.current.rotation.z) * 0.06
    }
  })

  return (
    <group ref={tilt}>
      <group ref={spin}>{children}</group>
    </group>
  )
}

interface SceneProps {
  accent: string
  activeId: string | null
  onHover: (id: string | null) => void
}

function ConstellationScene({ accent, activeId, onHover }: SceneProps) {
  return (
    <Rig>
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 6, 5]} intensity={1.1} />
      <pointLight
        position={[0, 0, 0.6]}
        intensity={1.5}
        distance={9}
        color={accent}
      />

      {/* Central readiness node */}
      <mesh>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.15}
        />
      </mesh>
      <mesh scale={1.8}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Connecting lines */}
      {DEMO_SKILLS.map((skill, i) => (
        <Line
          key={`line-${skill.id}`}
          points={[CENTER, POSITIONS[i]]}
          color={accent}
          lineWidth={1}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      ))}

      {/* Skill nodes */}
      {DEMO_SKILLS.map((skill, i) => (
        <SkillNodeMesh
          key={skill.id}
          skill={skill}
          position={POSITIONS[i]}
          accent={accent}
          active={skill.id === activeId}
          onHover={onHover}
        />
      ))}
    </Rig>
  )
}

export function SkillConstellation() {
  const { theme } = useTheme()
  const accent = theme === 'dark' ? ACCENT_DARK : ACCENT_LIGHT
  const [activeId, setActiveId] = useState<string | null>(null)

  const activeSkill = DEMO_SKILLS.find((skill) => skill.id === activeId) ?? null

  return (
    <div className="constellation">
      <div className="constellation__stage">
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 7], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          <ConstellationScene
            accent={accent}
            activeId={activeId}
            onHover={setActiveId}
          />
        </Canvas>
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
