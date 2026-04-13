const PacManWithFeature = () => (
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

    {/* Pac-Man game screen with 2x feature */}
    <div style={{
      background: '#000',
      height: '300px',
      position: 'relative',
      overflow: 'hidden',
      padding: '12px',
    }}>
      {/* Score header  - now with 2x multiplier */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: "'Courier New', monospace",
        fontSize: '0.75rem',
        marginBottom: '8px',
      }}>
        <div>
          <div style={{ color: '#fff', letterSpacing: '2px' }}>SCORE</div>
          <div style={{ color: '#ffeb3b', fontWeight: 700 }}>2560</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          {/* 2x badge */}
          <div style={{
            background: 'linear-gradient(135deg, #ff6f00, #ffab00)',
            color: '#000',
            fontWeight: 900,
            fontSize: '1.1rem',
            padding: '0.15rem 0.75rem',
            borderRadius: '6px',
            letterSpacing: '1px',
            animation: 'pulse 1s infinite',
          }}>
            2x POINTS!
          </div>
          <div style={{ color: '#ffab00', fontSize: '0.55rem', marginTop: '2px' }}>
            8 seconds left
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#fff', letterSpacing: '2px' }}>LIVES</div>
          <div style={{ color: '#ffeb3b', fontSize: '1rem' }}>&#9679; &#9679; &#9679;</div>
        </div>
      </div>

      {/* Maze */}
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

        {/* Fewer dots  - Pac-Man has been eating */}
        {[280, 320].map(x => (
          <circle key={`d1-${x}`} cx={x} cy={62} r="2" fill="#ffb8ae" />
        ))}
        {[320, 380].map(x => (
          <circle key={`d2-${x}`} cx={x} cy={100} r="2" fill="#ffb8ae" />
        ))}
        {[240, 320, 380].map(x => (
          <circle key={`d3-${x}`} cx={x} cy={140} r="2" fill="#ffb8ae" />
        ))}

        {/* Glowing power pellet that Pac-Man just ate */}
        <circle cx="20" cy="190" r="5" fill="#ffb8ae" />
        <circle cx="380" cy="190" r="5" fill="#ffb8ae" />

        {/* Pac-Man  - further along, eating */}
        <path d="M 245 100 L 258 91 A 14 14 0 1 0 258 109 Z" fill="#ffeb3b" />

        {/* Floating +20 score text */}
        <text x="220" y="88" fill="#ffab00" fontSize="10" fontWeight="900" fontFamily="Courier New">+20</text>

        {/* Scared ghosts (blue  - power pellet active) */}
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
      </svg>
    </div>
  </div>
)

const SlideS2FeatureResult = () => (
  <>
    <div className="section-header">
      <span className="section-badge section2">Section 2</span>
      <span className="phase-badge">Your Feature, Their App</span>
    </div>
    <h2>You Just Shipped to Someone Else's Codebase</h2>
    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textAlign: 'center' }}>
      The 2x power-up is live  - ghosts are scared, points are doubled:
    </p>
    <PacManWithFeature />
    <div className="emphasis-box orange" style={{ marginTop: '1rem', textAlign: 'center' }}>
      <strong>You just did what professional engineers do every day</strong>  -
      read unfamiliar code, understand it, add value, and ship.
    </div>
  </>
)

export default SlideS2FeatureResult
