const SlideSection3Step2 = () => (
  <>
    <div className="section-header">
      <span className="section-badge section3">Section 3</span>
      <span className="phase-badge">Step 2: Build &amp; Ship • 25 min</span>
    </div>
    <h2>Pick a Task, Build It, Ship It</h2>
    <div className="scrollable">
      <div className="checklist">
        {/* Git START */}
        <div className="check-group git">
          <div className="check-group-label">Git: Start</div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Sync your fork</strong>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Sync my fork with upstream and pull the latest
                <br />
                changes"
              </code>
            </div>
          </div>
        </div>

        {/* IN CURSOR */}
        <div className="check-group work section3">
          <div className="check-group-label">In Cursor</div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Pull design context for your task</strong>  - let Figma
                tell Cursor exactly what to build
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Use the Figma MCP get_design_context on the
                <br />
                [frame name] frame from the LinkedOut Design.
                <br />
                Then implement it in our codebase."
              </code>
            </div>
          </div>
          <div className="check-item">
            <div className="check-box"></div>
            <div>
              <strong>Run the app</strong>  - <code>npm install && npm run dev</code>{' '}
              in your team folder
            </div>
          </div>
          <div className="check-item">
            <div className="check-box"></div>
            <div>
              <strong>Iterate with Agent Mode</strong>  - refine the design,
              fix issues, match the Figma annotations
            </div>
          </div>
          <div className="check-item">
            <div className="check-box"></div>
            <div>
              <strong>Test in browser</strong>  - verify your feature works
              before committing
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
                "Commit with message 'Add [feature]',
                <br />
                push and open a PR"
              </code>
            </div>
          </div>
        </div>
      </div>
      <div className="emphasis-box purple">
        <strong>Remember:</strong> Stay in your team's folder. PRs over 500
        lines get rejected. Everyone must ship at least 1 merged PR.
      </div>
    </div>
  </>
)

export default SlideSection3Step2
