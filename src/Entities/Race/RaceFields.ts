import { FormField } from "../../Interfaces/FormField";

export const raceFields: FormField[] = [
	{
		id: "name",
		name: "Name",
		type: "text",
		placeholder: "Enter the name of Race",
		required: true,
	},
	{
		id: "description",
		name: "Description",
		type: "textarea",
		placeholder: "Enter a description of the Race",
	},
	//habitat
	{
		id: "habitats",
		name: "Habitats",
		type: "multi-select",
		options: ["Forest", "Mountains", "Desert", "Swamp", "Plains"],
	},
	//population
	{
		id: "population",
		name: "Population",
		type: "number",
		placeholder: "Enter the population of the race",
	},
	//relationsWithOthers
	{
		id: "relationsWithOthers",
		name: "Relations With Others",
		type: "list",
		placeholder: "Enter the relations of the race with other entities",
	},
];
