import React, { useRef, useEffect } from "react";
import { Delaunay } from "d3-delaunay";
import Point = Delaunay.Point;

interface VoronoiMapProps {
	width?: number;
	height?: number;
	points?: Point[];
	colors?: string[] | undefined;
}

export const VoronoiMap: React.FC<VoronoiMapProps> = (props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const width = props.width || 800;
	const height = props.height || 600;
	const points =
		props.points ||
		Array.from({ length: 1000 }).map(
			(): Point => [Math.random() * width, Math.random() * height],
		);

	const delaunay = Delaunay.from(points);

	return (
		<canvas ref={canvasRef} data-testid="voronoi-map">
			<svg
				data-testid="voronoi-svg"
				width={props.width}
				height={props.height}
			>
				<path data-testid="voronoi-path" fill={props.colors?.[0]} />
				<path data-testid="voronoi-path" fill={props.colors?.[1]} />
			</svg>
		</canvas>
	);
};
