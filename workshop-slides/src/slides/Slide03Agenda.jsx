const Slide03Agenda = () => (
  <>
    <h2>Agenda</h2>
    <div className="timeline">
      <div className="timeline-item">
        <div className="timeline-number gray">0</div>
        <div className="timeline-content">
          <div className="timeline-title">Pre-Work Setup</div>
          <div className="timeline-desc">Get Cursor, Terminal, and Git ready</div>
        </div>
        <div className="timeline-duration">10 min</div>
      </div>
      <div className="timeline-item">
        <div className="timeline-number green">1</div>
        <div className="timeline-content">
          <div className="timeline-title">Greenfield Project</div>
          <div className="timeline-desc">Build something new from scratch individually</div>
        </div>
        <div className="timeline-duration">25 min</div>
      </div>
      <div className="timeline-item">
        <div className="timeline-number orange">2</div>
        <div className="timeline-content">
          <div className="timeline-title">Legacy Codebase</div>
          <div className="timeline-desc">Jump into unfamiliar code and add features</div>
        </div>
        <div className="timeline-duration">25 min</div>
      </div>
      <div className="timeline-item">
        <div className="timeline-number purple">3</div>
        <div className="timeline-content">
          <div className="timeline-title">Real-World Chaos</div>
          <div className="timeline-desc">Compete to build the best LinkedIn clone from a Figma design</div>
        </div>
        <div className="timeline-duration">35 min</div>
      </div>
    </div>
  </>
)

export default Slide03Agenda
