import { LogoMark } from '../Logo'

const CURRENT_YEAR = new Date().getFullYear()

interface LandingFooterProps {
  onNavigate: (id: string) => void
}

export function LandingFooter({ onNavigate }: LandingFooterProps) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">
            <LogoMark size={28} />
          </span>
          <span className="footer__brand-text">
            APTIVUE
            <span className="footer__brand-suffix">AI</span>
          </span>
          <p className="footer__desc">
            An AI-powered job-readiness platform that turns your resume,
            projects, and skills into a clear path toward your next role.
          </p>
        </div>

        <nav className="footer__col" aria-label="Product">
          <span className="footer__heading">Product</span>
          <button type="button" onClick={() => onNavigate('features')}>
            Features
          </button>
          <button type="button" onClick={() => onNavigate('how-it-works')}>
            How It Works
          </button>
          <button type="button" onClick={() => onNavigate('preview')}>
            Dashboard Preview
          </button>
        </nav>

        <nav className="footer__col" aria-label="Company">
          <span className="footer__heading">Company</span>
          <button type="button" onClick={() => onNavigate('home')}>
            Home
          </button>
          <button type="button" onClick={() => onNavigate('cta')}>
            Get Started
          </button>
        </nav>
      </div>

      <div className="footer__bottom">
        <span>© {CURRENT_YEAR} APTIVUE AI. All rights reserved.</span>
      </div>
    </footer>
  )
}
