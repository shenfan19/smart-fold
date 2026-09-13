# Smart Fold for Obsidian

Smart Fold turns a long Markdown note into a readable outline with one command.

Its main feature is **Smart Fold**: fold every heading that has body text but **no child headings**. In practice, this hides the long leaf sections while keeping parent headings and nested structure visible, so your note reads like an outline instead of a wall of text.

This is especially useful for meeting notes, research notes, project plans, long reading notes, and any document where the structure matters more than the details during review.

## Demo

GIF coming soon.

Suggested demo scene:

1. Open a long note with nested headings, where several lower-level headings contain paragraphs or lists but no sub-headings.
2. Show the document before folding: the outline exists, but the body text makes it hard to scan.
3. Run **Smart Fold: Toggle fold for headings without children** from the command palette or click the `HS` ribbon icon.
4. Show the result: leaf sections collapse, parent headings remain open, and the page becomes a clean outline.
5. Toggle Smart Fold again to show the content returning.

Recommended GIF length: 6-10 seconds. Keep the note content generic, zoom in enough that the heading structure is readable, and avoid moving the mouse too much. When the GIF is ready, place it at `assets/smart-fold-demo.gif`; I can then insert it here.

## Features

**Smart Fold for leaf headings**: Toggle folding for all headings that **do not have child headings**. This keeps the hierarchy visible while hiding the detailed body text under leaf sections.

**Outline-first reading**: Turn dense notes into a scannable structure without manually folding dozens of individual sections.

**Auto Smart Fold on Open**: Automatically apply Smart Fold whenever you open a file, so long notes can start in outline mode.

**Adaptive Fold/Unfold Shortcuts**: Add hotkeys to increase or decrease the heading folding depth across the active document.

**Specific Heading Level Toggles**: Toggle specific heading levels from H1 to H6 individually. Hotkeys can be set for targeting specific levels directly.

**Auto-Fold on Open**: Configure the plugin to apply a specific fold state whenever you open a new file. You can fold to a heading level or apply Smart Fold.

**Ribbon Quick Icons**: Provides quick custom SVG icons on the left Ribbon menu: `HS` (Smart Fold), `H1`-`H6`, `H+` (Increase Fold), and `H-` (Decrease Fold).

**Unified Toggle Logic**: Turning off a ribbon icon in the plugin settings will **automatically disable its corresponding command and hotkey**. This keeps your command palette and hotkey list focused only on the features you use.

## Usage & Settings

1. Enable the plugin under Community Plugins.
2. Run **Smart Fold: Toggle fold for headings without children** from the command palette, assign it a hotkey, or click the `HS` ribbon icon.
3. Under **Settings -> Smart Fold**, choose which ribbon icons you want visible.
4. Set the **Default Fold State on Open** from the same panel if you want notes to open in outline mode automatically.
5. Go to Obsidian's native **Settings -> Hotkeys** and search for `Smart Fold` to assign customized shortcuts.

## Development

The project requires **Node.js >= 24.11.1**. You can install dependencies and build it using:

```bash
npm install
npm run build
```

## Credits

- **Inspiration**: This plugin's core folding logic directly references and is inspired by the exceptional work done in [obsidian-creases](https://github.com/liamcain/obsidian-creases) by Liam Cain. His project is licensed under the MIT License, and I retain the spirit of open-source sharing by also releasing this plugin under MIT.
- **AI Assistance**: The development, refactoring, and refinement of this plugin were assisted by **Antigravity**, an advanced agentic AI coding assistant developed by Google Deepmind.
