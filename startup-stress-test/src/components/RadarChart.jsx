import { CATEGORY_LABELS } from '../data/scoringModel';

/**
 * Pure SVG Radar/Spider Chart component
 * No external charting libraries - just SVG math
 */
export default function RadarChart({ scores }) {
  // Categories to plot (exclude 'overall')
  const categories = Object.keys(scores).filter(key => key !== 'overall');
  const numAxes = categories.length;
  
  // Chart dimensions
  const size = 400;
  const center = size / 2;
  const maxRadius = 150;
  
  // Calculate angle for each axis (in radians)
  const angleStep = (2 * Math.PI) / numAxes;
  
  // Get point coordinates for a given value (0-100) and axis index
  const getPoint = (value, index) => {
    const angle = index * angleStep - Math.PI / 2; // Start from top
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };
  
  // Generate gridlines at 25, 50, 75, 100
  const gridLevels = [25, 50, 75, 100];
  
  // Generate polygon points for the data
  const dataPoints = categories.map((key, i) => getPoint(scores[key], i));
  const dataPath = dataPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';
  
  // Short labels for radar chart
  const shortLabels = {
    tam: 'TAM',
    marketGrowth: 'Growth',
    competition: 'Competition',
    barriers: 'Barriers',
    feasibility: 'Feasibility',
    capital: 'Capital',
    timeToMarket: 'Time',
    revenueClarity: 'Revenue',
    risks: 'Risk Profile',
    opportunities: 'Opportunities',
  };

  return (
    <div className="radar-chart-container">
      <h3 className="chart-title">Performance Radar</h3>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="radar-chart"
        style={{ maxWidth: '100%', height: 'auto' }}
      >
        {/* Background gridlines */}
        {gridLevels.map(level => {
          const points = categories.map((_, i) => {
            const p = getPoint(level, i);
            return `${p.x},${p.y}`;
          }).join(' ');
          
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Axis lines */}
        {categories.map((_, i) => {
          const endPoint = getPoint(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Data polygon fill */}
        <path
          d={dataPath}
          fill="rgba(245, 78, 0, 0.25)"
          stroke="#f54e00"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="#f54e00"
            stroke="#ffffff"
            strokeWidth="2"
          />
        ))}
        
        {/* Axis labels */}
        {categories.map((key, i) => {
          const labelPoint = getPoint(120, i);
          const angle = i * angleStep - Math.PI / 2;
          
          // Adjust text anchor based on position
          let textAnchor = 'middle';
          if (Math.cos(angle) > 0.3) textAnchor = 'start';
          if (Math.cos(angle) < -0.3) textAnchor = 'end';
          
          // Adjust vertical alignment
          let dy = '0.35em';
          if (Math.sin(angle) < -0.5) dy = '0em';
          if (Math.sin(angle) > 0.5) dy = '0.7em';
          
          return (
            <text
              key={key}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor={textAnchor}
              dy={dy}
              className="radar-label"
              fill="#edecec"
              fontSize="11"
            >
              {shortLabels[key] || key}
            </text>
          );
        })}
        
        {/* Center point */}
        <circle
          cx={center}
          cy={center}
          r="3"
          fill="rgba(255, 255, 255, 0.3)"
        />
        
        {/* Grid level labels */}
        {gridLevels.map(level => {
          const point = getPoint(level, 0);
          return (
            <text
              key={level}
              x={point.x + 5}
              y={point.y}
              fill="rgba(255, 255, 255, 0.4)"
              fontSize="10"
              textAnchor="start"
              dy="-0.3em"
            >
              {level}
            </text>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="radar-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#f54e00' }} />
          <span className="legend-text">Your Startup Score</span>
        </div>
      </div>
    </div>
  );
}
