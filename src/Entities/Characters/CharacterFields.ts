import { FormField } from "../../Interfaces/FormField";

export const characterFields: FormField[] = [
	{
		id: "name",
		name: "Name",
		type: "text",
		placeholder: "Enter the name of the character",
	},
	{
		id: "description",
		name: "Description",
		type: "textarea",
		placeholder: "Enter a description of the character",
	},
	{
		id: "age",
		name: "Age",
		type: "number",
		placeholder: "Enter the age of the character",
	},
	{
		id: "role",
		name: "Role",
		type: "text",
		placeholder: "Enter the role of the character",
	},
	// Add more fields as needed
];
