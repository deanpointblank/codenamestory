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
			// Enhanced boundary styles
			switch (boundary.type) {
				case PlateMovement.CONVERGENT:
					ctx.strokeStyle = "#ff4d4d"; // Bright red
					ctx.lineWidth = 2.5;
					ctx.setLineDash([]);
					break;
				case PlateMovement.DIVERGENT:
					ctx.strokeStyle = "#4dff4d"; // Bright green
					ctx.lineWidth = 2.5;
					ctx.setLineDash([]);
					break;
				case PlateMovement.TRANSFORM:
					ctx.strokeStyle = "#4d4dff"; // Bright blue
					ctx.lineWidth = 2;
					ctx.setLineDash([5, 5]); // Dashed line for transform faults
					break;
			}

			// Draw boundary lines
			// After the main boundary stroke, add this:
			boundary.points.forEach((pointIndex, i) => {
				const point = points[pointIndex];
				if (i === 0) {
					ctx.moveTo(point.x, point.y);
				} else {
					ctx.lineTo(point.x, point.y);
				}
			});

			// Draw main colored line
			ctx.stroke();

			// Add white outline for contrast
			ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
			ctx.lineWidth += 1; // Slightly wider for outline
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

				// Simple white background for contrast
				const text = `Plate ${plate.id}`;
				ctx.font = "12px Arial";
				const metrics = ctx.measureText(text);

				// Add a small white rectangle behind the text
				ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
				ctx.fillRect(
					centerPoint.x - metrics.width / 2,
					centerPoint.y - 6,
					metrics.width,
					12,
				);

				// Draw the text
				ctx.fillStyle = "#000";
				ctx.fillText(text, centerPoint.x, centerPoint.y);
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
