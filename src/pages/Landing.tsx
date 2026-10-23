import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Icon } from '../components/Icon'
import { DashboardPreview } from '../components/landing/DashboardPreview'
import { Hero } from '../components/landing/Hero'
import { LandingFooter } from '../components/landing/LandingFooter'
import { LandingNavbar } from '../components/landing/LandingNavbar'
import { FEATURES, STEPS } from '../data/landing'

gsap.registerPlugin(ScrollTrigger)

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
}

interface LandingProps {
  onEnterApp: () => void
}

export function Landing({ onEnterApp }: LandingProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // Hero entrance
      gsap.from('.hero [data-hero]', {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.12,
      })

      gsap.from('.hero__visual', {
        autoAlpha: 0,
        scale: 0.96,
        duration: 1.1,
        ease: 'power2.out',
        delay: 0.1,
      })

      // Scroll-triggered section reveals
      gsap.utils.toArray<HTMLElement>('[data-reveal]', rootRef.current).forEach(
        (el) => {
          gsap.from(el, {
            y: 32,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
          })
        },
      )
    },
    { scope: rootRef },
  )

  return (
    <div className="landing" ref={rootRef}>
      <LandingNavbar onNavigate={scrollToSection} onEnterApp={onEnterApp} />

      <main>
        <Hero
          onGetStarted={onEnterApp}
          onExplore={() => scrollToSection('features')}
        />

        <section className="value" id="value" data-reveal>
          <div className="value__inner">
            <h2 className="value__title">
              Understand exactly how ready you are
            </h2>
            <p className="value__copy">
              APTIVUE AI connects your target role, your resume, and your
              projects into one clear readiness picture — so you always know
              what to practice next and why it matters.
            </p>
          </div>
        </section>

        <section className="features" id="features">
          <div className="features__head" data-reveal>
            <span className="section-eyebrow">Capabilities</span>
            <h2 className="section-title">Everything you need to get job-ready</h2>
            <p className="section-subtitle">
              A focused toolkit designed around one goal: closing the gap
              between where you are and the role you want.
            </p>
          </div>
          <div className="features__grid">
            {FEATURES.map((feature) => (
              <article key={feature.id} className="feature-card" data-reveal>
                <span className="feature-card__icon">
                  <Icon name={feature.icon} size={20} />
                </span>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__desc">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="how" id="how-it-works">
          <div className="how__head" data-reveal>
            <span className="section-eyebrow">How it works</span>
            <h2 className="section-title">From first step to job-ready</h2>
          </div>
          <ol className="how__steps">
            {STEPS.map((step, i) => (
              <li key={step.id} className="step" data-reveal>
                <span className="step__number">{String(i + 1).padStart(2, '0')}</span>
                <span className="step__icon">
                  <Icon name={step.icon} size={20} />
                </span>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__desc">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="preview-section" id="preview">
          <div className="preview-section__head" data-reveal>
            <span className="section-eyebrow">Dashboard preview</span>
            <h2 className="section-title">
              A clear, focused command center
            </h2>
            <p className="section-subtitle">
              See your readiness, skill gaps, and next actions at a glance.
              Illustrative preview — not real user data.
            </p>
          </div>
          <div data-reveal>
            <DashboardPreview />
          </div>
        </section>

        <section className="final-cta" id="cta" data-reveal>
          <h2 className="final-cta__title">
            Your Next Opportunity Starts With Preparation.
          </h2>
          <p className="final-cta__copy">
            Build a clear, personalized path to the role you want — powered by
            your own skills and evidence.
          </p>
          <button
            type="button"
            className="btn btn--primary btn--lg"
            onClick={onEnterApp}
          >
            Build Your Career Readiness
            <Icon name="arrow-right" size={16} />
          </button>
        </section>
      </main>

      <LandingFooter onNavigate={scrollToSection} />
    </div>
  )
}
