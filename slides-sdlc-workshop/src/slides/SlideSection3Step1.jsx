const SlideSection3Step1 = () => (
  <>
    <div className="section-header">
      <span className="section-badge section3">Section 3</span>
      <span className="phase-badge">Step 1: Setup &amp; Plan • 10 min</span>
    </div>
    <h2>Connect Figma, Join Your Team, Build Your PRD</h2>
    <div className="scrollable">
      <div className="checklist">
        <div className="check-item has-code">
          <div className="check-header">
            <div className="check-box"></div>
            <div>
              <strong>Add the Figma MCP</strong>  - connect Cursor to the design
              file
            </div>
          </div>
          <div className="code-block">
            <code>
              <span className="comment">Cursor Settings {'>'} MCP {'>'} Add Figma</span>
            </code>
          </div>
        </div>
        <div className="check-item has-code">
          <div className="check-header">
            <div className="check-box"></div>
            <div>
              <strong>Navigate to your team folder</strong>  -{' '}
              <code>linkedout/team_X/</code>
            </div>
          </div>
          <div className="code-block">
            <code>
              <span className="comment">Your team folder has everything:</span>
              <br />
              linkedout/team_1/ through linkedout/team_5/
            </code>
          </div>
        </div>
        <div className="check-item has-code">
          <div className="check-header">
            <div className="check-box"></div>
            <div>
              <strong>Add your member file</strong>  - just like Section 1
            </div>
          </div>
          <div className="code-block">
            <code>
              <span className="comment">Ask Cursor:</span>
              <br />
              "Add me to this team. My name is [name]
              <br />
              and my GitHub username is [username]."
            </code>
          </div>
        </div>
        <div className="check-item has-code">
          <div className="check-header">
            <div className="check-box"></div>
            <div>
              <strong>Pull the Figma design breakdown</strong>  - see every
              section annotated with what to build
            </div>
          </div>
          <div className="code-block">
            <code>
              <span className="comment">Ask Cursor:</span>
              <br />
              "Use the Figma MCP to get_metadata on this design:
              <br />
              figma.com/design/jXTg8QTUoESBYL5x0KHZvD/LinkedOut-Design
              <br />
              List every frame and sub-frame with annotations."
            </code>
          </div>
        </div>
        <div className="check-item has-code">
          <div className="check-header">
            <div className="check-box"></div>
            <div>
              <strong>Generate your PRD</strong>  - write it to{' '}
              <span className="highlight-purple">Notion</span> and/or create{' '}
              <span className="highlight-purple">GitHub Issues</span>
            </div>
          </div>
          <div className="code-block">
            <code>
              <span className="comment">Ask Cursor:</span>
              <br />
              "Based on the Figma breakdown, create a PRD for
              <br />
              our team. Write it to Notion and/or create GitHub
              <br />
              Issues  - one per task, assigned to team members.
              <br />
              Also save as prd.md in our team folder."
            </code>
          </div>
        </div>
      </div>
      <div className="emphasis-box purple">
        <strong>This is the real workflow:</strong> Designer creates Figma
        mockups → AI reads the design → generates a PRD → team divides the
        work. What used to take days happens in minutes.
      </div>
    </div>
  </>
)

export default SlideSection3Step1
