export interface MapPoint {
	x: number;
	y: number;
	elevation?: number;
	biome?: string;
	temperature?: number;
	rainfall?: number;
}

export interface MapLayer {
	id: string;
	isVisible: boolean;
	render: (
		ctx: CanvasRenderingContext2D,
		points: MapPoint[],
		width: number,
		height: number,
	) => void;
	update?: (points: MapPoint[]) => MapPoint[];
	configure?: (config: any) => void;
}

export interface MapLayerConfig {
	isVisible?: boolean;
	[key: string]: any;
}

export enum PlateType {
	OCEANIC = "oceanic",
	CONTINENTAL = "continental",
}

export enum PlateMovement {
	CONVERGENT = "convergent", // Plates moving toward each other
	DIVERGENT = "divergent", // Plates moving apart
	TRANSFORM = "transform", // Plates sliding past each other
}

export interface TectonicPlate {
	id: number;
	type: PlateType;
	velocity: { x: number; y: number };
	points: number[]; // Indices of points that belong to this plate
	elevation: number; // Base elevation of the plate
	age: number; // Age influences density and behavior
}

export interface PlateBoundary {
	plate1: number;
	plate2: number;
	type: PlateMovement;
	strength: number; // How strongly the plates are interacting
	points: number[]; // Indices of points along the boundary
}
