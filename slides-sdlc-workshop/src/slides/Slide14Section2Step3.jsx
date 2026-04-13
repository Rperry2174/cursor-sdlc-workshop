const Slide14Section2Step3 = () => (
  <>
    <div className="section-header">
      <span className="section-badge section2">Section 2</span>
      <span className="phase-badge">Step 3: Build Your Feature • 10 min</span>
    </div>
    <h2>Implement &amp; Ship</h2>
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
        <div className="check-group work section2">
          <div className="check-group-label">In Cursor</div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Create a Hook</strong>  - automate commit message
                validation
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Create a Cursor Hook that runs before git commit
                <br />
                and validates the commit message starts with
                <br />
                your username (e.g. 'username:')."
              </code>
            </div>
          </div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Pull your requirements from Notion</strong>  - search
                for your PRD and find your feature
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Search Notion for your SDLC Workshop PRD
                <br />
                and find the feature assigned to me ([your GitHub
                <br />
                username]). What do I need to build?"
              </code>
            </div>
          </div>
          <div className="check-item">
            <div className="check-box"></div>
            <div>
              <strong>Use Plan Mode first</strong>  - design your approach before
              writing code, using the requirements from Notion
            </div>
          </div>
          <div className="check-item">
            <div className="check-box"></div>
            <div>
              <strong>Implement using Agent Mode</strong>  - tell Cursor what to
              build and let it work
            </div>
          </div>
          <div className="check-item">
            <div className="check-box"></div>
            <div>
              <strong>Test it</strong>  - run the app and verify your feature
              works before committing
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
      <div className="emphasis-box orange">
        <strong>Section 2 Complete</strong>  - You explored unfamiliar code,
        created your own Rule, Skill, and Hook, then planned and shipped
        improvements. You didn't just use Cursor  - you customized it.
      </div>
    </div>
  </>
)

export default Slide14Section2Step3
