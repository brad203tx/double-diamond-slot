# iOS Platform

## Status: Planned

iOS support is planned for future development.

## Expected Implementation

The iOS version will be similar to the Android implementation:

- Custom WebView integration
- Similar scaling approach to Android
- Platform-specific optimizations for iOS WebView/WKWebView
- Support for iPhone and iPad screen sizes

## Differences from Android

Expected iOS-specific considerations:

1. **WebView Engine**: WKWebView instead of Android WebView
2. **Asset Loading**: Different path structure in iOS app bundle
3. **Safe Area**: iOS notch/Dynamic Island handling
4. **Touch Behavior**: iOS-specific touch event handling
5. **Performance**: Different GPU optimization strategies

## Development Roadmap

- [ ] Create Xcode project structure
- [ ] Implement WKWebView integration
- [ ] Port `index-android.html` to `index-ios.html`
- [ ] Test on iPhone (various sizes)
- [ ] Test on iPad (various sizes)
- [ ] Handle iOS-specific quirks (safe area, notch, etc.)
- [ ] App Store submission preparation

## Contributing

If you'd like to contribute iOS support, please:

1. Follow the same architecture pattern as Android
2. Keep core game logic in `/core/` (don't duplicate)
3. Document iOS-specific changes in this README
4. Test on multiple iOS device sizes
5. Submit a pull request

## Resources

Useful references for iOS WebView development:

- [Apple WKWebView Documentation](https://developer.apple.com/documentation/webkit/wkwebview)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Safe Area Layout Guide](https://developer.apple.com/documentation/uikit/uiview/positioning_content_relative_to_the_safe_area)

## Questions?

For questions about iOS implementation planning, please open an issue in the main repository.
