#!/usr/bin/env node
// Script to generate SVG clothing illustrations for the wardrobe app
const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, 'src/assets/clothing');

// Color map for named colors to hex
const colorMap = {
  white: '#F5F5F5',
  black: '#2D2D2D',
  navy: '#1B3A5C',
  blue: '#4A7FB5',
  red: '#C9463D',
  green: '#4A7A5B',
  khaki: '#C3B091',
  gray: '#8B8B8B',
  pink: '#E8A0BF',
  brown: '#8B6340',
};

function darken(hex, amount = 30) {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

function lighten(hex, amount = 40) {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

function svgWrap(inner, bg = '#F8F6F3') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" rx="16" fill="${bg}"/>
  ${inner}
</svg>`;
}

// ── TOPS ──────────────────────────────────────────────

function tshirt(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,105)">
    <!-- body -->
    <path d="M-42,-45 L-42,50 Q-42,55 -37,55 L37,55 Q42,55 42,50 L42,-45 L25,-45 Q20,-30 0,-28 Q-20,-30 -25,-45 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- sleeves -->
    <path d="M-42,-45 L-65,-25 L-55,-15 L-42,-20 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <path d="M42,-45 L65,-25 L55,-15 L42,-20 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- collar -->
    <path d="M-25,-45 Q-15,-55 0,-52 Q15,-55 25,-45 Q20,-30 0,-28 Q-20,-30 -25,-45 Z" fill="${lighten(c, 15)}" stroke="${d}" stroke-width="1.5"/>
  </g>`);
}

function hoodie(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,108)">
    <!-- body -->
    <path d="M-45,-48 L-45,50 Q-45,55 -40,55 L40,55 Q45,55 45,50 L45,-48 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- sleeves -->
    <path d="M-45,-40 L-68,-18 L-58,-8 L-45,-15 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <path d="M45,-40 L68,-18 L58,-8 L45,-15 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- hood -->
    <path d="M-30,-48 Q-35,-70 0,-72 Q35,-70 30,-48 Z" fill="${lighten(c, 20)}" stroke="${d}" stroke-width="2"/>
    <!-- pocket -->
    <rect x="-22" y="15" width="44" height="20" rx="4" fill="${darken(c, 15)}" stroke="${d}" stroke-width="1"/>
    <!-- drawstrings -->
    <line x1="-5" y1="-48" x2="-8" y2="-30" stroke="${lighten(c, 60)}" stroke-width="1.5"/>
    <line x1="5" y1="-48" x2="8" y2="-30" stroke="${lighten(c, 60)}" stroke-width="1.5"/>
  </g>`);
}

function blazer(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,108)">
    <!-- body -->
    <path d="M-42,-48 L-45,52 Q-45,55 -40,55 L40,55 Q45,55 45,52 L42,-48 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- lapels -->
    <path d="M-10,-48 L-20,-20 L-5,-15 L0,-48 Z" fill="${lighten(c, 30)}" stroke="${d}" stroke-width="1.5"/>
    <path d="M10,-48 L20,-20 L5,-15 L0,-48 Z" fill="${lighten(c, 30)}" stroke="${d}" stroke-width="1.5"/>
    <!-- sleeves -->
    <path d="M-42,-40 L-65,-18 L-58,-5 L-45,-12 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <path d="M42,-40 L65,-18 L58,-5 L45,-12 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- buttons -->
    <circle cx="0" cy="5" r="3" fill="${darken(c, 40)}"/>
    <circle cx="0" cy="20" r="3" fill="${darken(c, 40)}"/>
    <!-- center line -->
    <line x1="0" y1="-15" x2="0" y2="55" stroke="${d}" stroke-width="1"/>
    <!-- pocket -->
    <rect x="8" y="10" width="18" height="2" rx="1" fill="${d}"/>
    <rect x="-26" y="10" width="18" height="2" rx="1" fill="${d}"/>
  </g>`);
}

