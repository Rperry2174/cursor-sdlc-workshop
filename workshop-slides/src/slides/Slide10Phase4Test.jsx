const Slide10Phase4Test = () => (
  <>
    <div className="section-header">
      <span className="section-badge section1">Section 1</span>
      <span className="phase-badge">Phase 4: Test</span>
    </div>
    <h2>Test</h2>
    <div style={{
      background: 'linear-gradient(135deg, rgba(42,161,152,0.10), rgba(42,161,152,0.03))',
      border: '2px dashed rgba(42,161,152,0.3)',
      borderRadius: '12px',
      padding: '1.5rem 2rem',
      textAlign: 'center',
      marginBottom: '1.5rem',
    }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
        We're skipping this phase today
      </div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        But here's what normally happens at this stage:
      </div>
    </div>
    <div className="tiles" style={{ gridTemplateColumns: '1fr 1fr' }}>
      <div className="tile cyan">
        <div className="tile-title">
          <span className="highlight-green">Write automated tests</span>
        </div>
        <ul className="tile-bullets">
          <li>Does the code do what the PRD says it should?</li>
          <li>Unit tests check individual pieces, integration tests check the full flow</li>
          <li>Cursor can generate tests from your PRD and code</li>
        </ul>
      </div>
      <div className="tile cyan">
        <div className="tile-title">
          <span className="highlight-green">Catch bugs before users do</span>
        </div>
        <ul className="tile-bullets">
          <li>Tests run automatically every time someone pushes code</li>
          <li>If a new feature breaks an old one, tests flag it immediately</li>
          <li>This is how teams ship with confidence at scale</li>
        </ul>
      </div>
    </div>
    <div className="emphasis-box green" style={{ marginTop: '1rem' }}>
      <strong>The big idea:</strong> Testing is how you prove your software works the way
      you <em>think</em> it works  - before it reaches real users.
    </div>
  </>
)

export default Slide10Phase4Test
