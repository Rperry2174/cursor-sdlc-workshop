const SlidePlanPrdExample = () => (
  <>
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
    }}>
      <div className="phase-header" style={{ marginBottom: 0 }}>
        <div className="phase-number plan">01</div>
        <h2 style={{ marginBottom: 0 }}>Plan — What a PRD Looks Like</h2>
      </div>
      <a
        href="https://www.notion.so/cursorai/Auto-Premium-Model-Routing-326da74ef045808a9ad0e306e7dbc4d0"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: '0.7rem', fontWeight: 600, color: 'var(--cyan)',
          textDecoration: 'none', padding: '0.25rem 0.6rem',
          background: 'rgba(42, 161, 152, 0.1)', borderRadius: '100px',
          border: '1px solid rgba(42, 161, 152, 0.2)',
          fontStyle: 'normal',
        }}
      >
        Real example from the Cursor team — Open in Notion ↗
      </a>
    </div>

    <div style={{
      flex: 1,
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      display: 'flex',
    }}>
      <img
        src="/images/prd-example-notion.png"
        alt="PRD example in Notion — Auto Premium Model Routing"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top left',
          display: 'block',
        }}
      />
    </div>
  </>
)

export default SlidePlanPrdExample