function denimJacket(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,108)">
    <!-- body -->
    <path d="M-42,-45 L-44,48 Q-44,52 -39,52 L39,52 Q44,52 44,48 L42,-45 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- sleeves -->
    <path d="M-42,-38 L-65,-16 L-56,-4 L-42,-12 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <path d="M42,-38 L65,-16 L56,-4 L42,-12 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- collar -->
    <path d="M-25,-45 L-30,-58 L-10,-50 L0,-45 L10,-50 L30,-58 L25,-45 Z" fill="${lighten(c, 20)}" stroke="${d}" stroke-width="1.5"/>
    <!-- center line / zipper -->
    <line x1="0" y1="-45" x2="0" y2="52" stroke="${d}" stroke-width="1.5"/>
    <!-- chest pockets -->
    <rect x="-30" y="-25" width="22" height="16" rx="2" fill="${darken(c, 15)}" stroke="${d}" stroke-width="1"/>
    <rect x="8" y="-25" width="22" height="16" rx="2" fill="${darken(c, 15)}" stroke="${d}" stroke-width="1"/>
    <!-- stitching -->
    <line x1="-42" y1="15" x2="0" y2="15" stroke="${lighten(c, 30)}" stroke-width="0.8" stroke-dasharray="3,2"/>
    <line x1="0" y1="15" x2="42" y2="15" stroke="${lighten(c, 30)}" stroke-width="0.8" stroke-dasharray="3,2"/>
  </g>`);
}

function hawaiianShirt(c) {
  const d = darken(c);
  const accent = '#F4D03F';
  return svgWrap(`
  <g transform="translate(100,105)">
    <!-- body -->
    <path d="M-42,-45 L-42,50 Q-42,55 -37,55 L37,55 Q42,55 42,50 L42,-45 L25,-45 Q20,-30 0,-28 Q-20,-30 -25,-45 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- sleeves -->
    <path d="M-42,-45 L-65,-25 L-55,-10 L-42,-18 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <path d="M42,-45 L65,-25 L55,-10 L42,-18 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- collar -->
    <path d="M-25,-45 Q-15,-55 0,-52 Q15,-55 25,-45 Q20,-30 0,-28 Q-20,-30 -25,-45 Z" fill="${lighten(c, 25)}" stroke="${d}" stroke-width="1.5"/>
    <!-- tropical flowers/patterns -->
    <circle cx="-18" cy="5" r="8" fill="${accent}" opacity="0.6"/>
    <circle cx="20" cy="-10" r="6" fill="#4CAF50" opacity="0.5"/>
    <circle cx="-5" cy="30" r="7" fill="${accent}" opacity="0.5"/>
    <circle cx="25" cy="25" r="5" fill="#4CAF50" opacity="0.5"/>
    <circle cx="-25" cy="35" r="5" fill="${accent}" opacity="0.4"/>
    <circle cx="12" cy="45" r="6" fill="#4CAF50" opacity="0.4"/>
    <!-- leaf shapes -->
    <ellipse cx="-15" cy="18" rx="4" ry="10" transform="rotate(-30 -15 18)" fill="#4CAF50" opacity="0.4"/>
    <ellipse cx="22" cy="8" rx="3" ry="8" transform="rotate(20 22 8)" fill="${accent}" opacity="0.35"/>
    <!-- center line -->
    <line x1="0" y1="-28" x2="0" y2="55" stroke="${d}" stroke-width="1"/>
  </g>`);
}

function sweater(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,108)">
    <!-- body -->
    <path d="M-44,-45 L-44,50 Q-44,55 -39,55 L39,55 Q44,55 44,50 L44,-45 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- sleeves -->
    <path d="M-44,-38 L-68,-15 L-58,-2 L-44,-10 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <path d="M44,-38 L68,-15 L58,-2 L44,-10 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- collar (crew neck) -->
    <path d="M-20,-45 Q0,-55 20,-45 Q15,-38 0,-36 Q-15,-38 -20,-45 Z" fill="${darken(c, 15)}" stroke="${d}" stroke-width="1.5"/>
    <!-- ribbing at bottom -->
    <rect x="-44" y="42" width="88" height="13" rx="2" fill="${darken(c, 12)}" stroke="${d}" stroke-width="1"/>
    <!-- cable knit pattern -->
    <path d="M-15,-20 Q-10,-10 -15,0 Q-10,10 -15,20 Q-10,30 -15,40" fill="none" stroke="${lighten(c, 25)}" stroke-width="1.5"/>
    <path d="M0,-20 Q5,-10 0,0 Q5,10 0,20 Q5,30 0,40" fill="none" stroke="${lighten(c, 25)}" stroke-width="1.5"/>
    <path d="M15,-20 Q20,-10 15,0 Q20,10 15,20 Q20,30 15,40" fill="none" stroke="${lighten(c, 25)}" stroke-width="1.5"/>
  </g>`);
}

function poloShirt(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,105)">
    <!-- body -->
    <path d="M-42,-45 L-42,50 Q-42,55 -37,55 L37,55 Q42,55 42,50 L42,-45 L25,-45 Q20,-30 0,-28 Q-20,-30 -25,-45 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- sleeves -->
    <path d="M-42,-45 L-62,-28 L-52,-18 L-42,-22 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <path d="M42,-45 L62,-28 L52,-18 L42,-22 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- collar (polo style - larger) -->
    <path d="M-25,-45 Q-28,-58 -15,-55 L0,-48 L15,-55 Q28,-58 25,-45 Q20,-30 0,-28 Q-20,-30 -25,-45 Z" fill="${lighten(c, 20)}" stroke="${d}" stroke-width="1.5"/>
    <!-- placket -->
    <rect x="-4" y="-28" width="8" height="25" rx="1" fill="${lighten(c, 10)}" stroke="${d}" stroke-width="1"/>
    <!-- buttons -->
    <circle cx="0" cy="-20" r="2.5" fill="${darken(c, 50)}"/>
    <circle cx="0" cy="-10" r="2.5" fill="${darken(c, 50)}"/>
    <!-- sleeve ribbing -->
    <line x1="-52" y1="-18" x2="-42" y2="-22" stroke="${darken(c, 20)}" stroke-width="2.5"/>
    <line x1="52" y1="-18" x2="42" y2="-22" stroke="${darken(c, 20)}" stroke-width="2.5"/>
  </g>`);
}

function tankTop(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,105)">
    <!-- body -->
    <path d="M-32,-40 L-35,50 Q-35,55 -30,55 L30,55 Q35,55 35,50 L32,-40 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- straps -->
    <path d="M-20,-40 L-18,-60 Q-10,-65 0,-60" fill="none" stroke="${c}" stroke-width="8"/>
    <path d="M20,-40 L18,-60 Q10,-65 0,-60" fill="none" stroke="${c}" stroke-width="8"/>
    <path d="M-20,-40 L-18,-60 Q-10,-65 0,-60" fill="none" stroke="${d}" stroke-width="2"/>
    <path d="M20,-40 L18,-60 Q10,-65 0,-60" fill="none" stroke="${d}" stroke-width="2"/>
    <!-- neckline -->
    <path d="M-20,-40 Q0,-30 20,-40" fill="none" stroke="${d}" stroke-width="2"/>
    <!-- armholes -->
    <path d="M-32,-35 Q-38,-20 -35,0" fill="none" stroke="${d}" stroke-width="2"/>
    <path d="M32,-35 Q38,-20 35,0" fill="none" stroke="${d}" stroke-width="2"/>
  </g>`);
}

