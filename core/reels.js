/*
===============================================
REEL DEFINITIONS
===============================================
Physical and virtual reel configurations
- Physical reel: 22 stops (visual strip)
- Virtual reels: 72 stops (for weighting)

REFACTORED VERSION 2.0:
- Removed symbolic IDs (BLANK_A, SEVEN_B, etc.)
- Removed PHYSICAL_STOP_SYMBOL lookup table
- Virtual reels now use position indices (0-21)
- Added VIRTUAL_REEL_WEIGHTS configuration format
===============================================
*/

// Physical reel (22 stops) - the actual visual strip
// Each position contains the symbol name directly
export const PHYSICAL_REEL = [
  "BLANK",          // Position 0
  "SEVEN",          // Position 1
  "BLANK",          // Position 2
  "SINGLE_BAR",     // Position 3
  "BLANK",          // Position 4
  "DOUBLE_DIAMOND", // Position 5
  "BLANK",          // Position 6
  "TRIPLE_BAR",     // Position 7
  "BLANK",          // Position 8
  "CHERRY",         // Position 9
  "BLANK",          // Position 10
  "DOUBLE_BAR",     // Position 11
  "BLANK",          // Position 12
  "SEVEN",          // Position 13
  "BLANK",          // Position 14
  "SINGLE_BAR",     // Position 15
  "BLANK",          // Position 16
  "DOUBLE_DIAMOND", // Position 17
  "BLANK",          // Position 18
  "TRIPLE_BAR",     // Position 19
  "BLANK",          // Position 20
  "DOUBLE_BAR"      // Position 21
];

/**
 * Virtual Reel Weight Configuration
 * 
 * Defines probability of landing on each physical position.
 * Format: { physicalPosition: count }
 * 
 * Example: Position 3 has count 12, meaning it appears 12 times
 * in the 72-stop virtual reel, giving it 12/72 = 16.67% probability.
 * 
 * IMPORTANT: The order in which these counts are expanded into
 * the runtime virtual reel array is IRRELEVANT. Only the counts matter.
 */
export const VIRTUAL_REEL_WEIGHTS = {
  REEL1: {
    0: 4,    // BLANK: 5.56%
    1: 1,    // SEVEN: 1.39%
    2: 4,    // BLANK: 5.56%
    3: 12,   // SINGLE_BAR: 16.67%
    4: 3,    // BLANK: 4.17%
    5: 1,    // DOUBLE_DIAMOND: 1.39%
    6: 3,    // BLANK: 4.17%
    7: 1,    // TRIPLE_BAR: 1.39%
    8: 3,    // BLANK: 4.17%
    9: 1,    // CHERRY: 1.39%
    10: 3,   // BLANK: 4.17%
    11: 4,   // DOUBLE_BAR: 5.56%
    12: 3,   // BLANK: 4.17%
    13: 1,   // SEVEN: 1.39%
    14: 3,   // BLANK: 4.17%
    15: 12,  // SINGLE_BAR: 16.67%
    16: 3,   // BLANK: 4.17%
    17: 0,   // DOUBLE_DIAMOND: 0.00% (not used in this config)
    18: 3,   // BLANK: 4.17%
    19: 1,   // TRIPLE_BAR: 1.39%
    20: 3,   // BLANK: 4.17%
    21: 3    // DOUBLE_BAR: 4.17%
  },
  REEL2: {
    0: 4, 1: 1, 2: 4, 3: 12, 4: 3, 5: 1, 6: 3, 7: 1,
    8: 3, 9: 1, 10: 3, 11: 4, 12: 3, 13: 1, 14: 3, 15: 12,
    16: 3, 17: 0, 18: 3, 19: 1, 20: 3, 21: 3
  },
  REEL3: {
    0: 4, 1: 1, 2: 4, 3: 12, 4: 3, 5: 1, 6: 3, 7: 1,
    8: 3, 9: 1, 10: 3, 11: 4, 12: 3, 13: 1, 14: 3, 15: 12,
    16: 3, 17: 0, 18: 3, 19: 1, 20: 3, 21: 3
  }
};

/**
 * Expand weight configuration into runtime virtual reel array
 * 
 * Converts { position: count } format into array of position indices.
 * This is done once at module load time for performance.
 * 
 * Example:
 *   Input:  { 0: 2, 1: 3, 2: 1 }
 *   Output: [0, 0, 1, 1, 1, 2]
 *   
 * Note: Output array order is arbitrary and does not affect probabilities.
 * 
 * @param {Object} weights - Position to count mapping
 * @param {number} expectedTotal - Expected sum (default 72)
 * @returns {Array<number>} Array of position indices
 */
function expandWeightsToVirtualReel(weights, expectedTotal = 72) {
  const virtualReel = [];
  
  // Validate total
  const total = Object.values(weights).reduce((sum, count) => sum + count, 0);
  if (total !== expectedTotal) {
    throw new Error(
      `Virtual reel weights must sum to ${expectedTotal}, got ${total}`
    );
  }
  
  // Validate all positions covered
  const physicalPositions = PHYSICAL_REEL.length;
  for (let i = 0; i < physicalPositions; i++) {
    if (!(i in weights)) {
      throw new Error(`Missing weight for physical position ${i}`);
    }
  }
  
  // Expand: for each position, add it 'count' times
  Object.entries(weights).forEach(([position, count]) => {
    const pos = parseInt(position);
    for (let i = 0; i < count; i++) {
      virtualReel.push(pos);
    }
  });
  
  return virtualReel;
}

/**
 * Runtime Virtual Reels
 * 
 * These are expanded from VIRTUAL_REEL_WEIGHTS at module load.
 * Each is an array of 72 physical position indices (0-21).
 * 
 * Used by pickWeightedStop() for fast random selection.
 */
export const VIRTUAL_REELS = {
  REEL1: expandWeightsToVirtualReel(VIRTUAL_REEL_WEIGHTS.REEL1),
  REEL2: expandWeightsToVirtualReel(VIRTUAL_REEL_WEIGHTS.REEL2),
  REEL3: expandWeightsToVirtualReel(VIRTUAL_REEL_WEIGHTS.REEL3)
};

/**
 * Get symbol at a specific physical position
 * 
 * @param {number} physicalIndex - Position on physical reel (0-21)
 * @returns {string} Symbol name (e.g., "SEVEN", "BLANK")
 */
export function getSymbolAtPosition(physicalIndex) {
  return PHYSICAL_REEL[physicalIndex];
}

/**
 * Analyze virtual reel to show weight distribution
 * Useful for debugging and validation
 * 
 * @param {number} reelIndex - Which reel (0, 1, or 2)
 * @returns {Object} Symbol counts and percentages
 */
export function analyzeVirtualReel(reelIndex) {
  const weights = VIRTUAL_REEL_WEIGHTS[`REEL${reelIndex + 1}`];
  const analysis = {};
  
  Object.entries(weights).forEach(([position, count]) => {
    const symbol = PHYSICAL_REEL[position];
    if (!analysis[symbol]) {
      analysis[symbol] = { count: 0, positions: [] };
    }
    analysis[symbol].count += count;
    analysis[symbol].positions.push({ position: parseInt(position), count });
  });
  
  // Add percentages
  Object.keys(analysis).forEach(symbol => {
    analysis[symbol].percentage = (analysis[symbol].count / 72 * 100).toFixed(2);
  });
  
  return analysis;
}
