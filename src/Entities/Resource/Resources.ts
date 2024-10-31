// Resource.ts
import { App } from "obsidian";
import { Entity } from "../Entity/Entity";

export class Resource extends Entity {
	type: string;
	locations: string[];
	abundance: string;

	constructor(app: App, data: any) {
		super(app, data);
		this.type = data.type;
		this.locations = data.locations || [];
		this.abundance = data.abundance || "unknown";
		this.entityType = "Resources";
	}

	protected associateWithLocations(): void {}

	protected generateOverviewContent(): string {
		const locationsLinks = this.locations
			.map((loc) => `[[${loc}]]`)
			.join(", ");

		return `---
type: resource
name: ${this.name}
type: ${this.type}
abundance: ${this.abundance}
---

# ${this.name}

## Type

${this.type}

## Abundance

${this.abundance}

## Locations

${locationsLinks}

<!-- Add more sections as needed -->
`;
	}
}
