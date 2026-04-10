const Slide05PreWork = () => (
  <>
    <div className="section-header">
      <span className="section-badge prework">Pre-Work</span>
      <span className="phase-badge">Environment Setup • 10 min</span>
    </div>
    <h2>Get Set Up</h2>
    <div className="checklist">
      <div className="check-item has-code">
        <div className="check-header">
          <div className="check-box"></div>
          <div>
            <strong>Download &amp; Install Cursor</strong>  - should already be on
            your machine
          </div>
        </div>
      </div>
      <div className="check-item has-code">
        <div className="check-header">
          <div className="check-box"></div>
          <div>
            <strong>Open Terminal</strong>
          </div>
        </div>
        <div className="code-block">
          <code>
            <span className="command">Cmd+Space</span> → type "Terminal" → Enter
          </code>
        </div>
      </div>
      <div className="check-item has-code">
        <div className="check-header">
          <div className="check-box"></div>
          <div>
            <strong>Copy the setup script from GitHub</strong>
          </div>
        </div>
        <div className="code-block">
          <code>
            cd ~/Desktop
            <br />
            curl -L -o setup-cursor-agent.sh{' '}
            https://raw.githubusercontent.com/Rperry2174/cursor-sdlc-workshop/main/setup-cursor-agent.sh
          </code>
        </div>
      </div>
      <div className="check-item has-code">
        <div className="check-header">
          <div className="check-box"></div>
          <div>
            <strong>Run the setup script</strong>  - installs everything
            (Homebrew, Git, GitHub CLI, Node.js, Cursor CLI)
          </div>
        </div>
        <div className="code-block">
          <code>bash setup-cursor-agent.sh</code>
        </div>
      </div>
      <div className="check-item has-code">
        <div className="check-header">
          <div className="check-box"></div>
          <div>
            <strong>Verify it worked</strong>
          </div>
        </div>
        <div className="code-block">
          <code>
            git --version
            <br />
            cursor --version
          </code>
        </div>
      </div>
    </div>
    <div className="emphasis-box">
      <strong>The script handles everything:</strong> Homebrew, Git, GitHub CLI,
      Node.js, and the Cursor CLI  - all in one command.
    </div>
  </>
)

export default Slide05PreWork
