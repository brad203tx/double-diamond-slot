#!/usr/bin/env node

/*
===============================================
SLOT MACHINE TEST HARNESS
===============================================
Simulates millions of spins to calculate:
- RTP (Return to Player %)
- Hit frequency
- PAR sheet (symbol combinations & payouts)
- Distribution analysis

Usage: node test-harness.js [spins]
Example: node test-harness.js 1000000

Outputs:
- Console logs with formatted tables
- par_sheet.csv - Winning combinations PAR sheet
- symbol_frequency.csv - Symbol appearance rates per reel
- virtual_reel_weights.csv - Virtual reel distribution
- summary.csv - Overall RTP and statistics
===============================================
*/

import fs from 'fs';
import { spin } from './core/spin.js';
import { evaluate } from './core/payout.js';
import { VIRTUAL_REELS, PHYSICAL_STOP_SYMBOL } from './core/reels.js';

// ===============================
// SIMULATION
// ===============================
function runSimulation(numSpins) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`SLOT MACHINE SIMULATION - ${numSpins.toLocaleString()} SPINS`);
  console.log(`${"=".repeat(60)}\n`);

  const stats = {
    totalSpins: numSpins,
    totalWagered: numSpins,
    totalWon: 0,
    totalHits: 0,
    outcomes: {}
  };

  console.log("Running simulation...");
  const startTime = Date.now();

  for (let i = 0; i < numSpins; i++) {
    const spinResult = spin();
    const payoutResult = evaluate(spinResult.symbols, 1);

    stats.totalWon += payoutResult.payout;

    if (payoutResult.payout > 0) {
      stats.totalHits++;
    }

    const key = spinResult.symbols.join("-");
    if (!stats.outcomes[key]) {
      stats.outcomes[key] = {
        symbols: spinResult.symbols,
        type: payoutResult.type,
        payout: payoutResult.payout,
        count: 0
      };
    }
    stats.outcomes[key].count++;

    // Progress indicator
    if ((i + 1) % 100000 === 0) {
      process.stdout.write(`\r${((i + 1) / numSpins * 100).toFixed(1)}%`);
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`\r100.0% - Completed in ${(elapsed / 1000).toFixed(2)}s\n`);

  return stats;
}

// ===============================
// CSV GENERATION
// ===============================
function generateCSVs(stats) {
  const csvFiles = [];

  // Summary CSV
  const rtp = (stats.totalWon / stats.totalWagered) * 100;
  const hitFrequency = (stats.totalHits / stats.totalSpins) * 100;
  const avgWin = stats.totalHits > 0 ? (stats.totalWon / stats.totalHits) : 0;

  const summaryCSV = [
    "Metric,Value",
    `Total Spins,${stats.totalSpins}`,
    `Total Wagered,${stats.totalWagered}`,
    `Total Won,${stats.totalWon}`,
    `RTP %,${rtp.toFixed(4)}`,
    `Hit Frequency %,${hitFrequency.toFixed(4)}`,
    `Average Win Per Hit,${avgWin.toFixed(2)}`
  ].join('\n');

  fs.writeFileSync('summary.csv', summaryCSV);
  csvFiles.push('summary.csv');

  // PAR Sheet CSV
  const sorted = Object.values(stats.outcomes).sort((a, b) => b.payout - a.payout);
  const parLines = ["Reel 1,Reel 2,Reel 3,Win Type,Payout,Count,Frequency %,Contribution %"];

  sorted.forEach(outcome => {
    if (outcome.payout > 0) {
      const freq = (outcome.count / stats.totalSpins) * 100;
      const contribution = (outcome.count * outcome.payout / stats.totalWon) * 100;
      parLines.push(
        `${outcome.symbols[0]},${outcome.symbols[1]},${outcome.symbols[2]},` +
        `${outcome.type},${outcome.payout},${outcome.count},` +
        `${freq.toFixed(4)},${contribution.toFixed(4)}`
      );
    }
  });

  fs.writeFileSync('par_sheet.csv', parLines.join('\n'));
  csvFiles.push('par_sheet.csv');

  // Symbol Frequency CSV
  const symbolFreqs = [{}, {}, {}];

  Object.values(stats.outcomes).forEach(outcome => {
    outcome.symbols.forEach((sym, reelIdx) => {
      if (!symbolFreqs[reelIdx][sym]) {
        symbolFreqs[reelIdx][sym] = 0;
      }
      symbolFreqs[reelIdx][sym] += outcome.count;
    });
  });

  const freqLines = ["Symbol,Reel 1 Count,Reel 1 %,Reel 2 Count,Reel 2 %,Reel 3 Count,Reel 3 %"];
  const allSymbols = new Set();
  symbolFreqs.forEach(reelFreq => {
    Object.keys(reelFreq).forEach(sym => allSymbols.add(sym));
  });

  Array.from(allSymbols).sort().forEach(sym => {
    const counts = symbolFreqs.map(rf => rf[sym] || 0);
    const freqs = counts.map(c => (c / stats.totalSpins * 100).toFixed(4));
    freqLines.push(
      `${sym},${counts[0]},${freqs[0]},${counts[1]},${freqs[1]},${counts[2]},${freqs[2]}`
    );
  });

  fs.writeFileSync('symbol_frequency.csv', freqLines.join('\n'));
  csvFiles.push('symbol_frequency.csv');

  // Virtual Reel Weights CSV
  const weightLines = ["Symbol,Reel 1 Stops,Reel 1 Weight %,Reel 2 Stops,Reel 2 Weight %,Reel 3 Stops,Reel 3 Weight %"];
  const allReelSymbols = new Set();
  const reelWeights = [];

  ["REEL1", "REEL2", "REEL3"].forEach((reelName, idx) => {
    const reel = VIRTUAL_REELS[reelName];
    const symbolCounts = {};

    reel.forEach(stopId => {
      const sym = PHYSICAL_STOP_SYMBOL[stopId];
      symbolCounts[sym] = (symbolCounts[sym] || 0) + 1;
      allReelSymbols.add(sym);
    });

    reelWeights[idx] = symbolCounts;
  });

  Array.from(allReelSymbols).sort().forEach(sym => {
    const data = reelWeights.map(rw => {
      const count = rw[sym] || 0;
      const weight = (count / 72 * 100).toFixed(2);
      return [count, weight];
    });
    weightLines.push(
      `${sym},${data[0][0]},${data[0][1]},${data[1][0]},${data[1][1]},${data[2][0]},${data[2][1]}`
    );
  });

  fs.writeFileSync('virtual_reel_weights.csv', weightLines.join('\n'));
  csvFiles.push('virtual_reel_weights.csv');

  return csvFiles;
}

