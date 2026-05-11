const SlidePrdExample = () => (
  <>
    <div className="section-header">
      <span className="section-badge section1">Section 1</span>
      <span className="phase-badge">Your Plan = Public Notion + prd.md</span>
    </div>
    <h2>What Your Notion PRD Looks Like</h2>
    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
      Your plan starts in Notion, then Cursor saves a Markdown copy as <code>prd.md</code> inside the project folder.
    </p>
    <div style={{
      background: 'var(--code-bg)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '10px',
      padding: '1.25rem 1.5rem',
      fontFamily: "'Fira Code', 'Monaco', monospace",
      fontSize: '0.72rem',
      lineHeight: 1.7,
      color: '#586e75',
      overflow: 'auto',
      maxHeight: 'calc(100vh - 260px)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.75rem',
        fontSize: '0.55rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: 'var(--text-secondary)',
        opacity: 0.5,
        fontFamily: 'Inter, sans-serif',
      }}>
        prd.md
      </div>

      <div style={{ color: 'var(--cursor-blue)', fontWeight: 700, fontSize: '0.95rem' }}>
        # Product Requirements Document (PRD)
      </div>
      <br />

      <div style={{ color: 'var(--cursor-blue)', fontWeight: 600, fontSize: '0.82rem' }}>
        ## Project Overview
      </div>
      <div>
        <span style={{ color: '#93a1a1' }}>**Project Name:**</span>{' '}
        <span style={{ color: 'var(--cyan)', fontStyle: 'italic' }}>Memory Card Match</span>
      </div>
      <div>
        <span style={{ color: '#93a1a1' }}>**One-line Description:**</span>{' '}
        <span style={{ color: 'var(--cyan)', fontStyle: 'italic' }}>A card-flipping memory game where you find matching pairs</span>
      </div>
      <div>
        <span style={{ color: '#93a1a1' }}>**Type:**</span>{' '}
        <span style={{ color: 'var(--cyan)', fontStyle: 'italic' }}>Web App</span>
      </div>
      <br />

      <div style={{ color: 'var(--cursor-blue)', fontWeight: 600, fontSize: '0.82rem' }}>
        ## Base MVP
      </div>
      <div>
        <span style={{ color: '#93a1a1' }}>**What the MVP includes:**</span>
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span> Grid of face-down cards
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span> Click to flip, match two to keep them revealed
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span> Win message when all pairs found
      </div>
      <br />

      <div style={{ color: 'var(--cursor-blue)', fontWeight: 600, fontSize: '0.82rem' }}>
        ## Features
      </div>
      <div style={{ marginTop: '0.2rem' }}>
        <span style={{ color: '#93a1a1' }}>### Feature 1:</span>{' '}
        <span style={{ fontWeight: 600 }}>Move Counter</span>
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span>{' '}
        <span style={{ color: '#93a1a1' }}>**Description:**</span> Track and display number of moves
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span>{' '}
        <span style={{ color: '#93a1a1' }}>**Files:**</span> src/components/MoveCounter.jsx
      </div>

      <div style={{ marginTop: '0.35rem' }}>
        <span style={{ color: '#93a1a1' }}>### Feature 2:</span>{' '}
        <span style={{ fontWeight: 600 }}>Timer</span>
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span>{' '}
        <span style={{ color: '#93a1a1' }}>**Description:**</span> Countdown or elapsed-time timer
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span>{' '}
        <span style={{ color: '#93a1a1' }}>**Files:**</span> src/components/Timer.jsx
      </div>

      <div style={{ marginTop: '0.35rem' }}>
        <span style={{ color: '#93a1a1' }}>### Feature 3:</span>{' '}
        <span style={{ fontWeight: 600 }}>Win Animation</span>
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span>{' '}
        <span style={{ color: '#93a1a1' }}>**Description:**</span> Confetti effect when game is won
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span>{' '}
        <span style={{ color: '#93a1a1' }}>**Files:**</span> src/components/Confetti.jsx
      </div>
      <br />

      <div style={{ color: 'var(--cursor-blue)', fontWeight: 600, fontSize: '0.82rem' }}>
        ## Constraints
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span> Keep the project simple enough to finish in the workshop
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span> Do not call external APIs
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span> Stub any data that would normally come from another service
      </div>
      <div style={{ paddingLeft: '0.75rem' }}>
        <span style={{ color: 'var(--cyan)' }}>-</span> Make the project public
      </div>
    </div>

    <div className="emphasis-box green" style={{ marginTop: '0.75rem' }}>
      <strong>Your turn:</strong> Your Notion page should be public, and the
      project folder should contain a local <code>prd.md</code> copy before you
      start building.
    </div>
  </>
)

export default SlidePrdExample
