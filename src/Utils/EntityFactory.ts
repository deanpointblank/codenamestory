import { App, Notice } from "obsidian";
import { Entity } from "../Entities/Entity/Entity";
import { Country } from "../Entities/Country/Country";
import { Character } from "../Entities/Characters/Character";
import { World } from "../Entities/World/World";
import { MagicSystem } from "../Entities/MagicSystem/MagicSystem";
import { Race } from "../Entities/Race/Race";
import { ValidationUtils } from "./ValidationUtils";

export class EntityFactory {
	static async createEntity(
		app: App,
		entityType: string,
	): Promise<Entity | null> {
		// Collect additional data based on entity type
		const entityData = await Entity.collectEntityData(app, entityType);

		if (!entityData || !entityData.name) {
			new Notice("Entity creation cancelled or no name provided.");
			return null;
		}

		let entity: Entity | null = null;
		switch (entityType) {
			case "Country":
				entity = new Country(app, entityData);
				break;
			case "Character":
				entity = new Character(app, entityData);
				break;
			case "World":
				entity = new World(app, entityData);
				break;
			case "MagicSystem":
				entity = new MagicSystem(app, entityData);
				break;
			case "Race":
				entity = new Race(app, entityData);
				break;
			// Handle other entity types similarly
			default:
				new Notice(`Unknown entity type: ${entityType}`);
				return null;
		}

		// Generate the pages
		if (entity) {
			await entity.generatePages();
		}

		return entity;
	}
}
