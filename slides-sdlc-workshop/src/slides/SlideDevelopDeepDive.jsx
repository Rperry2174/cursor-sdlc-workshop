const SlideDevelopDeepDive = () => (
  <>
    <div className="phase-header">
      <div className="phase-number develop">03</div>
      <h2>Problem: Engineers Spend 70% of Time Reading, Not Writing</h2>
    </div>
    <p className="small" style={{ marginBottom: '0.5rem' }}>
      Where the actual code gets written - the core of engineering time and cost
    </p>

    <div className="deepdive-cols">
      <div className="deepdive-col">
        <h3 style={{ color: 'var(--cursor-blue)' }}>Discovery Questions</h3>
        <div className="pain-list">
          <div className="discovery-card">
            <span className="dq-icon">💬</span>
            <span className="dq-text">"How long does it take a new engineer to become productive in your codebase?"</span>
          </div>
          <div className="discovery-card">
            <span className="dq-icon">💬</span>
            <span className="dq-text">"What percentage of engineering time is spent writing new code vs. understanding existing code?"</span>
          </div>
          <div className="discovery-card">
            <span className="dq-icon">💬</span>
            <span className="dq-text">"How do engineers handle boilerplate, migrations, and repetitive patterns today?"</span>
          </div>
          <div className="discovery-card">
            <span className="dq-icon">💬</span>
            <span className="dq-text">"Do your devs use AI coding tools today? What's working and what's not?"</span>
          </div>
        </div>

        <h3 style={{ color: 'var(--red)', marginTop: '0.75rem' }}>Common Pain Points</h3>
        <div className="pain-list">
          <div className="pain-item">
            <span className="pain-icon">🧠</span>
            <span className="pain-text"><strong>Context switching</strong> - devs spend more time reading and navigating code than writing it. Understanding a large codebase is the real bottleneck.</span>
          </div>
          <div className="pain-item">
            <span className="pain-icon">🐢</span>
            <span className="pain-text"><strong>Slow ramp-up</strong> - new hires take months to become productive. Institutional knowledge lives in people's heads, not in tooling.</span>
          </div>
          <div className="pain-item">
            <span className="pain-icon">🔧</span>
            <span className="pain-text"><strong>Boilerplate & toil</strong> - repetitive patterns, config files, migrations - engineers spend hours on work that's necessary but not creative.</span>
          </div>
        </div>
      </div>

      <div className="deepdive-col">
        <h3 style={{ color: 'var(--cursor-blue)' }}>How Cursor Helps</h3>
        <div className="solution-card" style={{ borderColor: 'rgba(38, 139, 210, 0.2)', background: 'linear-gradient(135deg, rgba(38, 139, 210, 0.08), rgba(38, 139, 210, 0.02))' }}>
          <div className="solution-header">
            <span className="solution-icon">🚀</span>
            <span className="solution-title" style={{ color: 'var(--cursor-blue)' }}>AI-Native IDE + Background Agents</span>
          </div>
          <div className="solution-steps">
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--cursor-blue)' }}>1</span>
              <span>Codebase-aware AI understands your entire repo - ask questions, navigate, and get accurate answers grounded in your actual code</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--cursor-blue)' }}>2</span>
              <span>Agent mode handles multi-file changes end-to-end - describe what you want, Cursor implements across files, runs tests, iterates</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--cursor-blue)' }}>3</span>
              <span>Background Agents work in parallel - spin up tasks that run asynchronously while you work on other things</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--cursor-blue)' }}>4</span>
              <span>Rules, context, and MCPs let teams encode their patterns so AI follows company conventions automatically</span>
            </div>
          </div>
        </div>

        <div className="competitor-row">
          <span className="competitor-label">Tools today</span>
          <div className="tool-pills">
            <span className="tool-pill">VS Code</span>
            <span className="tool-pill">GitHub Copilot</span>
            <span className="tool-pill">JetBrains</span>
            <span className="tool-pill">Windsurf</span>
          </div>
        </div>

        <div className="outcome-callout">
          <div className="outcome-label">Outcome</div>
          <div className="outcome-text">
            Engineers go from <strong style={{ color: 'var(--cursor-blue)' }}>spending 70% of time reading code</strong> to having an AI pair that already understands the whole codebase - dramatically accelerating both new and experienced developers
          </div>
        </div>
      </div>
    </div>
  </>
)

export default SlideDevelopDeepDive
