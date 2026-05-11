const Slide07Phase1Plan = () => (
  <>
    <div className="section-header">
      <span className="section-badge section1">Section 1</span>
      <span className="phase-badge">Step 1: Plan in Notion • 10 min</span>
    </div>
    <h2>Turn Your Idea Into a PRD</h2>
    <div className="scrollable">
      <div className="checklist">
        {/* IN NOTION */}
        <div className="check-group work section1">
          <div className="check-group-label">In Notion</div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Explain what you want to build in plain English</strong>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Write in Notion:</span>
                <br />
                "I want to build [simple project idea].
                <br />
                It should do [main behavior] for [user]."
              </code>
            </div>
          </div>
        </div>

        {/* TELL CURSOR */}
        <div className="check-group work section1">
          <div className="check-group-label">Tell Cursor</div>
          <div className="check-item">
            <div className="check-box"></div>
            <div>
              <strong>Connect the Notion MCP in the Agent window</strong>  -
              this lets Cursor read the Notion page you just wrote
            </div>
          </div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Format the Notion page as an official PRD</strong>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Use my Notion page to format this as an official PRD.
                <br />
                Keep the project simple, do not use external APIs,
                <br />
                stub any data that would require API access,
                <br />
                and make the project public."
              </code>
            </div>
          </div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Create a local project folder on the Desktop</strong>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Create a projects folder on my Desktop and
                <br />
                add this project as a folder inside it."
              </code>
            </div>
          </div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Save the Notion PRD as prd.md in the project folder</strong>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Copy the finalized Notion PRD into the project folder
                <br />
                as prd.md so the project has a local Markdown
                <br />
                version of the plan."
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)

export default Slide07Phase1Plan
