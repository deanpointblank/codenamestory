import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	WorkspaceLeaf,
} from "obsidian";
import {
	WorldBuildingDashboardView,
	VIEW_TYPE_DASHBOARD,
} from "./src/View/WorldBuildingDashboardView";
import { DataviewApi, getAPI } from "obsidian-dataview";
import { createContext } from "react";
// Remember to rename these classes and interfaces!

interface WorldBuildingPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: WorldBuildingPluginSettings = {
	mySetting: "default",
};

export const AppContext = createContext<App | undefined>(undefined);

export default class WorldBuildingPlugin extends Plugin {
	settings: WorldBuildingPluginSettings;
	dataviewAPI: DataviewApi | null = null;

	async onload() {
		// Get the Dataview API
		// TODO: find solution if Dataview API is not found
		this.dataviewAPI = getAPI();

		if (!this.dataviewAPI) {
			console.error("Dataview API not found");
			return;
		}

		this.registerView(
			VIEW_TYPE_DASHBOARD,
			(leaf: WorkspaceLeaf) => new WorldBuildingDashboardView(leaf),
		);

		this.addRibbonIcon("world", "Open World-Building Dashboard", () => {
			this.activateView();
		});
	}

	async onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_DASHBOARD);
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_DASHBOARD);
		const rightLeaf = this.app.workspace.getRightLeaf(false);
		if (rightLeaf) {
			await rightLeaf.setViewState({
				type: VIEW_TYPE_DASHBOARD,
				active: true,
			});

			await this.app.workspace.revealLeaf(
				this.app.workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD)[0],
			);
		}
	}
}
