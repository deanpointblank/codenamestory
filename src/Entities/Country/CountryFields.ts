import { FormField } from "../../Interfaces/FormField";

export const countryFields: FormField[] = [
	{
		id: "name",
		name: "Name",
		type: "text",
		placeholder: "Enter the name of the country",
	},
	{
		id: "description",
		name: "Description",
		type: "textarea",
		placeholder: "Enter a description of the country",
	},
	{
		id: "capital",
		name: "Capital",
		type: "text",
		placeholder: "Enter the capital of the country",
	},
	{
		id: "population",
		name: "Population",
		type: "number",
		placeholder: "Enter the population of the country",
	},
	{
		id: "accessibility",
		name: "Accessibility",
		type: "textarea",
		placeholder: "Natural features marking borders and affecting access.",
	},
	{
		id: "neighboringCountries",
		name: "Neighboring Countries",
		type: "list",
		placeholder: "List of neighboring countries and relations.",
	},
	{
		id: "settlementReasons",
		name: "Settlement Reasons",
		type: "textarea",
		placeholder: "Reasons behind the country's initial settlement.",
	},
	{
		id: "naturalResources",
		name: "Natural Resources",
		type: "textarea",
		placeholder:
			"Information on resources, their abundance, and depletion.",
	},
	{
		id: "primaryCrops",
		name: "Primary Crops",
		type: "textarea",
		placeholder: "Details about main agricultural products.",
	},
	{
		id: "wildlife",
		name: "Wildlife",
		type: "list",
		placeholder: "List of wild and domesticated animals.",
	},
	{
		id: "livelihoods",
		name: "Livelihoods",
		type: "textarea",
		placeholder: "Common occupations and industries.",
	},
	// Add more fields as needed
];