function flannelShirt(c) {
  const d = darken(c);
  const stripe = darken(c, 50);
  return svgWrap(`
  <g transform="translate(100,105)">
    <!-- body -->
    <path d="M-42,-45 L-42,50 Q-42,55 -37,55 L37,55 Q42,55 42,50 L42,-45 L25,-45 Q20,-30 0,-28 Q-20,-30 -25,-45 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- sleeves -->
    <path d="M-42,-45 L-65,-25 L-55,-10 L-42,-18 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <path d="M42,-45 L65,-25 L55,-10 L42,-18 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- plaid horizontal lines -->
    <line x1="-42" y1="-15" x2="42" y2="-15" stroke="${stripe}" stroke-width="2" opacity="0.4"/>
    <line x1="-42" y1="5" x2="42" y2="5" stroke="${stripe}" stroke-width="2" opacity="0.4"/>
    <line x1="-42" y1="25" x2="42" y2="25" stroke="${stripe}" stroke-width="2" opacity="0.4"/>
    <line x1="-42" y1="45" x2="42" y2="45" stroke="${stripe}" stroke-width="2" opacity="0.4"/>
    <!-- plaid vertical lines -->
    <line x1="-25" y1="-45" x2="-25" y2="55" stroke="${stripe}" stroke-width="2" opacity="0.4"/>
    <line x1="-5" y1="-28" x2="-5" y2="55" stroke="${stripe}" stroke-width="2" opacity="0.4"/>
    <line x1="15" y1="-45" x2="15" y2="55" stroke="${stripe}" stroke-width="2" opacity="0.4"/>
    <line x1="35" y1="-45" x2="35" y2="55" stroke="${stripe}" stroke-width="2" opacity="0.4"/>
    <!-- collar -->
    <path d="M-25,-45 Q-28,-58 -15,-55 L0,-48 L15,-55 Q28,-58 25,-45 Q20,-30 0,-28 Q-20,-30 -25,-45 Z" fill="${lighten(c, 20)}" stroke="${d}" stroke-width="1.5"/>
    <!-- center line -->
    <line x1="0" y1="-28" x2="0" y2="55" stroke="${d}" stroke-width="1.5"/>
    <!-- buttons -->
    <circle cx="0" cy="-15" r="2" fill="${lighten(c, 60)}"/>
    <circle cx="0" cy="0" r="2" fill="${lighten(c, 60)}"/>
    <circle cx="0" cy="15" r="2" fill="${lighten(c, 60)}"/>
    <circle cx="0" cy="30" r="2" fill="${lighten(c, 60)}"/>
  </g>`);
}

function dressShirt(c) {
  const d = darken(c, 50);
  return svgWrap(`
  <g transform="translate(100,105)">
    <!-- body -->
    <path d="M-40,-45 L-40,50 Q-40,55 -35,55 L35,55 Q40,55 40,50 L40,-45 L25,-45 Q20,-30 0,-28 Q-20,-30 -25,-45 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- sleeves -->
    <path d="M-40,-45 L-62,-25 L-52,-12 L-40,-18 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <path d="M40,-45 L62,-25 L52,-12 L40,-18 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- collar (dress collar, pointed) -->
    <path d="M-25,-45 L-32,-58 L-12,-48 L0,-45" fill="${c}" stroke="${d}" stroke-width="1.5"/>
    <path d="M25,-45 L32,-58 L12,-48 L0,-45" fill="${c}" stroke="${d}" stroke-width="1.5"/>
    <!-- placket -->
    <rect x="-4" y="-45" width="8" height="100" rx="1" fill="${lighten(c, 8)}" stroke="${d}" stroke-width="0.8"/>
    <!-- buttons -->
    <circle cx="0" cy="-30" r="2.2" fill="${darken(c, 60)}"/>
    <circle cx="0" cy="-15" r="2.2" fill="${darken(c, 60)}"/>
    <circle cx="0" cy="0" r="2.2" fill="${darken(c, 60)}"/>
    <circle cx="0" cy="15" r="2.2" fill="${darken(c, 60)}"/>
    <circle cx="0" cy="30" r="2.2" fill="${darken(c, 60)}"/>
    <!-- cuff lines -->
    <line x1="-62" y1="-25" x2="-52" y2="-12" stroke="${d}" stroke-width="2.5"/>
    <line x1="62" y1="-25" x2="52" y2="-12" stroke="${d}" stroke-width="2.5"/>
  </g>`);
}

// ── BOTTOMS ──────────────────────────────────────────

