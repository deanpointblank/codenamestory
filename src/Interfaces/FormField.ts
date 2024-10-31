export interface FormField {
	id: string;
	name: string;
	type:
		| "text"
		| "number"
		| "textarea"
		| "dropdown"
		| "toggle"
		| "list"
		| "multi-select";
	placeholder?: string;
	options?: string[]; // For dropdowns
	required?: boolean;
}
