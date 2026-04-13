import linkedoutScreenshot from '../assets/linkedout_homepage.png'

const Slide17Transformation = () => (
  <>
    <div className="section-header">
      <span className="section-badge section3">Section 3</span>
      <span className="phase-badge">The Transformation</span>
    </div>
    <h2>Before → After</h2>
    <div className="transformation-compare">
      <div className="transformation-panel">
        <h3 style={{ color: 'var(--red)' }}>😬 You Start With</h3>
        <div className="ugly-site">
          <h1>LinkedOut</h1>
          <hr />
          <p><a href="#">Home</a> | <a href="#">My Network</a> | <a href="#">Jobs</a> | <a href="#">Messaging (3)</a></p>
          <hr />
          <p><strong>My Profile</strong></p>
          <p>[PROFILE PHOTO]<br />Sarah Chen<br />Senior Engineer @ Acme Corp</p>
          <p>Connections: 512 | Followers: 234</p>
          <hr />
          <p><strong>Feed</strong></p>
          <p>Brian McCarthy - 1st<br /><em>New Hire | Father of Many</em></p>
          <p>Thrilled to announce I'm starting a new chapter...</p>
          <p>[Like] [Comment] [Repost] [Send]</p>
          <div className="ugly-counter">Post impressions: 2,103</div>
        </div>
      </div>
      <div className="transformation-panel">
        <h3 style={{ color: 'var(--green)' }}>🎉 You Build</h3>
        <div className="nice-site">
          <img src={linkedoutScreenshot} alt="LinkedOut homepage" />
        </div>
      </div>
    </div>
  </>
)

export default Slide17Transformation
