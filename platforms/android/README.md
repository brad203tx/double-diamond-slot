# Android Platform

## Overview

This directory contains the Android-specific implementation of the Double Diamond Slot Machine, optimized for Android WebView.

## Files

- **`index-android.html`** - Main entry point for Android WebView
  - Includes all game logic bundled inline (no external JS files needed)
  - Custom viewport scaling for tablets and phones
  - Supports landscape and portrait orientations

## Key Features

### Viewport Scaling

The Android implementation uses a custom scaling system to ensure the game looks perfect on all Android devices:

- **Design Base**: 1280x900 pixels
- **Scaling Method**: Transform-based with flexbox centering
- **Wrapper Container**: `#stage-wrapper` - absolutely positioned, fills viewport, uses flexbox to center content
- **Orientation Support**: Full support for landscape and portrait modes

### Tested Devices

| Device Type | Resolution | Scale Factor | Status |
|-------------|-----------|--------------|--------|
| Small Phone | 480x854 | 36.3% | ✅ Working |
| Medium Phone | 720x1280 | 55% | ✅ Working |
| Pixel 6 | 1080x2340 | 83.1% | ✅ Working |
| Tablet | 1280x800 | 87.1% | ✅ Working |

## Differences from Web Version

1. **Container Structure**:
   - Web: Single `.stage` container
   - Android: `#stage-wrapper` > `.stage` (nested for proper centering)

2. **Scaling Function**:
   - Web: CSS-only responsive design
   - Android: `scaleStageToFit()` JavaScript function with transform scaling

3. **Orientation**:
   - Web: Typically landscape-focused
   - Android: Full landscape + portrait support via `screenOrientation="fullSensor"`

## Integration with Android Studio

### Project Structure

```
YourAndroidProject/
├── app/
│   └── src/
│       └── main/
│           ├── assets/
│           │   ├── index-android.html
│           │   └── assets/         # Nested assets folder for game images
│           │       ├── blank.png
│           │       ├── cheries.png
│           │       ├── confetti.gif
│           │       ├── ddsplash.png
│           │       ├── doubleBarReelIcon.png
│           │       ├── doublediaReelIcon.png
│           │       ├── sevenReelIcon.png
│           │       ├── singleBarReelIcon.png
│           │       ├── slotbck_2.png
│           │       └── tripleBarReelIcon.png
│           ├── java/ (or kotlin/)
│           │   └── com/yourpackage/
│           │       └── MainActivity.java
│           ├── res/
│           │   └── layout/
│           │       └── activity_main.xml
│           └── AndroidManifest.xml
└── build.gradle
```

### Required Configuration Changes

The following files need to be modified from Android Studio's default generated templates:

#### 1. AndroidManifest.xml

**Changes from default:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.yourpackage.doublediamond">

    <!-- ADD: Internet permission (if you need web assets or future features) -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.DoubleDiamond">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            
            <!-- CHANGE: Allow full rotation support -->
            android:screenOrientation="fullSensor"
            
            <!-- CHANGE: Handle rotation without recreating activity -->
            android:configChanges="orientation|screenSize|keyboardHidden">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

**Key changes:**
- `android:screenOrientation="fullSensor"` - Enables landscape and portrait
- `android:configChanges="orientation|screenSize|keyboardHidden"` - Prevents activity restart on rotation
- `<uses-permission android:name="android.permission.INTERNET" />` - Required for WebView (even for local assets in some cases)

#### 2. activity_main.xml

**Changes from default:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <!-- REPLACE default TextView with WebView -->
    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

**Key changes:**
- Removed default "Hello World" TextView
- Added WebView with id `@+id/webView`
- WebView fills entire screen (match_parent)

#### 3. MainActivity.java

**Complete implementation:**

