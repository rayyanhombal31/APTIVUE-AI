import type { IconName } from '../components/Icon'

export interface Feature {
  id: string
  title: string
  description: string
  icon: IconName
}

export interface Step {
  id: string
  title: string
  description: string
  icon: IconName
}

export const FEATURES: Feature[] = [
  {
    id: 'resume',
    title: 'Resume Intelligence',
    description: 'Analyze resume skills, strengths, and gaps.',
    icon: 'doc',
  },
  {
    id: 'github',
    title: 'GitHub Project Analysis',
    description: 'Discover practical skills demonstrated through repositories.',
    icon: 'code',
  },
  {
    id: 'interview',
    title: 'Personalized Mock Interviews',
    description: 'Practice role-specific questions and receive structured feedback.',
    icon: 'chat',
  },
  {
    id: 'roadmap',
    title: 'Skill Analytics & Roadmap',
    description: 'Track readiness and identify what to improve next.',
    icon: 'chart',
  },
]

export const STEPS: Step[] = [
  {
    id: 'define',
    title: 'Define your target job',
    description: 'Set the role you are aiming for and the skills it demands.',
    icon: 'target',
  },
  {
    id: 'connect',
    title: 'Upload resume & connect GitHub',
    description: 'Bring in your evidence from resumes and repositories.',
    icon: 'doc',
  },
  {
    id: 'practice',
    title: 'Practice mock interviews',
    description: 'Train with personalized questions and structured feedback.',
    icon: 'chat',
  },
  {
    id: 'review',
    title: 'Review readiness & roadmap',
    description: 'See your readiness score and what to improve next.',
    icon: 'map',
  },
]