function jeans(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,100)">
    <!-- waistband -->
    <rect x="-40" y="-55" width="80" height="14" rx="3" fill="${darken(c, 12)}" stroke="${d}" stroke-width="2"/>
    <!-- body -->
    <path d="M-40,-41 L-42,55 L-8,55 L-2,-5 L2,-5 L8,55 L42,55 L40,-41 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- fly -->
    <line x1="0" y1="-41" x2="0" y2="-5" stroke="${d}" stroke-width="1.5"/>
    <!-- pockets stitch -->
    <path d="M-35,-41 Q-28,-30 -20,-41" fill="none" stroke="${lighten(c, 30)}" stroke-width="1"/>
    <path d="M35,-41 Q28,-30 20,-41" fill="none" stroke="${lighten(c, 30)}" stroke-width="1"/>
    <!-- belt loops -->
    <rect x="-30" y="-57" width="4" height="18" rx="1" fill="${darken(c, 8)}" stroke="${d}" stroke-width="0.5"/>
    <rect x="-10" y="-57" width="4" height="18" rx="1" fill="${darken(c, 8)}" stroke="${d}" stroke-width="0.5"/>
    <rect x="10" y="-57" width="4" height="18" rx="1" fill="${darken(c, 8)}" stroke="${d}" stroke-width="0.5"/>
    <rect x="26" y="-57" width="4" height="18" rx="1" fill="${darken(c, 8)}" stroke="${d}" stroke-width="0.5"/>
    <!-- button -->
    <circle cx="0" cy="-48" r="3" fill="${darken(c, 40)}"/>
  </g>`);
}

function chinos(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,100)">
    <!-- waistband -->
    <rect x="-38" y="-55" width="76" height="12" rx="3" fill="${darken(c, 10)}" stroke="${d}" stroke-width="2"/>
    <!-- body -->
    <path d="M-38,-43 L-40,55 L-6,55 L0,-5 L6,55 L40,55 L38,-43 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- crease lines -->
    <line x1="-22" y1="-20" x2="-24" y2="55" stroke="${lighten(c, 20)}" stroke-width="1" opacity="0.5"/>
    <line x1="22" y1="-20" x2="24" y2="55" stroke="${lighten(c, 20)}" stroke-width="1" opacity="0.5"/>
    <!-- fly -->
    <line x1="0" y1="-43" x2="0" y2="-5" stroke="${d}" stroke-width="1"/>
    <!-- pockets -->
    <path d="M-33,-43 L-30,-30 L-20,-30 L-18,-43" fill="none" stroke="${d}" stroke-width="1"/>
    <path d="M33,-43 L30,-30 L20,-30 L18,-43" fill="none" stroke="${d}" stroke-width="1"/>
  </g>`);
}

function trousers(c) {
  const d = darken(c, 40);
  return svgWrap(`
  <g transform="translate(100,100)">
    <!-- waistband -->
    <rect x="-38" y="-55" width="76" height="12" rx="3" fill="${lighten(c, 10)}" stroke="${d}" stroke-width="2"/>
    <!-- body -->
    <path d="M-38,-43 L-38,55 L-5,55 L0,-5 L5,55 L38,55 L38,-43 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- crease lines (sharp) -->
    <line x1="-20" y1="-30" x2="-20" y2="55" stroke="${lighten(c, 25)}" stroke-width="1.2"/>
    <line x1="20" y1="-30" x2="20" y2="55" stroke="${lighten(c, 25)}" stroke-width="1.2"/>
    <!-- fly -->
    <line x1="0" y1="-43" x2="0" y2="-5" stroke="${d}" stroke-width="1.5"/>
    <!-- belt -->
    <rect x="-38" y="-53" width="76" height="5" rx="2" fill="${darken(c, 30)}" stroke="${d}" stroke-width="1"/>
    <!-- belt buckle -->
    <rect x="-4" y="-54" width="8" height="7" rx="1" fill="#B8860B" stroke="#8B6914" stroke-width="1"/>
  </g>`);
}

function cargoShorts(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,95)">
    <!-- waistband -->
    <rect x="-40" y="-40" width="80" height="12" rx="3" fill="${darken(c, 10)}" stroke="${d}" stroke-width="2"/>
    <!-- body -->
    <path d="M-40,-28 L-44,40 L-4,40 L0,0 L4,40 L44,40 L40,-28 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- cargo pockets -->
    <rect x="-38" y="0" width="20" height="22" rx="3" fill="${darken(c, 12)}" stroke="${d}" stroke-width="1.5"/>
    <rect x="18" y="0" width="20" height="22" rx="3" fill="${darken(c, 12)}" stroke="${d}" stroke-width="1.5"/>
    <!-- pocket flaps -->
    <rect x="-38" y="-2" width="20" height="6" rx="2" fill="${darken(c, 18)}" stroke="${d}" stroke-width="1"/>
    <rect x="18" y="-2" width="20" height="6" rx="2" fill="${darken(c, 18)}" stroke="${d}" stroke-width="1"/>
    <!-- button on pockets -->
    <circle cx="-28" cy="1" r="2" fill="${darken(c, 40)}"/>
    <circle cx="28" cy="1" r="2" fill="${darken(c, 40)}"/>
    <!-- fly -->
    <line x1="0" y1="-28" x2="0" y2="0" stroke="${d}" stroke-width="1.5"/>
  </g>`);
}

function athleticShorts(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,95)">
    <!-- waistband (elastic) -->
    <rect x="-42" y="-40" width="84" height="10" rx="5" fill="${lighten(c, 15)}" stroke="${d}" stroke-width="2"/>
    <!-- body -->
    <path d="M-42,-30 L-48,38 Q-48,42 -44,42 L-4,42 L0,5 L4,42 L44,42 Q48,42 48,38 L42,-30 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- side stripes -->
    <path d="M-42,-30 L-48,38" fill="none" stroke="${lighten(c, 40)}" stroke-width="4" opacity="0.6"/>
    <path d="M42,-30 L48,38" fill="none" stroke="${lighten(c, 40)}" stroke-width="4" opacity="0.6"/>
    <!-- drawstring -->
    <path d="M-8,-35 Q-5,-28 0,-32 Q5,-28 8,-35" fill="none" stroke="${lighten(c, 50)}" stroke-width="1.5"/>
  </g>`);
}

