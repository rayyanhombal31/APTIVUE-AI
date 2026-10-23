import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import type { ReactNode } from 'react'

export interface OrbitNode {
  id: string
  label: string
  level: number
  color: string
  position: THREE.Vector3
  size?: number
}

const CENTER = new THREE.Vector3(0, 0, 0)

function OrbNode({
  node,
  active,
  onHover,
}: {
  node: OrbitNode
  active: boolean
  onHover: (id: string | null) => void
}) {
  const ref = useRef<Mesh>(null)
  const baseScale = node.size ?? 0.16 + (node.level / 100) * 0.14

  useFrame(() => {
    if (!ref.current) return
    const target = active ? baseScale * 1.7 : baseScale
    const current = ref.current.scale.x
    ref.current.scale.setScalar(current + (target - current) * 0.16)
  })

  return (
    <mesh
      ref={ref}
      position={node.position}
      scale={baseScale}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
        onHover(node.id)
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
        onHover(null)
      }}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={active ? 1.1 : 0.45}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  )
}

function CenterNode({ color }: { color: string }) {
  return (
    <>
      <mesh>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.7}
          roughness={0.2}
          metalness={0.15}
        />
      </mesh>
      <mesh scale={1.8}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  )
}

function ConnectorLines({ nodes }: { nodes: OrbitNode[] }) {
  return (
    <>
      {nodes.map((node) => (
        <Line
          key={`line-${node.id}`}
          points={[CENTER, node.position]}
          color={node.color}
          lineWidth={1}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      ))}
    </>
  )
}

// Outer group applies pointer-based parallax; inner group spins continuously.
function Rig({
  children,
  spinSpeed = 0.12,
}: {
  children: ReactNode
  spinSpeed?: number
}) {
  const tilt = useRef<Group>(null)
  const spin = useRef<Group>(null)

  useFrame((state, delta) => {
    if (spin.current) spin.current.rotation.y += delta * spinSpeed
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

interface ConstellationSceneProps {
  nodes: OrbitNode[]
  accent: string
  activeId: string | null
  onHover: (id: string | null) => void
  spinSpeed?: number
}

function ConstellationScene({
  nodes,
  accent,
  activeId,
  onHover,
  spinSpeed,
}: ConstellationSceneProps) {
  return (
    <Rig spinSpeed={spinSpeed}>
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 6, 5]} intensity={1.1} />
      <pointLight
        position={[0, 0, 0.6]}
        intensity={1.5}
        distance={9}
        color={accent}
      />
      <CenterNode color={accent} />
      <ConnectorLines nodes={nodes} />
      {nodes.map((node) => (
        <OrbNode
          key={node.id}
          node={node}
          active={node.id === activeId}
          onHover={onHover}
        />
      ))}
    </Rig>
  )
}

interface ConstellationCanvasProps {
  nodes: OrbitNode[]
  accent: string
  activeId: string | null
  onHover: (id: string | null) => void
  camera?: { position: [number, number, number]; fov?: number }
  spinSpeed?: number
}

const DEFAULT_CAMERA: { position: [number, number, number]; fov: number } = {
  position: [0, 0, 7],
  fov: 45,
}

export function ConstellationCanvas({
  nodes,
  accent,
  activeId,
  onHover,
  camera,
  spinSpeed,
}: ConstellationCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={camera ?? DEFAULT_CAMERA}
      style={{ background: 'transparent' }}
    >
      <ConstellationScene
        nodes={nodes}
        accent={accent}
        activeId={activeId}
        onHover={onHover}
        spinSpeed={spinSpeed}
      />
    </Canvas>
  )
}
