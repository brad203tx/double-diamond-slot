# Platform Notes

## Overview

The Double Diamond Slot Machine is designed to be **device-agnostic** at its core, with platform-specific implementations for optimal user experience on each target platform.

## Architecture

### Shared Components (Device-Agnostic)

The following components are **100% shared** across all platforms:

- **`/core/`** - All game logic and algorithms
  - `constants.js` - Symbol definitions, payout tables, game configuration
  - `geometry.js` - Reel geometry calculations
  - `payout.js` - Win evaluation logic
  - `reels.js` - Virtual and physical reel definitions
  - `spin.js` - Spin mechanics and RNG
  
- **`/assets/`** - All visual and audio assets
  - Images (PNG)
  - Sounds (future)
  - Animations (GIF)

### Platform-Specific Components

Each platform has its own HTML entry point and configuration:

- **`/platforms/web/`** - Standard web browser implementation
- **`/platforms/android/`** - Android WebView optimized implementation
- **`/platforms/ios/`** - iOS WebView optimized implementation (future)

## Key Differences Between Platforms

### Web vs Mobile (Android/iOS)

| Aspect | Web | Android/iOS |
|--------|-----|-------------|
| **Viewport Handling** | Standard responsive design | Custom scaling with wrapper container |
| **Screen Orientation** | Auto-adapts | Supports landscape + portrait |
| **Touch Optimization** | Mouse + touch | Touch-first with larger tap targets |
| **Scaling Strategy** | CSS media queries | JavaScript-based transform scaling |

### Specific Implementation Details

#### Web (`/platforms/web/index.html`)
- Uses standard CSS flexbox for centering
- Relies on browser's native responsive behavior
- Optimized for desktop and tablet browsers
- No special viewport wrapper needed

#### Android (`/platforms/android/index-android.html`)
- Uses absolute positioned wrapper container (`#stage-wrapper`)
- Implements custom `scaleStageToFit()` function
- Scales content based on device dimensions (1280x900 design base)
- Handles both landscape and portrait orientations
- Tested on: tablets (1280x800), phones (480x854 to 1080x2340)

#### iOS (`/platforms/ios/`) - Future
- Will use similar approach to Android
- May require iOS-specific WebView adjustments
- Safari-specific optimizations

## Design Principles

1. **Core Logic is Sacred** - Game mechanics never change between platforms
2. **Assets are Universal** - Same visual assets work everywhere
3. **Platform Adaptation is Minimal** - Only viewport/scaling differences
4. **Single Source of Truth** - Core logic lives in `/core/`, not duplicated

## Testing Matrix

| Platform | Min Resolution | Max Resolution | Scale Range |
|----------|---------------|----------------|-------------|
| Web | 1024x768 | 3840x2160 | N/A |
| Android Phone (Small) | 480x854 | - | 36% |
| Android Phone (Medium) | 720x1280 | - | 55% |
| Android Phone (Large) | 1080x2340 | - | 83% |
| Android Tablet | 1280x800 | 2560x1600 | 87%+ |

## Adding a New Platform

To add support for a new platform:

1. Create directory: `/platforms/{platform-name}/`
2. Copy closest existing `index.html` as starting point
3. Create platform-specific `README.md`
4. Adjust viewport/scaling logic as needed
5. Test across device size range
6. Document differences in platform README
7. Update this document with new platform details

## Version Control

- Each platform maintains its own entry point HTML file
- Shared components (`/core/`, `/assets/`) are never duplicated
- Platform-specific changes should NOT leak into shared code
- When updating game logic, update `/core/` files only once

## Build Process

Each platform directory contains its own `README.md` with:
- Build instructions
- Deployment steps
- Platform-specific requirements
- Testing guidelines

See individual platform README files for details.
