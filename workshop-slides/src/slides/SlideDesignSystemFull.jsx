const SlideDesignSystemFull = () => (
  <>
    <div className="phase-header" style={{ marginBottom: '0.5rem' }}>
      <div className="phase-number design">02</div>
      <h2 style={{ marginBottom: 0 }}>Example: A Design System in Figma</h2>
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
        src="/images/figma-design-system.png"
        alt="Figma design system with components, pages, and prototype connections"
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

export default SlideDesignSystemFull
