export type InterviewType = 'Technical' | 'Behavioral' | 'Mixed'
export type InterviewDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type InterviewLength = 5 | 10

export interface InterviewConfig {
  type: InterviewType
  difficulty: InterviewDifficulty
  length: InterviewLength
}

export interface Question {
  id: number
  prompt: string
  hint: string
}

const QUESTION_BANK: Record<InterviewType, Question[]> = {
  Technical: [
    {
      id: 1,
      prompt:
        'Explain how React 19 concurrent features improve UI responsiveness under heavy CPU loads.',
      hint: 'Mention time slicing, non-blocking rendering, and selective hydration.',
    },
    {
      id: 2,
      prompt:
        'How do you design a high-throughput caching layer for a distributed microservices architecture?',
      hint: 'Discuss cache invalidation strategies, Redis clustering, and read-through vs write-through patterns.',
    },
    {
      id: 3,
      prompt:
        'Compare TypeScript conditional types and mapped types with practical use cases.',
      hint: 'Provide examples of transforming object keys or inferring return types.',
    },
    {
      id: 4,
      prompt:
        'Describe how you diagnose and resolve memory leaks in a large single-page web application.',
      hint: 'Mention Chrome DevTools heap snapshots, detached DOM nodes, and dangling event listeners.',
    },
    {
      id: 5,
      prompt:
        'What are the trade-offs between Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and Client-Side Rendering (CSR)?',
      hint: 'Discuss Time to First Byte (TTFB), SEO indexing, server compute cost, and edge caching.',
    },
    {
      id: 6,
      prompt:
        'Explain database indexing strategies for optimizing complex join queries on tables with millions of rows.',
      hint: 'Cover B-Trees, composite indexes, partial indexes, and execution plan analysis.',
    },
    {
      id: 7,
      prompt:
        'How would you architect a real-time collaborative editing tool supporting conflict-free replicated data types (CRDTs)?',
      hint: 'Explain state reconciliation, local-first architecture, and peer-to-peer sync vs centralized relay.',
    },
    {
      id: 8,
      prompt:
        'Discuss modern CSS layout performance considerations, including layout thrashing and GPU composite layers.',
      hint: 'Mention transform and opacity animations vs layout property changes.',
    },
    {
      id: 9,
      prompt:
        'How do you ensure robust error boundary handling and graceful degradation in React applications?',
      hint: 'Cover componentDidCatch, fallback UI trees, and async error catching.',
    },
    {
      id: 10,
      prompt:
        'Explain the principles of RESTful API design versus GraphQL when scaling enterprise systems.',
      hint: 'Compare payload over-fetching, caching layers, schema federation, and versioning.',
    },
  ],
  Behavioral: [
    {
      id: 1,
      prompt:
        'Tell me about a time you had a technical disagreement with a senior team member. How did you resolve it?',
      hint: 'Use the STAR method: Situation, Task, Action, Result. Focus on data-driven reasoning.',
    },
    {
      id: 2,
      prompt:
        'Describe a situation where a critical project deadline was at risk. What steps did you take?',
      hint: 'Discuss stakeholder communication, scope negotiation, and focused execution.',
    },
    {
      id: 3,
      prompt:
        'Give an example of when you took ownership of an ambiguous problem outside your formal responsibilities.',
      hint: 'Highlight initiative, investigation, and collaborative resolution.',
    },
    {
      id: 4,
      prompt:
        'Describe a time you received constructive feedback that challenged your approach. How did you adapt?',
      hint: 'Show emotional intelligence, openness to growth, and measurable improvement.',
    },
    {
      id: 5,
      prompt:
        'Tell me about a time you mentored a junior engineer or helped level up your team’s engineering standards.',
      hint: 'Focus on empathy, code review culture, and empowering others.',
    },
    {
      id: 6,
      prompt:
        'Describe a challenging cross-functional collaboration between engineering and product or design.',
      hint: 'Discuss empathy for different priorities, trade-off discussions, and shared goals.',
    },
    {
      id: 7,
      prompt:
        'Share an instance where you identified a significant technical debt item and successfully advocated for addressing it.',
      hint: 'Explain how you measured impact and justified refactoring time to leadership.',
    },
    {
      id: 8,
      prompt:
        'Tell me about a time a production incident occurred due to your code or team’s deployment. How did you handle it?',
      hint: 'Emphasize immediate mitigation, blameless post-mortem culture, and preventive measures.',
    },
    {
      id: 9,
      prompt:
        'Describe how you prioritize competing tasks when everything feels urgent.',
      hint: 'Discuss impact matrices, time blocking, and transparent communication with managers.',
    },
    {
      id: 10,
      prompt:
        'What is your approach to maintaining team morale and productivity during periods of rapid growth or organizational change?',
      hint: 'Highlight consistency, clarity of vision, and active listening.',
    },
  ],
  Mixed: [
    {
      id: 1,
      prompt:
        'How do you balance rapid feature delivery with maintaining high code quality and test coverage in a fast-paced product?',
      hint: 'Discuss pragmatic testing, automated CI gates, and refactoring budgets.',
    },
    {
      id: 2,
      prompt:
        'Describe a complex feature you shipped recently. What architectural decisions did you make and why?',
      hint: 'Cover trade-offs, scalability considerations, and collaboration with team members.',
    },
    {
      id: 3,
      prompt:
        'Tell me about a time you had to learn a completely new technology stack overnight to solve an urgent problem.',
      hint: 'Explain your learning strategy, documentation review, and incremental prototyping.',
    },
    {
      id: 4,
      prompt:
        'How do you approach code reviews to ensure they are both rigorous and encouraging?',
      hint: 'Focus on constructive tone, catching logic flaws early, and sharing domain knowledge.',
    },
    {
      id: 5,
      prompt:
        'Discuss a time when performance metrics or user telemetry contradicted your assumptions about a feature.',
      hint: 'Highlight data-driven pivoting, humility, and user-centric iteration.',
    },
    {
      id: 6,
      prompt:
        'How do you ensure accessibility (a11y) and inclusive design are integrated throughout your frontend development lifecycle?',
      hint: 'Mention semantic HTML, keyboard navigation, screen reader testing, and ARIA attributes.',
    },
    {
      id: 7,
      prompt:
        'Describe your strategy for managing state across large React applications without causing unnecessary re-renders.',
      hint: 'Discuss localized state, context splitting, selector memoization, and server state caching.',
    },
    {
      id: 8,
      prompt:
        'Tell me about a time you convinced stakeholders to invest in developer experience (DevEx) tooling.',
      hint: 'Quantify developer friction and potential productivity gains.',
    },
    {
      id: 9,
      prompt:
        'How do you approach securing web applications against common vulnerabilities such as XSS, CSRF, and injection attacks?',
      hint: 'Cover Content Security Policies, HttpOnly cookies, input sanitization, and parameterized queries.',
    },
    {
      id: 10,
      prompt:
        'What does engineering excellence mean to you in the context of building AI-powered products?',
      hint: 'Balance deterministic software reliability with probabilistic AI features.',
    },
  ],
}

export function getQuestions(type: InterviewType, length: InterviewLength): Question[] {
  const bank = QUESTION_BANK[type] || QUESTION_BANK.Technical
  return bank.slice(0, length)
}
