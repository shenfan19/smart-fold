# Changelog

## 0.1.2

### Changed

- Only the Smart Fold and H1 to H3 ribbon icons are enabled by default. H4 to H6 and the increase and decrease fold level icons, together with their commands, can be turned on in the settings. Settings you have already saved are kept.
- Production builds are written to the repository root.

### Fixed

- The fold state applied when a note opens now uses `activeWindow.setTimeout()`, so it also works in popout windows.
- Removed the `dotenv` and `builtin-modules` build dependencies in favor of Node's built-in equivalents, and updated development dependencies with known vulnerabilities.

## 0.1.1

### Fixed

- Ribbon icons turned off in settings no longer reappear after restarting Obsidian. Previously every icon was registered and then hidden with CSS, and Obsidian's ribbon layout restore made them visible again until the plugin was disabled and re-enabled.
- Ribbon icons turned off in settings no longer appear in the left ribbon's right-click menu. Disabled icons are now not registered at all, and turning an icon off in settings removes it from the ribbon. Turning it back on restores it to its previous position.

## 0.1.0

- Initial release.
