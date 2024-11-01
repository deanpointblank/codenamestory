import React, { useEffect, useRef, useState } from "react";
import { MapPoint } from "./mapTypes";
import { LayerManager } from "./MapLayers/LayerManager";
import { TectonicLayer } from "@/src/map/MapLayers/TectonicLayer";

interface MapGeneratorProps {
	width?: number;
	height?: number;
	numPoints?: number;
}

export const MapGenerator: React.FC<MapGeneratorProps> = ({
	width = 800,
	height = 600,
	numPoints = 1000,
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
		});
	}, [width, height, layerManager]);

	const handleRegenerate = () => {
		const newLayerManager = new LayerManager(width, height, numPoints);
		setLayerManager(newLayerManager);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-2">
				{layerManager.getAllLayers().map((layer) => (
					<button
						key={layer.id}
						onClick={() => {
							layerManager.toggleLayer(layer.id);
							// Force re-render
							setLayerManager(
								new LayerManager(width, height, numPoints),
							);
						}}
						className={`px-3 py-1 rounded ${
							layerManager.isLayerActive(layer.id)
								? "bg-blue-500 text-white"
								: "bg-gray-200"
						}`}
					>
						{layer.id}
					</button>
				))}
				<button
					onClick={handleRegenerate}
					className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
				>
					Regenerate Map
				</button>
			</div>
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				className="border rounded"
			/>
		</div>
	);
};
