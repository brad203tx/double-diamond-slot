cat > README.md << 'EOF'
# Double Diamond Slot Machine

An open-source, transparent implementation of a classic Double Diamond–style slot machine, designed as a reference model for probability, simulation, and deterministic game logic.

![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![RTP](https://img.shields.io/badge/RTP-96.07%25-green.svg)

## 🎰 Features

- **Transparent Probability Model**: Virtual reel system with documented weighting
- **Reproducible RTP**: Independent validation through Monte Carlo simulation
- **Modular Architecture**: Shared core logic between UI and test harness
- **Cross-Platform**: Runs in browsers and mobile WebViews (iOS/Android)
- **Educational**: Complete documentation of slot machine mechanics

## 🚀 Quick Start

### Play the Game

Simply open `index.html` in any modern browser.

### Run RTP Validation
```bash
# Install Node.js, then:
npm install

# Run 1 million spin simulation
npm test

# Quick test (100K spins)
npm run test:quick

# Thorough test (10M spins)
npm run test:thorough
```

Output generates CSV files with complete PAR sheet analysis.

## 📊 RTP Results (1M Spins)

- **RTP**: 96.0678%
- **Hit Frequency**: 14.658%
- **Average Win Per Hit**: 6.55 coins

## 🏗️ Architecture
```
double-diamond-slot/
├── core/
│   ├── constants.js    # Symbols, payout table, game config
│   ├── reels.js        # Physical (22) & virtual (72) reel definitions
│   ├── payout.js       # Win evaluation with wild logic
│   ├── spin.js         # RNG and virtual-to-physical mapping
│   └── geometry.js     # Physical reel positioning
├── index.html          # Game UI (imports from core/)
├── test-harness.js     # Simulation runner (imports from core/)
└── docs/               # White paper and documentation
```

## 🎓 How It Works

### Physical vs Virtual Reels

- **Physical Reel**: 22 stops (11 symbols + 11 blanks) - what players see
- **Virtual Reel**: 72 stops - controls probability through weighted mapping
- Multiple virtual stops can map to the same physical stop, creating weighted outcomes

### RNG to Outcome Flow
```javascript
// 1. Pick from 72-stop virtual reel
const virtualStopId = VIRTUAL_REEL[Math.floor(Math.random() * 72)];

// 2. Map to physical position (0-21)
const physicalIndex = PHYSICAL_REEL.indexOf(virtualStopId);

// 3. Animate to that position
// Outcome determined BEFORE animation begins
```

## 📖 Documentation

See `docs/white-paper.html` for complete technical documentation including:
- Mathematical model and probability calculations
- Implementation details
- RTP validation methodology
- Virtual reel weight distribution

## ⚠️ Important Disclaimers

This is **NOT**:
- ❌ A certified gambling device
- ❌ Regulatory compliant for real-money wagering
- ❌ Suitable for commercial casino use

This **IS**:
- ✅ Educational reference implementation
- ✅ Reproducible RTP validation tool
- ✅ Architectural demonstration
- ✅ Open-source learning resource

## 📄 License

GPL-3.0 License - see LICENSE file for details

## 👤 Author

**Bruce Bradbury**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🙏 Acknowledgments

- Inspired by classic Double Diamond slot machines
- Built with modern web standards (ES6 modules, CSS transforms)
- Test harness validates actual production code
EOF