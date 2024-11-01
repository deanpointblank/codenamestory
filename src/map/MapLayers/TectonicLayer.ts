import { MapLayer, MapPoint, PlateMovement } from "../mapTypes";
import { TectonicSystem } from "../Systems/TectonicSystem";

export class TectonicLayer implements MapLayer {
	id = "tectonic";
	isVisible = true;
	private tectonicSystem: TectonicSystem;

	constructor(points: MapPoint[] = [], numPlates: number = 8) {
		this.tectonicSystem = new TectonicSystem(points, numPlates);
	}

	updatePoints(points: MapPoint[]): void {
		this.tectonicSystem = new TectonicSystem(points, 8);
		this.updateElevations();
	}

	render(
		ctx: CanvasRenderingContext2D,
		points: MapPoint[],
		width: number,
		height: number,
	): void {
		// Draw plate boundaries
		const boundaries = this.tectonicSystem.getBoundaries();

		boundaries.forEach((boundary: { type: any; points: any[] }) => {
			ctx.beginPath();

			// Style based on boundary type
			switch (boundary.type) {
				case PlateMovement.CONVERGENT:
					ctx.strokeStyle = "#FF0000";
					ctx.lineWidth = 2;
					break;
				case PlateMovement.DIVERGENT:
					ctx.strokeStyle = "#00FF00";
					ctx.lineWidth = 2;
					break;
				case PlateMovement.TRANSFORM:
					ctx.strokeStyle = "#0000FF";
					ctx.lineWidth = 1;
					break;
			}

			// Draw boundary lines
			boundary.points.forEach((pointIndex, i) => {
				const point = points[pointIndex];
				if (i === 0) {
					ctx.moveTo(point.x, point.y);
				} else {
					ctx.lineTo(point.x, point.y);
				}
			});

			ctx.stroke();
		});

		// Optionally draw plate labels
		const plates = this.tectonicSystem.getPlates();
		plates.forEach((plate) => {
			if (plate.points.length > 0) {
				const centerPoint = this.calculatePlateCentroid(
					plate.points,
					points,
				);
				ctx.fillStyle = "#000";
				ctx.font = "12px Arial";
				ctx.fillText(`Plate ${plate.id}`, centerPoint.x, centerPoint.y);
			}
		});
	}

	private calculatePlateCentroid(
		pointIndices: number[],
		points: MapPoint[],
	): MapPoint {
		const sum = pointIndices.reduce(
			(acc, index) => {
				return {
					x: acc.x + points[index].x,
					y: acc.y + points[index].y,
				};
			},
			{ x: 0, y: 0 },
		);

		return {
			x: sum.x / pointIndices.length,
			y: sum.y / pointIndices.length,
		};
	}

	public updateElevations(): void {
		this.tectonicSystem.updateElevations();
	}
}
