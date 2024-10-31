// Race.ts
import { Entity } from "../Entity/Entity";
import { App, Notice } from "obsidian";
import { Relationship } from "../../Interfaces/Relationship";
import { CompositeEntity } from "../Entity/CompositeEntity";
import { ISubject } from "../../Interfaces/ISubject";
import { IObserver } from "../../Interfaces/IObserver";

export class Race extends CompositeEntity implements ISubject, IObserver {
	habitats: string[];
	population: number;
	relationships: Relationship[];
	subRaces: Race[];

	constructor(app: App, data: any) {
		super(app, data);
		this.habitats = data.habitats || [];
		this.population = data.population || 0;
		this.relationships = data.relationships || [];
		this.subRaces = [];
		this.entityType = "Races";
	}

	addSubRace(subRace: Race): void {
		this.subRaces.push(subRace);
	}

	removeSubRace(subRace: Race): void {
		this.subRaces = this.subRaces.filter((sr) => sr !== subRace);
	}

	getSubRaces(): Race[] {
		return this.subRaces;
	}

	//delete race?

	// Override generatePages to include sub-races
	async generatePages(): Promise<void> {
		// Generate race page
		await super.generatePages();

		// Generate pages for sub-races
		for (const subRace of this.subRaces) {
			await subRace.generatePages();
		}
	}
	//TODO: Fix Observer pattern
	observers: IObserver[] = [];

	addObserver(observer: IObserver): void {
		this.observers.push(observer);
	}

	removeObserver(observer: IObserver): void {
		this.observers = this.observers.filter((obs) => obs !== observer);
	}

	notifyObservers(): void {
		for (const observer of this.observers) {
			observer.update(this);
		}
	}

	update(subject: ISubject): void {
		// Handle updates from observed races
		new Notice(
			`${this.name} has been notified of changes in ${subject.name}`,
		);
	}

	// Handle relationship updates
	updateRelationship(relationship: Relationship): void {
		// Update the relationship and notify observers
		this.notifyObservers();
	}

	protected generateOverviewContent(): string {
		const relationshipsMarkdown = this.relationships
			.map((rel) => `- **${rel.type}:** [[${rel.toEntity}]]`)
			.join("\n");

		const subRacesMarkdown =
			this.children.length > 0
				? `## Sub-Races\n\n${this.children.map((child) => `- [[${child.name}]]`).join("\n")}`
				: "";

		return `---
				type: race
				name: ${this.name}
				description: ${this.description}
				habitats: ${this.habitats.join(", ")}
				population: ${this.population}
				---
				# ${this.name}
				
				## Description
				
				${this.description}
				
				## Habitats
				
				${this.habitats.join(",")}
				
				## Population
				
				${this.population}
				
				## Relationships
				
				${relationshipsMarkdown}
				
				${subRacesMarkdown}
				
				\`\`\`dataview
				TABLE
				name, type
				FROM
				"Races"
				WHERE
				contains(relationships, {toEntity: "${this.name}"})
				\`\`\`
				<!-- Add more sections as needed -->
				`;
	}
}
