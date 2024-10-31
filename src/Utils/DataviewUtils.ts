// Utils/DataviewUtils.ts
import { DataviewApi } from "obsidian-dataview";
import { Race } from "../Entities/Race/Race";

export class DataviewUtils {
	static getRaces(
		dataviewAPI: DataviewApi,
		folder: string = '"Races"',
	): any[] {
		const races = dataviewAPI
			.pages(folder)
			.where((p: { type: string }) => p.type === "race");
		return Array.from(races).map((p: any) => ({
			name: p.name,
			description: p.description,
			habitats: p.habitats,
			population: p.population,
			relationships: p.relationships,
		}));
	}

	// Add more utility functions as needed
}
