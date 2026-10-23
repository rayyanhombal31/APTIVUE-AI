import type { IconName } from './components/Icon'

export interface NavItem {
  id: string
  label: string
  description: string
  icon: IconName
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Your APTIVUE AI command center and readiness snapshot.',
    icon: 'grid',
  },
  {
    id: 'target-job',
    label: 'Target Job',
    description: 'Define and align on your target role and its requirements.',
    icon: 'target',
  },
  {
    id: 'resume-analysis',
    label: 'Resume Analysis',
    description: 'AI-powered feedback on your resume and positioning.',
    icon: 'doc',
  },
  {
    id: 'github-analysis',
    label: 'GitHub Analysis',
    description: 'Insights into your public code and open-source contributions.',
    icon: 'code',
  },
  {
    id: 'mock-interview',
    label: 'Mock Interview',
    description: 'Practice interviews with realistic, structured AI feedback.',
    icon: 'chat',
  },
  {
    id: 'skill-analytics',
    label: 'Skill Analytics',
    description: 'Measure and track your skill coverage over time.',
    icon: 'chart',
  },
  {
    id: 'learning-roadmap',
    label: 'Learning Roadmap',
    description: 'A personalized path from where you are to job-ready.',
    icon: 'map',
  },
  {
    id: 'profile-settings',
    label: 'Profile / Settings',
    description: 'Manage your profile and application preferences.',
    icon: 'user',
  },
]
