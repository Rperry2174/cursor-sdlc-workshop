const Slide07Phase1Plan = () => (
  <>
    <div className="section-header">
      <span className="section-badge section1">Section 1</span>
      <span className="phase-badge">Phase 1: Plan / Design • 10 min</span>
    </div>
    <h2>Plan / Design</h2>
    <div className="scrollable">
      <div className="checklist">
        {/* Git START */}
        <div className="check-group git">
          <div className="check-group-label">Git: Start</div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Tell Cursor to fork &amp; clone the repo</strong>  - this
                creates your own copy and downloads it
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Fork this repo
                <br />
                https://github.com/Rperry2174/cursor-sdlc-workshop
                <br />
                and clone my fork"
              </code>
            </div>
          </div>
        </div>

        {/* IN CURSOR */}
        <div className="check-group work section1">
          <div className="check-group-label">Tell Cursor</div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Create your project folder</strong> at{' '}
                <code>projects/&lt;your-github-username&gt;/</code>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Create a project folder for me at projects/[my-github-username] using the project template"
              </code>
            </div>
          </div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Create a PRD</strong> with{' '}
                <span className="highlight">planned features</span>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Read the prd.md template in projects/[my-github-username]
                <br />
                and help me fill it out. I want to build [idea]."
              </code>
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
                <strong>Tell Cursor to commit, push, and open a PR</strong>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Commit all my changes with the message
                <br />
                '[username] - Initial setup and PRD',
                <br />
                push to my fork, and open a PR to the original repo"
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)

export default Slide07Phase1Plan
