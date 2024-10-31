import { FormField } from "../../Interfaces/FormField";

export const worldFields: FormField[] = [
	{ id: "name", name: "World Name", type: "text" },
	{
		id: "description",
		name: "Description",
		type: "textarea",
	},
	{
		id: "lawsOfPhysics",
		name: "Laws of Physics",
		type: "textarea",
		placeholder:
			"Describe how the laws of physics differ from the real world.",
	},
	{
		id: "worldType",
		name: "World Type",
		type: "dropdown",
		options: ["Earth-like", "Alternate Earth", "Different Planet"],
	},
	{
		id: "humanRaces",
		name: "Human Races",
		type: "list",
		placeholder: "List the different human races.",
	},
	{
		id: "nonHumanRaces",
		name: "Non-Human Races",
		type: "list",
		placeholder: "List the non-human races (e.g., elves, dwarves).",
	},
	{
		id: "culturalDiversity",
		name: "Cultural Diversity",
		type: "textarea",
		placeholder:
			"Describe the cultural and ethnic diversity compared to the real world.",
	},
	{
		id: "ageOfWorld",
		name: "Age of World",
		type: "text",
		placeholder: "How long have people been on this world?",
	},
	{
		id: "originOfPeople",
		name: "Origin of People",
		type: "textarea",
		placeholder: "Did people evolve here, or migrate from elsewhere?",
	},
	{
		id: "totalPopulation",
		name: "Total Population",
		type: "number",
	},
	{
		id: "populationComparisons",
		name: "Population Comparisons",
		type: "textarea",
		placeholder: "How does this compare with world population?",
	},
	{
		id: "lawsOfPhysics",
		name: "Laws of Physics",
		type: "textarea",
		placeholder:
			"Describe how the laws of physics differ from the real world",
	},
	{
		id: "nonHumanInhabitants",
		name: "Non-Human Inhabitants",
		type: "textarea",
		placeholder: "List of non-human races",
	},
	{
		id: "continentalLayout",
		name: "Continental Layout",
		type: "textarea",
		placeholder: "Description of continent arrangements",
	},
	{
		id: "axialTilt",
		name: "Axial Tilt",
		type: "textarea",
		placeholder:
			"Information on the world's axial tilt and its effect on seasons",
	},
	{
		id: "planetaryFeatures",
		name: "Planetary Features",
		type: "textarea",
		placeholder:
			"Details about moons, suns, rings, and other celestial bodies",
	},
];
