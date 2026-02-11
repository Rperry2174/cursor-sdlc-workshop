import './AboutUs.css';

function AboutUs({ onBack }) {
  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/wardrobegen',
      icon: '📸',
      handle: '@wardrobegen'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/wardrobegen',
      icon: '🐦',
      handle: '@wardrobegen'
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com/@wardrobegen',
      icon: '🎵',
      handle: '@wardrobegen'
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/wardrobegen',
      icon: '👍',
      handle: 'Wardrobe Generator'
    }
  ];

  return (
    <div className="about-us">
      {onBack && (
        <button className="back-btn" onClick={onBack}>
          ← Back to Generator
        </button>
      )}

      <h1 className="about-title">About Us</h1>
      <p className="about-tagline">Your AI-Powered Style Companion</p>

      <div className="about-card">
        <p className="about-description">
          Welcome to <strong>Wardrobe Generator</strong> — your smart outfit picker 
          powered by AI. We help you discover the perfect outfit for any occasion, 
          whether you're dressing for a casual day out, an important work meeting, 
          a fun party, or an active sport session.
        </p>
        
        <p className="about-description">
          No matter the season — sunny summer days, cozy winter evenings, 
          refreshing spring mornings, or crisp fall afternoons — we've got you covered. 
          Our intelligent algorithm considers weather, dress codes, and color coordination 
          to generate outfits that make you look and feel your best.
        </p>
      </div>

      <div className="about-card">
        <h2 className="about-section-title">What We Offer</h2>
        <div className="features-list">
          <div className="feature-item">🌞 Season-smart outfit suggestions</div>
          <div className="feature-item">👔 Occasion-appropriate styling</div>
          <div className="feature-item">🎨 Color palette matching</div>
          <div className="feature-item">💾 Save your favorite outfits</div>
          <div className="feature-item">🎰 Fun, randomized generation</div>
        </div>
      </div>

      <div className="about-card">
        <h2 className="about-section-title">Follow Us</h2>
        <p className="about-social-subtitle">Stay connected for style tips and outfit inspiration!</p>
        
        <div className="social-links">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label={`Follow us on ${social.name}`}
            >
              <span className="social-icon">{social.icon}</span>
              <span className="social-name">{social.name}</span>
              <span className="social-handle">{social.handle}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="about-card">
        <h2 className="about-section-title">Meet Our Pro Stylists</h2>
        <div className="stylists-list">
          <a href="https://www.linkedin.com/in/raznar/" target="_blank" rel="noopener noreferrer" className="stylist-item">
            <img 
              src="https://media.licdn.com/dms/image/v2/D5603AQHVsy87C2OjsQ/profile-displayphoto-shrink_800_800/B56ZVeCwPEGQAc-/0/1741039536689?e=1772668800&v=beta&t=cEpPc7PaQL-DS3lhHiXyVJx_6rRSW2P9EVCoLU0MbtU" 
              alt="Ryan Aznar" 
              className="stylist-photo"
            />
            <span className="stylist-name">Ryan Aznar</span>
          </a>
          <a href="https://www.linkedin.com/in/zoe-barnswell-00024b121/" target="_blank" rel="noopener noreferrer" className="stylist-item">
            <img 
              src="https://media.licdn.com/dms/image/v2/D4E03AQHw_Gpuk-Salg/profile-displayphoto-crop_800_800/B4EZoN3vIUHMAI-/0/1761169306594?e=1772668800&v=beta&t=cAd33doetBKdaUSXl5b-ZShwsxE_BF4e1ClaDdLiO9k" 
              alt="Zoe Barnswell" 
              className="stylist-photo"
            />
            <span className="stylist-name">Zoe Barnswell</span>
          </a>
          <a href="https://www.linkedin.com/in/xuaudrey/" target="_blank" rel="noopener noreferrer" className="stylist-item">
            <img 
              src="https://media.licdn.com/dms/image/v2/D5603AQG0378YPTiZqQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1682514813257?e=1772668800&v=beta&t=IVmpKPP-TaaSZF7IJ6ze7SNDpsLOQlvBAm1VCy5DQvw" 
              alt="Audrey Leung" 
              className="stylist-photo"
            />
            <span className="stylist-name">Audrey Leung</span>
          </a>
          <a href="https://www.linkedin.com/in/faisalshaikh96/" target="_blank" rel="noopener noreferrer" className="stylist-item">
            <img 
              src="https://media.licdn.com/dms/image/v2/D5603AQE-QELUckF8jQ/profile-displayphoto-crop_800_800/B56ZsBN.sWHYAI-/0/1765252001314?e=1772668800&v=beta&t=M5IAzvGNuPl91LSdz4LWEyVMws1FWK8_jeFMc4TvAek" 
              alt="Faisal Shaikh" 
              className="stylist-photo"
            />
            <span className="stylist-name">Faisal Shaikh</span>
          </a>
          <a href="https://www.linkedin.com/in/noahzender/" target="_blank" rel="noopener noreferrer" className="stylist-item">
            <img 
              src="https://media.licdn.com/dms/image/v2/D5603AQE0GHyG70c-ow/profile-displayphoto-crop_800_800/B56ZxNVk9mKAAI-/0/1770824028483?e=1772668800&v=beta&t=Z5aWbMtF-uE2I8tvNoVJfwcFpr59BGpsRO4i4GlCTvk" 
              alt="Noah Zender" 
              className="stylist-photo"
            />
            <span className="stylist-name">Noah Zender</span>
          </a>
          <a href="https://www.linkedin.com/in/will-ziesing/" target="_blank" rel="noopener noreferrer" className="stylist-item">
            <img 
              src="https://media.licdn.com/dms/image/v2/C5603AQFgRpid9SbVbQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1608167211300?e=1772668800&v=beta&t=BxF74vsStFJxo9p3qFSyrsnstw9JbZb1mmUS3-qKzZg" 
              alt="Will Ziesing" 
              className="stylist-photo"
            />
            <span className="stylist-name">Will Ziesing</span>
          </a>
        </div>
      </div>

      <footer className="about-footer">
        <p>Made with ❤️ by our Pro Stylists</p>
      </footer>
    </div>
  );
}

export default AboutUs;
