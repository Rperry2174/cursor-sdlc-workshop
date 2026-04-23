import GolfTurfQuote from './components/GolfTurfQuote.jsx';
import './App.css';

/** Official Greens on Q logo (GoDaddy-hosted asset from greensonq.com). */
const GREENS_ON_Q_LOGO =
  'https://img1.wsimg.com/isteam/ip/ef9ff587-fccd-459e-a80e-c47de187afc4/Black%20logo%20-%20no%20background.svg/:/rs=w:200,h:200,m';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <span className="app-logo-wrap">
            <img
              className="app-logo"
              src={GREENS_ON_Q_LOGO}
              alt="Greens on Q"
              width={120}
              height={120}
              decoding="async"
            />
          </span>
          <div className="app-header-text">
            <h1 className="app-title">Quote estimate</h1>
            <p className="app-subtitle">
              Premium golf turf scope — area breakdown, pricing table, and site access
              adjustment. Browser-only; no sign-in required.
            </p>
          </div>
        </div>
      </header>
      <main className="app-main">
        <GolfTurfQuote />
      </main>
      <footer className="app-footer">
        <p>Workshop MVP — indicative estimate. Rates are fixed in code for this demo.</p>
      </footer>
    </div>
  );
}
