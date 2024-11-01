import {
	MapPoint,
	TectonicPlate,
	PlateType,
	PlateMovement,
	PlateBoundary,
} from "../mapTypes";
// import { noise2D } from "../utils/noise";
import { createNoise2D, NoiseFunction2D } from "simplex-noise";

export class TectonicSystem {
	private plates: TectonicPlate[] = [];
	private boundaries: PlateBoundary[] = [];
	private points: MapPoint[] = [];
	private noise2D: NoiseFunction2D;

	constructor(points: MapPoint[], numPlates: number) {
		this.points = points;
		this.noise2D = createNoise2D();
		this.initializePlates(numPlates);
		this.identifyBoundaries();
	}

	private initializePlates(numPlates: number): void {
		// Use k-means clustering to group points into plates
		const centers = this.generatePlateCenters(numPlates);
		const plateAssignments = this.assignPointsToPlates(centers);

		// Create plates
		for (let i = 0; i < numPlates; i++) {
			const platePoints = plateAssignments
				.map((assignment, index) => (assignment === i ? index : -1))
				.filter((index) => index !== -1);

			this.plates.push({
				id: i,
				type:
					Math.random() > 0.7
						? PlateType.OCEANIC
						: PlateType.CONTINENTAL,
				velocity: {
					x: (Math.random() - 0.5) * 2,
					y: (Math.random() - 0.5) * 2,
				},
				points: platePoints,
				elevation: this.calculateBaseElevation(PlateType.CONTINENTAL),
				age: Math.random() * 100, // Age in million years
			});
		}
	}

	private generatePlateCenters(numPlates: number): MapPoint[] {
		// Use weighted random selection to place plate centers
		const centers: MapPoint[] = [];
		for (let i = 0; i < numPlates; i++) {
			// Use noise to make placement more natural
			const angle = this.noise2D(i * 0.1, 0) * Math.PI * 2;
			const radius = this.noise2D(0, i * 0.1) * 0.5;
			centers.push({
				x: 0.5 + Math.cos(angle) * radius,
				y: 0.5 + Math.sin(angle) * radius,
			});
		}
		return centers;
	}

	private assignPointsToPlates(centers: MapPoint[]): number[] {
		const assignments: number[] = [];

		// Assign each point to nearest plate center
		this.points.forEach((point) => {
			let minDist = Infinity;
			let plateIndex = 0;

			centers.forEach((center, index) => {
				const dist = Math.hypot(point.x - center.x, point.y - center.y);
				if (dist < minDist) {
					minDist = dist;
					plateIndex = index;
				}
			});

			assignments.push(plateIndex);
		});

		return assignments;
	}

	private identifyBoundaries(): void {
		// Clear existing boundaries
		this.boundaries = [];

		// For each point, check if its neighbors belong to different plates
		this.points.forEach((point, index) => {
			const neighbors = this.getNeighborIndices(index);
			const plate1 = this.getPlateForPoint(index);

			neighbors.forEach((neighborIndex) => {
				const plate2 = this.getPlateForPoint(neighborIndex);

				if (plate1 !== plate2) {
					this.addBoundary(plate1, plate2, index);
				}
			});
		});
	}

	private addBoundary(
		plate1: number,
		plate2: number,
		pointIndex: number,
	): void {
		// Find existing boundary or create new one
		let boundary = this.boundaries.find(
			(b) =>
				(b.plate1 === plate1 && b.plate2 === plate2) ||
				(b.plate1 === plate2 && b.plate2 === plate1),
		);

		if (!boundary) {
			const movement = this.calculatePlateMovement(plate1, plate2);
			boundary = {
				plate1,
				plate2,
				type: movement,
				strength: this.calculateInteractionStrength(plate1, plate2),
				points: [],
			};
			this.boundaries.push(boundary);
		}

		boundary.points.push(pointIndex);
	}

