# Web Platform

## Overview

This directory contains the standard web browser implementation of the Double Diamond Slot Machine, optimized for desktop and tablet browsers.

## Files

- **`index.html`** - Main entry point for web browsers
  - Uses ES6 modules to load core game logic from `/core/`
  - Standard responsive CSS design
  - Optimized for mouse and keyboard interaction

## Key Features

### Responsive Design

The web implementation uses standard CSS techniques for responsiveness:

- **Flexbox centering**: Content is centered using CSS flexbox
- **Relative positioning**: Standard document flow
- **CSS-only scaling**: No JavaScript-based transform scaling needed
- **Browser-native behavior**: Relies on browser's built-in responsive capabilities

### Supported Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Differences from Android Version

1. **Module Loading**:
   - Web: Uses ES6 `import` statements to load `/core/` modules
   - Android: All code bundled inline in single HTML file

2. **Container Structure**:
   - Web: Simple `.stage` container with flexbox centering
   - Android: Nested wrapper structure for custom scaling

3. **Scaling**:
   - Web: CSS media queries and standard responsive techniques
   - Android: Custom `scaleStageToFit()` JavaScript function

4. **Input Methods**:
   - Web: Keyboard shortcuts (Space/Enter to spin) + mouse
   - Android: Touch-optimized, no keyboard shortcuts needed

## Asset Loading

Assets are loaded from the `/assets/` directory using relative paths:

```
double-diamond-slot/
├── assets/
│   ├── blank.png
│   ├── cheries.png
│   └── ...
├── core/
│   ├── constants.js
│   └── ...
└── platforms/
    └── web/
        └── index.html  ← Loads ../../../assets/ and ../../../core/
```

## Running Locally

### Simple HTTP Server

```bash
# From project root
cd platforms/web
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### Using npm/Node.js

```bash
# Install http-server globally
npm install -g http-server

# From project root
cd platforms/web
http-server -p 8000
```

### Using PHP

```bash
cd platforms/web
php -S localhost:8000
```

## Deployment

### Static Hosting (GitHub Pages, Netlify, Vercel)

1. The entire project can be deployed as static files
2. Ensure `/core/` and `/assets/` directories are included
3. Set `platforms/web/index.html` as the entry point
4. No build step required

### Example: GitHub Pages

```bash
# In your repository settings
# GitHub Pages → Source → Branch: main → Folder: /platforms/web
```

### Example: Netlify

Create `netlify.toml` in project root:

```toml
[build]
  publish = "platforms/web"
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Browser Compatibility

### Required Features

- ES6 Modules (`import`/`export`)
- CSS Flexbox
- JavaScript ES6+ (arrow functions, const/let, template literals)
- CSS transforms (for animations)

### Progressive Enhancement

The game currently requires JavaScript. Future enhancements:

- [ ] Add `<noscript>` fallback message
- [ ] Consider progressive web app (PWA) features
- [ ] Add offline support with service worker

## Performance

- Assets are loaded once on page load
- Animations use CSS transforms (GPU-accelerated)
- No framework overhead - vanilla JavaScript
- Minimal DOM manipulation

## Development

### Hot Reload

For development with auto-reload:

```bash
npm install -g live-server
cd platforms/web
live-server --port=8000
```

### Debugging

- Open browser DevTools (F12)
- Console tab shows game logic output
- Network tab shows asset loading
- Elements tab for DOM inspection

## Keyboard Shortcuts

- **Space** or **Enter**: Spin the reels
- Works when not typing in any input field

## Future Improvements

- [ ] Add service worker for offline play
- [ ] Implement save state to localStorage
- [ ] Add sound effects toggle
- [ ] Create progressive web app manifest
- [ ] Add analytics (optional)
- [ ] Implement share/social features

## Updating from Core

When core game logic is updated:

1. Changes in `/core/` files are automatically reflected
2. No rebuild or bundling required
3. Simply refresh the browser
4. ES6 modules make development easy

## License

Same as main project (see root LICENSE file).
