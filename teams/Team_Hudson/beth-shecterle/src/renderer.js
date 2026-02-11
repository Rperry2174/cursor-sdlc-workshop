/**
 * Canvas drawing for Hudson River Runner.
 * Draws river, banks, boat, icebergs, and HUD (distance meter).
 */

/**
 * Simple seeded random number generator for consistent iceberg shapes
 */
function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/**
 * Generate an irregular iceberg shape as a polygon
 */
function generateIcebergShape(ice) {
  const rand = seededRandom(ice.id);
  const points = [];
  const centerX = ice.x + ice.width / 2;
  const topY = ice.y;
  const bottomY = ice.y + ice.height;
  
  // Generate points for an irregular polygon (more points = more organic shape)
  const numPoints = 12;
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const radiusVariation = 0.5 + rand() * 0.5; // Vary radius between 50-100%
    const widthRadius = (ice.width / 2) * radiusVariation;
    const heightRadius = (ice.height / 2) * radiusVariation;
    
    const x = centerX + Math.cos(angle) * widthRadius;
    const y = topY + (ice.height / 2) + Math.sin(angle) * heightRadius;
    points.push({ x, y });
  }
  
  return points;
}

/**
 * Draw a realistic iceberg with irregular shape, highlights, and shadows
 */
function drawRealisticIceberg(ctx, ice) {
  const waterline = ice.y + ice.height * 0.7; // 70% underwater (realistic iceberg ratio)
  const shape = generateIcebergShape(ice);
  
  ctx.save();
  
  // Draw the full iceberg shape first
  ctx.beginPath();
  ctx.moveTo(shape[0].x, shape[0].y);
  for (let i = 1; i < shape.length; i++) {
    ctx.lineTo(shape[i].x, shape[i].y);
  }
  ctx.closePath();
  
  // Main iceberg body with gradient (white/light blue)
  const gradient = ctx.createLinearGradient(
    ice.x, ice.y,
    ice.x + ice.width, ice.y + ice.height
  );
  gradient.addColorStop(0, '#f0f8ff'); // Very light blue-white at top
  gradient.addColorStop(0.5, '#e0f0f8'); // Medium blue-white
  gradient.addColorStop(1, '#c8e0f0'); // Slightly darker at bottom
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Add shadow on the right side (depth effect)
  ctx.save();
  ctx.clip();
  const shadowRect = {
    x: ice.x + ice.width * 0.55,
    y: ice.y,
    width: ice.width * 0.45,
    height: ice.height
  };
  const shadowGradient = ctx.createLinearGradient(
    shadowRect.x, shadowRect.y,
    shadowRect.x + shadowRect.width, shadowRect.y + shadowRect.height
  );
  shadowGradient.addColorStop(0, 'rgba(100, 140, 180, 0.2)');
  shadowGradient.addColorStop(1, 'rgba(100, 140, 180, 0.5)');
  ctx.fillStyle = shadowGradient;
  ctx.fillRect(shadowRect.x, shadowRect.y, shadowRect.width, shadowRect.height);
  ctx.restore();
  
  // Add highlight on the left side (sunlight)
  ctx.save();
  ctx.clip();
  const highlightRect = {
    x: ice.x,
    y: ice.y,
    width: ice.width * 0.4,
    height: ice.height
  };
  const highlightGradient = ctx.createLinearGradient(
    highlightRect.x, highlightRect.y,
    highlightRect.x + highlightRect.width, highlightRect.y + highlightRect.height
  );
  highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  ctx.fillStyle = highlightGradient;
  ctx.fillRect(highlightRect.x, highlightRect.y, highlightRect.width, highlightRect.height);
  ctx.restore();
  
  // Outline for definition
  ctx.strokeStyle = 'rgba(180, 200, 220, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(shape[0].x, shape[0].y);
  for (let i = 1; i < shape.length; i++) {
    ctx.lineTo(shape[i].x, shape[i].y);
  }
  ctx.closePath();
  ctx.stroke();
  
  // Draw underwater portion (darker blue, visible below waterline)
  ctx.beginPath();
  ctx.moveTo(shape[0].x, Math.max(shape[0].y, waterline));
  for (let i = 1; i < shape.length; i++) {
    const y = Math.max(shape[i].y, waterline);
    ctx.lineTo(shape[i].x, y);
  }
  ctx.lineTo(ice.x + ice.width, ice.y + ice.height);
  ctx.lineTo(ice.x, ice.y + ice.height);
  ctx.closePath();
  ctx.fillStyle = 'rgba(30, 60, 100, 0.4)'; // Dark blue underwater
  ctx.fill();
  
  // Waterline (where iceberg meets water) - subtle line
  ctx.strokeStyle = 'rgba(100, 150, 200, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ice.x, waterline);
  ctx.lineTo(ice.x + ice.width, waterline);
  ctx.stroke();
  
  ctx.restore();
}

