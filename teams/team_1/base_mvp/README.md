# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Component: About Us Page

The `AboutUs` component provides an "About Us" page for the Wardrobe Generator app, describing the AI-powered outfit picker service and including social media links.

### Location

```
src/components/AboutUs.jsx
src/components/AboutUs.css
```

### Integration

#### Option 1: Add Directly to App.jsx (No Routing)

```jsx
import AboutUs from './components/AboutUs';

function App() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div>
      <button onClick={() => setShowAbout(!showAbout)}>
        {showAbout ? 'Back to App' : 'About Us'}
      </button>
      
      {showAbout ? <AboutUs /> : (
        // Your main app content here
      )}
    </div>
  );
}
```

#### Option 2: With React Router

First, install React Router:

```bash
npm install react-router-dom
```

Then update your App.jsx:

```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AboutUs from './components/AboutUs';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About Us</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={/* Your main outfit picker */} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Features

- AI-powered outfit picker description
- Covers all occasions (Casual, Work, Party, Sport) and seasons
- Social media links (Instagram, Twitter, TikTok, Facebook)
- Responsive design (mobile and desktop)
- Modern card-style layout with hover effects

### Customization

To update social media links, edit the `socialLinks` array in `AboutUs.jsx`:

```jsx
const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/your-handle',
    icon: '📸',
    handle: '@your-handle'
  },
  // ... more links
];
```
