/*
===============================================
SPIN LOGIC
===============================================
Handles RNG and virtual-to-physical mapping
- Picks weighted stops from virtual reels
- Maps to physical reel positions
===============================================
*/

import { PHYSICAL_REEL, PHYSICAL_STOP_SYMBOL, VIRTUAL_REELS } from './reels.js';

/**
 * Simulate a single spin
 * @returns {object} - { stops: [{stopId, physicalIndex, symbol}], symbols: [string] }
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
 * @param {number} reelIndex - 0, 1, or 2
 * @returns {object} - { stopId, physicalIndex, symbol }
 */
export function pickWeightedStop(reelIndex) {
  const virtualReel = VIRTUAL_REELS[`REEL${reelIndex + 1}`];
  
  // Pick from 72-stop virtual reel (weighted)
  const virtualStopId = virtualReel[Math.floor(Math.random() * virtualReel.length)];
  
  // Map to physical position (0-21)
  const physicalIndex = PHYSICAL_REEL.indexOf(virtualStopId);
  
  // Get display symbol
  const symbol = PHYSICAL_STOP_SYMBOL[virtualStopId];
  
  return { stopId: virtualStopId, physicalIndex, symbol };
}