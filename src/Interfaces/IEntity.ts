export interface IEntity {
	name: string;
	entityType: string;
	generatePages(): Promise<void>;
}
