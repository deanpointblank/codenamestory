// HistoricalEvent.ts
import { Entity } from "../Entity/Entity";
import { App } from "obsidian";

export class HistoricalEvent extends Entity {
	date: string;
	involvedEntities: Entity[];

	constructor(app: App, data: any) {
		super(app, data);
		this.date = data.date;
		this.involvedEntities = data.involvedEntities || [];
		this.entityType = "HistoricalEvents";
	}

	protected generateOverviewContent(): string {
		const entitiesLinks = this.involvedEntities
			.map((entity) => `[[${entity.name}]]`)
			.join(", ");

		return `---
type: historical_event
title: ${this.name}
date: ${this.date}
---

# ${this.name}

## Date

${this.date}

## Description

${this.description}

## Involved Entities

${entitiesLinks}

<!-- Add more sections as needed -->
`;
	}
}
