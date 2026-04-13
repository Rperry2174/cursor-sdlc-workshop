import { getAsset } from '../assets.js'
import { SLIDE_TYPES } from '../blockTypes.js'
import { toneColor } from '../theme.js'
import {
  renderPptSafeBrowserDemo,
  renderPptSafePhaseDeepDive,
  renderPptSafeSdlcOverview,
  renderPptSafeTakeaway,
  renderPptSafeTitleHero,
  renderPptSafeWorkflowCompare,
  renderPptSafeWorkflowColumns,
} from './reactPptSafe.jsx'

const highlightClassByTone = {
  section1: 'highlight-green',
  section2: 'highlight-orange',
  section3: 'highlight-purple',
  plan: 'highlight-green',
  design: 'highlight-purple',
  develop: 'highlight',
  test: 'highlight-orange',
  review: 'highlight-green',
  deploy: 'highlight-red',
  monitor: 'highlight',
}

function getMediaSrc(assetKey) {
  const asset = getAsset(assetKey)
  return asset?.browserSrc ?? ''
}

function renderTitleWithHighlight({ title, titleHighlight, titleTail, tone = 'develop' }) {
  const highlightClass = highlightClassByTone[tone] ?? 'highlight'

  return (
    <>
      {title}
      {titleHighlight ? <span className={highlightClass}>{titleHighlight}</span> : null}
      {titleTail}
    </>
  )
}

function FlowSlide({ children }) {
  return <div className="slide-flow-content">{children}</div>
}

function SectionHeader({ slide }) {
  if (!slide.section) return null

  return (
    <div className="section-header">
      <span className={`section-badge ${slide.section.tone}`}>{slide.section.badge}</span>
      {slide.phaseBadge ? <span className="phase-badge">{slide.phaseBadge}</span> : null}
    </div>
  )
}

function PhaseHeader({ slide, compact = false, allowThumbnail = false }) {
  if (!slide.phase) return null

  const phaseClassName = slide.phase.tone === 'monitor' ? 'phase-number' : `phase-number ${slide.phase.tone}`
  const phaseStyle =
    slide.phase.tone === 'monitor' ? { background: 'var(--yellow)' } : undefined

  return (
    <>
      {allowThumbnail && slide.media?.variant === 'thumbnail' ? (
        <div style={{ marginBottom: '0.75rem' }}>
          <img
            src={getMediaSrc(slide.media.asset)}
            alt={getAsset(slide.media.asset)?.alt ?? slide.title}
            style={{
              width: '140px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              display: 'block',
            }}
          />
        </div>
      ) : null}
      <div className="phase-header" style={compact ? { marginBottom: 0 } : undefined}>
        <div className={phaseClassName} style={phaseStyle}>
          {slide.phase.number}
        </div>
        <h2 style={compact ? { marginBottom: 0 } : undefined}>{slide.title}</h2>
      </div>
      {slide.subtitle ? (
        <p className="small" style={{ marginBottom: '0.75rem' }}>
          {slide.subtitle}
        </p>
      ) : null}
    </>
  )
}

function EmphasisBox({ emphasis, centered = false }) {
  if (!emphasis) return null

  const classNames = ['emphasis-box']
  if (emphasis.tone === 'green') classNames.push('green')
  if (emphasis.tone === 'orange') classNames.push('orange')
  if (emphasis.tone === 'purple') classNames.push('purple')

  return (
    <div className={classNames.join(' ')} style={centered ? { textAlign: 'center' } : undefined}>
      {emphasis.label ? <strong>{emphasis.label}</strong> : null}
      {emphasis.label ? ' ' : null}
      {emphasis.body}
    </div>
  )
}

function HeroCallout({ hero }) {
  if (!hero) return null

  return (
    <div className="hero-callout">
      <div className="hero-text">
        {hero.lead}
        <span className="hero-highlight">{hero.highlight}</span>
        {hero.tail}
      </div>
    </div>
  )
}

