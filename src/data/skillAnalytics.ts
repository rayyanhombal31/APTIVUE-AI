// ---------------------------------------------------------------------------
// SAMPLE DATA — illustrative demo analytics only. None of these results come
// from real AI analysis or user data processing.
// ---------------------------------------------------------------------------

export interface SkillMetric {
  id: string
  label: string
  value: string | number
  description: string
}

export interface SkillProficiency {
  skill: string
  proficiency: number // 0-100
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'soft'
}

export interface TargetSkillComparison {
  skill: string
  required: boolean
  demonstrated: boolean
  evidence: 'strong' | 'limited' | 'none'
  gap: boolean
}

export interface StrengthItem {
  skill: string
  proficiency: number
  evidence: string
  action: string
}

export interface ImprovementItem {
  skill: string
  proficiency: number
  evidence: string
  action: string
}

export interface EvidenceSource {
  source: string
  status: 'connected' | 'available' | 'pending'
  description: string
}

export interface ProgressPoint {
  date: string
  readiness: number
}

export interface ActivityItem {
  id: string
  date: string
  type: 'interview' | 'skill' | 'project' | 'learning'
  description: string
}

// Demo readiness metrics
export const DEMO_METRICS: SkillMetric[] = [
  {
    id: 'readiness',
    label: 'Overall Job Readiness',
    value: 72,
    description: 'Composite score across all assessed dimensions',
  },
  {
    id: 'technical',
    label: 'Technical Skill Coverage',
    value: 68,
    description: 'Percentage of target role technical requirements met',
  },
  {
    id: 'interview',
    label: 'Interview Performance',
    value: 78,
    description: 'Average score across completed mock interviews',
  },
  {
    id: 'learning',
    label: 'Learning Progress',
    value: 54,
    description: 'Progress through personalized learning roadmap',
  },
]

// Demo skill proficiencies
export const DEMO_SKILL_PROFICIENCIES: SkillProficiency[] = [
  { skill: 'React', proficiency: 85, category: 'frontend' },
  { skill: 'TypeScript', proficiency: 80, category: 'frontend' },
  { skill: 'JavaScript', proficiency: 90, category: 'frontend' },
  { skill: 'Node.js', proficiency: 72, category: 'backend' },
  { skill: 'PostgreSQL', proficiency: 65, category: 'database' },
  { skill: 'REST APIs', proficiency: 78, category: 'backend' },
  { skill: 'System Design', proficiency: 58, category: 'soft' },
  { skill: 'Git', proficiency: 88, category: 'devops' },
  { skill: 'Docker', proficiency: 62, category: 'devops' },
  { skill: 'CI/CD', proficiency: 55, category: 'devops' },
  { skill: 'Communication', proficiency: 82, category: 'soft' },
  { skill: 'Problem Solving', proficiency: 76, category: 'soft' },
]

// Demo target job comparison
export const DEMO_TARGET_COMPARISON: TargetSkillComparison[] = [
  { skill: 'React', required: true, demonstrated: true, evidence: 'strong', gap: false },
  { skill: 'TypeScript', required: true, demonstrated: true, evidence: 'strong', gap: false },
  { skill: 'Node.js', required: true, demonstrated: true, evidence: 'limited', gap: true },
  { skill: 'PostgreSQL', required: true, demonstrated: true, evidence: 'limited', gap: true },
  { skill: 'System Design', required: true, demonstrated: false, evidence: 'none', gap: true },
  { skill: 'AWS / Cloud', required: true, demonstrated: false, evidence: 'none', gap: true },
  { skill: 'GraphQL', required: false, demonstrated: false, evidence: 'none', gap: false },
  { skill: 'Testing', required: true, demonstrated: false, evidence: 'none', gap: true },
  { skill: 'Docker', required: true, demonstrated: true, evidence: 'limited', gap: true },
  { skill: 'Communication', required: true, demonstrated: true, evidence: 'strong', gap: false },
]

