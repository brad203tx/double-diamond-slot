/*
===============================================
PAYOUT EVALUATION
===============================================
Evaluates winning combinations with wild logic
- Double Diamond acts as wild with multipliers
- Handles all payout types from PAR sheet
===============================================
*/

import { PAYOUT_TABLE } from './constants.js';

/**
 * Evaluate a 3-symbol combination
 * @param {string[]} symbols - Array of 3 symbol names
 * @param {number} coins - Bet amount (for scaling)
 * @returns {object} - { type, payout }
 */
export function evaluate(symbols, coins = 1) {
  const wilds = symbols.filter(s => s === "DOUBLE_DIAMOND").length;
  const nonWild = symbols.filter(s => s !== "DOUBLE_DIAMOND");

  // Jackpot: 3x DOUBLE_DIAMOND (no multiplier)
  if (wilds === 3) {
    return { type: "JACKPOT", payout: PAYOUT_TABLE.JACKPOT * coins };
  }

  // Wild multiplier: 2 wilds = 4x, 1 wild = 2x, 0 wilds = 1x
  const wildMultiplier = wilds === 2 ? 4 : wilds === 1 ? 2 : 1;

  // Check for 3-of-a-kind with wild substitution
  if (nonWild.length > 0) {
    const sym = nonWild[0];
    if (nonWild.every(s => s === sym)) {
      const base = PAYOUT_TABLE[sym] || 0;
      if (base > 0) {
        return { type: sym, payout: base * wildMultiplier * coins };
      }
    }
  }

  // Mixed bars (any 3 BARs)
  if (symbols.every(s => s.includes("BAR") || s === "DOUBLE_DIAMOND")) {
    return { 
      type: "MIXED_BARS", 
      payout: PAYOUT_TABLE.MIXED_BARS * wildMultiplier * coins 
    };
  }

  // Cherry logic (wilds multiply but don't count as cherries)
  const cherryCount = symbols.filter(s => s === "CHERRY").length;
  if (cherryCount === 3) {
    return { 
      type: "CHERRY_3", 
      payout: PAYOUT_TABLE.CHERRY_3 * wildMultiplier * coins 
    };
  }
  if (cherryCount === 2) {
    return { 
      type: "CHERRY_2", 
      payout: PAYOUT_TABLE.CHERRY_2 * wildMultiplier * coins 
    };
  }
  if (cherryCount === 1) {
    return { 
      type: "CHERRY_1", 
      payout: PAYOUT_TABLE.CHERRY_1 * wildMultiplier * coins 
    };
  }

  return { type: "LOSE", payout: 0 };
}