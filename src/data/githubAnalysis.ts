// ---------------------------------------------------------------------------
// SAMPLE DATA — illustrative demo analysis only. None of these results come
// from real source-code inspection or AI analysis.
// ---------------------------------------------------------------------------

export interface SkillEvidence {
  skill: string
  project: string
  note: string
}

export const DEMO_SKILLS_IDENTIFIED: string[] = [
  'React',
  'TypeScript',
  'Node.js',
  'PostgreSQL',
  'REST APIs',
  'Git',
]

export const DEMO_SKILL_EVIDENCE: SkillEvidence[] = [
  {
    skill: 'React',
    project: 'react-ui-kit',
    note: 'Component library demonstrates advanced React patterns and hooks.',
  },
  {
    skill: 'TypeScript',
    project: 'job-tracker',
    note: 'Strong static typing across the full-stack codebase.',
  },
  {
    skill: 'Node.js',
    project: 'rest-api-boilerplate',
    note: 'REST API server with middleware, validation, and error handling.',
  },
  {
    skill: 'PostgreSQL',
    project: 'data-pipeline',
    note: 'Schema design and complex queries in the ETL pipeline.',
  },
  {
    skill: 'REST APIs',
    project: 'rest-api-boilerplate',
    note: 'RESTful endpoints with validation and pagination.',
  },
  {
    skill: 'Git',
    project: 'Multiple repositories',
    note: 'Consistent commit history and branching across projects.',
  },
]

export const DEMO_RELEVANT_SKILLS: string[] = ['React', 'TypeScript', 'REST APIs']

export const DEMO_LIMITED_EVIDENCE: string[] = ['Node.js', 'PostgreSQL']

export const DEMO_GAPS: string[] = [
  'Cloud deployment (AWS / GCP)',
  'Automated testing',
  'GraphQL APIs',
]

export const DEMO_SUGGESTIONS: string[] = [
  'Add a CI/CD pipeline to a project to demonstrate deployment skills.',
  'Add automated tests to showcase quality practices.',
  'Document architecture decisions in a repository README.',
]
