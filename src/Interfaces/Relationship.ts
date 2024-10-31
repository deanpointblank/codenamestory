// Relationship.ts
import { Entity } from "../Entities/Entity/Entity";

import { IObserver } from "./IObserver";
import { ISubject } from "./ISubject";
import { Race } from "../Entities/Race/Race";

export interface Relationship {
	fromEntity: string;
	toEntity: string;
	type: string; // e.g., ally, enemy
}

export class RaceObserver implements IObserver {
	raceName: string;

	constructor(raceName: string) {
		this.raceName = raceName;
	}

	update(subject: ISubject, data?: any): void {
		if (subject instanceof Race) {
			console.log(
				`${this.raceName} has been notified of changes in ${subject.name}.`,
			);
			// Implement additional logic as needed
		}
	}
}
