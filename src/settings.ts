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

        containerEl.createEl("h2", { text: "Smart Fold Ribbon Icons" });
        containerEl.createEl("p", {
            text: "Toggle which ribbon icons (left toolbar) you want to see for quick access.",
            cls: "setting-item-description"
        });

        const createToggle = (name: string, desc: string, key: keyof SmartFoldSettings) => {
            new Setting(containerEl)
                .setName(name)
                .setDesc(desc)
                .addToggle((toggle) => {
                    toggle.setValue(this.plugin.settings[key] as boolean);
                    toggle.onChange(async (value) => {
                        (this.plugin.settings as any)[key] = value;
                        await this.plugin.saveSettings();
                        this.plugin.refreshRibbons();
                    });
                });
        };

        createToggle("Show H1 Ribbon Icon", "Toggle fold for H1", "showRibbonH1");
        createToggle("Show H2 Ribbon Icon", "Toggle fold for H2", "showRibbonH2");
        createToggle("Show H3 Ribbon Icon", "Toggle fold for H3", "showRibbonH3");
        createToggle("Show H4 Ribbon Icon", "Toggle fold for H4", "showRibbonH4");
        createToggle("Show H5 Ribbon Icon", "Toggle fold for H5", "showRibbonH5");
        createToggle("Show H6 Ribbon Icon", "Toggle fold for H6", "showRibbonH6");
        createToggle("Show Smart Fold Ribbon Icon", "Fold headings without children", "showRibbonSmart");

        new Setting(containerEl)
            .setName("Default Fold State on Open")
            .setDesc("Automatically fold headings when opening a new page.")
            .addDropdown(cb => {
                cb.addOptions({
                    "none": "None (Do nothing)",
                    "h1": "Fold H1",
                    "h2": "Fold H2",
                    "h3": "Fold H3",
                    "h4": "Fold H4",
                    "h5": "Fold H5",
                    "h6": "Fold H6",
                    "smart": "Smart Fold (No children)",
                });
                cb.setValue(this.plugin.settings.defaultFoldStateOnOpen);
                cb.onChange(async (value) => {
                    this.plugin.settings.defaultFoldStateOnOpen = value;
                    await this.plugin.saveSettings();
                });
            });
    }
}
