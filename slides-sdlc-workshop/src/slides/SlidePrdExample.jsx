const SlidePrdExample = () => (
  <>
    <div className="section-header">
      <span className="section-badge section1">Section 1</span>
      <span className="phase-badge">Your Plan = a prd.md File</span>
    </div>
    <h2>What Your PRD Looks Like</h2>
    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
      Your plan lives in a markdown file at{' '}
      <code style={{
        background: 'var(--code-bg)',
        padding: '0.15rem 0.4rem',
        borderRadius: '4px',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.8rem',
        color: 'var(--cursor-blue)',
        fontWeight: 600,
      }}>
        projects/&lt;your-github-username&gt;/prd.md
      </code>
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
    </div>

    <div className="emphasis-box green" style={{ marginTop: '0.75rem' }}>
      <strong>Your turn:</strong> There should already be a <code>prd.md</code> in{' '}
      <code>projects/&lt;your-github-username&gt;/</code>  - Cursor helped you fill it out in the last step.
      Make sure it has your project idea, a base MVP, and at least 2-3 features.
    </div>
  </>
)

export default SlidePrdExample
