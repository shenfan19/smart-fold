import { App, PluginSettingTab, Setting } from "obsidian";
import SmartFoldPlugin from "./main";

export interface SmartFoldSettings {
    showRibbonH1: boolean;
    showRibbonH2: boolean;
    showRibbonH3: boolean;
    showRibbonH4: boolean;
    showRibbonH5: boolean;
    showRibbonH6: boolean;
    showRibbonSmart: boolean;
    showRibbonInc: boolean;
    showRibbonDec: boolean;
    defaultFoldStateOnOpen: string;
}

export const DEFAULT_SETTINGS: SmartFoldSettings = {
    showRibbonH1: true,
    showRibbonH2: true,
    showRibbonH3: true,
    showRibbonH4: true,
    showRibbonH5: true,
    showRibbonH6: true,
    showRibbonSmart: true,
    showRibbonInc: true,
    showRibbonDec: true,
    defaultFoldStateOnOpen: "none",
};

export class SmartFoldSettingTab extends PluginSettingTab {
    plugin: SmartFoldPlugin;

    constructor(app: App, plugin: SmartFoldPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName("Ribbon icons")
            .setHeading();
            
        containerEl.createEl("p", {
            text: "Toggle which ribbon icons (left toolbar) you want to see. Turning off an icon also disables its corresponding command and hotkey.",
            cls: "setting-item-description"
        });

        const createToggle = (name: string, desc: string, key: keyof SmartFoldSettings) => {
            new Setting(containerEl)
                .setName(name)
                .setDesc(desc)
                .addToggle((toggle) => {
                    toggle.setValue(this.plugin.settings[key] as boolean);
                    toggle.onChange(async (value) => {
                        const settings = this.plugin.settings;
                        if (key in settings) {
                            (settings[key] as boolean) = value;
                        }
                        await this.plugin.saveSettings();
                        this.plugin.refreshRibbons();
                    });
                });
        };

        createToggle("Show H1 ribbon icon", "Toggle fold for H1", "showRibbonH1");
        createToggle("Show H2 ribbon icon", "Toggle fold for H2", "showRibbonH2");
        createToggle("Show H3 ribbon icon", "Toggle fold for H3", "showRibbonH3");
        createToggle("Show H4 ribbon icon", "Toggle fold for H4", "showRibbonH4");
        createToggle("Show H5 ribbon icon", "Toggle fold for H5", "showRibbonH5");
        createToggle("Show H6 ribbon icon", "Toggle fold for H6", "showRibbonH6");
        createToggle("Show smart fold ribbon icon", "Fold headings without children (HS)", "showRibbonSmart");
        createToggle("Show increase fold level icon", "Increase heading fold level (H+)", "showRibbonInc");
        createToggle("Show decrease fold level icon", "Decrease heading fold level (H-)", "showRibbonDec");

        new Setting(containerEl)
            .setName("Default fold state on open")
            .setDesc("Automatically fold headings when opening a new page.")
            .addDropdown(cb => {
                cb.addOptions({
                    "none": "None (do nothing)",
                    "h1": "Fold H1",
                    "h2": "Fold H2",
                    "h3": "Fold H3",
                    "h4": "Fold H4",
                    "h5": "Fold H5",
                    "h6": "Fold H6",
                    "smart": "Smart fold (no children)",
                });
                cb.setValue(this.plugin.settings.defaultFoldStateOnOpen);
                cb.onChange(async (value) => {
                    this.plugin.settings.defaultFoldStateOnOpen = value;
                    await this.plugin.saveSettings();
                });
            });
    }
}
