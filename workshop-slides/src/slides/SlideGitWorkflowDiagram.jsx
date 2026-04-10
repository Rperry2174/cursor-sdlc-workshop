const SlideGitWorkflowDiagram = () => (
  <>
    <h2>Git in 60 Seconds: Local → PR → Merged</h2>

    <div className="workflow-grid">
      <div className="workflow-label">Git</div>
      <div className="workflow-step workflow-step-git">
        <div className="workflow-title">Local</div>
        <div className="workflow-sub">Only you can see it</div>
        <ul className="workflow-bullets">
          <li>Edit code, run tests</li>
          <li>Commit checkpoints</li>
        </ul>
      </div>
      <div className="workflow-arrow">→</div>
      <div className="workflow-step workflow-step-git">
        <div className="workflow-title">Pushed + PR</div>
        <div className="workflow-sub">Staged and ready for review</div>
        <ul className="workflow-bullets">
          <li>Others can see your branch</li>
          <li>Automated checks can run</li>
        </ul>
      </div>
      <div className="workflow-arrow">→</div>
      <div className="workflow-step workflow-step-git">
        <div className="workflow-title">Merged</div>
        <div className="workflow-sub">In main (and deployed)</div>
        <ul className="workflow-bullets">
          <li>Official source of truth</li>
          <li>Goes live via CI/CD</li>
        </ul>
      </div>

      <div className="workflow-label">Google Docs</div>
      <div className="workflow-step workflow-step-docs">
        <div className="workflow-title">Your draft</div>
        <div className="workflow-sub">Private copy</div>
        <ul className="workflow-bullets">
          <li>You type freely</li>
          <li>No one else sees it yet</li>
        </ul>
      </div>
      <div className="workflow-arrow">→</div>
      <div className="workflow-step workflow-step-docs">
        <div className="workflow-title">Suggesting</div>
        <div className="workflow-sub">Ready to be accepted</div>
        <ul className="workflow-bullets">
          <li>Visible, reviewable</li>
          <li>Not “in the doc” yet</li>
        </ul>
      </div>
      <div className="workflow-arrow">→</div>
      <div className="workflow-step workflow-step-docs">
        <div className="workflow-title">Accepted</div>
        <div className="workflow-sub">In the main doc</div>
        <ul className="workflow-bullets">
          <li>Becomes the official text</li>
          <li>Everyone sees it</li>
        </ul>
      </div>
    </div>

    <div className="emphasis-box" style={{ marginTop: '1rem' }}>
      <strong>Key point:</strong> The PR is the “suggesting changes” layer  -
      visible, reviewable, and safe  - but not live until it’s merged.
    </div>
  </>
)

export default SlideGitWorkflowDiagram
