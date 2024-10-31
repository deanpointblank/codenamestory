import { Entity } from "./Entity";

export abstract class CompositeEntity extends Entity {
	protected children: Entity[] = [];

	addChild(entity: Entity): void {
		this.children.push(entity);
	}

	removeChild(entity: Entity): void {
		this.children = this.children.filter((child) => child !== entity);
	}

	getChildren(): Entity[] {
		return this.children;
	}

	// Override generatePages to include child entities
	async generatePages(): Promise<void> {
		await super.generatePages();
		for (const child of this.children) {
			await child.generatePages();
		}
	}
}