function joggers(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,100)">
    <!-- waistband (elastic) -->
    <rect x="-40" y="-55" width="80" height="12" rx="6" fill="${lighten(c, 12)}" stroke="${d}" stroke-width="2"/>
    <!-- body -->
    <path d="M-40,-43 L-42,35 Q-35,50 -20,50 L-5,50 L0,-5 L5,50 L20,50 Q35,50 42,35 L40,-43 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- cuffs -->
    <ellipse cx="-13" cy="50" rx="13" ry="5" fill="${darken(c, 15)}" stroke="${d}" stroke-width="1.5"/>
    <ellipse cx="13" cy="50" rx="13" ry="5" fill="${darken(c, 15)}" stroke="${d}" stroke-width="1.5"/>
    <!-- drawstring -->
    <path d="M-8,-49 Q-5,-42 0,-46 Q5,-42 8,-49" fill="none" stroke="${lighten(c, 50)}" stroke-width="1.5"/>
    <!-- side seam -->
    <path d="M-40,-20 Q-38,10 -30,35" fill="none" stroke="${d}" stroke-width="0.8" stroke-dasharray="4,3"/>
    <path d="M40,-20 Q38,10 30,35" fill="none" stroke="${d}" stroke-width="0.8" stroke-dasharray="4,3"/>
  </g>`);
}

function skirt(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,95)">
    <!-- waistband -->
    <rect x="-35" y="-42" width="70" height="10" rx="3" fill="${darken(c, 10)}" stroke="${d}" stroke-width="2"/>
    <!-- body (A-line) -->
    <path d="M-35,-32 L-52,48 Q-52,52 -48,52 L48,52 Q52,52 52,48 L35,-32 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- pleats / folds -->
    <line x1="-20" y1="-32" x2="-32" y2="52" stroke="${darken(c, 15)}" stroke-width="1" opacity="0.5"/>
    <line x1="0" y1="-32" x2="0" y2="52" stroke="${darken(c, 15)}" stroke-width="1" opacity="0.5"/>
    <line x1="20" y1="-32" x2="32" y2="52" stroke="${darken(c, 15)}" stroke-width="1" opacity="0.5"/>
    <!-- hem detail -->
    <path d="M-52,48 Q-48,55 -35,52 Q-20,48 0,52 Q20,48 35,52 Q48,55 52,48" fill="none" stroke="${darken(c, 20)}" stroke-width="1.5"/>
  </g>`);
}

function corduroyPants(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,100)">
    <!-- waistband -->
    <rect x="-38" y="-55" width="76" height="12" rx="3" fill="${darken(c, 10)}" stroke="${d}" stroke-width="2"/>
    <!-- body -->
    <path d="M-38,-43 L-40,55 L-5,55 L0,-5 L5,55 L40,55 L38,-43 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- corduroy ridges (left leg) -->
    <line x1="-35" y1="-43" x2="-37" y2="55" stroke="${darken(c, 12)}" stroke-width="1" opacity="0.5"/>
    <line x1="-30" y1="-43" x2="-32" y2="55" stroke="${darken(c, 12)}" stroke-width="1" opacity="0.5"/>
    <line x1="-25" y1="-43" x2="-27" y2="55" stroke="${darken(c, 12)}" stroke-width="1" opacity="0.5"/>
    <line x1="-20" y1="-43" x2="-22" y2="55" stroke="${darken(c, 12)}" stroke-width="1" opacity="0.5"/>
    <line x1="-15" y1="-43" x2="-15" y2="55" stroke="${darken(c, 12)}" stroke-width="1" opacity="0.5"/>
    <line x1="-10" y1="-43" x2="-10" y2="55" stroke="${darken(c, 12)}" stroke-width="1" opacity="0.5"/>
    <!-- corduroy ridges (right leg) -->
    <line x1="10" y1="-43" x2="10" y2="55" stroke="${darken(c, 12)}" stroke-width="1" opacity="0.5"/>
    <line x1="15" y1="-43" x2="15" y2="55" stroke="${darken(c, 12)}" stroke-width="1" opacity="0.5"/>
    <line x1="20" y1="-43" x2="22" y2="55" stroke="${darken(c, 12)}" stroke-width="1" opacity="0.5"/>
    <line x1="25" y1="-43" x2="27" y2="55" stroke="${darken(c, 12)}" stroke-width="1" opacity="0.5"/>
    <line x1="30" y1="-43" x2="32" y2="55" stroke="${darken(c, 12)}" stroke-width="1" opacity="0.5"/>
    <line x1="35" y1="-43" x2="37" y2="55" stroke="${darken(c, 12)}" stroke-width="1" opacity="0.5"/>
    <!-- fly -->
    <line x1="0" y1="-43" x2="0" y2="-5" stroke="${d}" stroke-width="1.5"/>
    <!-- pockets -->
    <path d="M-33,-43 L-30,-30 L-18,-30 L-15,-43" fill="none" stroke="${d}" stroke-width="1"/>
    <path d="M33,-43 L30,-30 L18,-30 L15,-43" fill="none" stroke="${d}" stroke-width="1"/>
  </g>`);
}

// ── SHOES ──────────────────────────────────────────

function sneakers(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,110)">
    <!-- sole -->
    <path d="M-55,-5 L-55,10 Q-55,18 -45,18 L50,18 Q60,18 62,10 L62,-5 Z" fill="#E0E0E0" stroke="#999" stroke-width="2"/>
    <!-- body -->
    <path d="M-50,-5 L-50,-30 Q-45,-40 -20,-42 L10,-42 Q40,-42 50,-25 L55,-5 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- toe cap -->
    <path d="M35,-5 Q50,-15 55,-5 L62,-5 Q60,5 50,5 L35,5 Z" fill="${lighten(c, 20)}" stroke="${d}" stroke-width="1.5"/>
    <!-- laces -->
    <line x1="-5" y1="-35" x2="10" y2="-35" stroke="${d}" stroke-width="1.5"/>
    <line x1="-8" y1="-28" x2="12" y2="-28" stroke="${d}" stroke-width="1.5"/>
    <line x1="-10" y1="-21" x2="15" y2="-21" stroke="${d}" stroke-width="1.5"/>
    <!-- ankle collar -->
    <path d="M-50,-30 Q-45,-38 -30,-40 Q-20,-42 -10,-42" fill="none" stroke="${d}" stroke-width="3"/>
    <!-- logo circle -->
    <circle cx="30" cy="-20" r="6" fill="${lighten(c, 30)}" stroke="${d}" stroke-width="1"/>
  </g>`);
}

