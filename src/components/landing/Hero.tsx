import { Icon } from '../Icon'
import { HeroConstellation } from '../three/HeroConstellation'

interface HeroProps {
  onGetStarted: () => void
  onExplore: () => void
}

export function Hero({ onGetStarted, onExplore }: HeroProps) {
  return (
    <section className="hero" id="home">
      <div className="hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow" data-hero>
            AI-powered career readiness
          </span>
          <h1 className="hero__title" data-hero>
            Know Your Skills.
            <br />
            <span className="hero__title-accent">Prove Your Potential.</span>
          </h1>
          <p className="hero__subtitle" data-hero>
            Turn your resume, projects, and skills into a clear path toward
            career readiness. Practice smarter with personalized AI interviews
            and actionable feedback.
          </p>
          <div className="hero__actions" data-hero>
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={onGetStarted}
            >
              Start Your Journey
              <Icon name="arrow-right" size={16} />
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--lg"
              onClick={onExplore}
            >
              Explore Features
            </button>
          </div>
          <p className="hero__trust" data-hero>
            Built for students, graduates, and ambitious professionals.
          </p>
        </div>

        <div className="hero__visual">
          <HeroConstellation />
        </div>
      </div>
    </section>
  )
}
