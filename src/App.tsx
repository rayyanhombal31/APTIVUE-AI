import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Mesh } from 'three'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

export default function App() {
  const meshRef = useRef<Mesh>(null)

  useGSAP(() => {
    if (!meshRef.current) return
    gsap.to(meshRef.current.rotation, {
      x: Math.PI * 4,
      y: Math.PI * 4,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    })
  }, [])

  return (
    <Canvas camera={{ position: [4, 3, 5] }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#aa3bff" />
      </mesh>
      <OrbitControls />
    </Canvas>
  )
}