function boots(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,108)">
    <!-- sole -->
    <path d="M-45,15 L-45,25 Q-45,32 -35,32 L50,32 Q58,32 60,25 L60,15 Z" fill="#4A4A4A" stroke="#333" stroke-width="2"/>
    <!-- boot body -->
    <path d="M-40,15 L-40,-45 Q-38,-50 -25,-52 L10,-52 Q30,-50 40,-35 L50,15 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- toe cap -->
    <path d="M30,15 Q45,5 50,15 L55,15 Q55,8 45,5 L30,5 Z" fill="${darken(c, 15)}" stroke="${d}" stroke-width="1.5"/>
    <!-- pull tab -->
    <rect x="-20" y="-52" width="12" height="8" rx="2" fill="${lighten(c, 20)}" stroke="${d}" stroke-width="1"/>
    <!-- lace eyelets -->
    <circle cx="-5" cy="-38" r="2" fill="#666" stroke="#333" stroke-width="1"/>
    <circle cx="5" cy="-38" r="2" fill="#666" stroke="#333" stroke-width="1"/>
    <circle cx="-5" cy="-25" r="2" fill="#666" stroke="#333" stroke-width="1"/>
    <circle cx="5" cy="-25" r="2" fill="#666" stroke="#333" stroke-width="1"/>
    <circle cx="-5" cy="-12" r="2" fill="#666" stroke="#333" stroke-width="1"/>
    <circle cx="5" cy="-12" r="2" fill="#666" stroke="#333" stroke-width="1"/>
    <!-- laces -->
    <line x1="-5" y1="-38" x2="5" y2="-32" stroke="#555" stroke-width="1"/>
    <line x1="5" y1="-38" x2="-5" y2="-32" stroke="#555" stroke-width="1"/>
    <line x1="-5" y1="-25" x2="5" y2="-19" stroke="#555" stroke-width="1"/>
    <line x1="5" y1="-25" x2="-5" y2="-19" stroke="#555" stroke-width="1"/>
  </g>`);
}

function loafers(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,115)">
    <!-- sole -->
    <path d="M-50,0 L-50,10 Q-50,16 -40,16 L48,16 Q56,16 58,10 L58,0 Z" fill="#C9A96E" stroke="#8B6914" stroke-width="2"/>
    <!-- body -->
    <path d="M-45,0 L-45,-20 Q-40,-30 -15,-32 L15,-32 Q40,-30 48,-15 L52,0 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- opening -->
    <ellipse cx="-10" cy="-22" rx="22" ry="10" fill="${darken(c, 10)}" stroke="${d}" stroke-width="1.5"/>
    <!-- penny strap -->
    <path d="M10,-20 Q20,-22 30,-15" fill="none" stroke="${d}" stroke-width="3"/>
    <rect x="15" y="-22" width="10" height="6" rx="2" fill="${darken(c, 20)}" stroke="${d}" stroke-width="1"/>
    <!-- heel -->
    <rect x="-50" y="2" width="10" height="14" rx="2" fill="#8B6914" stroke="#6B4F12" stroke-width="1"/>
  </g>`);
}

