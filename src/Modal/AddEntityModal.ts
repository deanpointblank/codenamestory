import { App, Modal, Setting } from "obsidian";

export class AddEntityModal extends Modal {
	onSubmit: (entityType: string) => void;

	constructor(app: App, onSubmit: (entityType: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h2", { text: "Add New Entity" });

		let selectedEntityType = "Country";

		new Setting(contentEl)
			.setName("Entity Type")
			.addDropdown((dropdown) => {
				dropdown
					.addOption("Country", "Country")
					.addOption("Character", "Character")
					.addOption("World", "World")
					.addOption("MagicSystem", "MagicSystem")
					.addOption("Race", "Race")
					// Add more entity types as needed
					.onChange((value) => {
						selectedEntityType = value;
					});
			});

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Create")
					.setCta()
					.onClick(() => {
						this.close();
						this.onSubmit(selectedEntityType);
					}),
			)
			.addButton((btn) =>
				btn.setButtonText("Cancel").onClick(() => {
					this.close();
				}),
			);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
