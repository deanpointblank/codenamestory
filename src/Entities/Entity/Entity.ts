import { App, Notice } from "obsidian";
import { FormField } from "../../Interfaces/FormField";
import { countryFields } from "../Country/CountryFields";
import { characterFields } from "../Characters/CharacterFields";
import { worldFields } from "../World/WorldFields";
import { EntityFormModal } from "../../Modal/EntityFormModal";
import { magicSystemFields } from "../MagicSystem/MagicSystemFields";
import { raceFields } from "../Race/RaceFields";
import { IEntity } from "../../Interfaces/IEntity";
import * as path from "path";

export abstract class Entity implements IEntity {
	app: App;
	name: string;
	entityType: string;
	description: string;

	protected constructor(app: App, data: any) {
		this.app = app;
		this.name = data.name;
		this.description = data.description;
	}

	async generatePages(): Promise<void> {
		const overviewContent = this.generateOverviewContent();
		const overviewPath = path.join(
			this.entityType,
			this.name,
			"Overview.md",
		);
		await this.createPageInVault(overviewPath, overviewContent);
	}

	private async createPageInVault(path: string, content: string) {
		const existingFile = this.app.vault.getAbstractFileByPath(path);
		if (existingFile) {
			new Notice(`A file already exists at ${path}`);
			return;
		}

		const directoryPath = this.app.vault.getFolderByPath(
			`./${this.entityType}/${this.name}`,
		);
		if (!directoryPath) {
			await this.app.vault.createFolder(
				`${this.entityType}/${this.name}`,
			);
		}
		await this.app.vault.create(path, content);
	}

	protected abstract generateOverviewContent(): string;

	static async collectEntityData(app: App, entityType: string): Promise<any> {
		return new Promise((resolve) => {
			let fields: FormField[];

			// Define fields based on entity type
			switch (entityType) {
				case "Country":
					fields = countryFields;
					break;
				case "Character":
					fields = characterFields;
					break;
				case "World":
					fields = worldFields;
					break;
				case "MagicSystem":
					fields = magicSystemFields;
					break;
				case "Race":
					fields = raceFields;
					break;
				default:
					fields = [];
					break;
			}

			// Create and open the Modal
			const modal = new EntityFormModal(app, fields, (data: any) => {
				resolve(data);
			});
			modal.open();
		});
	}
}
