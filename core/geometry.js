/*
===============================================
PHYSICAL REEL GEOMETRY
===============================================
Calculates positions and heights for physical reel stops
- Handles mixed heights (blanks = 105px, symbols = 210px)
- Provides center-Y positions for animation

REFACTORED VERSION 2.0:
- Removed PHYSICAL_STOP_SYMBOL lookup
- Uses direct array access on PHYSICAL_REEL
- Simplified, faster code
===============================================
*/

import { PHYSICAL_REEL } from './reels.js';
import { SYMBOL_HEIGHTS } from './constants.js';

/**
 * Build geometry data for the physical reel
 * 
 * Calculates pixel positions for each stop on the physical reel.
 * This is used for animation and rendering.
 * 
 * @returns {object} - { stops: [{index, symbol, height, centerY}], totalHeight }
 */
export function buildPhysicalGeometry() {
  let offset = 0;
  const stops = [];

  PHYSICAL_REEL.forEach((symbol, index) => {
    const height = SYMBOL_HEIGHTS[symbol];
    
    if (!height) {
      throw new Error(`Missing height for symbol: ${symbol}`);
    }
    
    const centerY = offset + height / 2;
    
    stops.push({ 
      index,      // Physical position (0-21)
      symbol,     // Symbol name
      height,     // Symbol height in pixels
      centerY     // Center Y coordinate
    });
    
    offset += height;
  });

  return { 
    stops, 
    totalHeight: offset  // Total reel strip height
  };
}

// Pre-calculate geometry on module load
export const GEOMETRY = buildPhysicalGeometry();
