import { Entity } from "../Entity/Entity";
import { App } from "obsidian";

export class MagicSystem extends Entity {
	app: App;
	name: string;
	description: string;

	sourceOfMagic: string;
	isExhaustible: boolean;
	effectsOnUsers: string;
	racialDifferences: string;

	constructor(app: App, data: any) {
		super(app, data);
		this.sourceOfMagic = data.sourceOfMagic;
		this.isExhaustible = data.isExhaustible;
		this.effectsOnUsers = data.effectsOnUsers;
		this.racialDifferences = data.racialDifferences;
		this.entityType = "MagicSystem";
	}

	// Additional methods as needed
	protected generateOverviewContent(): string {
		return `# Magic System of ${this.name}

      ## Source of Magic

      ${this.sourceOfMagic}

      ## Is Magic Exhaustible?

      ${this.isExhaustible ? "Yes" : "No"}

      ## Effects on Users

      ${this.effectsOnUsers}

      ## Racial Differences in Magic

      ${this.racialDifferences}

      <!-- Add more sections as needed -->
      `;
	}
}