```java
package com.yourpackage.doublediamond;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize WebView
        webView = findViewById(R.id.webView);
        
        // Configure WebView settings
        WebSettings webSettings = webView.getSettings();
        
        // CRITICAL: Enable JavaScript
        webSettings.setJavaScriptEnabled(true);
        
        // Enable DOM storage (for any future localStorage needs)
        webSettings.setDomStorageEnabled(true);
        
        // Enable zoom controls (optional - currently disabled)
        webSettings.setBuiltInZoomControls(false);
        webSettings.setSupportZoom(false);
        
        // Prevent WebView from opening external browser
        webView.setWebViewClient(new WebViewClient());
        
        // Load the game
        webView.loadUrl("file:///android_asset/index-android.html");
    }

    @Override
    public void onBackPressed() {
        // Handle back button - go back in WebView history if possible
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
```

**Key additions to default MainActivity:**
- WebView initialization and configuration
- JavaScript enabled (required for game logic)
- DOM storage enabled (future-proofing)
- WebViewClient to prevent external browser
- Back button handling
- Load game from assets

#### 4. build.gradle (Module: app)

**Minimum SDK requirement:**

```gradle
android {
    compileSdk 33  // or latest

    defaultConfig {
        applicationId "com.yourpackage.doublediamond"
        minSdk 24      // CHANGE: Minimum Android 7.0 for modern WebView
        targetSdk 33   // or latest
        versionCode 1
        versionName "1.0"
    }
    
    // Rest of default configuration...
}
```

**Key changes:**
- `minSdk 24` - Ensures modern WebView with good JavaScript support

### File Location

### Summary of Configuration Changes

| File | Changes | Why |
|------|---------|-----|
| AndroidManifest.xml | `screenOrientation="fullSensor"` | Enable landscape + portrait |
| AndroidManifest.xml | `configChanges="orientation\|screenSize..."` | Prevent restart on rotation |
| AndroidManifest.xml | `INTERNET` permission | Required for WebView |
| activity_main.xml | Add WebView | Replace default TextView |
| MainActivity.java | WebView setup + JavaScript enabled | Load and run game |
| build.gradle | `minSdk 24` | Modern WebView support |

### WebView Setup

## Asset Requirements

All assets referenced in `index-android.html` must also be in the `assets/` folder:

```
app/src/main/assets/
├── index-android.html
└── assets/              # Note: nested assets folder
    ├── blank.png
    ├── cheries.png
    ├── confetti.gif
    ├── ddsplash.png
    ├── doubleBarReelIcon.png
    ├── doublediaReelIcon.png
    ├── sevenReelIcon.png
    ├── singleBarReelIcon.png
    ├── slotbck_2.png
    └── tripleBarReelIcon.png
```

## Building

1. Ensure all files are in correct locations
2. In Android Studio: `Build` → `Rebuild Project`
3. Run on device or emulator
4. Test both landscape and portrait orientations

## Debugging

### Common Issues

**Issue: Content appears too small or cut off**
- Check that `scaleStageToFit()` is being called on load and resize
- Verify viewport meta tag is present: `<meta name="viewport" content="width=device-width,initial-scale=1" />`

**Issue: Assets not loading**
- Verify asset paths use `./assets/` prefix
- Check that assets folder is nested: `app/src/main/assets/assets/`

**Issue: JavaScript not working**
- Ensure `setJavaScriptEnabled(true)` is set in WebView configuration
- Check Logcat for console errors: Filter by "chromium" or "console"

### Logcat Filtering

To see WebView console output:
```
adb logcat | grep chromium
```

Or in Android Studio Logcat:
- Filter: Select your app name
- Search: Type "chromium" or "console"

## Performance Notes

- The transform scaling is GPU-accelerated and performs well on all tested devices
- Minimum viable scale is ~36% (small phones) - still fully functional but text is smaller
- Recommended minimum: Medium phones (55% scale) for optimal user experience

## Future Improvements

- [ ] Add minimum scale warning for very small devices
- [ ] Optimize asset sizes for mobile (currently desktop-sized PNGs)
- [ ] Add haptic feedback on spin button
- [ ] Implement sound effects (with mute toggle)
- [ ] Add save state for balance/settings

## Updating from Web Version

When the core game logic changes in `/core/`:

1. The bundled JavaScript in `index-android.html` needs to be updated
2. Copy the updated functions from `/core/` files
3. Test thoroughly on multiple device sizes
4. Verify scaling still works correctly

## License

Same as main project (see root LICENSE file).
