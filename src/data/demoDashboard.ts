import type { IconName } from '../components/Icon'

export interface TargetJob {
  title: string
  level: string
}

export interface Metric {
  id: string
  label: string
  value: string
  hint: string
  icon: IconName
}

export interface SkillNode {
  id: string
  label: string
  level: number
}

export interface AssessmentItem {
  id: string
  label: string
  note: string
}

// ---------------------------------------------------------------------------
// SAMPLE DATA — illustrative demo values only.
// None of these are real, AI-generated results.
// ---------------------------------------------------------------------------

export const DEMO_TARGET_JOB: TargetJob | null = {
  title: 'Frontend Engineer',
  level: 'Mid-level',
}

export const DEMO_METRICS: Metric[] = [
  {
    id: 'readiness',
    label: 'Readiness score',
    value: '72',
    hint: 'out of 100',
    icon: 'target',
  },
  {
    id: 'interviews',
    label: 'Mock interviews',
    value: '4',
    hint: 'completed',
    icon: 'chat',
  },
  {
    id: 'skills',
    label: 'Skills assessed',
    value: '18',
    hint: 'across 6 areas',
    icon: 'chart',
  },
  {
    id: 'roadmap',
    label: 'Roadmap progress',
    value: '38%',
    hint: 'of your plan',
    icon: 'map',
  },
]

export const DEMO_SKILLS: SkillNode[] = [
  { id: 'frontend', label: 'Frontend Engineering', level: 82 },
  { id: 'typescript', label: 'TypeScript', level: 76 },
  { id: 'communication', label: 'Communication', level: 88 },
  { id: 'problem-solving', label: 'Problem Solving', level: 71 },
  { id: 'data-structures', label: 'Data Structures', level: 64 },
  { id: 'system-design', label: 'System Design', level: 58 },
  { id: 'devops', label: 'DevOps & CI/CD', level: 49 },
]

export const DEMO_STRENGTHS: AssessmentItem[] = [
  {
    id: 'frontend',
    label: 'Frontend Engineering',
    note: 'Consistent, well-structured contributions.',
  },
  {
    id: 'communication',
    label: 'Communication',
    note: 'Clear written and verbal signals.',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    note: 'Strong typing and API design habits.',
  },
]

export const DEMO_IMPROVEMENTS: AssessmentItem[] = [
  {
    id: 'system-design',
    label: 'System Design',
    note: 'Fewer large-scale architecture examples.',
  },
  {
    id: 'devops',
    label: 'DevOps & CI/CD',
    note: 'Limited pipeline and deployment coverage.',
  },
  {
    id: 'data-structures',
    label: 'Data Structures',
    note: 'Gaps in advanced graph algorithms.',
  },
]
