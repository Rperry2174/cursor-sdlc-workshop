/**
 * Progressive SVG hints (ages 6–8). Each step adds to the picture.
 * Step 0 often shows a light construction outline (dashed); later steps finalize lines.
 */

const VB = '0 0 200 200'

function SvgFrame({ children }) {
  return (
    <svg
      viewBox={VB}
      className="step-diagram__svg"
      role="img"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="200" height="200" fill="var(--diagram-bg)" rx="12" />
      {children}
    </svg>
  )
}

/** Cat: 7 steps (0–6). Silhouette: sitting cat, face forward. */
function CatSvg({ step }) {
  const s = Math.min(step, 6)
  return (
    <SvgFrame>
      {s === 0 && (
        <circle
          cx="100"
          cy="84"
          r="36"
          fill="none"
          stroke="var(--diagram-guide)"
          strokeWidth="2"
          strokeDasharray="6 5"
        />
      )}
      {s >= 1 && (
        <circle
          cx="100"
          cy="84"
          r="36"
          fill="none"
          stroke="var(--diagram-stroke)"
          strokeWidth="3"
        />
      )}
      {s >= 2 && (
        <>
          <path
            d="M 72 58 Q 78 34 90 54"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 128 58 Q 122 34 110 54"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
      {s >= 3 && (
        <>
          <ellipse
            cx="88"
            cy="80"
            rx="6"
            ry="8"
            fill="var(--diagram-stroke)"
          />
          <ellipse
            cx="112"
            cy="80"
            rx="6"
            ry="8"
            fill="var(--diagram-stroke)"
          />
          <path
            d="M 94 94 L 100 100 L 106 94"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M 92 104 Q 100 110 108 104"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
      {s >= 4 && (
        <ellipse
          cx="100"
          cy="150"
          rx="48"
          ry="40"
          fill="none"
          stroke="var(--diagram-stroke)"
          strokeWidth="3"
        />
      )}
      {s >= 5 && (
        <>
          <path
            d="M 78 176 Q 78 168 80 162"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 100 178 Q 100 170 100 164"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 122 176 Q 122 168 120 162"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 144 172 Q 144 166 142 160"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      )}
      {s >= 6 && (
        <>
          <path
            d="M 140 128 Q 172 100 178 72"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="62"
            y1="88"
            x2="48"
            y2="86"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="62"
            y1="94"
            x2="46"
            y2="94"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="62"
            y1="100"
            x2="48"
            y2="102"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="138"
            y1="88"
            x2="152"
            y2="86"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="138"
            y1="94"
            x2="154"
            y2="94"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="138"
            y1="100"
            x2="152"
            y2="102"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </SvgFrame>
  )
}

/** Car: 6 steps (0–5). Side-view cartoon car. */
function CarSvg({ step }) {
  const s = Math.min(step, 5)
  return (
    <SvgFrame>
      {s === 0 && (
        <rect
          x="38"
          y="112"
          width="124"
          height="32"
          rx="10"
          fill="none"
          stroke="var(--diagram-guide)"
          strokeWidth="2"
          strokeDasharray="6 5"
        />
      )}
      {s >= 1 && (
        <>
          <path
            d="M 36 130 L 36 120 Q 36 108 50 108 L 150 108 Q 164 108 164 120 L 164 130 L 36 130 Z"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 52 108 L 58 84 Q 62 72 100 72 Q 138 72 142 84 L 148 108"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </>
      )}
      {s >= 2 && (
        <>
          <circle
            cx="58"
            cy="138"
            r="17"
            fill="var(--diagram-fill)"
            stroke="var(--diagram-stroke)"
            strokeWidth="3"
          />
          <circle
            cx="142"
            cy="138"
            r="17"
            fill="var(--diagram-fill)"
            stroke="var(--diagram-stroke)"
            strokeWidth="3"
          />
          <path
            d="M 44 138 Q 58 128 72 138"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
            opacity="0.5"
          />
          <path
            d="M 128 138 Q 142 128 156 138"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
            opacity="0.5"
          />
        </>
      )}
      {s >= 3 && (
        <>
          <rect
            x="68"
            y="86"
            width="30"
            height="22"
            rx="4"
            fill="var(--diagram-fill)"
            fillOpacity="0.35"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
          />
          <rect
            x="102"
            y="86"
            width="30"
            height="22"
            rx="4"
            fill="var(--diagram-fill)"
            fillOpacity="0.35"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
          />
        </>
      )}
      {s >= 4 && (
        <line
          x1="24"
          y1="158"
          x2="176"
          y2="158"
          stroke="var(--diagram-stroke)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
      {s >= 5 && (
        <>
          <circle cx="44" cy="122" r="5" fill="var(--diagram-accent)" />
          <circle cx="156" cy="122" r="5" fill="var(--diagram-warn)" />
          <line
            x1="36"
            y1="130"
            x2="164"
            y2="130"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
            opacity="0.6"
          />
        </>
      )}
    </SvgFrame>
  )
}

/** House: 6 steps (0–5). Front view with path. */
function HouseSvg({ step }) {
  const s = Math.min(step, 5)
  return (
    <SvgFrame>
      {s === 0 && (
        <rect
          x="54"
          y="102"
          width="92"
          height="82"
          fill="none"
          stroke="var(--diagram-guide)"
          strokeWidth="2"
          strokeDasharray="6 5"
        />
      )}
      {s >= 1 && (
        <rect
          x="54"
          y="102"
          width="92"
          height="82"
          fill="var(--diagram-fill)"
          fillOpacity="0.2"
          stroke="var(--diagram-stroke)"
          strokeWidth="3"
        />
      )}
      {s >= 2 && (
        <path
          d="M 44 102 L 100 48 L 156 102 Z"
          fill="none"
          stroke="var(--diagram-stroke)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}
      {s >= 3 && (
        <>
          <rect
            x="86"
            y="132"
            width="28"
            height="52"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="3"
          />
          <circle cx="110" cy="158" r="3" fill="var(--diagram-stroke)" />
        </>
      )}
      {s >= 4 && (
        <>
          <rect
            x="62"
            y="112"
            width="24"
            height="24"
            fill="var(--diagram-fill)"
            fillOpacity="0.35"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
          />
          <line
            x1="74"
            y1="112"
            x2="74"
            y2="136"
            stroke="var(--diagram-stroke)"
            strokeWidth="1.5"
          />
          <line
            x1="62"
            y1="124"
            x2="86"
            y2="124"
            stroke="var(--diagram-stroke)"
            strokeWidth="1.5"
          />
          <rect
            x="114"
            y="112"
            width="24"
            height="24"
            fill="var(--diagram-fill)"
            fillOpacity="0.35"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
          />
          <line
            x1="126"
            y1="112"
            x2="126"
            y2="136"
            stroke="var(--diagram-stroke)"
            strokeWidth="1.5"
          />
          <line
            x1="114"
            y1="124"
            x2="138"
            y2="124"
            stroke="var(--diagram-stroke)"
            strokeWidth="1.5"
          />
        </>
      )}
      {s >= 5 && (
        <>
          <rect
            x="118"
            y="56"
            width="18"
            height="36"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="3"
          />
          <rect
            x="116"
            y="52"
            width="22"
            height="6"
            rx="2"
            fill="none"
            stroke="var(--diagram-stroke)"
            strokeWidth="2"
          />
          <line
            x1="100"
            y1="176"
            x2="100"
            y2="196"
            stroke="var(--diagram-stroke)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="78"
            y1="198"
            x2="122"
            y2="198"
            stroke="var(--diagram-stroke)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
    </SvgFrame>
  )
}

export function StepDiagram({ lessonId, stepIndex }) {
  switch (lessonId) {
    case 'cat':
      return <CatSvg step={stepIndex} />
    case 'simple-car':
      return <CarSvg step={stepIndex} />
    case 'simple-house':
      return <HouseSvg step={stepIndex} />
    default:
      return <CatSvg step={0} />
  }
}