function sandals(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,115)">
    <!-- sole -->
    <path d="M-48,-5 Q-50,5 -48,12 Q-45,18 -30,18 L35,18 Q50,18 52,12 Q54,5 52,-5 Q50,-10 35,-12 L-30,-12 Q-46,-10 -48,-5 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- sole texture -->
    <path d="M-40,5 L40,5" stroke="${darken(c, 15)}" stroke-width="0.8" opacity="0.4"/>
    <path d="M-38,10 L38,10" stroke="${darken(c, 15)}" stroke-width="0.8" opacity="0.4"/>
    <!-- front strap -->
    <path d="M-15,-12 Q0,-30 15,-12" fill="none" stroke="${darken(c, 20)}" stroke-width="5" stroke-linecap="round"/>
    <!-- back strap -->
    <path d="M-25,-8 Q-35,-25 -10,-25 Q10,-28 15,-12" fill="none" stroke="${darken(c, 20)}" stroke-width="4" stroke-linecap="round"/>
    <!-- buckle -->
    <rect x="-30" y="-18" width="8" height="6" rx="1" fill="#B8860B" stroke="#8B6914" stroke-width="1"/>
  </g>`);
}

function runningShoes(c) {
  const d = darken(c);
  const accent = '#FF6B35';
  return svgWrap(`
  <g transform="translate(100,110)">
    <!-- sole -->
    <path d="M-55,-5 L-55,12 Q-55,18 -45,18 L52,18 Q62,18 64,12 L64,-5 Z" fill="#333" stroke="#222" stroke-width="2"/>
    <!-- midsole -->
    <path d="M-52,-5 L-52,5 Q-52,10 -42,10 L50,10 Q58,10 60,5 L60,-5 Z" fill="${lighten(c, 40)}" stroke="${d}" stroke-width="1"/>
    <!-- body -->
    <path d="M-48,-5 L-48,-28 Q-43,-38 -18,-40 L12,-40 Q38,-38 48,-22 L55,-5 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- mesh overlay -->
    <path d="M-10,-35 L10,-35 L20,-5 L-20,-5 Z" fill="${lighten(c, 15)}" stroke="none" opacity="0.3"/>
    <!-- swoosh / accent -->
    <path d="M-35,-15 Q0,-30 45,-10" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>
    <!-- laces -->
    <line x1="-8" y1="-33" x2="8" y2="-33" stroke="#eee" stroke-width="1.5"/>
    <line x1="-10" y1="-27" x2="10" y2="-27" stroke="#eee" stroke-width="1.5"/>
    <line x1="-12" y1="-21" x2="12" y2="-21" stroke="#eee" stroke-width="1.5"/>
    <!-- heel tab -->
    <rect x="-50" y="-30" width="8" height="15" rx="2" fill="${accent}" stroke="${darken(accent)}" stroke-width="1"/>
  </g>`);
}

function highHeels(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,110)">
    <!-- sole front -->
    <path d="M5,10 L50,10 Q58,10 58,5 L58,-5 L5,-5 Z" fill="#333" stroke="#222" stroke-width="1.5"/>
    <!-- heel -->
    <path d="M-35,-5 L-40,20 Q-42,25 -38,25 L-28,25 Q-24,25 -25,20 L-30,-5 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- body -->
    <path d="M-35,-5 L-35,-18 Q-30,-28 0,-30 L20,-30 Q42,-28 50,-15 L55,-5 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- opening -->
    <path d="M-30,-18 Q-20,-25 0,-28 Q10,-30 20,-30" fill="none" stroke="${d}" stroke-width="2.5"/>
    <!-- inner shadow -->
    <path d="M-25,-15 Q-10,-22 10,-22" fill="none" stroke="${darken(c, 20)}" stroke-width="1.5" opacity="0.5"/>
    <!-- pointed toe -->
    <path d="M50,-5 Q56,-10 58,-5 L58,5 Q55,8 50,8 Z" fill="${c}" stroke="${d}" stroke-width="1.5"/>
    <!-- sole tip -->
    <path d="M50,8 Q56,8 58,5 L58,10 Q55,12 50,10 Z" fill="#333" stroke="#222" stroke-width="1"/>
  </g>`);
}

