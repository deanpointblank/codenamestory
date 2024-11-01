import { MapLayer, MapPoint } from "./../mapTypes";
import { Delaunay } from "d3-delaunay";

interface VoronoiLayerConfig {
	strokeStyle?: string;
	lineWidth?: number;
}

export class VoronoiLayer implements MapLayer {
	id = "voronoi";
	isVisible = true;
	private strokeStyle: string = "#666";
	private lineWidth: number = 0.5;

	configure(config: VoronoiLayerConfig) {
		if (config.strokeStyle) this.strokeStyle = config.strokeStyle;
		if (config.lineWidth) this.lineWidth = config.lineWidth;
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

		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;

		for (let i = 0; i < points.length; i++) {
			const cell = voronoi.cellPolygon(i);
			if (cell) {
				ctx.beginPath();
				ctx.moveTo(cell[0][0], cell[0][1]);
				for (let j = 1; j < cell.length; j++) {
					ctx.lineTo(cell[j][0], cell[j][1]);
				}
				ctx.closePath();
				ctx.stroke();
			}
		}
	}
}