/**
 * Draw animated waves on the water surface - vertical waves that scroll with icebergs
 */
function drawWaves(ctx, riverLeft, riverRight, height, time, scrollOffset = 0) {
  const riverWidth = riverRight - riverLeft;
  const waveAmplitude = 3; // Horizontal variation of waves (left/right)
  const waveFrequency = 0.02; // How many waves per pixel vertically
  const waveSpeed = 0.02; // Animation speed
  
  ctx.save();
  
  // Draw vertical wave lines that scroll down with the icebergs
  // Multiple layers moving at different speeds for depth
  for (let layer = 0; layer < 4; layer++) {
    const layerOffset = layer * 0.5;
    const layerAmplitude = waveAmplitude * (1 - layer * 0.2);
    const layerSpeed = waveSpeed * (1 + layer * 0.1);
    const layerSpacing = 20 + layer * 10; // Horizontal spacing between wave lines
    
    ctx.strokeStyle = `rgba(100, 180, 220, ${0.3 - layer * 0.06})`;
    ctx.lineWidth = 2 - layer * 0.3;
    
    // Draw vertical wave lines across the water (left to right)
    for (let x = riverLeft; x <= riverRight; x += layerSpacing) {
      ctx.beginPath();
      let firstPoint = true;
      
      for (let y = 0; y < height; y += 2) {
        // Combine multiple sine waves for organic vertical wave pattern
        // Use y position + scroll offset to make waves scroll down
        const waveY = y + scrollOffset;
        const wave1 = Math.sin((waveY * waveFrequency) + (time * layerSpeed) + layerOffset) * layerAmplitude;
        const wave2 = Math.sin((waveY * waveFrequency * 1.7) + (time * layerSpeed * 0.8) + layerOffset * 1.5) * (layerAmplitude * 0.6);
        const wave3 = Math.sin((waveY * waveFrequency * 2.5) + (time * layerSpeed * 1.3) + layerOffset * 2.2) * (layerAmplitude * 0.3);
        const waveX = x + wave1 + wave2 + wave3;
        
        if (firstPoint) {
          ctx.moveTo(waveX, y);
          firstPoint = false;
        } else {
          ctx.lineTo(waveX, y);
        }
      }
      
      ctx.stroke();
    }
  }
  
  // Draw additional vertical wave layers for more texture
  ctx.strokeStyle = 'rgba(120, 200, 240, 0.2)';
  ctx.lineWidth = 1.5;
  const additionalSpacing = 35;
  
  for (let x = riverLeft + 10; x <= riverRight; x += additionalSpacing) {
    ctx.beginPath();
    let firstPoint = true;
    
    for (let y = 0; y < height; y += 3) {
      const waveY = y + scrollOffset;
      const wave = Math.sin((waveY * waveFrequency * 1.3) + (time * waveSpeed * 0.6) + (x * 0.01)) * (waveAmplitude * 0.8);
      const waveX = x + wave;
      
      if (firstPoint) {
        ctx.moveTo(waveX, y);
        firstPoint = false;
      } else {
        ctx.lineTo(waveX, y);
      }
    }
    
    ctx.stroke();
  }
  
  // Add subtle highlights on wave crests (vertical highlights)
  ctx.strokeStyle = 'rgba(200, 230, 255, 0.25)';
  ctx.lineWidth = 1;
  for (let layer = 0; layer < 2; layer++) {
    const layerOffset = layer * 0.7;
    const layerSpeed = waveSpeed * (1 + layer * 0.15);
    const highlightSpacing = 30;
    
    for (let x = riverLeft; x <= riverRight; x += highlightSpacing) {
      ctx.beginPath();
      let firstPoint = true;
      
      for (let y = 0; y < height; y += 2) {
        const waveY = y + scrollOffset;
        const wave = Math.sin((waveY * waveFrequency) + (time * layerSpeed) + layerOffset) * waveAmplitude;
        const waveX = x + wave;
        
        // Only draw highlights on wave peaks (rightmost parts)
        if (wave > waveAmplitude * 0.6) {
          if (firstPoint) {
            ctx.moveTo(waveX, y);
            firstPoint = false;
          } else {
            ctx.lineTo(waveX, y);
          }
        } else {
          firstPoint = true;
        }
      }
      
      ctx.stroke();
    }
  }
  
  ctx.restore();
}

