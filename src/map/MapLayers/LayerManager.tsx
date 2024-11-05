// LayerManager.tsx
// @ts-ignore
import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
} from "react";
import { MapLayer, MapLayerConfig, MapPoint } from "../mapTypes";
import { ElevationLayer } from "./ElevationLayer";
import { VoronoiLayer } from "./VoronoiLayer";
import { TectonicLayer } from "./TectonicLayer";
import { PlateVisualizationLayer } from "./PlateVisualizationLayer";

interface LayerManagerContextType {
	points: MapPoint[];
	activeLayers: Set<string>;
	layers: Map<string, MapLayer>;
	isLayerActive: (layerId: string) => boolean;
	toggleLayer: (layerId: string) => void;
	regeneratePoints: () => void;
	getActiveLayers: () => MapLayer[];
	getAllLayers: () => MapLayer[];
	configureLayer: (layerId: string, config: MapLayerConfig) => void;
}

const LayerManagerContext = createContext<LayerManagerContextType | null>(null);

export const useLayerManager = () => {
	const context = useContext(LayerManagerContext);
	if (!context) {
		throw new Error(
			"useLayerManager must be used within a LayerManagerProvider",
		);
	}
	return context;
};

interface LayerManagerProviderProps {
	width?: number;
	height?: number;
	numPoints?: number;
	children: React.ReactNode;
}

export const LayerManagerProvider: React.FC<LayerManagerProviderProps> = ({
	width = 800,
	height = 600,
	numPoints = 1000,
	children,
}) => {
	// State for points and layer visibility
	const [points, setPoints] = useState<MapPoint[]>(() =>
		generateDefaultPoints(width, height, numPoints),
	);

	const [activeLayers, setActiveLayers] = useState<Set<string>>(
		() => new Set(["elevation"]),
	);

	// Initialize layers
	const layers = useMemo(() => {
		const layerMap = new Map<string, MapLayer>();
		layerMap.set("elevation", new ElevationLayer());
		layerMap.set("plates", new PlateVisualizationLayer(points, 8));
		layerMap.set("tectonic", new TectonicLayer(points, 8));
		layerMap.set("voronoi", new VoronoiLayer());
		return layerMap;
	}, []); // Empty dependency array as layers should be initialized once

	const isLayerActive = useCallback(
		(layerId: string) => activeLayers.has(layerId),
		[activeLayers],
	);

	const toggleLayer = useCallback((layerId: string) => {
		setActiveLayers((prev) => {
			const newLayers = new Set(prev);
			if (newLayers.has(layerId)) {
				newLayers.delete(layerId);
			} else {
				newLayers.add(layerId);
			}
			return newLayers;
		});
	}, []);

	const regeneratePoints = useCallback(() => {
		setPoints(generateDefaultPoints(width, height, numPoints));
	}, [width, height, numPoints]);

	const getActiveLayers = useCallback(
		() =>
			Array.from(activeLayers)
				.map((id) => layers.get(id))
				.filter((layer): layer is MapLayer => layer !== undefined),
		[activeLayers, layers],
	);

	const getAllLayers = useCallback(
		() => Array.from(layers.values()),
		[layers],
	);

	const configureLayer = useCallback(
		(layerId: string, config: MapLayerConfig) => {
			const layer = layers.get(layerId);
			if (layer?.configure) {
				layer.configure(config);
			}
		},
		[layers],
	);

	const value = useMemo(
		() => ({
			points,
			activeLayers,
			layers,
			isLayerActive,
			toggleLayer,
			regeneratePoints,
			getActiveLayers,
			getAllLayers,
			configureLayer,
		}),
		[
			points,
			activeLayers,
			layers,
			isLayerActive,
			toggleLayer,
			regeneratePoints,
			getActiveLayers,
			getAllLayers,
			configureLayer,
		],
	);

	return (
		<LayerManagerContext.Provider value={value}>
			{children}
		</LayerManagerContext.Provider>
	);
};

// Helper functions can remain mostly unchanged
function generateDefaultPoints(
	width: number,
	height: number,
	numPoints: number,
): MapPoint[] {
	const points: MapPoint[] = [];
	const centerX = width / 2;
	const centerY = height / 2;
	const maxRadius = Math.min(width, height) * 0.4;

	for (let i = 0; i < numPoints; i++) {
		const angle = Math.random() * Math.PI * 2;
		const radius = Math.random() * maxRadius;
		const x = centerX + Math.cos(angle) * radius;
		const y = centerY + Math.sin(angle) * radius;

		const distanceFromCenter = Math.sqrt(
			Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2),
		);
		const normalizedDistance = distanceFromCenter / maxRadius;
		const baseElevation = 1 - normalizedDistance;
		const noise = Math.random() * 0.4 - 0.2;
		const elevation = Math.max(0, Math.min(1, baseElevation + noise));

		points.push({
			x,
			y,
			elevation,
			temperature: 0,
			rainfall: 0,
		});
	}

	return points;
}
