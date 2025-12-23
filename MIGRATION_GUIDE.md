# Migration Guide: Restructuring to Platform-Based Architecture

This guide explains how to migrate your existing repository to the new platform-based structure.

## Current Structure

```
double-diamond-slot/
├── assets/
├── core/
├── docs/
├── index.html
├── index-android.html
└── indexBeforeAttemptedCenter.html
```

## Target Structure

```
double-diamond-slot/
├── assets/               # Unchanged
├── core/                 # Unchanged
├── docs/
│   └── PLATFORM_NOTES.md     # NEW
├── platforms/            # NEW
│   ├── web/
│   │   ├── index.html
│   │   └── README.md
│   ├── android/
│   │   ├── index-android.html
│   │   └── README.md
│   └── ios/
│       └── README.md
├── README.md            # Update to reference new structure
└── LICENSE
```

## Migration Steps

### Step 1: Create Platform Directories

```bash
cd ~/slotmachine/double-diamond-slot
mkdir -p platforms/web platforms/android platforms/ios
```

### Step 2: Move Existing Files

```bash
# Move web version
mv index.html platforms/web/

# Move Android version
mv index-android.html platforms/android/

# Archive old backup
mkdir -p archive
mv indexBeforeAttemptedCenter.html archive/
```

### Step 3: Add Platform Documentation

Copy the README files:
- `platforms/web/README.md`
- `platforms/android/README.md`
- `platforms/ios/README.md`
- `docs/PLATFORM_NOTES.md`

### Step 4: Update Root README.md

Add a "Platform Support" section:

```markdown
## Platform Support

This project supports multiple platforms with optimized implementations:

- **Web**: Standard browser implementation (Chrome, Firefox, Safari, Edge)
- **Android**: WebView implementation for Android devices
- **iOS**: Planned for future development

See `/docs/PLATFORM_NOTES.md` for detailed platform differences.

### Quick Start by Platform

**Web Browser:**
\`\`\`bash
cd platforms/web
python3 -m http.server 8000
# Open http://localhost:8000
\`\`\`

**Android:**
See `/platforms/android/README.md` for integration instructions.
```

### Step 5: Update Asset Paths (Web Version)

In `platforms/web/index.html`, update paths to reference parent directories:

```javascript
// Before (when index.html was in root)
import { SYMBOLS } from './core/constants.js';

// After (index.html is in platforms/web/)
import { SYMBOLS } from '../../core/constants.js';
```

Update asset paths:
```javascript
// Before
BLANK: "./assets/blank.png"

// After  
BLANK: "../../assets/blank.png"
```

### Step 6: Update .gitignore

Add to `.gitignore`:
```
# Archives and backups
archive/

# Platform-specific builds
platforms/*/build/
platforms/*/dist/
```

### Step 7: Commit Changes

```bash
cd ~/slotmachine/double-diamond-slot

# Check status
git status

# Add new structure
git add platforms/
git add docs/PLATFORM_NOTES.md

# Remove old files from root (they're now in platforms/)
git rm index.html index-android.html
git rm indexBeforeAttemptedCenter.html

# Commit
git commit -m "Restructure project into platform-based architecture

- Move index.html to platforms/web/
- Move index-android.html to platforms/android/
- Add platform-specific README files
- Add PLATFORM_NOTES.md documentation
- Archive old backup file"

# Push
git push
```

## Android Studio Integration

After restructuring, update your Android Studio project:

### Option 1: Copy from Git Repo (Recommended)

```bash
# Copy Android implementation to Android Studio
cp ~/slotmachine/double-diamond-slot/platforms/android/index-android.html \
   ~/AndroidStudioProjects/DoubleDiamond/app/src/main/assets/
```

### Option 2: Symlink (Advanced)

```bash
# Create symlink (changes sync automatically)
ln -s ~/slotmachine/double-diamond-slot/platforms/android/index-android.html \
      ~/AndroidStudioProjects/DoubleDiamond/app/src/main/assets/index-android.html
```

## Verification Checklist

After migration, verify:

- [ ] Web version works: `cd platforms/web && python3 -m http.server 8000`
- [ ] Android version loads in Android Studio
- [ ] All assets load correctly (check browser console)
- [ ] Git history is preserved
- [ ] All documentation is in place
- [ ] Old backup file is archived

## Rolling Back

If you need to revert:

```bash
git log  # Find the commit before restructuring
git revert <commit-hash>
```

Or restore from backup:
```bash
git checkout HEAD~1 index.html index-android.html
```

## Questions?

If you encounter issues during migration, refer to:
- `/docs/PLATFORM_NOTES.md` for architecture details
- Platform-specific READMEs for troubleshooting
- Git history for previous file locations