/**
 * Draw a simple cartoon-style sailboat (pointing upstream)
 */
function drawTitanic(ctx, boat) {
  ctx.save();
  
  const centerX = boat.x + boat.width / 2;
  const centerY = boat.y + boat.height / 2;
  
  // Hull dimensions
  const hullWidth = boat.width * 0.8;
  const hullHeight = boat.height * 0.3;
  const hullY = boat.y + boat.height - hullHeight - 5;
  const hullX = boat.x + (boat.width - hullWidth) / 2;
  
  // Draw brown hull with curved bottom
  ctx.fillStyle = '#8b4513'; // Brown
  ctx.beginPath();
  // Top of hull (straight)
  ctx.moveTo(hullX, hullY);
  ctx.lineTo(hullX + hullWidth, hullY);
  // Right side
  ctx.lineTo(hullX + hullWidth, hullY + hullHeight);
  // Curved bottom
  ctx.quadraticCurveTo(
    centerX, 
    hullY + hullHeight + 8, 
    hullX, 
    hullY + hullHeight
  );
  ctx.closePath();
  ctx.fill();
  
  // Hull outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Draw simple brown deck (interior visible)
  ctx.fillStyle = '#654321'; // Darker brown
  ctx.fillRect(hullX + hullWidth * 0.1, hullY + 2, hullWidth * 0.8, hullHeight * 0.4);
  
  // Draw mast (brown, vertical)
  const mastX = centerX;
  const mastY = hullY;
  const mastHeight = boat.height * 0.6;
  const mastWidth = 4;
  
  ctx.fillStyle = '#8b4513'; // Brown
  ctx.fillRect(mastX - mastWidth / 2, mastY, mastWidth, mastHeight);
  
  // Mast outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.strokeRect(mastX - mastWidth / 2, mastY, mastWidth, mastHeight);
  
  // Draw larger front sail (cream/off-white, triangular)
  const frontSailTopY = mastY;
  const frontSailBottomY = mastY + mastHeight * 0.6;
  const frontSailLeftX = mastX;
  const frontSailRightX = mastX + boat.width * 0.25;
  
  ctx.fillStyle = '#f5f5dc'; // Cream/off-white
  ctx.beginPath();
  ctx.moveTo(mastX, frontSailTopY); // Top of mast
  ctx.lineTo(frontSailRightX, frontSailBottomY); // Bottom right
  ctx.lineTo(mastX, frontSailBottomY); // Bottom left (at mast)
  ctx.closePath();
  ctx.fill();
  
  // Front sail outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw smaller back sail (red and white stripes, triangular)
  const backSailTopY = mastY + mastHeight * 0.1;
  const backSailBottomY = mastY + mastHeight * 0.5;
  const backSailLeftX = mastX - boat.width * 0.2;
  const backSailRightX = mastX;
  
  // Draw striped sail with red and white bands
  const numStripes = 4;
  const stripeHeight = (backSailBottomY - backSailTopY) / numStripes;
  
  for (let i = 0; i < numStripes; i++) {
    const stripeY = backSailTopY + (i * stripeHeight);
    const stripeColor = i % 2 === 0 ? '#ffffff' : '#cc0000'; // Alternating white and red
    
    ctx.fillStyle = stripeColor;
    ctx.beginPath();
    // Calculate triangle points for this stripe
    const leftX = backSailLeftX + ((backSailRightX - backSailLeftX) * (stripeY - backSailTopY) / (backSailBottomY - backSailTopY));
    const nextLeftX = backSailLeftX + ((backSailRightX - backSailLeftX) * (stripeY + stripeHeight - backSailTopY) / (backSailBottomY - backSailTopY));
    
    ctx.moveTo(leftX, stripeY);
    ctx.lineTo(backSailRightX, stripeY);
    ctx.lineTo(backSailRightX, stripeY + stripeHeight);
    ctx.lineTo(nextLeftX, stripeY + stripeHeight);
    ctx.closePath();
    ctx.fill();
  }
  
  // Back sail outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(backSailLeftX, backSailTopY);
  ctx.lineTo(backSailRightX, backSailTopY);
  ctx.lineTo(backSailRightX, backSailBottomY);
  ctx.lineTo(backSailLeftX, backSailBottomY);
  ctx.closePath();
  ctx.stroke();
  
  // Draw red pennant/flag at top of mast
  const flagHeight = 8;
  const flagWidth = 12;
  ctx.fillStyle = '#cc0000'; // Red
  ctx.beginPath();
  ctx.moveTo(mastX, mastY);
  ctx.lineTo(mastX + flagWidth, mastY + flagHeight / 2);
  ctx.lineTo(mastX, mastY + flagHeight);
  ctx.closePath();
  ctx.fill();
  
  // Flag outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  ctx.restore();
}

