// Utils/ValidationUtils.ts
export class ValidationUtils {
	static validateRaceData(data: any): string[] {
		const errors: string[] = [];

		if (!data.name || data.name.trim() === "") {
			errors.push("Name is required.");
		}

		if (!data.description || data.description.trim() === "") {
			errors.push("Description is required.");
		}

		if (
			!data.habitats ||
			!Array.isArray(data.habitats) ||
			data.habitats.length === 0
		) {
			errors.push("At least one habitat must be specified.");
		}

		if (typeof data.population !== "number" || data.population < 0) {
			errors.push("Population must be a non-negative number.");
		}

		// Add more validation rules as needed

		return errors;
	}

	//TODO: find way to export function
	// const errors = ValidationUtils.validateRaceData(entityData);
	// if (errors.length > 0) {
	// 	new Notice(`Error creating entity:\n${errors.join("\n")}`);
	// 	return null;
	// }

	//TODO: finish implementation, implement for other entities
	static validateCountryData(data: any): string[] {
		const errors: string[] = [];
		if (!data.name || data.name.trim() === "") {
			errors.push("Name is required.");
		}
		// Additional validations...
		return errors;
	}
}
