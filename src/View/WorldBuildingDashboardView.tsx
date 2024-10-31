import { ItemView, TFile, WorkspaceLeaf } from "obsidian";
import { AddEntityModal } from "../Modal/AddEntityModal";
import { EntityFactory } from "../Utils/EntityFactory";
import { DataviewApi, getAPI } from "obsidian-dataview";
import { DataviewUtils } from "../Utils/DataviewUtils";
import { Entity } from "../Entities/Entity/Entity";
import { ReactView } from "../../ReactView";
import { createRoot, Root } from "react-dom/client";
import React, { StrictMode } from "react";
import { AppContext } from "../../main";

export const VIEW_TYPE_DASHBOARD = "world-building-dashboard";

export class WorldBuildingDashboardView extends ItemView {
	root: Root | null = null;
	dataviewAPI: DataviewApi | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_DASHBOARD;
	}

	getDisplayText() {
		return "World-Building Dashboard";
	}

	async onOpen() {
		const container = this.containerEl.children[1];
		// container.empty();
		// container.createEl("h2", { text: "World-Building Dashboard" });

		this.root = createRoot(container);

		this.root.render(
			<StrictMode>
				<AppContext.Provider value={this.app}>
					<ReactView />
				</AppContext.Provider>
			</StrictMode>,
		);

		// Retrieve Dataview API
		const plugin = getAPI(this.app); // Replace with actual plugin ID
		if (plugin) {
			this.dataviewAPI = plugin;
			// Get all races
			const races = DataviewUtils.getRaces(this.dataviewAPI, '"Races"');

			// Create a tree-like structure
			const treeContainer = container.createEl("div", {
				cls: "race-tree",
			});

			races.forEach((race) => {
				const raceItem = treeContainer.createEl("div", {
					cls: "race-item",
				});
				raceItem.createEl("span", {
					text: race.name,
					cls: "race-name",
				});

				if (race.relationships && race.relationships.length > 0) {
					const relationships = race.relationships
						.map(
							(rel: { type: any; toEntity: any }) =>
								`**${rel.type}:** [[${rel.toEntity}]]`,
						)
						.join(", ");
					raceItem.createEl("div", {
						text: relationships,
						cls: "race-relationships",
					});
				}

				if (race.habitats && race.habitats.length > 0) {
					raceItem.createEl("div", {
						text: `Habitats: ${race.habitats.join(", ")}`,
						cls: "race-habitats",
					});
				}
			});

			// Apply styling for better visualization
			this.applyTreeStyles(container as HTMLElement);
		} else {
			container.createEl("div", {
				text: "Dataview API not available. Please ensure Dataview is installed and enabled.",
			});
		}

		const addButton = container.createEl("button", { text: "Add Entity" });
		addButton.onclick = () => {
			new AddEntityModal(this.app, async (entityType: string) => {
				// Use the EntityFactory to create the entity
				const entity = await EntityFactory.createEntity(
					this.app,
					entityType,
				);
				if (entity) {
					await this.openPage(
						`${entity.entityType}/${entity.name}/Overview.md`,
					);
				}
			}).open();
		};
	}

	applyTreeStyles(container: HTMLElement) {
		const style = document.createElement("style");
		style.innerHTML = `
      .race-tree {
        display: flex;
        flex-direction: column;
      }
      .race-item {
        margin-left: 20px;
        padding: 5px;
        border-left: 2px solid #ccc;
      }
      .race-name {
        font-weight: bold;
        cursor: pointer;
      }
      .race-name:hover {
        color: blue;
      }
      .race-relationships, .race-habitats {
        font-size: 0.9em;
        color: #555;
      }
    `;
		container.appendChild(style);
	}

	async onClose() {
		// Cleanup if necessary
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}

	async openPage(path: string) {
		const file = this.app.vault.getAbstractFileByPath(path);
		if (file && file instanceof TFile) {
			await this.app.workspace.getLeaf(true).openFile(file);
		}
	}
}
