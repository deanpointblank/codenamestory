import { App } from "obsidian";
import { Entity } from "../Entity/Entity";
import { ISubject } from "../../Interfaces/ISubject";
import { IObserver } from "../../Interfaces/IObserver";

export class Country extends Entity implements ISubject {
	app: App;
	name: string;
	description: string;
	capital: string;
	population: number;
	accessibility: string;
	neighboringCountries: string[];

	constructor(app: App, data: any) {
		super(app, data);
		this.description = data.description;
		this.capital = data.capital || "";
		this.population = data.population || 0;
		this.entityType = "Country";
		this.accessibility = data.accessibility || "";
		this.neighboringCountries = data.neighboringCountries || [];
		// Initialize other properties as needed
	}

	private observers: IObserver[] = [];

	registerObserver(observer: IObserver): void {
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

	updatePopulation(newPopulation: number): void {
		this.population = newPopulation;
		this.notifyObservers();
	}

	protected generateOverviewContent(): string {
		const neighborsMarkdown = this.neighboringCountries
			.map((country) => `- [[${country}]]`)
			.join("\n");

		return `---
		type: country
name: ${this.name}
capital: ${this.capital}
population: ${this.population}

${this.name}

Description

${this.description}

Capital

${this.capital}

Population

${this.population}

Accessibility

${this.accessibility}

Neighboring Countries

${neighborsMarkdown}
<!-- Add more sections as needed -->
		`;
	}
}
