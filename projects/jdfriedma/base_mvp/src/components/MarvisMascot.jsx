import {
  MARVIS_MASCOT_HEIGHT,
  MARVIS_MASCOT_RECTS,
  MARVIS_MASCOT_WIDTH,
} from '../data/marvisMascotPixels.js'

const SCALE = 3

/**
 * Pixel-art mascot: pig in a suit (grimdark / bureaucratic; crisp edges, no AA).
 */
export default function MarvisMascot() {
  return (
    <div
      className="marvis-mascot"
      role="img"
      aria-label="Marvis, a stern pig in a suit"
    >
      <svg
        className="marvis-mascot__svg"
        width={MARVIS_MASCOT_WIDTH * SCALE}
        height={MARVIS_MASCOT_HEIGHT * SCALE}
        viewBox={`0 0 ${MARVIS_MASCOT_WIDTH} ${MARVIS_MASCOT_HEIGHT}`}
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        {MARVIS_MASCOT_RECTS.map(({ x, y, fill, key }) => (
          <rect key={key} x={x} y={y} width={1} height={1} fill={fill} />
        ))}
      </svg>
    </div>
  )
}
