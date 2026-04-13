const SlideS2AddFeature = () => (
  <>
    <div className="section-header">
      <span className="section-badge section2">Section 2</span>
      <span className="phase-badge">Step 2: Add a Feature to Their App</span>
    </div>
    <h2>Build Something New in Their Code</h2>
    <div className="intro-callout orange">
      <p>
        Now that you understand the project and have it running, your job is to
        <strong> add one feature</strong> to their app. Think small  - something
        fun you can finish in a few minutes.
      </p>
    </div>
    <div style={{
      background: 'var(--code-bg)',
      border: '1px solid var(--border-subtle)',
      borderRadius: '10px',
      padding: '1rem 1.25rem',
      marginBottom: '1rem',
    }}>
      <div style={{
        fontSize: '0.65rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: 'var(--orange)',
        marginBottom: '0.5rem',
      }}>
        Example: If it's a Pac-Man game...
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '0.75rem',
      }}>
        <div style={{
          background: 'white',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '0.75rem',
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>&#9889;</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Power-up: 2x Points
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Eating a special pellet doubles your score for 10 seconds
          </div>
        </div>
        <div style={{
          background: 'white',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '0.75rem',
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>&#127932;</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Sound Effects
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Add a "waka waka" chomp sound when eating dots
          </div>
        </div>
        <div style={{
          background: 'white',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '0.75rem',
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>&#127942;</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Win Screen
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Show a celebration animation when you clear all the dots
          </div>
        </div>
      </div>
    </div>

    <div className="checklist">
      <div className="check-group work section2">
        <div className="check-group-label">In Cursor</div>
        <div className="check-item has-code">
          <div className="check-header">
            <div className="check-box"></div>
            <div>
              <strong>Tell Cursor what feature to add</strong>
            </div>
          </div>
          <div className="code-block">
            <code>
              <span className="comment">Ask Cursor:</span>
              <br />
              "Add a [feature] to this project.
              <br />
              Look at the existing code to understand
              <br />
              how it works first, then implement it."
            </code>
          </div>
        </div>
        <div className="check-item">
          <div className="check-box"></div>
          <div>
            <strong>Test it</strong>  - run the app and make sure your feature works
          </div>
        </div>
      </div>

      {/* Git FINISH */}
      <div className="check-group git">
        <div className="check-group-label">Git: Finish</div>
        <div className="check-item has-code">
          <div className="check-header">
            <div className="check-box"></div>
            <div>
              <strong>Commit, push, and open a PR</strong>
            </div>
          </div>
          <div className="code-block">
            <code>
              <span className="comment">Ask Cursor:</span>
              <br />
              "Commit with message 'Add [feature] to [project]',
              <br />
              push to my fork, and open a PR"
            </code>
          </div>
        </div>
      </div>
    </div>
  </>
)

export default SlideS2AddFeature
