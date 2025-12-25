/*
===============================================
SPIN LOGIC
===============================================
Handles RNG and virtual-to-physical mapping
- Picks weighted stops from virtual reels
- Maps to physical reel positions

REFACTORED VERSION 2.0:
- Removed indexOf() call (now uses direct indexing)
- Removed PHYSICAL_STOP_SYMBOL lookup
- Virtual reel now contains position indices (0-21)
- Simplified logic, faster execution
===============================================
*/

import { PHYSICAL_REEL, VIRTUAL_REELS } from './reels.js';

/**
 * Simulate a single spin
 * @returns {object} - { stops: [{physicalIndex, symbol}], symbols: [string] }
 */
export function spin() {
  const results = [];
  const symbols = [];
  
  for (let reelIdx = 0; reelIdx < 3; reelIdx++) {
    const result = pickWeightedStop(reelIdx);
    results.push(result);
    symbols.push(result.symbol);
  }
  
  return { stops: results, symbols };
}

/**
 * Pick a weighted stop from virtual reel and map to physical position
 * 
 * Process:
 * 1. Get virtual reel for this reel index
 * 2. Select random index from virtual reel (0-71)
 * 3. Get physical position from virtual reel (value is 0-21)
 * 4. Get symbol from physical reel
 * 
 * @param {number} reelIndex - 0, 1, or 2
 * @returns {object} - { physicalIndex, symbol }
 */
export function pickWeightedStop(reelIndex) {
  const virtualReel = VIRTUAL_REELS[`REEL${reelIndex + 1}`];
  
  // Pick random index from virtual reel (0-71)
  const randomIndex = Math.floor(Math.random() * virtualReel.length);
  
  // Get physical position (virtual reel contains position indices 0-21)
  const physicalIndex = virtualReel[randomIndex];
  
  // Get symbol directly from physical reel (no lookup needed)
  const symbol = PHYSICAL_REEL[physicalIndex];
  
  return { physicalIndex, symbol };
}
