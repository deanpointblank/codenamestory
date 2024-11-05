import React, { useEffect, useRef, useState } from "react";
import { LayerManager } from "./MapLayers/LayerManager";
import { ElevationLayer } from "./MapLayers/ElevationLayer";

interface MapGeneratorProps {
	width?: number;
	height?: number;
	numPoints?: number;
	showDebug?: boolean;
}

export const MapGenerator: React.FC<MapGeneratorProps> = ({
	width = 800,
	height = 600,
	numPoints = 1000,
	showDebug = false,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [layerManager, setLayerManager] = useState(
		() => new LayerManager(width, height, numPoints),
	);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = "#f0f0f0";
		ctx.fillRect(0, 0, width, height);

		// Render active layers
		const points = layerManager.getPoints();
		layerManager.getActiveLayers().forEach((layer) => {
			layer.render(ctx, points, width, height);

			// Render legend if it's the elevation layer
			if (layer.id === "elevation" && "renderLegend" in layer) {
				(layer as ElevationLayer).renderLegend(ctx, 20, height - 100);
			}
		});
	}, [width, height, layerManager]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-2">
				{layerManager.getAllLayers().map((layer) => (
					<div key={layer.id}>
						<button
							key={layer.id}
							data-test-id={`${layer.id}-button`}
							onClick={() => {
								layerManager.toggleLayer(layer.id);
								// Force re-render
								setLayerManager(
									new LayerManager(width, height, numPoints),
								);
							}}
							className={`
                            px-4 py-2 rounded-md
                            font-medium text-sm
                            transition-all duration-200
                            border-2
                            ${
								layerManager.isLayerActive(layer.id)
									? "bg-blue-500 text-white border-blue-600 shadow-md hover:bg-blue-600"
									: "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
							}
                            flex items-center gap-2
                        `}
							aria-pressed={layerManager.isLayerActive(layer.id)}
						>
							{/* Visual indicator of layer state */}
							<span
								className={`
                                w-2 h-2 rounded-full
                                ${layerManager.isLayerActive(layer.id) ? "bg-white" : "bg-gray-400"}
                            `}
							/>
							{/* Capitalize first letter of layer id */}
							{layer.id.charAt(0).toUpperCase() +
								layer.id.slice(1)}
						</button>
					</div>
				))}

				{/* Regenerate button with distinct styling */}
				<button
					onClick={() => {
						setLayerManager(
							new LayerManager(width, height, numPoints),
						);
					}}
					className="
                        px-4 py-2 rounded-md
                        bg-green-500 text-white
                        font-medium text-sm
                        hover:bg-green-600
                        transition-colors
                        ml-4
                        shadow-md
                    "
				>
					Regenerate Map
				</button>
			</div>
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				className="border rounded"
				role="img"
			/>
			<div className="text-sm text-gray-600 mt-2">
				<p>Tectonic Boundary Types:</p>
				<ul className="list-disc pl-5">
					<li>
						<span className="text-red-500">Red lines</span>:
						Convergent boundaries (mountains, trenches)
					</li>
					<li>
						<span className="text-green-500">Green lines</span>:
						Divergent boundaries (rifts, ridges)
					</li>
					<li>
						<span className="text-blue-500">Blue lines</span>:
						Transform boundaries
					</li>
				</ul>
			</div>
		</div>
	);
};
