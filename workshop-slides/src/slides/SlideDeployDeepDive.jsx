const SlideDeployDeepDive = () => (
  <>
    <div className="phase-header">
      <div className="phase-number deploy">06</div>
      <h2>Problem: Deployment is Manual, Risky, and Slow</h2>
    </div>
    <p className="small" style={{ marginBottom: '0.5rem' }}>
      Getting code to production - and the infrastructure complexity that slows teams down
    </p>

    <div className="deepdive-cols">
      <div className="deepdive-col">
        <h3 style={{ color: 'var(--red)' }}>Discovery Questions</h3>
        <div className="pain-list">
          <div className="discovery-card">
            <span className="dq-icon">💬</span>
            <span className="dq-text">"How often do you deploy? Daily, weekly, or less frequently? What gates the frequency?"</span>
          </div>
          <div className="discovery-card">
            <span className="dq-icon">💬</span>
            <span className="dq-text">"How much DevOps / infrastructure work is handled by your engineers vs. a dedicated platform team?"</span>
          </div>
          <div className="discovery-card">
            <span className="dq-icon">💬</span>
            <span className="dq-text">"What does your deployment pipeline look like? How much of it is manual vs. automated?"</span>
          </div>
          <div className="discovery-card">
            <span className="dq-icon">💬</span>
            <span className="dq-text">"How do you handle rollbacks, canary deploys, or feature flags?"</span>
          </div>
        </div>

        <h3 style={{ color: 'var(--red)', marginTop: '0.75rem' }}>Common Pain Points</h3>
        <div className="pain-list">
          <div className="pain-item">
            <span className="pain-icon">🏗️</span>
            <span className="pain-text"><strong>Infrastructure complexity</strong> - Terraform, Docker, K8s, CI/CD - the deployment stack is as complex as the app itself. Few people understand it all.</span>
          </div>
          <div className="pain-item">
            <span className="pain-icon">😨</span>
            <span className="pain-text"><strong>Deploy fear</strong> - teams deploy infrequently because it's risky. Bigger batches mean bigger failures. The cycle reinforces itself.</span>
          </div>
          <div className="pain-item">
            <span className="pain-icon">🔧</span>
            <span className="pain-text"><strong>Config drift</strong> - environment differences between dev, staging, and prod cause "works on my machine" bugs that only appear in production.</span>
          </div>
        </div>
      </div>

      <div className="deepdive-col">
        <h3 style={{ color: 'var(--red)' }}>How Cursor Helps</h3>
        <div className="solution-card" style={{ borderColor: 'rgba(220, 50, 47, 0.2)', background: 'linear-gradient(135deg, rgba(220, 50, 47, 0.08), rgba(220, 50, 47, 0.02))' }}>
          <div className="solution-header">
            <span className="solution-icon">☁️</span>
            <span className="solution-title" style={{ color: 'var(--red)' }}>AI-Assisted DevOps + MCPs</span>
          </div>
          <div className="solution-steps">
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--red)' }}>1</span>
              <span>Cursor understands infrastructure-as-code (Terraform, Dockerfiles, K8s manifests) and can generate, modify, and debug configs</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--red)' }}>2</span>
              <span>MCPs connect Cursor to cloud providers and deployment platforms - query status, trigger deploys, read logs without leaving the IDE</span>
            </div>
            <div className="solution-step">
              <span className="step-num" style={{ background: 'var(--red)' }}>3</span>
              <span>When deploys fail, Cursor reads error logs and suggests fixes - closing the loop between "it broke" and "here's the fix"</span>
            </div>
          </div>
        </div>

        <div className="competitor-row">
          <span className="competitor-label">Tools today</span>
          <div className="tool-pills">
            <span className="tool-pill">AWS</span>
            <span className="tool-pill">Docker</span>
            <span className="tool-pill">Kubernetes</span>
            <span className="tool-pill">Terraform</span>
            <span className="tool-pill">Vercel</span>
          </div>
        </div>

        <div className="outcome-callout" style={{ background: 'linear-gradient(135deg, rgba(220, 50, 47, 0.1), rgba(220, 50, 47, 0.03))', borderColor: 'rgba(220, 50, 47, 0.25)' }}>
          <div className="outcome-label" style={{ color: 'var(--red)' }}>Outcome</div>
          <div className="outcome-text">
            Infrastructure stops being a <strong style={{ color: 'var(--red)' }}>black box owned by 2 people</strong> - any engineer can confidently work with deployment configs because AI understands them
          </div>
        </div>
      </div>
    </div>
  </>
)

export default SlideDeployDeepDive