function canvasShoes(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,112)">
    <!-- sole -->
    <path d="M-52,-2 L-52,10 Q-52,16 -42,16 L48,16 Q56,16 58,10 L58,-2 Z" fill="#F5F5F0" stroke="#CCC" stroke-width="2"/>
    <!-- rubber toe cap -->
    <path d="M30,-2 Q48,-12 55,-2 L58,-2 Q58,5 48,5 L30,5 Z" fill="#F5F5F0" stroke="#CCC" stroke-width="1.5"/>
    <!-- body -->
    <path d="M-48,-2 L-48,-25 Q-43,-35 -18,-37 L10,-37 Q35,-35 45,-22 L50,-2 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- eyelets and laces -->
    <circle cx="-5" cy="-30" r="2" fill="#DDD" stroke="#999" stroke-width="0.8"/>
    <circle cx="5" cy="-30" r="2" fill="#DDD" stroke="#999" stroke-width="0.8"/>
    <circle cx="-7" cy="-23" r="2" fill="#DDD" stroke="#999" stroke-width="0.8"/>
    <circle cx="7" cy="-23" r="2" fill="#DDD" stroke="#999" stroke-width="0.8"/>
    <circle cx="-9" cy="-16" r="2" fill="#DDD" stroke="#999" stroke-width="0.8"/>
    <circle cx="9" cy="-16" r="2" fill="#DDD" stroke="#999" stroke-width="0.8"/>
    <!-- laces X pattern -->
    <line x1="-5" y1="-30" x2="7" y2="-23" stroke="white" stroke-width="1.2"/>
    <line x1="5" y1="-30" x2="-7" y2="-23" stroke="white" stroke-width="1.2"/>
    <line x1="-7" y1="-23" x2="9" y2="-16" stroke="white" stroke-width="1.2"/>
    <line x1="7" y1="-23" x2="-9" y2="-16" stroke="white" stroke-width="1.2"/>
    <!-- ankle line -->
    <path d="M-48,-25 Q-40,-35 -20,-37 L10,-37" fill="none" stroke="${d}" stroke-width="2.5"/>
    <!-- star logo -->
    <circle cx="30" cy="-18" r="5" fill="${lighten(c, 30)}" stroke="${d}" stroke-width="1"/>
  </g>`);
}

function hikingBoots(c) {
  const d = darken(c);
  return svgWrap(`
  <g transform="translate(100,108)">
    <!-- aggressive sole -->
    <path d="M-48,18 L-48,28 Q-48,35 -38,35 L50,35 Q60,35 62,28 L62,18 Z" fill="#4A4A4A" stroke="#333" stroke-width="2"/>
    <!-- tread pattern -->
    <line x1="-40" y1="28" x2="-30" y2="22" stroke="#666" stroke-width="2"/>
    <line x1="-25" y1="28" x2="-15" y2="22" stroke="#666" stroke-width="2"/>
    <line x1="-10" y1="28" x2="0" y2="22" stroke="#666" stroke-width="2"/>
    <line x1="5" y1="28" x2="15" y2="22" stroke="#666" stroke-width="2"/>
    <line x1="20" y1="28" x2="30" y2="22" stroke="#666" stroke-width="2"/>
    <line x1="35" y1="28" x2="45" y2="22" stroke="#666" stroke-width="2"/>
    <!-- body -->
    <path d="M-42,18 L-42,-40 Q-38,-48 -20,-50 L10,-50 Q32,-48 42,-32 L52,18 Z" fill="${c}" stroke="${d}" stroke-width="2"/>
    <!-- toe guard -->
    <path d="M30,18 Q48,5 52,18" fill="${darken(c, 20)}" stroke="${d}" stroke-width="1.5"/>
    <!-- collar padding -->
    <path d="M-42,-40 Q-38,-48 -20,-50 L10,-50 Q20,-50 25,-48" fill="none" stroke="${lighten(c, 20)}" stroke-width="4" stroke-linecap="round"/>
    <!-- D-ring lace hooks -->
    <circle cx="-8" cy="-40" r="3" fill="#999" stroke="#666" stroke-width="1.5"/>
    <circle cx="8" cy="-40" r="3" fill="#999" stroke="#666" stroke-width="1.5"/>
    <circle cx="-8" cy="-28" r="3" fill="#999" stroke="#666" stroke-width="1.5"/>
    <circle cx="8" cy="-28" r="3" fill="#999" stroke="#666" stroke-width="1.5"/>
    <circle cx="-8" cy="-16" r="3" fill="#999" stroke="#666" stroke-width="1.5"/>
    <circle cx="8" cy="-16" r="3" fill="#999" stroke="#666" stroke-width="1.5"/>
    <!-- laces -->
    <line x1="-8" y1="-40" x2="8" y2="-34" stroke="#D4A574" stroke-width="1.5"/>
    <line x1="8" y1="-40" x2="-8" y2="-34" stroke="#D4A574" stroke-width="1.5"/>
    <line x1="-8" y1="-28" x2="8" y2="-22" stroke="#D4A574" stroke-width="1.5"/>
    <line x1="8" y1="-28" x2="-8" y2="-22" stroke="#D4A574" stroke-width="1.5"/>
  </g>`);
}

// ── GENERATE ALL FILES ─────────────────────────────

const items = [
  // Tops
  { dir: 'tops', file: 'white-tshirt.svg', fn: tshirt, color: 'white' },
  { dir: 'tops', file: 'black-hoodie.svg', fn: hoodie, color: 'black' },
  { dir: 'tops', file: 'blazer.svg', fn: blazer, color: 'navy' },
  { dir: 'tops', file: 'denim-jacket.svg', fn: denimJacket, color: 'blue' },
  { dir: 'tops', file: 'hawaiian-shirt.svg', fn: hawaiianShirt, color: 'red' },
  { dir: 'tops', file: 'sweater.svg', fn: sweater, color: 'green' },
  { dir: 'tops', file: 'polo-shirt.svg', fn: poloShirt, color: 'navy' },
  { dir: 'tops', file: 'tank-top.svg', fn: tankTop, color: 'white' },
  { dir: 'tops', file: 'flannel-shirt.svg', fn: flannelShirt, color: 'red' },
  { dir: 'tops', file: 'dress-shirt.svg', fn: dressShirt, color: 'white' },
  // Bottoms
  { dir: 'bottoms', file: 'blue-jeans.svg', fn: jeans, color: 'blue' },
  { dir: 'bottoms', file: 'chinos.svg', fn: chinos, color: 'khaki' },
  { dir: 'bottoms', file: 'black-trousers.svg', fn: trousers, color: 'black' },
  { dir: 'bottoms', file: 'cargo-shorts.svg', fn: cargoShorts, color: 'green' },
  { dir: 'bottoms', file: 'athletic-shorts.svg', fn: athleticShorts, color: 'black' },
  { dir: 'bottoms', file: 'joggers.svg', fn: joggers, color: 'gray' },
  { dir: 'bottoms', file: 'skirt.svg', fn: skirt, color: 'pink' },
  { dir: 'bottoms', file: 'corduroy-pants.svg', fn: corduroyPants, color: 'brown' },
  // Shoes
  { dir: 'shoes', file: 'white-sneakers.svg', fn: sneakers, color: 'white' },
  { dir: 'shoes', file: 'black-boots.svg', fn: boots, color: 'black' },
  { dir: 'shoes', file: 'loafers.svg', fn: loafers, color: 'brown' },
  { dir: 'shoes', file: 'sandals.svg', fn: sandals, color: 'brown' },
  { dir: 'shoes', file: 'running-shoes.svg', fn: runningShoes, color: 'blue' },
  { dir: 'shoes', file: 'high-heels.svg', fn: highHeels, color: 'red' },
  { dir: 'shoes', file: 'canvas-shoes.svg', fn: canvasShoes, color: 'navy' },
  { dir: 'shoes', file: 'hiking-boots.svg', fn: hikingBoots, color: 'brown' },
];

let count = 0;
for (const item of items) {
  const hex = colorMap[item.color];
  const svg = item.fn(hex);
  const outPath = path.join(BASE, item.dir, item.file);
  fs.writeFileSync(outPath, svg.trim() + '\n');
  count++;
  console.log(`  ✓ ${item.dir}/${item.file}`);
}

console.log(`\nDone! Generated ${count} SVG clothing images.`);
