import { Modal, App, Setting } from "obsidian";
import { FormField } from "../Interfaces/FormField";

export class EntityFormModal extends Modal {
	fields: FormField[];
	onSubmit: (data: any) => void;

	constructor(app: App, fields: FormField[], onSubmit: (data: any) => void) {
		super(app);
		this.fields = fields;
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl("h2", { text: "Enter Entity Details" });

		const data: any = {};

		this.fields.forEach((field) => {
			const setting = new Setting(contentEl).setName(field.name);

			switch (field.type) {
				case "text":
					setting.addText((text) => {
						if (field.placeholder)
							text.setPlaceholder(field.placeholder);
						text.onChange((value) => {
							data[field.id] = value;
						});
					});
					break;
				case "number":
					setting.addText((text) => {
						text.inputEl.type = "number";
						if (field.placeholder)
							text.setPlaceholder(field.placeholder);
						text.onChange((value) => {
							data[field.id] = Number(value);
						});
					});
					break;
				case "textarea":
					setting.addTextArea((textarea) => {
						if (field.placeholder)
							textarea.setPlaceholder(field.placeholder);
						textarea.onChange((value) => {
							data[field.id] = value;
						});
					});
					break;
				case "dropdown":
					setting.addDropdown((dropdown) => {
						field.options?.forEach((option: string) => {
							dropdown.addOption(option, option);
						});
						dropdown.onChange((value) => {
							data[field.id] = value;
						});
					});
					break;
				case "toggle":
					setting.addToggle((toggle) => {
						toggle.onChange((value) => {
							data[field.id] = value;
						});
					});
					break;
				case "list":
					setting.addText((text) => {
						if (field.placeholder)
							text.setPlaceholder(field.placeholder);
						text.onChange((value) => {
							data[field.id] = value
								.split(",")
								.map((item) => item.trim());
						});
					});
					break;
				//TODO: Multi-select replace tooltip
				case "multi-select":
					const values = [];
					setting.addDropdown((dropdownComponent) => {});
					// field.options?.forEach((option) => {
					// 	setting.addToggle((toggle) => {
					// 		setting.setName(option);
					// 		toggle.onChange((value) => {
					// 			if (value) {
					// 				if (!data[field.id]) data[field.id] = [];
					// 				data[field.id].push(option);
					// 			} else {
					// 				data[field.id] = data[field.id].filter(
					// 					(item: string) => item !== option,
					// 				);
					// 			}
					// 		});
					// 	});
					// });
					break;
				// Add more field types as needed
			}
		});

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Create")
					.setCta()
					.onClick(() => {
						this.close();
						this.onSubmit(data);
					}),
			)
			.addButton((btn) =>
				btn.setButtonText("Cancel").onClick(() => {
					this.close();
					this.onSubmit(null);
				}),
			);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
