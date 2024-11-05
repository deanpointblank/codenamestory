import { MapLayer, MapPoint, TectonicPlate } from "../mapTypes";
import { TectonicSystem } from "../Systems/TectonicSystem";

export class PlateVisualizationLayer implements MapLayer {
	id = "plates";
	isVisible = true;
	private tectonicSystem: TectonicSystem;
	private plateColors: Map<number, string> = new Map();

	constructor(points: MapPoint[] = [], numPlates: number = 8) {
		this.tectonicSystem = new TectonicSystem(points, numPlates);
		this.generatePlateColors();
	}

	private generatePlateColors(): void {
		// Generate distinct colors for each plate
		const plates = this.tectonicSystem.getPlates();
		const baseHues = plates.map((_, i) => (360 / plates.length) * i);

		plates.forEach((plate, i) => {
			const hue = baseHues[i];
			// Use HSL color space for better control over lightness and saturation
			const color = `hsla(${hue}, 70%, 50%, 0.3)`;
			this.plateColors.set(plate.id, color);
		});
	}

	render(
		ctx: CanvasRenderingContext2D,
		points: MapPoint[],
		width: number,
		height: number,
	): void {
		const plates = this.tectonicSystem.getPlates();

		// Draw plate territories
		plates.forEach((plate) => {
			const baseHue = (360 / plates.length) * plate.id;
			const color = `hsla(${baseHue}, 70%, 50%, 0.3)`; // Added alpha for transparency";

			// Draw each point that belongs to this plate
			plate.points.forEach((pointIndex) => {
				const point = points[pointIndex];
				const neighbors = this.findNeighborPoints(pointIndex, points);

				// Draw filled polygon for the cell
				ctx.beginPath();
				ctx.fillStyle = color;

				// Create path around the point using neighbors
				if (neighbors.length > 2) {
					const firstNeighbor = neighbors[0];
					ctx.moveTo(firstNeighbor.x, firstNeighbor.y);

					for (let i = 1; i < neighbors.length; i++) {
						const neighbor = neighbors[i];
						ctx.lineTo(neighbor.x, neighbor.y);
					}
				}

				ctx.closePath();
				ctx.fill();

				// Subtle plate region borders
				ctx.strokeStyle = `hsla(${baseHue}, 70%, 30%, 0.2)`;
				ctx.lineWidth = 0.5;
				ctx.stroke();
			});
		});

		// Add plate labels
		ctx.font = "bold 14px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		plates.forEach((plate) => {
			const centerPoint = this.calculatePlateCentroid(
				plate.points,
				points,
			);

			// Draw label background
			const text = `Plate ${plate.id}`;
			const metrics = ctx.measureText(text);
			// const padding = 4;

			ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
			ctx.fillRect(
				centerPoint.x - metrics.width / 2 - 4,
				centerPoint.y - 10,
				metrics.width + 8,
				20,
			);

			// Draw label text
			ctx.fillStyle = "#000";
			ctx.fillText(text, centerPoint.x, centerPoint.y);
		});
	}

	private calculatePlateCentroid(
		pointIndices: number[],
		points: MapPoint[],
	): MapPoint {
		const sum = pointIndices.reduce(
			(acc, index) => ({
				x: acc.x + points[index].x,
				y: acc.y + points[index].y,
			}),
			{ x: 0, y: 0 },
		);

		return {
			x: sum.x / pointIndices.length,
			y: sum.y / pointIndices.length,
		};
	}

	private findNeighborPoints(
		pointIndex: number,
		points: MapPoint[],
	): MapPoint[] {
		// Simple approximation - in a real implementation, you'd use Voronoi or Delaunay
		const currentPoint = points[pointIndex];
		const radius = 30; // Adjust this value based on your point density

		return points
			.filter((p, i) => {
				if (i === pointIndex) return false;
				const dx = p.x - currentPoint.x;
				const dy = p.y - currentPoint.y;
				return Math.sqrt(dx * dx + dy * dy) < radius;
			})
			.sort((a, b) => {
				// Sort by angle around the current point
				const angleA = Math.atan2(
					a.y - currentPoint.y,
					a.x - currentPoint.x,
				);
				const angleB = Math.atan2(
					b.y - currentPoint.y,
					b.x - currentPoint.x,
				);
				return angleA - angleB;
			});
	}

	updatePoints(points: MapPoint[]): void {
		this.tectonicSystem = new TectonicSystem(points, 8);
		this.generatePlateColors();
	}

	renderLegend(ctx: CanvasRenderingContext2D, x: number, y: number): void {
		const plates = this.tectonicSystem.getPlates();

		ctx.font = "12px Arial";
		const boxSize = 15;
		const padding = 5;
		let currentY = y;

		plates.forEach((plate, i) => {
			const color = this.plateColors.get(plate.id);
			if (!color) return;

			// Draw color box
			ctx.fillStyle = color;
			ctx.fillRect(x, currentY, boxSize, boxSize);
			ctx.strokeStyle = "rgba(0,0,0,0.3)";
			ctx.strokeRect(x, currentY, boxSize, boxSize);

			// Draw label
			ctx.fillStyle = "#000";
			ctx.fillText(
				`Plate ${plate.id}`,
				x + boxSize + padding,
				currentY + boxSize / 2 + 4,
			);

			currentY += boxSize + padding;
		});
	}
}
