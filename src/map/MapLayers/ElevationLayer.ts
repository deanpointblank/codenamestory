import { MapLayer, MapPoint } from "./../mapTypes";
import { Delaunay } from "d3-delaunay";

interface ElevationLayerConfig {
	colorMap?: Record<number, string>;
}

export class ElevationLayer implements MapLayer {
	id = "elevation";
	isVisible = true;
	private colorMap: Record<number, string> = {
		0.2: "#006994", // Deep water
		0.3: "#0099CC", // Shallow water
		0.4: "#A3E0D8", // Coast
		0.5: "#90EE90", // Lowlands
		0.7: "#228B22", // Hills
		0.85: "#8B4513", // Mountains
		1: "#FFFFFF", // Snow caps
	};

	configure(config: ElevationLayerConfig) {
		if (config.colorMap) {
			this.colorMap = config.colorMap;
		}
	}

	private getElevationColor(elevation: number): string {
		const thresholds = Object.keys(this.colorMap)
			.map(Number)
			.sort((a, b) => a - b);

		for (const threshold of thresholds) {
			if (elevation < threshold) {
				return this.colorMap[threshold];
			}
		}
		return this.colorMap[1]; // Default to the highest elevation color
	}

	render(
		ctx: CanvasRenderingContext2D,
		points: MapPoint[],
		width: number,
		height: number,
	): void {
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

				ctx.fillStyle = this.getElevationColor(point.elevation);
				ctx.fill();
			}
		});
	}
}
