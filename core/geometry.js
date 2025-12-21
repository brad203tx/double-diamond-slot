/*
===============================================
PHYSICAL REEL GEOMETRY
===============================================
Calculates positions and heights for physical reel stops
- Handles mixed heights (blanks = 105px, symbols = 210px)
- Provides center-Y positions for animation
===============================================
*/

import { PHYSICAL_REEL, PHYSICAL_STOP_SYMBOL } from './reels.js';
import { SYMBOL_HEIGHTS } from './constants.js';

/**
 * Build geometry data for the physical reel
 * @returns {object} - { stops: [{index, stopId, symbol, height, centerY}], totalHeight }
 */
export function buildPhysicalGeometry() {
  let offset = 0;
  const stops = [];

  PHYSICAL_REEL.forEach((stopId, index) => {
    const symbol = PHYSICAL_STOP_SYMBOL[stopId];
    const height = SYMBOL_HEIGHTS[symbol];
    
    if (!height) {
      throw new Error(`Missing height for symbol: ${symbol}`);
    }
    
    const centerY = offset + height / 2;
    
    stops.push({ 
      index, 
      stopId, 
      symbol, 
      height, 
      centerY 
    });
    
    offset += height;
  });

  return { 
    stops, 
    totalHeight: offset 
  };
}

// Pre-calculate geometry on module load
export const GEOMETRY = buildPhysicalGeometry();