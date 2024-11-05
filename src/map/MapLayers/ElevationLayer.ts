import { MapLayer, MapPoint } from "./../mapTypes";
import { Delaunay } from "d3-delaunay";

export class ElevationLayer implements MapLayer {
	id = "elevation";
	isVisible = true;

	render(
		ctx: CanvasRenderingContext2D,
		points: MapPoint[],
		width: number,
		height: number,
	): void {
		console.log(
			"Sample elevations:",
			points.slice(0, 5).map((p) => p.elevation),
		);
		const delaunay = Delaunay.from(
			points.map((p) => [p.x, p.y]),
			(p) => p[0],
			(p) => p[1],
		);
		const voronoi = delaunay.voronoi([0, 0, width, height]);

		points.forEach((point, i) => {
			const cell = voronoi.cellPolygon(i);
			if (cell && point.elevation !== undefined) {
				ctx.beginPath();
				ctx.moveTo(cell[0][0], cell[0][1]);
				for (let j = 1; j < cell.length; j++) {
					ctx.lineTo(cell[j][0], cell[j][1]);
				}
				ctx.closePath();

				// Explicitly defined elevation thresholds
				const elevation = point.elevation;
				if (elevation < 0.3) {
					ctx.fillStyle = "#1a237e"; // Deep water - darker blue
				} else if (elevation < 0.5) {
					ctx.fillStyle = "#42a5f5"; // Shallow water - medium blue
				} else if (elevation < 0.7) {
					ctx.fillStyle = "#90e0ef"; // Coastal areas - light blue
				} else if (elevation < 0.8) {
					ctx.fillStyle = "#2d6a4f"; // Lowlands - green
				} else if (elevation < 0.9) {
					ctx.fillStyle = "#81c784"; // Hills - darker green
				} else {
					ctx.fillStyle = "#33691e"; // Mountains - darkest green
				}
				ctx.fill();

				// Optional: Add cell borders for better visibility
			}
		});
	}

	renderLegend(ctx: CanvasRenderingContext2D, x: number, y: number): void {
		const legendItems = [
			{ color: "#03045e", label: "Deep Ocean" },
			{ color: "#0077b6", label: "Shallow Water" },
			{ color: "#90e0ef", label: "Coastal Waters" },
			{ color: "#2d6a4f", label: "Lowlands" },
			{ color: "#1b4332", label: "Hills" },
			{ color: "#081c15", label: "Mountains" },
		];

		ctx.font = "12px Arial";
		legendItems.forEach((item, i) => {
			const yPos = y + i * 20;
			ctx.fillStyle = item.color;
			ctx.fillRect(x, yPos, 15, 15);
			ctx.fillStyle = "#000";
			ctx.fillText(item.label, x + 20, yPos + 12);
		});
	}
}
