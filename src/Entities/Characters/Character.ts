import { App } from "obsidian";
import { Entity } from "../Entity/Entity";
import { ISubject } from "../../Interfaces/ISubject";
import { IObserver } from "../../Interfaces/IObserver";
import { Country } from "../Country/Country";

export class Character extends Entity implements IObserver {
	app: App;
	name: string;
	description: string;
	age: number;
	role: string;

	constructor(app: App, data: any) {
		super(app, data);
		this.name = data.name;
		this.description = data.description;
		this.age = data.age || 0;
		this.role = data.role || "";
		this.entityType = "Character";
	}

	update(subject: ISubject): void {
		// Implement observer update logic if needed
	}

	protected generateOverviewContent(): string {
		return `---
type: character
name: ${this.name}
age: ${this.age}
role: ${this.role}
---

# ${this.name}

## Description

${this.description}

## Age

${this.age}

## Role

${this.role}

<!-- Add more sections as needed -->
`;
	}
}
