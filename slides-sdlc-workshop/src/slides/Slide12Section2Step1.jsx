const Slide12Section2Step1 = () => (
  <>
    <div className="section-header">
      <span className="section-badge section2">Section 2</span>
      <span className="phase-badge">Step 1: Get Someone Else's Project Running</span>
    </div>
    <h2>Pull &amp; Explore</h2>
    <div className="scrollable">
      <div className="checklist">
        {/* Git START */}
        <div className="check-group git">
          <div className="check-group-label">Git: Start</div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Pull the latest changes from main</strong>  - everyone's
                merged PRs are now in the repo
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Pull the latest changes from the main branch
                <br />
                so I have everyone's projects"
              </code>
            </div>
          </div>
        </div>

        {/* IN CURSOR */}
        <div className="check-group work section2">
          <div className="check-group-label">In Cursor</div>
          <div className="check-item">
            <div className="check-box"></div>
            <div>
              <strong>Pick someone else's project</strong>  - browse the{' '}
              <code>projects/</code> folder and find a project that isn't yours
            </div>
          </div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Use Ask Mode to understand it</strong>  - explore without
                changing anything
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">In Ask Mode, try:</span>
                <br />
                "What does this project do?"
                <br />
                "How is it structured?"
              </code>
            </div>
          </div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Run it</strong>  - get their project working in your browser
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "How do I run this project locally?"
              </code>
            </div>
          </div>
          <div className="check-item">
            <div className="check-box"></div>
            <div>
              <strong>See it live</strong>  - you should have someone else's app
              running in your browser right now
            </div>
          </div>
        </div>
      </div>
      <div className="emphasis-box orange">
        <strong>Key insight:</strong> Ask Mode lets you learn a codebase fast
        without breaking anything. This is 90% of what real engineers do day-to-day.
      </div>
    </div>
  </>
)

export default Slide12Section2Step1
