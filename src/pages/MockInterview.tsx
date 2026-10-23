import { useState } from 'react'
import { Icon } from '../components/Icon'
import { getQuestions } from '../data/interview'
import type { InterviewConfig, Question, InterviewDifficulty, InterviewLength, InterviewType } from '../data/interview'
import { loadTargetJob } from '../data/targetJob'
import type { TargetJobData } from '../data/targetJob'

interface MockInterviewProps {
  onNavigate: (id: string) => void
}

type Screen = 'setup' | 'interview' | 'complete' | 'feedback'

export function MockInterview({ onNavigate }: MockInterviewProps) {
  const [targetJob] = useState<TargetJobData | null>(() => loadTargetJob())
  const [screen, setScreen] = useState<Screen>('setup')
  
  // Setup configuration state
  const [config, setConfig] = useState<InterviewConfig>({
    type: 'Technical',
    difficulty: 'Intermediate',
    length: 5,
  })

  // Active interview runtime state
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({})
  const [currentText, setCurrentText] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleStart = () => {
    const list = getQuestions(config.type, config.length)
    setQuestions(list)
    setCurrentIndex(0)
    setAnswers({})
    setSubmitted({})
    setCurrentText('')
    setValidationError(null)
    setScreen('interview')
  }

  const handleSelectQuestion = (index: number) => {
    // Save current text into answers temporarily if editing
    if (questions[currentIndex]) {
      const qId = questions[currentIndex].id
      if (currentText.trim()) {
        setAnswers((prev) => ({ ...prev, [qId]: currentText }))
      }
    }
    setCurrentIndex(index)
    const nextQId = questions[index].id
    setCurrentText(answers[nextQId] ?? '')
    setValidationError(null)
  }

  const handleSaveAnswer = (isFinalForQuestion: boolean) => {
    if (!currentText.trim()) {
      setValidationError('Answer cannot be empty before submitting.')
      return
    }
    setValidationError(null)
    const qId = questions[currentIndex].id
    setAnswers((prev) => ({ ...prev, [qId]: currentText }))
    if (isFinalForQuestion) {
      setSubmitted((prev) => ({ ...prev, [qId]: true }))
    }
  }

  const handleNext = () => {
    if (currentText.trim()) {
      handleSaveAnswer(true)
    } else {
      const qId = questions[currentIndex].id
      if (!answers[qId]) {
        setValidationError('Please provide an answer or skip to navigate.')
        return
      }
    }

    if (currentIndex < questions.length - 1) {
      handleSelectQuestion(currentIndex + 1)
    } else {
      // Check if all answered or finish
      setScreen('complete')
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleSelectQuestion(currentIndex - 1)
    }
  }

  const answeredCount = Object.keys(submitted).length

  return (
    <div className="page interview-page">
      <header className="page__header">
        <p className="page__eyebrow">APTIVUE AI</p>
        <h1 className="page__title">Mock Interview</h1>
        <p className="page__desc">
          Practice interview questions tailored to your target role with realistic
          simulations and structured feedback.
        </p>
      </header>

      {/* Target Job Status Banner */}
      <section
        className={`github-card target-job-banner${
          targetJob ? '' : ' target-job-banner--empty'
        }`}
      >
        {targetJob ? (
          <>
            <span className="target-job-banner__icon">
              <Icon name="target" size={18} />
            </span>
            <div className="target-job-banner__body">
              <span className="target-job-banner__label">Target Role</span>
              <span className="target-job-banner__title">
                {targetJob.title}
                {targetJob.company ? ` · ${targetJob.company}` : ''}
              </span>
            </div>
          </>
        ) : (
          <>
            <span className="target-job-banner__icon">
              <Icon name="alert" size={18} />
            </span>
            <div className="target-job-banner__body">
              <span className="target-job-banner__label">
                No target job configured
              </span>
              <span className="target-job-banner__text">
                Configure a target job for role-specific questions, or proceed
                with a general demo interview.
              </span>
            </div>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => onNavigate('target-job')}
            >
              Configure target job
            </button>
          </>
        )}
      </section>

      {/* SETUP SCREEN */}
      {screen === 'setup' && (
        <section className="github-card interview-setup">
          <div className="github-card__head">
            <h2 className="github-card__title">Configure your mock interview</h2>
            <span className="sample-tag">Demo setup</span>
          </div>

          <div className="setup-grid">
            <div className="field">
              <label className="field__label" htmlFor="interview-type">
                Interview type
              </label>
              <select
                id="interview-type"
                className="github-select"
                value={config.type}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    type: e.target.value as InterviewType,
                  }))
                }
              >
                <option value="Technical">Technical Interview</option>
                <option value="Behavioral">Behavioral Interview</option>
                <option value="Mixed">Mixed Interview</option>
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="interview-diff">
                Difficulty level
              </label>
              <select
                id="interview-diff"
                className="github-select"
                value={config.difficulty}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    difficulty: e.target.value as InterviewDifficulty,
                  }))
                }
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="interview-len">
                Interview length
              </label>
              <select
                id="interview-len"
                className="github-select"
                value={config.length}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    length: Number(e.target.value) as InterviewLength,
                  }))
                }
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
              </select>
            </div>
          </div>

          <div className="setup-actions">
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={handleStart}
            >
              Start Interview
              <Icon name="arrow-right" size={16} />
            </button>
          </div>
        </section>
      )}

      {/* INTERVIEW SCREEN */}
      {screen === 'interview' && questions.length > 0 && (
        <div className="interview-active">
          <div className="interview-topbar">
            <div className="interview-meta">
              <span className="badge">{config.type}</span>
              <span className="badge">{config.difficulty}</span>
              <span className="interview-counter">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setScreen('setup')}
            >
              Exit Interview
            </button>
          </div>

          <div
            className="interview-progress-bar"
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={questions.length}
          >
            <div
              className="interview-progress-fill"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          <section className="github-card question-card">
            <div className="question-header">
              <span className="question-number">Question {currentIndex + 1}</span>
              {submitted[questions[currentIndex].id] && (
                <span className="sample-tag sample-tag--success">Submitted</span>
              )}
            </div>

            <h2 className="question-prompt">
              {questions[currentIndex].prompt}
            </h2>

            <div className="question-hint">
              <strong>Tip:</strong> {questions[currentIndex].hint}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="answer-area">
                Your Answer
              </label>
              <textarea
                id="answer-area"
                className="field__textarea"
                rows={7}
                value={currentText}
                onChange={(e) => {
                  setCurrentText(e.target.value)
                  setValidationError(null)
                }}
                placeholder="Type your structured answer here..."
              />
              {validationError && (
                <p className="field__error" role="alert">
                  {validationError}
                </p>
              )}
            </div>

            <div className="question-actions">
              <div className="question-actions__left">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <Icon name="chevron-left" size={16} />
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => handleSaveAnswer(true)}
                >
                  Submit / Save Answer
                </button>
              </div>

              <button
                type="button"
                className="btn btn--primary"
                onClick={handleNext}
              >
                {currentIndex === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                <Icon name="chevron-right" size={16} />
              </button>
            </div>
          </section>

          {/* Quick navigation pill bar */}
          <div className="question-pills">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(submitted[q.id])
              const isCurrent = idx === currentIndex
              return (
                <button
                  key={q.id}
                  type="button"
                  className={`q-pill${isCurrent ? ' q-pill--current' : ''}${
                    isAnswered ? ' q-pill--answered' : ''
                  }`}
                  onClick={() => handleSelectQuestion(idx)}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* COMPLETE SCREEN */}
      {screen === 'complete' && (
        <section className="github-card interview-complete">
          <div className="interview-complete__icon">
            <Icon name="check" size={32} />
          </div>
          <h2 className="interview-complete__title">Interview Completed!</h2>
          <p className="interview-complete__subtitle">
            You successfully navigated through all {questions.length} questions.
          </p>

          <div className="complete-summary">
            <div className="complete-summary__row">
              <span>Interview Type</span>
              <strong>{config.type}</strong>
            </div>
            <div className="complete-summary__row">
              <span>Difficulty</span>
              <strong>{config.difficulty}</strong>
            </div>
            <div className="complete-summary__row">
              <span>Questions Answered</span>
              <strong>
                {answeredCount} / {questions.length}
              </strong>
            </div>
            <div className="complete-summary__row">
              <span>Target Role</span>
              <strong>{targetJob ? targetJob.title : 'General Demo Role'}</strong>
            </div>
          </div>

          <div className="complete-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setScreen('feedback')}
            >
              View Demo Feedback
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setScreen('setup')}
            >
              Start New Interview
            </button>
          </div>
        </section>
      )}

      {/* FEEDBACK SCREEN */}
      {screen === 'feedback' && (
        <div className="interview-feedback">
          <div className="github-results__bar">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setScreen('complete')}
            >
              Back to Summary
            </button>
            <span className="sample-tag">Demo / Sample Feedback</span>
          </div>

          <section className="github-card feedback-score-card">
            <div className="feedback-score__main">
              <span className="feedback-score__num">82</span>
              <span className="feedback-score__max">/ 100</span>
            </div>
            <div className="feedback-score__details">
              <h2 className="github-card__title">Overall Demo Evaluation</h2>
              <p className="feedback-score__note">
                Simulated heuristic score based on response length and keyword coverage.
              </p>
            </div>
          </section>

          <div className="resume-grid">
            <section className="github-card">
              <h2 className="github-card__title">Sub-Scores</h2>
              <div className="subscores-list">
                <div className="subscore-row">
                  <span>Communication Clarity</span>
                  <strong>85%</strong>
                </div>
                <div className="subscore-row">
                  <span>Technical Relevance</span>
                  <strong>78%</strong>
                </div>
                <div className="subscore-row">
                  <span>Answer Structure (STAR / Logical)</span>
                  <strong>83%</strong>
                </div>
              </div>
            </section>

            <section className="github-card">
              <h2 className="github-card__title">Key Strengths</h2>
              <ul className="resume-gaps__list">
                <li className="resume-gaps__item">
                  <Icon name="check" size={15} />
                  Clear breakdown of technical trade-offs.
                </li>
                <li className="resume-gaps__item">
                  <Icon name="check" size={15} />
                  Good usage of structured examples.
                </li>
              </ul>
            </section>
          </div>

          <section className="github-card">
            <div className="github-card__head">
              <h2 className="github-card__title">Areas for Improvement</h2>
              <span className="sample-tag">Sample data</span>
            </div>
            <ul className="resume-gaps__list">
              <li className="resume-gaps__item">
                <Icon name="alert" size={15} />
                Expand more on edge-case error handling in technical answers.
              </li>
              <li className="resume-gaps__item">
                <Icon name="alert" size={15} />
                Quantify impact and metrics more clearly in behavioral examples.
              </li>
            </ul>
          </section>
        </div>
      )}
    </div>
  )
}
