const Slide08Phase2Design = () => (
  <>
    <div className="section-header">
      <span className="section-badge section1">Section 1</span>
      <span className="phase-badge">Step 2: Publish to GitHub • 5 min</span>
    </div>
    <h2>Create the GitHub Repo</h2>
    <div className="scrollable">
      <div className="checklist">
        {/* IN CURSOR */}
          <div className="check-group work section1">
            <div className="check-group-label">In the Agent Window</div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Open the local project folder</strong>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Open ~/Desktop/projects/[project-name] in Cursor."
              </code>
            </div>
          </div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Create a public GitHub repository and push the project</strong>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Create a GitHub repository for this project,
                <br />
                make the repository public, and push
                <br />
                the current project to it."
              </code>
            </div>
          </div>
          <div className="check-item has-code">
            <div className="check-header">
              <div className="check-box"></div>
              <div>
                <strong>Check GitHub</strong>
              </div>
            </div>
            <div className="code-block">
              <code>
                <span className="comment">Ask Cursor:</span>
                <br />
                "Give me the GitHub repository link so I can open it
                <br />
                and confirm the project is there."
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
)

export default Slide08Phase2Design
