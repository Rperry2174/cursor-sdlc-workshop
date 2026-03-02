const Slide12Section2Step1 = () => (
  <>
    <div className="section-header">
      <span className="section-badge section2">Section 2</span>
      <span className="phase-badge">Step 1: Understand the Code • 10 min</span>
    </div>
    <h2>Explore With Ask Mode</h2>
    <div className="scrollable">
      <div className="checklist">
        <div className="check-item">
          <div className="check-box"></div>
          <div>
            <strong>Navigate to an unfamiliar project folder</strong> — find
            the code in the file tree (projects/[username])
          </div>
        </div>
        <div className="check-item has-code">
          <div className="check-header">
            <div className="check-box"></div>
            <div>
              <strong>Switch to Ask Mode</strong> — explore without changing anything
            </div>
          </div>
          <div className="code-block">
            <code>
              <span className="comment">In Ask Mode, try:</span>
              <br />
              "What does this project do? Explain the structure."
              <br />
              "What technologies does it use?"
              <br />
              "How do the components fit together?"
            </code>
          </div>
        </div>
        <div className="check-item has-code">
          <div className="check-header">
            <div className="check-box"></div>
            <div>
              <strong>Figure out how to run it</strong>
            </div>
          </div>
          <div className="code-block">
            <code>
              <span className="comment">In Ask Mode:</span>
              <br />
              "How do I run this project locally?"
            </code>
          </div>
        </div>
        <div className="check-item">
          <div className="check-box"></div>
          <div>
            <strong>Actually run it</strong> — see it working in your browser
          </div>
        </div>
        <div className="check-item has-code">
          <div className="check-header">
            <div className="check-box"></div>
            <div>
              <strong>Discover what's been helping you</strong> — see the hooks,
              skills, and rules already configured in this project
            </div>
          </div>
          <div className="code-block">
            <code>
              <span className="comment">Ask Cursor:</span>
              <br />
              "What hooks, skills, and rules are configured
              <br />
              in this project? What does each one do?"
            </code>
          </div>
        </div>
        <div className="check-item has-code">
          <div className="check-header">
            <div className="check-box"></div>
            <div>
              <strong>Create a Rule</strong> — teach Cursor your coding
              standards for this project
            </div>
          </div>
          <div className="code-block">
            <code>
              <span className="comment">Ask Cursor:</span>
              <br />
              "Look at this project's structure and create a
              <br />
              Cursor Rule that enforces its coding standards —
              <br />
              use existing patterns, keep files organized the
              <br />
              same way, and add comments for beginners."
            </code>
          </div>
        </div>
      </div>
      <div className="emphasis-box orange">
        <strong>Key insight:</strong> Ask Mode lets you learn a codebase fast
        without breaking anything. Rules let you bake that understanding into
        Cursor permanently.
      </div>
    </div>
  </>
)

export default Slide12Section2Step1