// Demo strengths
export const DEMO_STRENGTHS: StrengthItem[] = [
  {
    skill: 'React',
    proficiency: 85,
    evidence: 'Multiple production projects, component library',
    action: 'Maintain leadership; mentor others on advanced patterns',
  },
  {
    skill: 'TypeScript',
    proficiency: 80,
    evidence: 'Full-stack type-safe codebases',
    action: 'Explore advanced type patterns (conditional, template literals)',
  },
  {
    skill: 'JavaScript',
    proficiency: 90,
    evidence: 'Deep ES6+ knowledge, performance optimization',
    action: 'Share expertise through code reviews and documentation',
  },
  {
    skill: 'Git',
    proficiency: 88,
    evidence: 'Clean history, branching strategies, conflict resolution',
    action: 'Lead team workflow improvements',
  },
  {
    skill: 'Communication',
    proficiency: 82,
    evidence: 'Technical writing, presentations, cross-functional collab',
    action: 'Take on technical lead responsibilities',
  },
]

// Demo improvements
export const DEMO_IMPROVEMENTS: ImprovementItem[] = [
  {
    skill: 'System Design',
    proficiency: 58,
    evidence: 'Few large-scale architecture examples',
    action: 'Complete system design course; document 3 architecture decisions',
  },
  {
    skill: 'AWS / Cloud',
    proficiency: 42,
    evidence: 'No production cloud deployments',
    action: 'Deploy a project to AWS; complete Cloud Practitioner cert',
  },
  {
    skill: 'Testing',
    proficiency: 48,
    evidence: 'Limited automated test coverage in projects',
    action: 'Add unit/integration tests to 2 projects; learn Playwright',
  },
  {
    skill: 'CI/CD',
    proficiency: 55,
    evidence: 'Basic GitHub Actions only',
    action: 'Build multi-stage pipeline with staging/prod environments',
  },
  {
    skill: 'Docker',
    proficiency: 62,
    evidence: 'Containerization basics only',
    action: 'Orchestrate multi-service app with Docker Compose',
  },
]

// Demo evidence sources
export const DEMO_EVIDENCE_SOURCES: EvidenceSource[] = [
  {
    source: 'Resume',
    status: 'connected',
    description: 'Parsed for skills, experience, and projects',
  },
  {
    source: 'GitHub Repositories',
    status: 'connected',
    description: '8 repositories analyzed for tech stack and patterns',
  },
  {
    source: 'Mock Interview Answers',
    status: 'available',
    description: '4 completed interviews evaluated for technical depth',
  },
  {
    source: 'Learning Roadmap',
    status: 'pending',
    description: 'Progress tracking will activate when roadmap is started',
  },
]

// Demo progress over time (last 6 weeks)
export const DEMO_PROGRESS_TREND: ProgressPoint[] = [
  { date: '2024-11-01', readiness: 58 },
  { date: '2024-11-08', readiness: 61 },
  { date: '2024-11-15', readiness: 64 },
  { date: '2024-11-22', readiness: 67 },
  { date: '2024-11-29', readiness: 70 },
  { date: '2024-12-06', readiness: 72 },
]

// Demo recent activity
export const DEMO_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    date: '2024-12-05',
    type: 'interview',
    description: 'Completed Technical Interview (82/100)',
  },
  {
    id: '2',
    date: '2024-12-03',
    type: 'skill',
    description: 'React proficiency updated: 82 → 85',
  },
  {
    id: '3',
    date: '2024-11-28',
    type: 'interview',
    description: 'Completed Behavioral Interview (75/100)',
  },
  {
    id: '4',
    date: '2024-11-25',
    type: 'project',
    description: 'Added react-ui-kit to GitHub analysis',
  },
  {
    id: '5',
    date: '2024-11-22',
    type: 'learning',
    description: 'Completed System Design fundamentals module',
  },
  {
    id: '6',
    date: '2024-11-20',
    type: 'skill',
    description: 'TypeScript proficiency updated: 78 → 80',
  },
]
