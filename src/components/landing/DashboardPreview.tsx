import { DEMO_METRICS } from '../../data/demoDashboard'
import { NAV_ITEMS } from '../../nav'
import { Icon } from '../Icon'
import { LogoMark } from '../Logo'

function PreviewConstellation() {
  const count = 7
  const radius = 44
  const cx = 60
  const cy = 60
  const dots = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  })

  return (
    <svg
      viewBox="0 0 120 120"
      className="preview-constellation__svg"
      aria-hidden="true"
    >
      {dots.map((dot, i) => (
        <line
          key={`line-${i}`}
          x1={cx}
          y1={cy}
          x2={dot.x}
          y2={dot.y}
          stroke="var(--accent)"
          strokeOpacity="0.3"
          strokeWidth="1"
        />
      ))}
      {dots.map((dot, i) => (
        <circle
          key={`dot-${i}`}
          cx={dot.x}
          cy={dot.y}
          r="4"
          fill="var(--accent)"
          fillOpacity="0.85"
        />
      ))}
      <circle cx={cx} cy={cy} r="7" fill="var(--accent)" />
    </svg>
  )
}

export function DashboardPreview() {
  const previewNav = NAV_ITEMS.slice(0, 5)

  return (
    <div className="preview-frame">
      <div className="preview-frame__bar">
        <span className="preview-frame__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="preview-frame__url">aptivue.ai/app</span>
      </div>

      <div className="preview-frame__body">
        <aside className="preview-sidebar" aria-hidden="true">
          <span className="preview-sidebar__logo">
            <LogoMark size={22} />
          </span>
          {previewNav.map((item) => (
            <span
              key={item.id}
              className={`preview-sidebar__icon${
                item.id === 'overview' ? ' preview-sidebar__icon--active' : ''
              }`}
            >
              <Icon name={item.icon} size={16} />
            </span>
          ))}
        </aside>

        <div className="preview-main">
          <div className="preview-main__head">
            <div className="preview-main__heading">
              <span className="preview-main__eyebrow">Overview</span>
              <span className="preview-main__title">
                Your Career Intelligence
              </span>
            </div>
            <span className="sample-tag">Sample</span>
          </div>

          <div className="preview-metrics">
            {DEMO_METRICS.map((metric) => (
              <div key={metric.id} className="preview-metric">
                <span className="preview-metric__value">{metric.value}</span>
                <span className="preview-metric__label">{metric.label}</span>
              </div>
            ))}
          </div>

          <div className="preview-constellation">
            <PreviewConstellation />
            <span className="preview-constellation__caption">
              Skill constellation — illustrative preview
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