export function drawFrame(ctx, state, time = 0) {
  const { width, height, riverLeft, riverRight, boat, icebergs, distance, milesToWin } = state;

  // Sky / background
  ctx.fillStyle = '#1a2a3a';
  ctx.fillRect(0, 0, width, height);

  // Left bank (green-gray)
  ctx.fillStyle = '#3d5a4a';
  ctx.fillRect(0, 0, riverLeft, height);

  // River base (blue)
  ctx.fillStyle = '#2a4a6a';
  ctx.fillRect(riverLeft, 0, riverRight - riverLeft, height);

  // Right bank
  ctx.fillStyle = '#4a5a5a';
  ctx.fillRect(riverRight, 0, width - riverRight, height);

  // Draw animated waves - calculate scroll offset from distance to sync with icebergs
  // Convert distance (miles) to pixels for scrolling
  const MILES_PER_PIXEL = 0.00015;
  const scrollOffset = (distance / MILES_PER_PIXEL) % (height * 2); // Modulo to create seamless scrolling
  drawWaves(ctx, riverLeft, riverRight, height, time, scrollOffset);

  // Icebergs (realistic shapes with highlights and shadows)
  icebergs.forEach((ice) => {
    drawRealisticIceberg(ctx, ice);
  });

  // Draw Titanic-like ship
  drawTitanic(ctx, boat);

  // HUD: distance meter
  const miles = (distance).toFixed(1);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(width / 2 - 100, 12, 200, 32);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.strokeRect(width / 2 - 100, 12, 200, 32);
  ctx.fillStyle = '#fff';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${miles} mi / ${milesToWin} mi to the ocean`, width / 2, 32);
}
