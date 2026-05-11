const SlideRunProject = () => (
  <>
    <div className="section-header">
      <span className="section-badge section1">Section 1</span>
      <span className="phase-badge">Step 3: Build, Run, Push • 15 min</span>
    </div>
    <h2>Build the Project From the PRD</h2>
    <div className="scrollable">
      <div className="checklist">
        <div className="check-group work section1">
          <div className="check-group-label">In the Agent Window</div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Build the project from the PRD</strong>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Read prd.md, the Markdown copy of my Notion PRD,
                <br />
                and build the project in this folder.
                <br />
                Keep it simple and use stubbed data instead of external APIs."
              </code>
            </div>
          </div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Run the project for me</strong>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Run this project locally and give me the URL
                <br />
                where I can see it."
              </code>
            </div>
          </div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Push the finished project to GitHub</strong>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Commit the finished project, push it to GitHub,
                <br />
                and give me the repo link again."
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="emphasis-box green">
      <strong>Done means:</strong> The app runs locally, the code is pushed,
      and the GitHub repository shows the latest version.
    </div>
  </>
)

export default SlideRunProject