function ToolPills({ items, tone }) {
  if (!items?.length) return null

  return (
    <div className="tool-pills" style={{ marginTop: 0 }}>
      {items.map((item) => (
        <span
          key={item}
          className="tool-pill"
          style={
            tone
              ? {
                  background: `${toneColor(tone)}1F`,
                  borderColor: `${toneColor(tone)}4D`,
                  color: toneColor(tone),
                }
              : undefined
          }
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function DiscoveryGroups({ discovery }) {
  if (!discovery) return null

  return (
    <div
      className="emphasis-box"
      style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
    >
      <strong>{discovery.label}</strong>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${discovery.groups.length}, 1fr)`, gap: '0.75rem' }}>
        {discovery.groups.map((group) => (
          <div key={group.label}>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--text-secondary)',
                marginBottom: '0.35rem',
              }}
            >
              {group.label}
            </div>
            <ToolPills items={group.items} />
          </div>
        ))}
      </div>
    </div>
  )
}

function BrowserShell({ children, url = 'localhost:5173', maxWidth = '700px' }) {
  return (
    <div
      style={{
        border: '1px solid var(--border-strong)',
        borderRadius: '10px',
        overflow: 'hidden',
        maxWidth,
        margin: '0 auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      }}
    >
      <div
        style={{
          background: '#f0f0f0',
          padding: '0.5rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div
          style={{
            flex: 1,
            background: 'white',
            borderRadius: '6px',
            padding: '0.25rem 0.6rem',
            fontSize: '0.65rem',
            color: 'var(--text-secondary)',
            fontFamily: "'Inter', sans-serif",
            border: '1px solid var(--border-subtle)',
          }}
        >
          {url}
        </div>
      </div>
      {children}
    </div>
  )
}

function FlappyBirdMock({ score = '7' }) {
  return (
    <BrowserShell>
      <div
        style={{
          background: 'linear-gradient(180deg, #4ec5f1 0%, #4ec5f1 60%, #8bc34a 60%, #689f38 100%)',
          height: '320px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ position: 'absolute', top: 30, left: 60, fontSize: '2rem', opacity: 0.6 }}>&#9729;</div>
        <div style={{ position: 'absolute', top: 50, right: 80, fontSize: '1.5rem', opacity: 0.4 }}>&#9729;</div>
        <div style={{ position: 'absolute', top: 15, left: '45%', fontSize: '1.8rem', opacity: 0.5 }}>&#9729;</div>

        <div style={{ position: 'absolute', left: 120, top: 0, width: 40, height: 80, background: '#4caf50', borderRadius: '0 0 4px 4px', border: '2px solid #388e3c' }} />
        <div style={{ position: 'absolute', left: 120, bottom: 64, width: 40, height: 100, background: '#4caf50', borderRadius: '4px 4px 0 0', border: '2px solid #388e3c' }} />
        <div style={{ position: 'absolute', left: 320, top: 0, width: 40, height: 140, background: '#4caf50', borderRadius: '0 0 4px 4px', border: '2px solid #388e3c' }} />
        <div style={{ position: 'absolute', left: 320, bottom: 64, width: 40, height: 60, background: '#4caf50', borderRadius: '4px 4px 0 0', border: '2px solid #388e3c' }} />
        <div style={{ position: 'absolute', left: 520, top: 0, width: 40, height: 50, background: '#4caf50', borderRadius: '0 0 4px 4px', border: '2px solid #388e3c' }} />
        <div style={{ position: 'absolute', left: 520, bottom: 64, width: 40, height: 130, background: '#4caf50', borderRadius: '4px 4px 0 0', border: '2px solid #388e3c' }} />

        <div
          style={{
            position: 'absolute',
            left: 200,
            top: 110,
            width: 36,
            height: 28,
            background: '#fdd835',
            borderRadius: '50%',
            border: '2px solid #f9a825',
            zIndex: 2,
          }}
        >
          <div style={{ position: 'absolute', right: 4, top: 5, width: 8, height: 8, background: 'white', borderRadius: '50%', border: '1.5px solid #333' }}>
            <div style={{ position: 'absolute', right: 1, top: 2, width: 3, height: 3, background: '#333', borderRadius: '50%' }} />
          </div>
          <div style={{ position: 'absolute', right: -8, top: 12, width: 10, height: 6, background: '#ff7043', borderRadius: '2px', border: '1px solid #e64a19' }} />
          <div style={{ position: 'absolute', left: 4, top: 12, width: 12, height: 8, background: '#ffee58', borderRadius: '50%', border: '1.5px solid #f9a825' }} />
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, background: '#8bc34a', borderTop: '3px solid #689f38' }}>
          <div style={{ position: 'absolute', top: 8, left: 0, right: 0, display: 'flex', gap: 20, paddingLeft: 10 }}>
            {[...Array(20)].map((_, index) => (
              <div key={index} style={{ width: 3, height: 12, background: '#689f38', borderRadius: 1, opacity: 0.5 }} />
            ))}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'white',
            textShadow: '2px 2px 0 rgba(0,0,0,0.2)',
            fontFamily: "'Inter', sans-serif",
            zIndex: 3,
          }}
        >
          {score}
        </div>
      </div>
    </BrowserShell>
  )
}

function PacmanBase({ powerUp = false, score = '1280', badge = null, timer = null }) {
  return (
    <BrowserShell maxWidth="680px">
      <div
        style={{
          background: '#000',
          height: '300px',
          position: 'relative',
          overflow: 'hidden',
          padding: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: "'Courier New', monospace",
            fontSize: '0.75rem',
            marginBottom: '8px',
          }}
        >
          <div>
            <div style={{ color: '#fff', letterSpacing: '2px' }}>SCORE</div>
            <div style={{ color: powerUp ? '#ffeb3b' : '#fff', fontWeight: 700 }}>{score}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            {powerUp ? (
              <>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #ff6f00, #ffab00)',
                    color: '#000',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    padding: '0.15rem 0.75rem',
                    borderRadius: '6px',
                    letterSpacing: '1px',
                    boxShadow: '0 0 10px rgba(255, 171, 0, 0.35)',
                  }}
                >
                  {badge}
                </div>
                <div style={{ color: '#ffab00', fontSize: '0.55rem', marginTop: '2px' }}>{timer}</div>
              </>
            ) : (
              <>
                <div style={{ color: '#fff', letterSpacing: '2px' }}>HIGH SCORE</div>
                <div style={{ color: '#fff', fontWeight: 700 }}>5000</div>
              </>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#fff', letterSpacing: '2px' }}>LIVES</div>
            <div style={{ color: '#ffeb3b', fontSize: '1rem' }}>&#9679; &#9679; &#9679;</div>
          </div>
        </div>

        <svg viewBox="0 0 400 210" style={{ width: '100%', height: '210px' }}>
          <rect x="4" y="4" width="392" height="202" rx="6" fill="none" stroke="#1a1aff" strokeWidth="3" />
          <rect x="40" y="30" width="60" height="20" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />
          <rect x="130" y="30" width="50" height="20" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />
          <rect x="220" y="30" width="50" height="20" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />
          <rect x="300" y="30" width="60" height="20" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />
          <rect x="40" y="70" width="30" height="50" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />
          <rect x="100" y="70" width="80" height="20" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />
          <rect x="220" y="70" width="80" height="20" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />
          <rect x="330" y="70" width="30" height="50" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />
          <rect x="100" y="110" width="30" height="40" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />
          <rect x="270" y="110" width="30" height="40" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />
          <rect x="40" y="160" width="60" height="20" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />
          <rect x="160" y="160" width="80" height="20" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />
          <rect x="300" y="160" width="60" height="20" rx="4" fill="none" stroke="#1a1aff" strokeWidth="2.5" />

          {powerUp
            ? [280, 320].map((x) => <circle key={`d1-${x}`} cx={x} cy={62} r="2" fill="#ffb8ae" />)
            : [80, 120, 160, 200, 240, 280, 320].map((x) => (
                <circle key={`d1-${x}`} cx={x} cy={62} r="2" fill="#ffb8ae" />
              ))}
          {powerUp
            ? [320, 380].map((x) => <circle key={`d2-${x}`} cx={x} cy={100} r="2" fill="#ffb8ae" />)
            : [20, 80, 160, 200, 320, 380].map((x) => (
                <circle key={`d2-${x}`} cx={x} cy={100} r="2" fill="#ffb8ae" />
              ))}
          {powerUp
            ? [240, 320, 380].map((x) => <circle key={`d3-${x}`} cx={x} cy={140} r="2" fill="#ffb8ae" />)
            : [20, 80, 160, 240, 320, 380].map((x) => (
                <circle key={`d3-${x}`} cx={x} cy={140} r="2" fill="#ffb8ae" />
              ))}

          <circle cx="20" cy="20" r="5" fill="#ffb8ae" />
          {!powerUp ? <circle cx="380" cy="20" r="5" fill="#ffb8ae" /> : null}
          <circle cx="20" cy="190" r="5" fill="#ffb8ae" />
          <circle cx="380" cy="190" r="5" fill="#ffb8ae" />

          <path
            d={powerUp ? 'M 245 100 L 258 91 A 14 14 0 1 0 258 109 Z' : 'M 195 100 L 208 91 A 14 14 0 1 0 208 109 Z'}
            fill="#ffeb3b"
          />

          {powerUp ? (
            <text x="220" y="88" fill="#ffab00" fontSize="10" fontWeight="900" fontFamily="Courier New">
              +20
            </text>
          ) : null}

          {powerUp ? (
            <>
              <g transform="translate(310, 90)">
                <path d="M 0 14 L 0 4 Q 0 -4 8 -4 L 8 -4 Q 16 -4 16 4 L 16 14 L 13 11 L 10 14 L 7 11 L 4 14 L 0 14" fill="#2222ff" />
                <rect x="3" y="2" width="4" height="2" rx="0.5" fill="white" />
                <rect x="9" y="2" width="4" height="2" rx="0.5" fill="white" />
                <path d="M 3 8 L 5 6 L 7 8 L 9 6 L 11 8 L 13 6" fill="none" stroke="white" strokeWidth="1" />
              </g>
              <g transform="translate(340, 140)">
                <path d="M 0 14 L 0 4 Q 0 -4 8 -4 L 8 -4 Q 16 -4 16 4 L 16 14 L 13 11 L 10 14 L 7 11 L 4 14 L 0 14" fill="#2222ff" />
                <rect x="3" y="2" width="4" height="2" rx="0.5" fill="white" />
                <rect x="9" y="2" width="4" height="2" rx="0.5" fill="white" />
                <path d="M 3 8 L 5 6 L 7 8 L 9 6 L 11 8 L 13 6" fill="none" stroke="white" strokeWidth="1" />
              </g>
              <g transform="translate(350, 60)">
                <path d="M 0 14 L 0 4 Q 0 -4 8 -4 L 8 -4 Q 16 -4 16 4 L 16 14 L 13 11 L 10 14 L 7 11 L 4 14 L 0 14" fill="#2222ff" />
                <rect x="3" y="2" width="4" height="2" rx="0.5" fill="white" />
                <rect x="9" y="2" width="4" height="2" rx="0.5" fill="white" />
                <path d="M 3 8 L 5 6 L 7 8 L 9 6 L 11 8 L 13 6" fill="none" stroke="white" strokeWidth="1" />
              </g>
            </>
          ) : (
            <>
              <g transform="translate(260, 90)">
                <path d="M 0 14 L 0 4 Q 0 -4 8 -4 L 8 -4 Q 16 -4 16 4 L 16 14 L 13 11 L 10 14 L 7 11 L 4 14 L 0 14" fill="#ff0000" />
                <circle cx="5" cy="3" r="3" fill="white" />
                <circle cx="11" cy="3" r="3" fill="white" />
                <circle cx="4" cy="3" r="1.5" fill="#111" />
                <circle cx="10" cy="3" r="1.5" fill="#111" />
              </g>
              <g transform="translate(290, 130)">
                <path d="M 0 14 L 0 4 Q 0 -4 8 -4 L 8 -4 Q 16 -4 16 4 L 16 14 L 13 11 L 10 14 L 7 11 L 4 14 L 0 14" fill="#ffb8ff" />
                <circle cx="5" cy="3" r="3" fill="white" />
                <circle cx="11" cy="3" r="3" fill="white" />
                <circle cx="6" cy="3" r="1.5" fill="#111" />
                <circle cx="12" cy="3" r="1.5" fill="#111" />
              </g>
              <g transform="translate(150, 130)">
                <path d="M 0 14 L 0 4 Q 0 -4 8 -4 L 8 -4 Q 16 -4 16 4 L 16 14 L 13 11 L 10 14 L 7 11 L 4 14 L 0 14" fill="#00ffff" />
                <circle cx="5" cy="3" r="3" fill="white" />
                <circle cx="11" cy="3" r="3" fill="white" />
                <circle cx="4" cy="3" r="1.5" fill="#111" />
                <circle cx="10" cy="3" r="1.5" fill="#111" />
              </g>
            </>
          )}
        </svg>
      </div>
    </BrowserShell>
  )
}

function renderBrowserMock(browserMock) {
  if (!browserMock) return null
  if (browserMock.variant === 'flappyBird') return <FlappyBirdMock score={browserMock.score} />
  if (browserMock.variant === 'pacmanPowerUp') {
    return <PacmanBase powerUp score={browserMock.score} badge={browserMock.badge} timer={browserMock.timer} />
  }
  return <PacmanBase score={browserMock.score} />
}

function renderChecklistGroups(slide) {
  const body = (
    <div className="checklist">
      {slide.checklistGroups.map((group, groupIndex) => {
        if (group.tone === 'plain') {
          return (
            <div key={groupIndex} className="checklist">
              {group.items.map((item, itemIndex) => renderChecklistItem(item, itemIndex))}
            </div>
          )
        }

        const groupClassNames = ['check-group']
        if (group.tone) groupClassNames.push(group.tone)
        if (group.sectionTone) groupClassNames.push(group.sectionTone)

        return (
          <div key={group.label ?? groupIndex} className={groupClassNames.join(' ')}>
            {group.label ? <div className="check-group-label">{group.label}</div> : null}
            {group.items.map((item, itemIndex) => renderChecklistItem(item, itemIndex))}
          </div>
        )
      })}
    </div>
  )

  return slide.scrollable ? <div className="scrollable">{body}</div> : body
}

function renderChecklistItem(item, key) {
  const hasCode = item.codeLines?.length

  return (
    <div key={key} className={`check-item${hasCode ? ' has-code' : ''}`}>
      <div className="check-header">
        <div className="check-box" />
        <div>
          <strong>{item.title}</strong>
          {item.detail ? ` - ${item.detail}` : null}
          {item.body ? ` ${item.body}` : null}
        </div>
      </div>
      {hasCode ? (
        <div className="code-block">
          <code>
            {item.codeComment ? <span className="comment">{item.codeComment}</span> : null}
            {item.codeComment ? <br /> : null}
            {item.codeLines.map((line, index) => (
              <span key={index}>
                {line}
                {index < item.codeLines.length - 1 ? <br /> : null}
              </span>
            ))}
          </code>
        </div>
      ) : null}
    </div>
  )
}

function renderSdlcOverview(slide) {
  const renderPhaseItem = (phase, isActive = false, dimmed = false) => (
    <div
      key={phase.name}
      className="sdlc-item"
      style={{
        opacity: dimmed ? 0.35 : 1,
        border: isActive ? `2px solid ${toneColor(phase.tone)}` : undefined,
        boxShadow: isActive ? `0 4px 20px ${toneColor(phase.tone)}22` : undefined,
        transform: isActive ? 'scale(1.04)' : undefined,
      }}
    >
      <div className="sdlc-icon" style={isActive ? { color: toneColor(phase.tone), opacity: 1 } : undefined}>
        {phase.num}
      </div>
      <div className="sdlc-name" style={isActive ? { color: toneColor(phase.tone) } : undefined}>
        {phase.name}
      </div>
      {phase.subcategories ? (
        phase.subcategories.map((subcategory) => (
          <div key={subcategory.label}>
            <div className="tool-subcategory">{subcategory.label}</div>
            <ToolPills items={subcategory.tools} />
          </div>
        ))
      ) : (
        <ToolPills items={phase.tools} />
      )}
    </div>
  )

  const highlight = slide.highlight
  const isHighlightMode = Boolean(highlight)

  return (
    <>
      <h2>{slide.title}</h2>
      <div className="sdlc-flow">
        {slide.sdlcPhases.map((phase, index) => {
          const isActive = isHighlightMode && phase.name === highlight
          const dimmed = isHighlightMode && !isActive && highlight !== 'Monitor'

          return (
            <span key={phase.name} style={{ display: 'contents' }}>
              {renderPhaseItem(phase, isActive, dimmed)}
              {index < slide.sdlcPhases.length - 1 ? (
                <div className="sdlc-arrow" style={{ opacity: dimmed ? 0.25 : 0.6 }}>
                  →
                </div>
              ) : null}
            </span>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', paddingRight: '1rem' }}>
        <div
          className="sdlc-item"
          style={
            isHighlightMode && highlight === 'Monitor'
              ? {
                  border: `2px solid ${toneColor('monitor')}`,
                  boxShadow: `0 4px 20px ${toneColor('monitor')}22`,
                  transform: 'scale(1.04)',
                }
              : {
                  opacity: isHighlightMode ? 0.25 : 0.7,
                  borderStyle: 'dashed',
                }
          }
        >
          <div className="sdlc-icon" style={highlight === 'Monitor' ? { color: toneColor('monitor'), opacity: 1 } : undefined}>
            {slide.monitorPhase.num}
          </div>
          <div className="sdlc-name" style={highlight === 'Monitor' ? { color: toneColor('monitor') } : undefined}>
            {slide.monitorPhase.name}
          </div>
          <ToolPills items={slide.monitorPhase.tools} />
        </div>
      </div>

      {slide.footerCallout ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1rem' }}>
          <strong>{slide.footerCallout}</strong>
        </p>
      ) : null}

      {slide.footerText ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '0.75rem', fontSize: '1.1rem' }}>
          {slide.footerText}{' '}
          <strong style={{ color: toneColor(slide.highlight.toLowerCase()) }}>{slide.highlight}</strong>
        </p>
      ) : null}
    </>
  )
}

function renderPhaseDeepDive(slide) {
  const accent = toneColor(slide.phase.tone)

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: `2px solid ${accent}26`,
        }}
      >
        <div>
          <PhaseHeader slide={slide} compact />
          <p className="small" style={{ marginBottom: 0 }}>
            {slide.subtitle}
          </p>
        </div>
        {slide.headerPill ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.75rem',
              background: `linear-gradient(135deg, ${accent}1A, ${accent}0A)`,
              border: `1px solid ${accent}33`,
              borderRadius: '100px',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>{slide.headerPill.icon}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: accent, letterSpacing: '0.5px' }}>
              {slide.headerPill.text}
            </span>
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 60px 1fr',
          alignItems: 'stretch',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <h3 style={{ color: accent, marginBottom: 0, fontSize: '1rem' }}>Discovery Questions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {slide.discoveryQuestions.map((question, index) => (
              <div key={question} className="discovery-card" style={{ borderLeft: `3px solid ${accent}`, padding: '0.55rem 0.75rem', minHeight: '58px', display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: accent,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
                <span className="dq-text" style={{ fontSize: '0.9rem' }}>
                  {question}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            paddingTop: '2rem',
          }}
        >
          <div style={{ width: '2px', flex: 1, background: `linear-gradient(to bottom, transparent, ${accent}4D, ${accent}4D, transparent)` }} />
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${accent}22, ${accent}10)`,
              border: `2px solid ${accent}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0,
            }}
          >
            →
          </div>
          <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.5px', color: accent, textAlign: 'center', lineHeight: 1.3, maxWidth: '55px', textTransform: 'uppercase' }}>
            {slide.connectorLabel}
          </div>
          <div style={{ width: '2px', flex: 1, background: `linear-gradient(to bottom, transparent, ${accent}4D, ${accent}4D, transparent)` }} />
        </div>

        <div>
          <h3 style={{ color: accent, marginBottom: '0.6rem', fontSize: '1rem' }}>Common Pain Points</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {slide.painPoints.map((pain) => (
              <div key={pain.label} className="pain-item" style={{ borderLeftColor: accent, borderColor: `${accent}26`, background: `linear-gradient(135deg, ${accent}12, ${accent}06)` }}>
                <span className="pain-icon" style={{ fontSize: '1.1rem' }}>
                  {pain.icon}
                </span>
                <span className="pain-text" style={{ fontSize: '0.9rem' }}>
                  <strong style={{ color: accent }}>{pain.label}</strong>
                  {' - '}
                  {pain.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {slide.footerCallout ? (
        <div
          style={{
            marginTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.6rem 0.85rem',
            background: `linear-gradient(135deg, ${accent}14, ${accent}06)`,
            border: `1px solid ${accent}33`,
            borderRadius: '8px',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>💡</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            {slide.footerCallout}
          </span>
        </div>
      ) : null}
    </>
  )
}

function renderPhaseDeepDiveSplit(slide) {
  const accent = toneColor(slide.phase.tone)

  return (
    <>
      <PhaseHeader slide={slide} />
      <div className="deepdive-cols">
        <div className="deepdive-col">
          <h3 style={{ color: accent }}>Discovery Questions</h3>
          <div className="pain-list">
            {slide.discoveryQuestions.map((question) => (
              <div key={question} className="discovery-card">
                <span className="dq-icon">💬</span>
                <span className="dq-text">{question}</span>
              </div>
            ))}
          </div>

          <h3 style={{ color: accent, marginTop: '0.85rem' }}>Common Pain Points</h3>
          <div className="pain-list">
            {slide.painPoints.map((pain) => (
              <div key={pain.label} className="pain-item" style={{ borderLeftColor: accent, borderColor: `${accent}26`, background: `linear-gradient(135deg, ${accent}12, ${accent}06)` }}>
                <span className="pain-icon">{pain.icon}</span>
                <span className="pain-text">
                  <strong style={{ color: accent }}>{pain.label}</strong>
                  {' - '}
                  {pain.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="deepdive-col">
          <div className="solution-card" style={{ borderColor: `${accent}33`, background: `linear-gradient(135deg, ${accent}14, ${accent}08)` }}>
            <div className="solution-header">
              <span className="solution-icon">{slide.solution.icon}</span>
              <span className="solution-title" style={{ color: accent }}>
                {slide.solution.title}
              </span>
            </div>
            <div className="solution-steps">
              {slide.solution.steps.map((step, index) => (
                <div key={step} className="solution-step">
                  <span className="step-num" style={{ background: accent }}>
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {slide.surfaceItems ? (
            <div className="competitor-row">
              <span className="competitor-label">{slide.surfaceLabel}</span>
              <ToolPills items={slide.surfaceItems} tone={slide.phase.tone} />
            </div>
          ) : null}

          {slide.bottomLine ? (
            <div className="outcome-callout" style={{ borderColor: `${accent}40`, background: `linear-gradient(135deg, ${accent}1A, ${accent}08)` }}>
              <div className="outcome-label" style={{ color: accent }}>
                Outcome
              </div>
              <div className="outcome-text">{slide.bottomLine}</div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

function renderSolutionImpact(slide) {
  const accent = toneColor(slide.phase.tone)

  return (
    <>
      <PhaseHeader slide={slide} allowThumbnail />
      <div
        className="deepdive-cols"
        style={{
          gridTemplateColumns: '1.02fr 1fr',
          gap: '1rem',
          marginTop: '0.35rem',
        }}
      >
        <div
          className="deepdive-col"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
        >
          <div
            className="solution-card"
            style={{
              marginTop: 0,
              minHeight: '248px',
              borderColor: `${accent}33`,
              background: `linear-gradient(135deg, ${accent}14, ${accent}08)`,
            }}
          >
            <div className="solution-header">
              <span className="solution-icon" style={{ fontSize: '1.45rem' }}>
                {slide.solution.icon}
              </span>
              <span className="solution-title" style={{ color: accent }}>
                {slide.solution.title}
              </span>
            </div>
            <div className="solution-steps" style={{ gap: '0.55rem' }}>
              {slide.solution.steps.map((step, index) => (
                <div key={step} className="solution-step">
                  <span className="step-num" style={{ background: accent }}>
                    {index + 1}
                  </span>
                  <span style={{ flex: 1 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {slide.surfaceItems ? (
            <div
              className="competitor-row"
              style={{
                marginTop: 0,
                padding: '0.75rem 1rem',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                rowGap: '0.5rem',
              }}
            >
              <span className="competitor-label">{slide.surfaceLabel}</span>
              <ToolPills items={slide.surfaceItems} tone={slide.phase.tone} />
            </div>
          ) : null}

          {slide.keyShift ? (
            <div
              className="emphasis-box"
              style={{
                marginTop: 0,
                padding: '0.95rem 1.1rem',
                fontSize: '1rem',
                lineHeight: 1.5,
                borderColor: `${accent}33`,
                background: `linear-gradient(135deg, ${accent}14, ${accent}06)`,
              }}
            >
              <strong>Key shift:</strong> {slide.keyShift}
            </div>
          ) : null}
        </div>

        <div
          className="deepdive-col"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}
        >
          {slide.impactCards?.map((card) => (
            <div
              key={card.label}
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '1rem 1.1rem',
                minHeight: '88px',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: accent, marginBottom: '0.2rem', lineHeight: 1.05 }}>
                {card.stat}
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.28rem' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '0.95rem', lineHeight: 1.45 }}>{card.body}</div>
            </div>
          ))}

          {slide.bottomLine ? (
            <div
              className="outcome-callout"
              style={{
                marginTop: 0,
                padding: '1rem 1.15rem',
                borderColor: `${accent}40`,
                background: `linear-gradient(135deg, ${accent}1A, ${accent}08)`,
              }}
            >
              <div className="outcome-label" style={{ color: accent }}>
                Bottom Line
              </div>
              <div className="outcome-text">{slide.bottomLine}</div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

function renderMediaSlide(slide, fullBleed = false) {
  const media = slide.media

  return (
    <>
      {slide.phase ? <PhaseHeader slide={slide} /> : null}
      {slide.link ? (
        <a href={slide.link.href} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: 'var(--cursor-blue)', textDecoration: 'none' }}>
          {slide.link.label}
        </a>
      ) : null}
      <div
        style={{
          flex: 1,
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'stretch',
          marginTop: slide.link ? '0.75rem' : 0,
          minHeight: fullBleed ? '500px' : '420px',
        }}
      >
        <img
          src={getMediaSrc(media.asset)}
          alt={getAsset(media.asset)?.alt ?? slide.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: media.fit === 'cover' ? 'cover' : 'contain',
            objectPosition: fullBleed ? 'top left' : 'center',
            display: 'block',
            background: 'white',
          }}
        />
      </div>
    </>
  )
}

function renderContextSplit(slide) {
  return (
    <>
      <PhaseHeader slide={slide} />
      <div className="deepdive-cols">
        <div className="deepdive-col">
          <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <img
              src={getMediaSrc(slide.media.asset)}
              alt={getAsset(slide.media.asset)?.alt ?? slide.title}
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className="deepdive-col">
          <h3 style={{ color: toneColor(slide.phase.tone) }}>A Designer&apos;s Day</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {slide.contextCards.map((card) => (
              <div key={card.label} className="discovery-card">
                <span className="dq-text" style={{ fontStyle: 'normal' }}>
                  <strong style={{ color: toneColor(slide.phase.tone) }}>{card.label}</strong>
                  {' - '}
                  {card.body}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <EmphasisBox emphasis={{ label: 'The gap:', body: slide.emphasis, tone: 'purple' }} />
    </>
  )
}

function renderTwoColumnCycle(slide) {
  const accent = toneColor(slide.phase.tone)
  const asset = slide.media?.asset ? getAsset(slide.media.asset) : null

  return (
    <>
      <PhaseHeader slide={slide} />
      <div className="deepdive-cols">
        <div className="deepdive-col">
          <h3 style={{ color: accent }}>{slide.leftTitle}</h3>
          <p className="small" style={{ marginBottom: '0.6rem' }}>
            {slide.leftSubtitle}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {slide.cycleSteps.map((step, index) => (
              <div key={step.title} className="solution-card" style={{ marginTop: 0, borderColor: `${accent}26`, background: 'var(--card-bg)' }}>
                <div className="solution-step">
                  <span className="step-num" style={{ background: accent }}>
                    {index + 1}
                  </span>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{step.title}</strong>
                    {step.tools?.length ? <ToolPills items={step.tools} tone={slide.phase.tone} /> : null}
                    {step.quotes?.length ? (
                      <div style={{ marginTop: '0.3rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {step.quotes.join(' ')}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {slide.loopBanner ? (
            <div className="emphasis-box" style={{ marginTop: '0.75rem', borderColor: `${accent}33`, background: `linear-gradient(135deg, ${accent}14, ${accent}06)` }}>
              <strong>Loop:</strong> {slide.loopBanner}
            </div>
          ) : null}
        </div>
        <div className="deepdive-col">
          <h3 style={{ color: accent }}>{slide.media.title}</h3>
          {slide.media.href ? (
                    <a href={slide.media.href} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', color: accent, textDecoration: 'none' }}>
              {slide.media.href}
            </a>
          ) : null}
          <div style={{ marginTop: '0.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <video
              controls
              src={asset?.browserSrc}
              style={{ width: '100%', display: 'block', background: '#000' }}
            />
          </div>
          <div className="outcome-callout" style={{ borderColor: `${accent}40`, background: `linear-gradient(135deg, ${accent}1A, ${accent}08)` }}>
            <div className="outcome-label" style={{ color: accent }}>
              Why it matters
            </div>
            <div className="outcome-text">{slide.media.caption}</div>
          </div>
        </div>
      </div>
    </>
  )
}

function renderVideoPlaceholder(slide) {
  return (
    <>
      <PhaseHeader slide={slide} />
      <div className="video-placeholder">
        <div className="vp-icon">{slide.placeholder.icon}</div>
        <div className="vp-title">{slide.placeholder.title}</div>
        <div className="vp-desc">{slide.placeholder.description}</div>
      </div>
      <div className="outcome-callout">
        <div className="outcome-label">Key message</div>
        <div className="outcome-text">{slide.outcome}</div>
      </div>
    </>
  )
}

function renderWorkflowCompare(slide) {
  return (
    <>
      <h2>{slide.title}</h2>
      <div className="workflow-grid">
        {slide.workflowRows.map((row) => (
          <span key={row.label} style={{ display: 'contents' }}>
            <div className="workflow-label">{row.label}</div>
            {row.steps.map((step, index) => (
              <span key={step.title} style={{ display: 'contents' }}>
                <div className={`workflow-step ${row.label === 'Git' ? 'workflow-step-git' : 'workflow-step-docs'}`}>
                  <div className="workflow-title">{step.title}</div>
                  <div className="workflow-sub">{step.subtitle}</div>
                  <ul className="workflow-bullets">
                    {step.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                {index < row.steps.length - 1 ? <div className="workflow-arrow">→</div> : null}
              </span>
            ))}
          </span>
        ))}
      </div>
      <EmphasisBox emphasis={slide.emphasis} />
    </>
  )
}

function renderWorkflowColumns(slide) {
  if (slide.variant === 'analogyTimeline') {
    const timelineStep = (step) => {
      let bg = 'var(--card-bg)'
      let border = '1px solid var(--border-subtle)'
      let color = 'var(--text-primary)'
      let extra = {}

      if (step.variant === 'danger') {
        bg = 'linear-gradient(135deg, rgba(220, 50, 47, 0.15), rgba(220, 50, 47, 0.06))'
        border = '2px solid var(--red)'
        color = 'var(--red)'
        extra = { boxShadow: '0 0 12px rgba(220, 50, 47, 0.2)' }
      } else if (step.variant === 'investment') {
        bg = 'linear-gradient(135deg, rgba(133, 153, 0, 0.15), rgba(133, 153, 0, 0.06))'
        border = '2px solid var(--green)'
        color = 'var(--green)'
      } else if (step.variant === 'glow') {
        bg = 'linear-gradient(135deg, rgba(203, 75, 22, 0.12), rgba(203, 75, 22, 0.04))'
        border = '2px solid var(--orange)'
        color = 'var(--orange)'
        extra = { boxShadow: '0 0 12px rgba(203, 75, 22, 0.15)' }
      }

      return (
        <div
          key={step.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.5rem 0.6rem',
            background: bg,
            border,
            borderRadius: '10px',
            minWidth: '80px',
            maxWidth: '110px',
            flex: 1,
            textAlign: 'center',
            ...extra,
          }}
        >
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color, lineHeight: 1.3 }}>{step.label}</span>
        </div>
      )
    }

    return (
      <>
        <PhaseHeader slide={slide} />
        {slide.timelineRows.map((row) => (
          <div
            key={row.label}
            style={{
              background:
                row.label === 'Food Manufacturing'
                  ? 'linear-gradient(135deg, rgba(101, 123, 131, 0.04), rgba(101, 123, 131, 0.01))'
                  : 'linear-gradient(135deg, rgba(203, 75, 22, 0.04), rgba(203, 75, 22, 0.01))',
              border:
                row.label === 'Food Manufacturing'
                  ? '1px solid var(--border-subtle)'
                  : '1px solid rgba(203, 75, 22, 0.2)',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '0.6rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: row.label === 'Food Manufacturing' ? 'var(--text-secondary)' : 'var(--orange)' }}>
                {row.label}
              </span>
              <span style={{ fontSize: '0.55rem', padding: '0.1rem 0.4rem', borderRadius: '100px', background: row.label === 'Food Manufacturing' ? 'rgba(101, 123, 131, 0.1)' : 'rgba(203, 75, 22, 0.1)', color: row.label === 'Food Manufacturing' ? 'var(--text-secondary)' : 'var(--orange)' }}>
                {row.badge}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'nowrap' }}>
              {row.steps.map((step, index) => (
                <span key={step.label} style={{ display: 'contents' }}>
                  {timelineStep(step)}
                  {index < row.steps.length - 1 ? (
                    <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', opacity: 0.5, flexShrink: 0 }}>→</span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'stretch' }}>
          {slide.insightCards.map((card) => (
            <div
              key={card.label}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, rgba(203, 75, 22, 0.08), rgba(203, 75, 22, 0.02))',
                border: '1px solid rgba(203, 75, 22, 0.2)',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{card.body}</div>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <PhaseHeader slide={slide} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', alignItems: 'start' }}>
        {slide.workflowColumns.map((column) => (
          <div
            key={column.title}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1rem',
            }}
          >
            <div style={{ fontSize: '1.02rem', fontWeight: 700, color: toneColor(column.tone), marginBottom: '0.15rem' }}>
              {column.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              {column.subtitle}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {column.steps.map((step, index) => (
                <div
                  key={step}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    border:
                      index === column.highlightStep
                        ? `2px solid ${toneColor(column.tone)}`
                        : '1px solid var(--border-subtle)',
                    background:
                      index === column.highlightStep
                        ? `${toneColor(column.tone)}12`
                        : 'white',
                    fontSize: '0.88rem',
                    fontWeight: index === column.highlightStep ? 700 : 500,
                  }}
                >
                  {step}
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
              {column.footer}
            </div>
          </div>
        ))}
      </div>
      <div className="emphasis-box green" style={{ marginTop: '1rem', textAlign: 'center' }}>
        <strong>{slide.mainTakeaway}</strong>
      </div>
    </>
  )
}

function renderRealWorldPanels(slide) {
  return (
    <>
      <PhaseHeader slide={slide} />
      <div className="deepdive-cols" style={{ gap: '1.5rem' }}>
        {slide.panels.map((panel) => (
          <div key={panel.title} className="deepdive-col">
            <h3 style={{ color: toneColor(slide.phase.tone), marginBottom: '0.5rem' }}>{panel.title}</h3>
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <img
                src={getMediaSrc(panel.media.asset)}
                alt={getAsset(panel.media.asset)?.alt ?? panel.title}
                style={{ width: '100%', display: 'block' }}
              />
            </div>
            <div className="pain-list" style={{ marginTop: '0.75rem' }}>
              {panel.steps.map((step, index) => (
                <div key={step} className="discovery-card">
                  <span className="dq-icon">{index + 1}</span>
                  <span className="dq-text" style={{ fontStyle: 'normal' }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="outcome-callout" style={{ marginTop: '1rem' }}>
        <div className="outcome-label" style={{ color: toneColor(slide.phase.tone) }}>
          Why it matters
        </div>
        <div className="outcome-text">{slide.banner}</div>
      </div>
    </>
  )
}

function renderBeforeAfter(slide) {
  return (
    <>
      <SectionHeader slide={slide} />
      <h2>{slide.title}</h2>
      <div className="transformation-compare">
        <div className="transformation-panel">
          <h3 style={{ color: 'var(--red)' }}>{slide.beforeAfter.before.title}</h3>
          <div className="ugly-site">
            {slide.beforeAfter.before.lines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
        <div className="transformation-panel">
          <h3 style={{ color: 'var(--green)' }}>{slide.beforeAfter.after.title}</h3>
          <div className="nice-site">
            <img
              src={getMediaSrc(slide.beforeAfter.after.media.asset)}
              alt={getAsset(slide.beforeAfter.after.media.asset)?.alt ?? slide.beforeAfter.after.title}
            />
          </div>
        </div>
      </div>
    </>
  )
}

function renderSectionIntro(slide) {
  if (slide.variant === 'projectPicker') {
    return (
      <>
        <SectionHeader slide={slide} />
        <h2>{slide.title}</h2>
        <div className="intro-callout cyan">
          {slide.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="two-col">
          <div>
            <div className="tiles" style={{ gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              {slide.objectiveTiles.map((tile) => (
                <div key={tile.number} className="tile cyan">
                  <div className="tile-number">{tile.number}</div>
                  <div className="tile-title">
                    {renderTitleWithHighlight({ title: tile.title, titleHighlight: tile.titleHighlight, titleTail: tile.titleTail, tone: 'section1' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>{slide.sideHeading}</h3>
            {slide.projectCategories.map((category) => (
              <div key={category.label} className="project-category">
                <div className="project-category-label">{category.label}</div>
                <div className="project-ideas">
                  {category.ideas.map((idea) => (
                    <div key={idea.name} className="project-idea">
                      <span className="project-icon">{idea.icon}</span>
                      <div>
                        <strong>{idea.name}</strong>
                        <span>{idea.features}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="project-idea build-your-own" style={{ marginTop: '0.4rem' }}>
              <span className="project-icon">{slide.buildYourOwn.icon}</span>
              <div>
                <strong>{slide.buildYourOwn.title}</strong>
                <span>{slide.buildYourOwn.description}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (slide.variant === 'threeTiles') {
    return (
      <>
        <SectionHeader slide={slide} />
        <h2>{slide.title}</h2>
        <div className="intro-callout orange">
          <p>{slide.intro.paragraphs[0]}</p>
        </div>
        <div className="tiles">
          {slide.tiles.map((tile) => (
            <div key={tile.number} className="tile orange">
              <div className="tile-number">{tile.number}</div>
              <div className="tile-title">
                {renderTitleWithHighlight({ title: `${tile.title} `, titleHighlight: tile.titleHighlight, tone: 'section2' })}
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  if (slide.variant === 'bigQuote') {
    return (
      <>
        <SectionHeader slide={slide} />
        <h2>{slide.title}</h2>
        <div className="big-quote">
          {slide.quoteLines[0]}
          <br />
          <span className="highlight-purple">{slide.quoteLines[1]}</span>
        </div>
      </>
    )
  }

  if (slide.variant === 'rules') {
    return (
      <>
        <SectionHeader slide={slide} />
        <h2>{slide.title}</h2>
        <div className="intro-callout purple">
          {slide.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="tiles" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {slide.tiles.map((tile) => (
            <div key={tile.number} className="tile purple">
              <div className="tile-number">{tile.number}</div>
              <div className="tile-title">{tile.title}</div>
              <div className="tile-desc">{tile.description}</div>
            </div>
          ))}
        </div>
        <EmphasisBox emphasis={slide.emphasis} />
      </>
    )
  }

  if (slide.variant === 'skipInfo') {
    return (
      <>
        <SectionHeader slide={slide} />
        <h2>{slide.title}</h2>
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            border: '1px dashed rgba(203, 75, 22, 0.25)',
            background: 'linear-gradient(135deg, rgba(203, 75, 22, 0.08), rgba(203, 75, 22, 0.02))',
            marginBottom: '1rem',
          }}
        >
          <strong>{slide.skipBanner.title}</strong>
          <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem', fontSize: '0.9rem' }}>
            {slide.skipBanner.subtitle}
          </div>
        </div>
        <div className="tiles" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {slide.tiles.map((tile) => (
            <div key={tile.title} className="tile cyan">
              <div className="tile-title">{tile.title}</div>
              <ul className="tile-bullets">
                {tile.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <EmphasisBox emphasis={slide.emphasis} />
      </>
    )
  }

  return null
}

function renderTakeaway(slide) {
  return (
    <>
      <SectionHeader slide={slide} />
      <h2>{slide.title}</h2>
      <HeroCallout hero={slide.hero} />
      <div className="tiles">
        {slide.tiles.map((tile) => (
          <div key={tile.label} className={`tile ${tile.tone === 'section1' ? 'cyan' : tile.tone === 'section2' ? 'orange' : tile.tone === 'section3' ? 'purple' : ''}`}>
            <div className="takeaway-label" style={{ color: toneColor(tile.tone === 'section1' ? 'plan' : tile.tone === 'section2' ? 'test' : tile.tone === 'section3' ? 'design' : 'develop') }}>
              {tile.label}
            </div>
            <div className="tile-title">
              {tile.titleHighlight ? (
                <span className={highlightClassByTone[tile.tone] ?? 'highlight'}>{tile.titleHighlight}</span>
              ) : (
                tile.title
              )}
            </div>
            {tile.description ? <div className="tile-desc">{tile.description}</div> : null}
            {tile.bullets ? (
              <ul className="tile-bullets">
                {tile.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
      <DiscoveryGroups discovery={slide.discovery} />
      <EmphasisBox emphasis={slide.emphasis} />
    </>
  )
}

function renderAgenda(slide) {
  return (
    <>
      <h2>{slide.title}</h2>
      <div className="timeline">
        {slide.timelineItems.map((item) => (
          <div key={item.number} className="timeline-item">
            <div className={`timeline-number ${item.numberVariant}`}>{item.number}</div>
            <div className="timeline-content">
              <div className="timeline-title">{item.title}</div>
              <div className="timeline-desc">{item.description}</div>
            </div>
            <div className="timeline-duration">{item.duration}</div>
          </div>
        ))}
      </div>
    </>
  )
}

function renderDocPreview(slide) {
  return (
    <>
      <SectionHeader slide={slide} />
      <h2>{slide.title}</h2>
      <p className="small" style={{ marginBottom: '0.75rem' }}>
        {slide.intro}
      </p>
      <div
        style={{
          position: 'relative',
          background: 'var(--code-bg)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          maxHeight: '460px',
          overflow: 'auto',
          fontFamily: "'Fira Code', monospace",
          fontSize: '0.78rem',
          lineHeight: 1.6,
          color: '#586e75',
        }}
      >
        <div style={{ position: 'absolute', top: '0.7rem', right: '0.9rem', fontSize: '0.65rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
          {slide.docLabel}
        </div>
        {slide.docLines.map((line, index) => (
          <div key={index} style={{ whiteSpace: 'pre-wrap' }}>
            {line || ' '}
          </div>
        ))}
      </div>
      <EmphasisBox emphasis={slide.emphasis} />
    </>
  )
}

function renderQuote(slide) {
  return (
    <>
      <h2>{slide.title}</h2>
      <div className="big-quote">
        {slide.quoteLines.map((line, index) => (
          <span key={line}>
            {slide.quoteHighlightLines?.includes(index) ? (
              <span className="highlight">{line}</span>
            ) : (
              line
            )}
            {index < slide.quoteLines.length - 1 ? <br /> : null}
          </span>
        ))}
      </div>
      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center', lineHeight: 1.5 }}>
        {slide.supportingLines?.map((line, index) => (
          <span key={line}>
            {line}
            {index < slide.supportingLines.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    </>
  )
}

export function RenderSlide({ slide }) {
  switch (slide.type) {
    case SLIDE_TYPES.titleHero:
      return renderPptSafeTitleHero(slide)
    case SLIDE_TYPES.closing:
      return (
        <FlowSlide>
          <h1 style={{ fontSize: '6rem' }}>{slide.title}</h1>
        </FlowSlide>
      )
    case SLIDE_TYPES.takeaway:
      return renderPptSafeTakeaway(slide)
    case SLIDE_TYPES.agenda:
      return <FlowSlide>{renderAgenda(slide)}</FlowSlide>
    case SLIDE_TYPES.sdlcOverview:
    case SLIDE_TYPES.sdlcHighlight:
      return renderPptSafeSdlcOverview(slide)
    case SLIDE_TYPES.sectionIntro:
      return <FlowSlide>{renderSectionIntro(slide)}</FlowSlide>
    case SLIDE_TYPES.checklist:
      return (
        <FlowSlide>
          <SectionHeader slide={slide} />
          <h2>{slide.title}</h2>
          {slide.intro ? (
            <div className={`intro-callout ${slide.section?.tone === 'section2' ? 'orange' : slide.section?.tone === 'section3' ? 'purple' : 'cyan'}`}>
              {slide.intro.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}
          {slide.exampleLabel ? (
            <p className="small" style={{ marginBottom: '0.6rem' }}>
              {slide.exampleLabel}
            </p>
          ) : null}
          {slide.tiles ? (
            <div className="tiles" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1rem' }}>
              {slide.tiles.map((tile) => (
                <div key={tile.title} className="tile orange">
                  {'number' in tile ? <div className="tile-number">{tile.number}</div> : <div style={{ fontSize: '1.6rem' }}>{tile.icon}</div>}
                  <div className="tile-title">{tile.title}</div>
                  <div className="tile-desc">{tile.description}</div>
                </div>
              ))}
            </div>
          ) : null}
          {renderChecklistGroups(slide)}
          <EmphasisBox emphasis={slide.emphasis} />
        </FlowSlide>
      )
    case SLIDE_TYPES.docPreview:
      return <FlowSlide>{renderDocPreview(slide)}</FlowSlide>
    case SLIDE_TYPES.workflowCompare:
      return renderPptSafeWorkflowCompare(slide)
    case SLIDE_TYPES.phaseDeepDive:
      return renderPptSafePhaseDeepDive(slide)
    case SLIDE_TYPES.phaseDeepDiveSplit:
      return <FlowSlide>{renderPhaseDeepDiveSplit(slide)}</FlowSlide>
    case SLIDE_TYPES.solutionImpact:
      return <FlowSlide>{renderSolutionImpact(slide)}</FlowSlide>
    case SLIDE_TYPES.mediaExample:
      return <FlowSlide>{renderMediaSlide(slide)}</FlowSlide>
    case SLIDE_TYPES.mediaFullBleed:
      return <FlowSlide>{renderMediaSlide(slide, true)}</FlowSlide>
    case SLIDE_TYPES.contextSplit:
      return <FlowSlide>{renderContextSplit(slide)}</FlowSlide>
    case SLIDE_TYPES.twoColumnCycle:
      return <FlowSlide>{renderTwoColumnCycle(slide)}</FlowSlide>
    case SLIDE_TYPES.videoPlaceholder:
      return <FlowSlide>{renderVideoPlaceholder(slide)}</FlowSlide>
    case SLIDE_TYPES.workflowColumns:
      return renderPptSafeWorkflowColumns(slide)
    case SLIDE_TYPES.browserDemo:
      return renderPptSafeBrowserDemo(slide)
    case SLIDE_TYPES.beforeAfter:
      return <FlowSlide>{renderBeforeAfter(slide)}</FlowSlide>
    case SLIDE_TYPES.quote:
      return <FlowSlide>{renderQuote(slide)}</FlowSlide>
    case SLIDE_TYPES.realWorldPanels:
      return <FlowSlide>{renderRealWorldPanels(slide)}</FlowSlide>
    default:
      return (
        <FlowSlide>
          <h2>{slide.title ?? slide.slug}</h2>
          <pre>{JSON.stringify(slide, null, 2)}</pre>
        </FlowSlide>
      )
  }
}
