import { DataviewApi } from "obsidian-dataview";
import { App, Notice } from "obsidian";

export abstract class DataViewQuery {
	app: App;
	dv: DataviewApi;

	protected constructor(app: App, dv: DataviewApi) {
		this.app = app;
		this.dv = dv;
	}

	abstract async runQuery(): Promise<void>;

	async run(): Promise<void> {
		try {
			await this.runQuery();
		} catch (e) {
			new Notice(`Error running query: ${e}`);
		}
	}
}