	private calculatePlateMovement(
		plate1: number,
		plate2: number,
	): PlateMovement {
		const p1 = this.plates[plate1];
		const p2 = this.plates[plate2];

		// Calculate relative velocity
		const relativeVelocity = {
			x: p1.velocity.x - p2.velocity.x,
			y: p1.velocity.y - p2.velocity.y,
		};

		// Calculate the angle between plates
		const angle = Math.atan2(relativeVelocity.y, relativeVelocity.x);
		const magnitude = Math.hypot(relativeVelocity.x, relativeVelocity.y);

		if (magnitude < 0.1) return PlateMovement.TRANSFORM;
		if (Math.abs(angle) < Math.PI / 4) return PlateMovement.CONVERGENT;
		return PlateMovement.DIVERGENT;
	}

	private calculateInteractionStrength(
		plate1: number,
		plate2: number,
	): number {
		const p1 = this.plates[plate1];
		const p2 = this.plates[plate2];

		// Factors that influence interaction strength:
		// - Relative velocity
		// - Plate types (oceanic vs continental)
		// - Plate ages

		const velocityDiff = Math.hypot(
			p1.velocity.x - p2.velocity.x,
			p1.velocity.y - p2.velocity.y,
		);

		const ageFactor = Math.abs(p1.age - p2.age) / 100;
		const typeFactor = p1.type === p2.type ? 1 : 1.5;

		return velocityDiff * typeFactor * (1 + ageFactor);
	}

	public updateElevations(): void {
		// Reset elevations to plate base levels
		this.points.forEach((point, index) => {
			const plate = this.getPlateForPoint(index);
			point.elevation = this.plates[plate].elevation;
		});

		// Modify elevations based on plate boundaries
		this.boundaries.forEach((boundary) => {
			this.applyBoundaryEffects(boundary);
		});
	}

	private applyBoundaryEffects(boundary: PlateBoundary): void {
		const plate1 = this.plates[boundary.plate1];
		const plate2 = this.plates[boundary.plate2];

		boundary.points.forEach((pointIndex) => {
			const point = this.points[pointIndex];

			switch (boundary.type) {
				case PlateMovement.CONVERGENT:
					if (
						plate1.type === PlateType.CONTINENTAL &&
						plate2.type === PlateType.CONTINENTAL
					) {
						// Form mountains
						point.elevation += boundary.strength * 0.5;
					} else if (plate1.type !== plate2.type) {
						// Form volcanic arcs and trenches
						const oceanicPlate =
							plate1.type === PlateType.OCEANIC ? plate1 : plate2;
						if (oceanicPlate.age > 50) {
							point.elevation -= boundary.strength * 0.3; // Trench
						} else {
							point.elevation += boundary.strength * 0.2; // Volcanic arc
						}
					}
					break;

				case PlateMovement.DIVERGENT:
					// Form ridges or rifts
					point.elevation +=
						plate1.type === PlateType.OCEANIC &&
						plate2.type === PlateType.OCEANIC
							? boundary.strength * 0.2 // Oceanic ridge
							: -boundary.strength * 0.1; // Continental rift
					break;

				case PlateMovement.TRANSFORM:
					// Slight depression along transform faults
					point.elevation -= boundary.strength * 0.05;
					break;
			}
		});
	}

	private getPlateForPoint(pointIndex: number): number {
		return this.plates.findIndex((plate) =>
			plate.points.includes(pointIndex),
		);
	}

	private getNeighborIndices(pointIndex: number): number[] {
		// Implement based on your point neighborhood system
		// This could use Delaunay triangulation or a simpler grid-based approach
		return [];
	}

	public getPlates(): TectonicPlate[] {
		return this.plates;
	}

	public getBoundaries(): PlateBoundary[] {
		return this.boundaries;
	}

	private calculateBaseElevation(type: PlateType): number {
		return type === PlateType.CONTINENTAL
			? 0.6 + Math.random() * 0.2 // Continental plates are higher
			: 0.2 + Math.random() * 0.1; // Oceanic plates are lower
	}
}
