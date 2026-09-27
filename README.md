# Smart Fold

[![Obsidian plugin](https://img.shields.io/badge/Obsidian-plugin-7C3AED?logo=obsidian&logoColor=white)](https://community.obsidian.md/plugins/smart-fold)
[![Downloads](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fcommunity.obsidian.md%2Fapi%2Fv1%2Fplugins%2Fsmart-fold&query=%24.downloads&label=downloads&logo=obsidian&logoColor=white&color=7C3AED)](https://community.obsidian.md/plugins/smart-fold)
[![Latest release](https://img.shields.io/github/v/release/shenfan19/smart-fold?sort=semver)](https://github.com/shenfan19/smart-fold/releases/latest)
[![Minimum Obsidian version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fshenfan19%2Fsmart-fold%2Fmain%2Fmanifest.json&query=%24.minAppVersion&label=min%20Obsidian&color=blue)](manifest.json)
[![License](https://img.shields.io/github/license/shenfan19/smart-fold)](LICENSE)

**Smart Fold** is a plugin for [Obsidian](https://obsidian.md) that turns a long Markdown note into a readable outline with one click.

![Smart Fold folding every section that has no subheadings, then unfolding them again](assets/smart-fold-demo.gif)

Its main feature is **Smart Fold**, which folds every heading that has no subheadings of its own. Those are the sections that hold the actual text, so folding them hides the long paragraphs and lists while every parent heading stays open. The note reads like an outline instead of a wall of text, and one more click brings everything back.

This is especially useful for meeting notes, research notes, project plans, long reading notes, and any document where the structure matters more than the details while you review it.

## Features

- **Smart Fold for leaf headings**: fold or unfold every heading without subheadings in one step, keeping the whole hierarchy visible.
- **Step through heading levels**: fold one heading level deeper or shallower at a time with **H-** and **H+**, until the note shows exactly as much detail as you want.
- **Fold a single heading level**: toggle all H1, H2, H3, H4, H5 or H6 headings of the note at once.
- **Fold on open**: have every note you open start in Smart Fold or folded to a chosen heading level.
- **Ribbon icons and hotkeys**: every action has its own ribbon icon and command, so you can click it or give it a hotkey. Smart Fold and H1 to H3 are on by default, and the rest can be turned on in the settings.
- **Only the tools you use**: turning an icon off in the settings also removes its command and hotkey, which keeps the ribbon and the command palette uncluttered.
- **Native Obsidian folding**: Smart Fold uses the same folds as the arrows next to your headings. Nothing is written into your notes, and you can open any single section again by clicking its arrow.

## How it works

### Smart Fold

Click the **HS** icon in the left ribbon, or run **Smart Fold: Toggle fold for headings without children** from the command palette.

A heading counts as a leaf when the next heading after it is at the same level or higher, so no subheading sits under it. Smart Fold folds all leaf headings of the current note and leaves every other heading open. In the example above, **Goals**, **Beds**, **Front bed** and **Schedule** stay open because they contain subheadings, while sections such as **Soil**, **Back bed** and **Budget** fold away.

Running Smart Fold again unfolds the same sections. Folds you made by hand on other headings are kept either way.

### Folding one heading level

![Folding all H3 sections, then all H2 sections, then the H1 heading, and opening each again](assets/heading-levels.gif)

The **H1** to **H6** icons each toggle all headings of that level in the current note. **H1** to **H3** are on by default, and **H4** to **H6** can be turned on in the settings. If the first heading of that level is folded, all of them are unfolded, otherwise all of them are folded. The matching commands are **Toggle fold for H1** to **Toggle fold for H6**.

### Folding level by level

![Folding one heading level at a time with H-, then opening them again with H+](assets/fold-levels.gif)

- **H-** folds the deepest heading level that is still open. In a note with headings down to H4, the first click folds all H4 sections, the next folds H3, then H2.
- **H+** does the opposite and opens the shallowest folded level together with every level above it, so repeated clicks reveal the note one level at a time.

The matching commands are **Decrease heading fold level** and **Increase heading fold level**. Both icons are off by default, so turn them on under **Settings → Smart Fold** first.

### Fold on open

Under **Settings → Smart Fold → Default fold state on open** you can choose what happens whenever you open a note.

- **None**: notes open as they are. This is the default.
- **Fold H1** to **Fold H6**: all headings of that level are folded.
- **Smart Fold**: the note opens in outline mode, with all leaf headings folded.

## Settings

![Smart Fold settings tab](assets/settings.png)

- **Ribbon icons**: choose which of the icons **HS**, **H1** to **H6**, **H+** and **H-** appear in the left ribbon. By default only **HS** and **H1** to **H3** are shown. Turning an icon off also disables its command and any hotkey assigned to it. Turning it back on restores it to its previous place in the ribbon.
- **Default fold state on open**: see [Fold on open](#fold-on-open).

To assign hotkeys, open Obsidian's **Settings → Hotkeys** and search for `Smart Fold`.

## Installation

1. Open **Settings → Community plugins** in Obsidian and turn off Restricted mode if it is on.
2. Click **Browse**, search for **Smart Fold**, then install and enable it.

If Smart Fold does not show up in the Community Plugins browser yet, install it manually. Download `main.js` and `manifest.json` from the [latest release](https://github.com/shenfan19/obsidian-smart-fold/releases), copy them into `<your-vault>/.obsidian/plugins/smart-fold/`, reload Obsidian and enable **Smart Fold** under **Settings → Community plugins**.

## Development

The project requires Node.js 24.11.1 or later.

```bash
npm install
npm run build
```

The build writes `main.js` to the repository root. To try it in a vault, copy `main.js` and `manifest.json` into `<your-vault>/.obsidian/plugins/smart-fold/`.

### Releasing

Releases are built and published by GitHub Actions, see `.github/workflows/release.yml`. Obsidian's community directory rebuilds every release from source and compares the result with the released `main.js`, so releases are not built locally, where line endings and installed dependency versions can differ.

1. Add a `## <version>` section to `CHANGELOG.md` describing the changes. It becomes the release notes.
2. Set the same version in `manifest.json` and `package.json`, and add it to `versions.json` together with the `minAppVersion` from `manifest.json`.
3. Commit and push.
4. Push a tag named exactly like the version, without a leading `v`:

   ```bash
   git tag 0.1.3
   git push origin 0.1.3
   ```

The workflow checks that the tag matches `manifest.json`, builds the plugin on Linux, and publishes a release with `main.js` and `manifest.json` and their artifact attestations. Obsidian offers the update to users automatically. To check the build without releasing, run the workflow by hand from the Actions tab.

## Credits

- **Inspiration**: This plugin's core folding logic directly references and is inspired by the exceptional work done in [obsidian-creases](https://github.com/liamcain/obsidian-creases) by Liam Cain. His project is licensed under the MIT License, and I retain the spirit of open-source sharing by also releasing this plugin under MIT.
- **AI Assistance**: The development, refactoring, and refinement of this plugin were assisted by **Antigravity**, an advanced agentic AI coding assistant developed by Google Deepmind.
