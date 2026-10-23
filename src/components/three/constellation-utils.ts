import * as THREE from 'three'

// Evenly distribute nodes on a sphere using a Fibonacci spiral.
export function fibonacciSpherePoint(
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
