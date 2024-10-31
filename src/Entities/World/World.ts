import { App } from "obsidian";
import { MagicSystem } from "../MagicSystem/MagicSystem";
import { TownSizeDefinitions } from "../../Interfaces/TownSizeDefinitions";
import { CompositeEntity } from "../Entity/CompositeEntity";

export class World extends CompositeEntity {
	app: App;
	name: string;

	lawsOfPhysics: string;
	magicSystem: MagicSystem;
	magicalBeasts: string;

	worldType: "Earth-like" | "Alternate Earth" | "Different Planet";
	humanRaces: string[];
	nonHumanRaces: string[];
	culturalDiversity: string;

	ageOfWorld: string;
	originOfPeople: string;

	totalPopulation: number;
	populationComparisons: string;
	townSizeDefinitions: TownSizeDefinitions;

	constructor(app: App, data: any) {
		super(app, data);
		this.description = data.description;

		this.lawsOfPhysics = data.lawsOfPhysics;
		this.magicSystem = data.magicSystem;
		this.magicalBeasts = data.magicalBeasts;

		this.worldType = data.worldType;
		this.humanRaces = data.humanRaces || [];
		this.nonHumanRaces = data.nonHumanRaces || [];
		this.culturalDiversity = data.culturalDiversity;

		this.ageOfWorld = data.ageOfWorld;
		this.originOfPeople = data.originOfPeople;

		this.totalPopulation = data.totalPopulation;
		this.populationComparisons = data.populationComparisons;
		this.townSizeDefinitions = data.townSizeDefinitions;
		this.entityType = "World";

		// Initialize other properties as needed
	}

	async generatePages(): Promise<void> {
		for (const child of this.children) {
			await child.generatePages();
		}
	}

	protected generateOverviewContent(): string {
		return `---
      type: world
      name: ${this.name}
      worldType: ${this.worldType}
      ---

      # ${this.name}

      ## Description

      ${this.description}

      ## Laws of Physics

      ${this.lawsOfPhysics}

      ## Magic System

      See [[Magic System]].

      ## Inhabitants

      ### Human Races

      ${this.humanRaces.join(", ")}

      ### Non-Human Race
 
      ${this.nonHumanRaces.join(", ")}

      <!-- Add more sections as needed -->
      `;
	}

	// Additional methods as needed
}
