import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line, OrbitControls } from '@react-three/drei'
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

// Outer group applies pointer-based parallax; inner group spins continuously.
// Also includes OrbitControls for user interaction.
function Rig({
  children,
  spinSpeed = 0.08,
}: {
  children: ReactNode
  spinSpeed?: number
}) {
  const tilt = useRef<Group>(null)
  const spin = useRef<Group>(null)
  const [userInteracting, setUserInteracting] = useState(false)

  useFrame((state, delta) => {
    if (spin.current && !userInteracting) {
      spin.current.rotation.y += delta * spinSpeed
    }
    if (tilt.current) {
      const targetX = state.pointer.y * 0.18
      const targetZ = -state.pointer.x * 0.18
      tilt.current.rotation.x += (targetX - tilt.current.rotation.x) * 0.06
      tilt.current.rotation.z += (targetZ - tilt.current.rotation.z) * 0.06
    }
  })

  return (
    <group ref={tilt} onPointerDown={() => setUserInteracting(true)} onPointerUp={() => setUserInteracting(false)}>
      <group ref={spin}>{children}</group>
    </group>
  )
}

function OrbNode({
  node,
  active,
  selected,
  onHover,
  onClick,
}: {
  node: OrbitNode
  active: boolean
  selected: boolean
  onHover: (id: string | null) => void
  onClick: (id: string) => void
}) {
  const ref = useRef<Mesh>(null)
  const baseScale = node.size ?? 0.16 + (node.level / 100) * 0.14

  useFrame(() => {
    if (!ref.current) return
    const target = active ? baseScale * 1.7 : selected ? baseScale * 1.35 : baseScale
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
      onClick={(e) => {
        e.stopPropagation()
        onClick(node.id)
      }}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={active ? 1.1 : selected ? 0.8 : 0.45}
        roughness={selected ? 0.2 : 0.3}
        metalness={selected ? 0.15 : 0.1}
      />
    </mesh>
  )
}

function CenterNode({ 
  color, 
  centerNode,
}: { 
  color: string 
  centerNode?: {
    label: string
    value: number
    color: string
  }
}) {
  if (!centerNode) {
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

  // Custom center node with readiness score display
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={centerNode.color}
          emissive={centerNode.color}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.15}
        />
      </mesh>
      <mesh scale={2.2}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color={centerNode.color}
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Inner glow sphere */}
      <mesh scale={1.2}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color={centerNode.color}
          transparent
          opacity={0.08}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

function ConnectorLines({ 
  nodes, 
  selectedId 
}: { 
  nodes: OrbitNode[] 
  selectedId: string | null 
}) {
  return (
    <>
      {nodes.map((node) => (
        <Line
          key={`line-${node.id}`}
          points={[CENTER, node.position]}
          color={node.id === selectedId ? '#ffffff' : node.color}
          lineWidth={node.id === selectedId ? 2 : 1}
          transparent
          opacity={node.id === selectedId ? 0.8 : 0.3}
          depthWrite={false}
        />
      ))}
    </>
  )
}

interface ConstellationSceneProps {
  nodes: OrbitNode[]
  accent: string
  activeId: string | null
  selectedId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
  spinSpeed?: number
  centerNode?: {
    label: string
    value: number
    color: string
  }
}

function ConstellationScene({
  nodes,
  accent,
  activeId,
  selectedId,
  onHover,
  onSelect,
  spinSpeed,
  centerNode,
}: ConstellationSceneProps) {
  return (
    <Rig spinSpeed={spinSpeed}>
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        enablePan
        enableZoom
        minZoom={0.5}
        maxZoom={3}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        autoRotate={false}
      />
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 6, 5]} intensity={1.1} />
      <pointLight
        position={[0, 0, 0.6]}
        intensity={1.5}
        distance={9}
        color={accent}
      />
      <CenterNode color={accent} centerNode={centerNode} />
      <ConnectorLines nodes={nodes} selectedId={selectedId} />
      {nodes.map((node) => (
        <OrbNode
          key={node.id}
          node={node}
          active={node.id === activeId}
          selected={node.id === selectedId}
          onHover={onHover}
          onClick={onSelect}
        />
      ))}
    </Rig>
  )
}

interface ConstellationCanvasProps {
  nodes: OrbitNode[]
  accent: string
  activeId: string | null
  selectedId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
  camera?: { position: [number, number, number]; fov?: number }
  spinSpeed?: number
  centerNode?: {
    label: string
    value: number
    color: string
  }
}

const DEFAULT_CAMERA: { position: [number, number, number]; fov: number } = {
  position: [0, 0, 7],
  fov: 45,
}

export function ConstellationCanvas({
  nodes,
  accent,
  activeId,
  selectedId = null,
  onHover,
  onSelect = () => {},
  camera,
  spinSpeed,
  centerNode,
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
        selectedId={selectedId}
        onHover={onHover}
        onSelect={onSelect}
        spinSpeed={spinSpeed}
        centerNode={centerNode}
      />
    </Canvas>
  )
}
