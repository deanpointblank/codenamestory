import { FormField } from "../../Interfaces/FormField";

export const magicSystemFields: FormField[] = [
	{ id: "name", name: "World Name", type: "text" },
	{
		id: "description",
		name: "Description",
		type: "textarea",
	},
	{
		id: "sourceOfMagic",
		name: "Source of Magic",
		type: "textarea",
		placeholder: "Where does magic power come from?",
	},
	{
		id: "isExhaustible",
		name: "Is Magic Exhaustible?",
		type: "toggle",
	},
	{
		id: "effectsOnUsers",
		name: "Effects on Magic Users",
		type: "textarea",
		placeholder: "What long-term effects does magic have on users?",
	},
	{
		id: "racialDifferences",
		name: "Racial Differences in Magic",
		type: "textarea",
		placeholder:
			"Do different races have different sources for their magic?",
	},
];
