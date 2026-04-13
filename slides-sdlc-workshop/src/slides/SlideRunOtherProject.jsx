const PacManMockup = () => (
  <div style={{
    border: '1px solid var(--border-strong)',
    borderRadius: '10px',
    overflow: 'hidden',
    maxWidth: '680px',
    margin: '0 auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
  }}>
    {/* Browser chrome */}
    <div style={{
      background: '#f0f0f0',
      padding: '0.5rem 0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', gap: '0.35rem' }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
      </div>
      <div style={{
        flex: 1,
        background: 'white',
        borderRadius: '6px',
        padding: '0.25rem 0.6rem',
        fontSize: '0.65rem',
        color: 'var(--text-secondary)',
        fontFamily: "'Inter', sans-serif",
        border: '1px solid var(--border-subtle)',
      }}>
        localhost:5173
      </div>
    </div>

    {/* Pac-Man game screen */}
    <div style={{
      background: '#000',
      height: '300px',
      position: 'relative',
      overflow: 'hidden',
      padding: '12px',
    }}>
      {/* Score header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: "'Courier New', monospace",
        fontSize: '0.75rem',
        marginBottom: '8px',
      }}>
        <div>
          <div style={{ color: '#fff', letterSpacing: '2px' }}>SCORE</div>
          <div style={{ color: '#fff', fontWeight: 700 }}>1280</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#fff', letterSpacing: '2px' }}>HIGH SCORE</div>
          <div style={{ color: '#fff', fontWeight: 700 }}>5000</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#fff', letterSpacing: '2px' }}>LIVES</div>
          <div style={{ color: '#ffeb3b', fontSize: '1rem' }}>&#9679; &#9679; &#9679;</div>
        </div>
      </div>

      {/* Maze walls (simplified) */}
      <svg viewBox="0 0 400 210" style={{ width: '100%', height: '210px' }}>
        {/* Outer border */}
        <rect x="4" y="4" width="392" height="202" rx="6" fill="none" stroke="#1a1aff" strokeWidth="3" />

        {/* Inner maze walls */}
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

        {/* Dots */}
        {[80, 120, 160, 200, 240, 280, 320].map(x => (
          <circle key={`d1-${x}`} cx={x} cy={62} r="2" fill="#ffb8ae" />
        ))}
        {[20, 80, 160, 200, 320, 380].map(x => (
          <circle key={`d2-${x}`} cx={x} cy={100} r="2" fill="#ffb8ae" />
        ))}
        {[20, 80, 160, 240, 320, 380].map(x => (
          <circle key={`d3-${x}`} cx={x} cy={140} r="2" fill="#ffb8ae" />
        ))}

        {/* Power pellets */}
        <circle cx="20" cy="20" r="5" fill="#ffb8ae" />
        <circle cx="380" cy="20" r="5" fill="#ffb8ae" />
        <circle cx="20" cy="190" r="5" fill="#ffb8ae" />
        <circle cx="380" cy="190" r="5" fill="#ffb8ae" />

        {/* Pac-Man */}
        <path d="M 195 100 L 208 91 A 14 14 0 1 0 208 109 Z" fill="#ffeb3b" />

        {/* Ghosts */}
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
      </svg>
    </div>
  </div>
)

const SlideRunOtherProject = () => (
  <>
    <div className="section-header">
      <span className="section-badge section2">Section 2</span>
      <span className="phase-badge">Someone Else's App, Your Browser</span>
    </div>
    <h2>You're Running Their Project</h2>
    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center' }}>
      You pulled the latest code, explored with Ask Mode, and now you have a
      classmate's app running locally:
    </p>
    <PacManMockup />
    <div className="emphasis-box orange" style={{ marginTop: '1rem', textAlign: 'center' }}>
      <strong>You just onboarded to someone else's project in minutes.</strong>{' '}
      In the real world, this can take days or weeks.
    </div>
  </>
)

export default SlideRunOtherProject