// ===============================
// CONSOLE REPORT
// ===============================
function generateReport(stats) {
  const rtp = (stats.totalWon / stats.totalWagered) * 100;
  const hitFrequency = (stats.totalHits / stats.totalSpins) * 100;

  console.log(`${"=".repeat(60)}`);
  console.log("OVERALL STATISTICS");
  console.log(`${"=".repeat(60)}`);
  console.log(`Total Spins:      ${stats.totalSpins.toLocaleString()}`);
  console.log(`Total Wagered:    ${stats.totalWagered.toLocaleString()} coins`);
  console.log(`Total Won:        ${stats.totalWon.toLocaleString()} coins`);
  console.log(`RTP:              ${rtp.toFixed(4)}%`);
  console.log(`Hit Frequency:    ${hitFrequency.toFixed(4)}%`);
  console.log(`Average Win:      ${(stats.totalWon / stats.totalHits).toFixed(2)} coins per hit`);
  console.log();

  // Sort outcomes by payout descending
  const sorted = Object.values(stats.outcomes).sort((a, b) => b.payout - a.payout);

  console.log(`${"=".repeat(60)}`);
  console.log("PAR SHEET - TOP 20 WINNING COMBINATIONS");
  console.log(`${"=".repeat(60)}`);
  console.log(`${"Combination".padEnd(30)} ${"Pays".padEnd(8)} ${"Count".padEnd(12)} ${"Frequency".padEnd(12)} Contribution`);
  console.log(`${"-".repeat(60)}`);

  let displayCount = 0;
  sorted.forEach(outcome => {
    if (outcome.payout > 0 && displayCount < 20) {
      const freq = (outcome.count / stats.totalSpins) * 100;
      const contribution = (outcome.count * outcome.payout / stats.totalWon) * 100;

      const combo = outcome.symbols.join(" | ");
      console.log(
        `${combo.padEnd(30)} ` +
        `${outcome.payout.toString().padEnd(8)} ` +
        `${outcome.count.toLocaleString().padEnd(12)} ` +
        `${freq.toFixed(4)}%`.padEnd(12) + ` ` +
        `${contribution.toFixed(2)}%`
      );
      displayCount++;
    }
  });

  console.log();
}

// ===============================
// MAIN
// ===============================
const args = process.argv.slice(2);
const numSpins = parseInt(args[0]) || 1000000;

const stats = runSimulation(numSpins);
generateReport(stats);

console.log(`\n${"=".repeat(60)}`);
console.log("GENERATING CSV FILES");
console.log(`${"=".repeat(60)}`);

const csvFiles = generateCSVs(stats);
csvFiles.forEach(file => {
  console.log(`✓ Created ${file}`);
});

console.log();
console.log(`${"=".repeat(60)}`);
console.log("SIMULATION COMPLETE");
console.log(`${"=".repeat(60)}\n`);