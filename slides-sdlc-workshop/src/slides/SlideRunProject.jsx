const BrowserMockup = () => (
  <div style={{
    border: '1px solid var(--border-strong)',
    borderRadius: '10px',
    overflow: 'hidden',
    maxWidth: '700px',
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

    {/* Game screen */}
    <div style={{
      background: 'linear-gradient(180deg, #4ec5f1 0%, #4ec5f1 60%, #8bc34a 60%, #689f38 100%)',
      height: '320px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Clouds */}
      <div style={{ position: 'absolute', top: 30, left: 60, fontSize: '2rem', opacity: 0.6 }}>&#9729;</div>
      <div style={{ position: 'absolute', top: 50, right: 80, fontSize: '1.5rem', opacity: 0.4 }}>&#9729;</div>
      <div style={{ position: 'absolute', top: 15, left: '45%', fontSize: '1.8rem', opacity: 0.5 }}>&#9729;</div>

      {/* Pipes */}
      <div style={{ position: 'absolute', left: 120, top: 0, width: 40, height: 80, background: '#4caf50', borderRadius: '0 0 4px 4px', border: '2px solid #388e3c' }} />
      <div style={{ position: 'absolute', left: 120, bottom: 64, width: 40, height: 100, background: '#4caf50', borderRadius: '4px 4px 0 0', border: '2px solid #388e3c' }} />

      <div style={{ position: 'absolute', left: 320, top: 0, width: 40, height: 140, background: '#4caf50', borderRadius: '0 0 4px 4px', border: '2px solid #388e3c' }} />
      <div style={{ position: 'absolute', left: 320, bottom: 64, width: 40, height: 60, background: '#4caf50', borderRadius: '4px 4px 0 0', border: '2px solid #388e3c' }} />

      <div style={{ position: 'absolute', left: 520, top: 0, width: 40, height: 50, background: '#4caf50', borderRadius: '0 0 4px 4px', border: '2px solid #388e3c' }} />
      <div style={{ position: 'absolute', left: 520, bottom: 64, width: 40, height: 130, background: '#4caf50', borderRadius: '4px 4px 0 0', border: '2px solid #388e3c' }} />

      {/* Bird */}
      <div style={{
        position: 'absolute',
        left: 200,
        top: 110,
        width: 36,
        height: 28,
        background: '#fdd835',
        borderRadius: '50%',
        border: '2px solid #f9a825',
        zIndex: 2,
      }}>
        {/* Eye */}
        <div style={{ position: 'absolute', right: 4, top: 5, width: 8, height: 8, background: 'white', borderRadius: '50%', border: '1.5px solid #333' }}>
          <div style={{ position: 'absolute', right: 1, top: 2, width: 3, height: 3, background: '#333', borderRadius: '50%' }} />
        </div>
        {/* Beak */}
        <div style={{ position: 'absolute', right: -8, top: 12, width: 10, height: 6, background: '#ff7043', borderRadius: '2px', border: '1px solid #e64a19' }} />
        {/* Wing */}
        <div style={{ position: 'absolute', left: 4, top: 12, width: 12, height: 8, background: '#ffee58', borderRadius: '50%', border: '1.5px solid #f9a825' }} />
      </div>

      {/* Ground */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, background: '#8bc34a', borderTop: '3px solid #689f38' }}>
        <div style={{ position: 'absolute', top: 8, left: 0, right: 0, display: 'flex', gap: 20, paddingLeft: 10 }}>
          {[...Array(20)].map((_, i) => (
            <div key={i} style={{ width: 3, height: 12, background: '#689f38', borderRadius: 1, opacity: 0.5 }} />
          ))}
        </div>
      </div>

      {/* Score */}
      <div style={{
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
      }}>
        7
      </div>
    </div>
  </div>
)

const SlideRunProject = () => (
  <>
    <div className="section-header">
      <span className="section-badge section1">Section 1</span>
      <span className="phase-badge">Phase 2: Design</span>
    </div>
    <h2>Run It &mdash; See It In Your Browser</h2>
    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center' }}>
      When you ask Cursor to run your project, you should see it live in your web browser:
    </p>
    <BrowserMockup />
    <div className="emphasis-box green" style={{ marginTop: '1rem', textAlign: 'center' }}>
      <strong>Ask Cursor:</strong>{' '}
      <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.85rem' }}>
        "How do I run this project?"
      </span>
      {' '}&mdash; then open the URL it gives you.
      If something looks wrong, tell Cursor what you see!
    </div>
  </>
)

export default SlideRunProject
