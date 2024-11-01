import { MapLayer, MapLayerConfig, MapPoint } from "../mapTypes";
import { ElevationLayer } from "./ElevationLayer";
import { VoronoiLayer } from "./VoronoiLayer";
import { TectonicLayer } from "@/src/map/MapLayers/TectonicLayer";

export class LayerManager {
	private layers: Map<string, MapLayer> = new Map();
	private activeLayerIds: Set<string> = new Set();
	private points: MapPoint[] = [];

	constructor(
		width: number = 800,
		height: number = 600,
		numPoints: number = 1000,
	) {
		this.points = this.generateDefaultPoints(width, height, numPoints);
		// Initialize default layers
		this.addLayer(new VoronoiLayer());
		this.addLayer(new ElevationLayer());
		this.addLayer(new TectonicLayer(this.points, 8)); // 8 plates
	}

	private generateDefaultPoints(
		width: number,
		height: number,
		numPoints: number,
	): MapPoint[] {
		const points: MapPoint[] = [];
		for (let i = 0; i < numPoints; i++) {
			// Use polar coordinates for more even distribution
			const angle = Math.random() * Math.PI * 2;
			const radius = Math.random() * Math.min(width, height) * 0.4;
			const x = width / 2 + Math.cos(angle) * radius;
			const y = height / 2 + Math.sin(angle) * radius;

			points.push({
				x,
				y,
				elevation: 0.5, // Neutral elevation to start
				temperature: 0,
				rainfall: 0,
			});
		}
		return points;
	}

	addLayer(layer: MapLayer): void {
		this.layers.set(layer.id, layer);
		if (layer.isVisible) {
			this.activeLayerIds.add(layer.id);
		}
	}

	removeLayer(layerId: string): void {
		this.layers.delete(layerId);
		this.activeLayerIds.delete(layerId);
	}

	toggleLayer(layerId: string): void {
		if (this.activeLayerIds.has(layerId)) {
			this.activeLayerIds.delete(layerId);
		} else {
			this.activeLayerIds.add(layerId);
		}
	}

	configureLayer(layerId: string, config: MapLayerConfig): void {
		const layer = this.layers.get(layerId);
		if (layer?.configure) {
			layer.configure(config);
		}
	}

	getLayer(layerId: string): MapLayer | undefined {
		return this.layers.get(layerId);
	}

	getActiveLayers(): MapLayer[] {
		return Array.from(this.activeLayerIds)
			.map((id) => this.layers.get(id))
			.filter((layer): layer is MapLayer => layer !== undefined);
	}

	getAllLayers(): MapLayer[] {
		return Array.from(this.layers.values());
	}

	isLayerActive(layerId: string): boolean {
		return this.activeLayerIds.has(layerId);
	}

	getPoints(): MapPoint[] {
		return this.points;
	}

	setPoints(newPoints: MapPoint[]): void {
		this.points = newPoints;
		// Update tectonic layer with new points
		const tectonicLayer = this.getLayer("tectonic") as TectonicLayer;
		if (tectonicLayer) {
			tectonicLayer.updatePoints(newPoints);
		}
	}
}
