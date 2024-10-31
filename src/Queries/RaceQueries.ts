import { DataViewQuery } from "./DataViewQuery";
import { App } from "obsidian";
import { DataviewApi } from "obsidian-dataview";

export class RaceQueries extends DataViewQuery {
	app: App;
	dv: DataviewApi;

	async runQuery() {}
}
