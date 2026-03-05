import {
  Editor,
  MarkdownView,
  Plugin,
  addIcon,
} from "obsidian";
import { SmartFoldSettings, DEFAULT_SETTINGS, SmartFoldSettingTab } from "./settings";

const headingLevels = [1, 2, 3, 4, 5, 6];

const createTextSvg = (text: string) => `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-size="50" font-family="sans-serif" font-weight="bold" fill="currentColor">${text}</text>
</svg>
`;

export default class SmartFoldPlugin extends Plugin {
  public settings: SmartFoldSettings;
  private ribbonElements: Record<string, HTMLElement> = {};

  async onload(): Promise<void> {
    await this.loadSettings();

    // Add setting tab
    this.addSettingTab(new SmartFoldSettingTab(this.app, this));

    // Register custom SVG icons
    headingLevels.forEach(level => {
      addIcon(`smartfold-h${level}`, createTextSvg(`H${level}`));
    });
    addIcon(`smartfold-hs`, createTextSvg(`Hs`));

    // Add ribbon icons
    headingLevels.forEach(level => {
      this.ribbonElements[`H${level}`] = this.addRibbonIcon(`smartfold-h${level}`, `Toggle fold for H${level}`, () => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view) this.toggleFoldForHeadingLevel(view, level);
      });
    });

    this.ribbonElements['Smart'] = this.addRibbonIcon('smartfold-hs', 'Smart Fold (headings without children)', () => {
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (view) this.foldHeadingsWithoutChildren(view);
    });

    // Refresh visibility
    this.refreshRibbons();

    // File open hook for default folding state
    this.app.workspace.onLayoutReady(() => {
      this.registerEvent(this.app.workspace.on('file-open', (file) => {
        if (!file) return;
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (view && view.file === file) {
          const defaultState = this.settings.defaultFoldStateOnOpen;
          if (defaultState === "none") return;

          // Adding a small delay to ensure CodeMirror is fully loaded
          setTimeout(() => {
            if (defaultState === "smart") {
              this.foldHeadingsWithoutChildren(view, true);
            } else if (defaultState.startsWith("h")) {
              const level = parseInt(defaultState.charAt(1));
              if (!isNaN(level)) {
                this.foldLevel(view, level);
              }
            }
          }, 100);
        }
      }));
    });

    // Register Commands
    this.addCommand({
      id: "fold-headings-without-children",
      name: "Fold headings without children",
      checkCallback: (checking: boolean) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (checking) return !!view;
        if (view) this.foldHeadingsWithoutChildren(view);
      },
    });

    this.addCommand({
      id: "increase-fold-level",
      name: "Increase heading fold level",
      editorCallback: this.increaseHeadingFoldLevel.bind(this),
    });

    this.addCommand({
      id: "decrease-fold-level",
      name: "Decrease heading fold level",
      editorCallback: this.decreaseHeadingFoldLevel.bind(this),
    });

    headingLevels.forEach((level) => {
      this.addCommand({
        id: `toggle-fold-heading-level-${level}`,
        name: `Toggle fold for H${level}`,
        checkCallback: (checking) => {
          const view = this.app.workspace.getActiveViewOfType(MarkdownView);
          if (!view) return false;
          if (checking) return true;
          this.toggleFoldForHeadingLevel(view, level);
        },
      });

      this.addCommand({
        id: `fold-heading-level-${level}`,
        name: `Fold H${level}`,
        checkCallback: (checking) => {
          const view = this.app.workspace.getActiveViewOfType(MarkdownView);
          if (!view) return false;
          if (checking) return true;
          this.foldLevel(view, level);
        },
      });

      this.addCommand({
        id: `unfold-heading-level-${level}`,
        name: `Unfold H${level}`,
        checkCallback: (checking) => {
          const view = this.app.workspace.getActiveViewOfType(MarkdownView);
          if (!view) return false;
          if (checking) return true;
          this.unfoldLevel(view, level);
        },
      });
    });
  }

  refreshRibbons() {
    this.ribbonElements['H1'].style.display = this.settings.showRibbonH1 ? "" : "none";
    this.ribbonElements['H2'].style.display = this.settings.showRibbonH2 ? "" : "none";
    this.ribbonElements['H3'].style.display = this.settings.showRibbonH3 ? "" : "none";
    this.ribbonElements['H4'].style.display = this.settings.showRibbonH4 ? "" : "none";
    this.ribbonElements['H5'].style.display = this.settings.showRibbonH5 ? "" : "none";
    this.ribbonElements['H6'].style.display = this.settings.showRibbonH6 ? "" : "none";
    this.ribbonElements['Smart'].style.display = this.settings.showRibbonSmart ? "" : "none";
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  public foldHeadingsWithoutChildren(view: MarkdownView, forceFold = false): void {
    const headings = this.app.metadataCache.getFileCache(view.file)?.headings ?? [];
    const existingFolds = view.currentMode.getFoldInfo()?.folds ?? [];

    let shouldUnfold = false;
    const targetHeadingLines = new Set<number>();

    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      const headingLine = heading.position.start.line;
      let hasSubHeading = false;

      for (let j = i + 1; j < headings.length; j++) {
        const nextHeading = headings[j];
        if (nextHeading.level <= heading.level) {
          break;
        }
        if (nextHeading.level > heading.level) {
          hasSubHeading = true;
          break;
        }
      }

      if (!hasSubHeading) {
        targetHeadingLines.add(headingLine);
      }
    }

    if (targetHeadingLines.size === 0) return;

    if (!forceFold) {
      const firstTargetLine = Array.from(targetHeadingLines)[0];
      if (existingFolds.find(f => f.from === firstTargetLine)) {
        shouldUnfold = true;
      }
    }

    if (shouldUnfold) {
      view.currentMode.applyFoldInfo({
        folds: existingFolds.filter(f => !targetHeadingLines.has(f.from)),
        lines: view.editor.lineCount()
      });
      view.onMarkdownFold();
    } else {
      const newFolds = [...existingFolds];
      targetHeadingLines.forEach(line => {
        if (!newFolds.find(f => f.from === line)) {
          newFolds.push({ from: line, to: line + 1 });
        }
      });
      view.currentMode.applyFoldInfo({
        folds: newFolds,
        lines: view.editor.lineCount()
      });
      view.onMarkdownFold();
    }
  }

  async decreaseHeadingFoldLevel(_editor: Editor, view: MarkdownView) {
    const foldInfo = view.currentMode.getFoldInfo();
    const existingFolds = foldInfo?.folds ?? [];
    const headings = this.app.metadataCache.getFileCache(view.file)?.headings ?? [];

    let maxUnfoldedLevel = 1;
    for (const heading of headings) {
      if (!existingFolds.find((f) => f.from === heading.position.start.line)) {
        maxUnfoldedLevel = Math.max(maxUnfoldedLevel, heading.level);
      }
    }

    const headingsAtLevel = headings.filter((h) => h.level === maxUnfoldedLevel);
    const folds = [
      ...existingFolds,
      ...headingsAtLevel.map((h) => ({
        from: h.position.start.line,
        to: h.position.end.line,
      })),
    ];

    view.currentMode.applyFoldInfo({
      folds,
      lines: view.editor.lineCount(),
    });
    view.onMarkdownFold();
  }

  async increaseHeadingFoldLevel(_editor: Editor, view: MarkdownView) {
    const foldInfo = view.currentMode.getFoldInfo();
    const existingFolds = foldInfo?.folds ?? [];
    const headings = this.app.metadataCache.getFileCache(view.file)?.headings ?? [];

    let maxFoldLevel = Math.max(...headings.map((h) => h.level));
    if (!Number.isFinite(maxFoldLevel)) return;
    for (const heading of headings) {
      if (existingFolds.find((f) => f.from === heading.position.start.line)) {
        maxFoldLevel = Math.min(maxFoldLevel, heading.level);
      }
    }

    const excludedHeadingPositions = new Set(
      headings.filter((h) => h.level <= maxFoldLevel).map((h) => h.position.start.line)
    );
    const folds = existingFolds.filter(
      (fold) => !excludedHeadingPositions.has(fold.from)
    );

    view.currentMode.applyFoldInfo({
      folds,
      lines: view.editor.lineCount(),
    });
    view.onMarkdownFold();
  }

  foldLevel(view: MarkdownView, level: number): void {
    const existingFolds = view.currentMode.getFoldInfo()?.folds ?? [];
    const headings = this.app.metadataCache.getFileCache(view.file)?.headings ?? [];

    const headingsToFold = level === 0 ? headings : headings.filter(h => h.level === level);

    const newFolds = [...existingFolds];
    headingsToFold.forEach(h => {
      if (!newFolds.find(f => f.from === h.position.start.line)) {
        newFolds.push({ from: h.position.start.line, to: h.position.start.line + 1 });
      }
    });

    view.currentMode.applyFoldInfo({
      folds: newFolds,
      lines: view.editor.lineCount(),
    });
    view.onMarkdownFold();
  }

  unfoldLevel(view: MarkdownView, level: number): void {
    const existingFolds = view.currentMode.getFoldInfo()?.folds ?? [];
    const headings = this.app.metadataCache.getFileCache(view.file)?.headings ?? [];

    const headingLinesToUnfold = new Set((level === 0 ? headings : headings.filter(h => h.level === level)).map(h => h.position.start.line));

    const remainingFolds = existingFolds.filter(fold => !headingLinesToUnfold.has(fold.from));

    view.currentMode.applyFoldInfo({
      folds: remainingFolds,
      lines: view.editor.lineCount(),
    });
    view.onMarkdownFold();
  }

  toggleFoldForHeadingLevel(view: MarkdownView, level: number): void {
    const existingFolds = view.currentMode.getFoldInfo()?.folds ?? [];
    const headings = this.app.metadataCache.getFileCache(view.file)?.headings ?? [];
    const targetHeadings = level === 0 ? headings : headings.filter(h => h.level === level);

    if (targetHeadings.length === 0) return;

    const headingLineNums = new Set(targetHeadings.map(h => h.position.start.line));
    const firstHeadingPos = targetHeadings[0].position.start;

    // Check if the first heading of this level is folded
    if (existingFolds.find((fold) => fold.from === firstHeadingPos.line)) {
      // Unfold
      view.currentMode.applyFoldInfo({
        folds: existingFolds.filter((fold) => !headingLineNums.has(fold.from)),
        lines: view.editor.lineCount(),
      });
      view.onMarkdownFold();
    } else {
      // Fold
      const newFolds = [...existingFolds];
      targetHeadings.forEach(h => {
        if (!newFolds.find(f => f.from === h.position.start.line)) {
          newFolds.push({ from: h.position.start.line, to: h.position.start.line + 1 });
        }
      });
      view.currentMode.applyFoldInfo({
        folds: newFolds,
        lines: view.editor.lineCount(),
      });
      view.onMarkdownFold();
    }
  }
}
