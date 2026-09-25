# Changelog

## 0.1.1

### Fixed

- Ribbon icons turned off in settings no longer reappear after restarting Obsidian. Previously every icon was registered and then hidden with CSS, and Obsidian's ribbon layout restore made them visible again until the plugin was disabled and re-enabled.
- Ribbon icons turned off in settings no longer appear in the left ribbon's right-click menu. Disabled icons are now not registered at all, and turning an icon off in settings removes it from the ribbon. Turning it back on restores it to its previous position.

## 0.1.0

- Initial release.
