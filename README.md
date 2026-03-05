# Smart Fold for Obsidian

Smart Fold is a highly optimized and lightweight Obsidian plugin that provides advanced yet intuitive tools for efficiently folding Markdown sections. It gives you finer control over the built-in folding mechanism in Obsidian without taking over your content.

## Features

**Adaptive Fold/Unfold Shortcuts**: You can add hotkeys to globally increase or decrease the headings' folding depth across the active document.

**Specific Heading Level Toggles**: Easily toggle, fold, or unfold specific heading levels from H1 to H6 individually. Hotkeys can be set for targeting specific levels directly.

**Smart Fold**: An intelligent command that specifically folds all headings that **do not have any children (sub-headings)**. Excellent for cleanly summarizing documents where leaf-node contents get too long.

**Auto-Fold on Open**: Highly requested feature—configure the plugin to automatically apply a specific fold state whenever you open a new file. You can choose to automatically fold everything to H1, or apply the Smart Fold!

**Ribbon Quick Icons**: Provides quick, aesthetic custom SVG icons on the left Ribbon menu `H1`-`H6` and `Hs` (Smart Fold). Any icon can be optionally hidden in the plugin's settings to keep your workspace clean.

## Usage & Settings

1. Enable the plugin under Community Plugins.
2. Under **Settings -> Smart Fold**, you can choose which Ribbon Icons you want visible.
3. You can set the **Default Fold State on Open** from the same panel.
4. Go to Obsidian's native **Settings -> Hotkeys** and search for `Smart Fold` to assign customized shortcuts to any of the 23 specific folding actions!

## Development

You can install dependencies and build it using:

```bash
yarn install
yarn build
```

## Credits

- **Inspiration**: This plugin's core folding logic directly references and is inspired by the exceptional work done in [obsidian-creases](https://github.com/liamcain/obsidian-creases) by Liam Cain. His project is licensed under the MIT License, and I retain the spirit of open-source sharing by also releasing this plugin under MIT.
- **AI Assistance**: The development, refactoring, and refinement of this plugin were assisted by **Antigravity**, an advanced agentic AI coding assistant developed by Google Deepmind.
