/*
===============================================
CORE CONSTANTS
===============================================
Shared constants for slot machine
- Symbol definitions and heights
- Payout table
- Game configuration
===============================================
*/

// Symbol image URLs - NOW USING LOCAL ASSETS
export const SYMBOLS = {
  BLANK: "./assets/blank.png",
  SINGLE_BAR: "./assets/singleBarReelIcon.png",
  DOUBLE_BAR: "./assets/doubleBarReelIcon.png",
  TRIPLE_BAR: "./assets/tripleBarReelIcon.png",
  SEVEN: "./assets/sevenReelIcon.png",
  DOUBLE_DIAMOND: "./assets/doublediaReelIcon.png",
  CHERRY: "./assets/cheries.png"
};

// Symbol heights in pixels
export const SYMBOL_HEIGHTS = {
  BLANK: 105,
  SINGLE_BAR: 210,
  DOUBLE_BAR: 210,
  TRIPLE_BAR: 210,
  SEVEN: 210,
  DOUBLE_DIAMOND: 210,
  CHERRY: 210
};

// Payout table (per 1 coin)
export const PAYOUT_TABLE = {
  JACKPOT: 800,        // 3x DOUBLE_DIAMOND
  SEVEN: 80,           // 3x SEVEN
  TRIPLE_BAR: 40,      // 3x TRIPLE_BAR
  DOUBLE_BAR: 25,      // 3x DOUBLE_BAR
  SINGLE_BAR: 10,      // 3x SINGLE_BAR
  CHERRY_3: 10,        // 3x CHERRY
  MIXED_BARS: 5,       // any 3 BARs mixed
  CHERRY_2: 5,         // any 2 cherries
  CHERRY_1: 2          // any 1 cherry
};

// Game configuration
export const GAME_CONFIG = {
  DEFAULT_BALANCE: 1000,
  BIG_WIN_THRESHOLD_PER_COIN: 30,
  SPIN_TIME: 1800,
  STAGGER_MS: 250
};
