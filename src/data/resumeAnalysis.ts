// ---------------------------------------------------------------------------
// SAMPLE DATA — illustrative demo content only.
// None of these results are produced by real AI analysis of a resume.
// ---------------------------------------------------------------------------

export interface ResumeStrength {
  id: string
  label: string
  note: string
}

export interface SkillGroup {
  category: string
  skills: string[]
}

export const DEMO_MATCH_SCORE = 74

export const DEMO_STRENGTHS: ResumeStrength[] = [
  {
    id: 'technical',
    label: 'Technical skills',
    note: 'Solid foundation in React and modern JavaScript.',
  },
  {
    id: 'projects',
    label: 'Relevant projects',
    note: 'Multiple deployed projects demonstrating real usage.',
  },
  {
    id: 'experience',
    label: 'Experience',
    note: 'Clear progression across internships and freelance work.',
  },
  {
    id: 'structure',
    label: 'Resume structure',
    note: 'Well-organized sections with consistent formatting.',
  },
]

export const DEMO_SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Frontend',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
  },
  {
    category: 'Languages',
    skills: ['JavaScript', 'Python', 'SQL'],
  },
  {
    category: 'Tooling',
    skills: ['Git', 'Vite', 'Docker'],
  },
  {
    category: 'Soft skills',
    skills: ['Communication', 'Collaboration', 'Problem solving'],
  },
]

export const DEMO_GAPS: string[] = [
  'Cloud deployment (AWS / GCP)',
  'Automated testing',
  'System design fundamentals',
  'GraphQL APIs',
]

export const DEMO_SUGGESTIONS: string[] = [
  'Strengthen project descriptions with measurable outcomes (e.g. "improved load time by 40%").',
  'Include relevant technical skills from the target role.',
  'Improve keyword alignment with the job description.',
  'Make accomplishments more specific and quantify impact.',
]
