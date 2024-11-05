import { MapLayer, MapLayerConfig, MapPoint } from "../mapTypes";
import { ElevationLayer } from "./ElevationLayer";
import { VoronoiLayer } from "./VoronoiLayer";
import { TectonicLayer } from "./TectonicLayer";
import { PlateVisualizationLayer } from "./PlateVisualizationLayer";

export class LayerManager {
	private layers: Map<string, MapLayer> = new Map();
	private activeLayerIds: Set<string> = new Set();
	private points: MapPoint[] = [];
	private layerOrder: string[] = ["elevation", "tectonic", "voronoi"];

	constructor(
		width: number = 800,
		height: number = 600,
		numPoints: number = 1000,
	) {
		this.points = this.generateDefaultPoints(width, height, numPoints);
		// Initialize default layers
		this.addLayer(new ElevationLayer());
		this.addLayer(new PlateVisualizationLayer());
		this.addLayer(new TectonicLayer(this.points, 8)); // 8 plates
		this.addLayer(new VoronoiLayer());
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
		return this.layerOrder
			.filter((id) => this.activeLayerIds.has(id))
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

	private generateDefaultPoints(
		width: number,
		height: number,
		numPoints: number,
	): MapPoint[] {
		const points: MapPoint[] = [];
		const centerX = width / 2;
		const centerY = height / 2;
		const maxRadius = Math.min(width, height) * 0.4;

		for (let i = 0; i < numPoints; i++) {
			// Use polar coordinates for more even distribution
			const angle = Math.random() * Math.PI * 2;
			const radius = Math.random() * maxRadius;
			const x = centerX + Math.cos(angle) * radius;
			const y = centerY + Math.sin(angle) * radius;

			// Generate varied elevation
			// Use distance from center to influence elevation
			const distanceFromCenter = Math.sqrt(
				Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2),
			);
			const normalizedDistance = distanceFromCenter / maxRadius;
			const baseElevation = 1 - normalizedDistance;

			// Add random variation (-0.2 to 0.2)
			const noise = Math.random() * 0.4 - 0.2;

			// Combine base elevation with noise and clamp between 0 and 1
			const elevation = Math.max(0, Math.min(1, baseElevation + noise));

			points.push({
				x,
				y,
				elevation, // Neutral elevation to start
				temperature: 0,
				rainfall: 0,
			});
		}

		// Log elevation distribution for debugging
		const distribution = {
			deepWater: points.filter((p) => (p.elevation || 0) < 0.3).length,
			shallowWater: points.filter(
				(p) => (p.elevation || 0) >= 0.3 && (p.elevation || 0) < 0.5,
			).length,
			land: points.filter(
				(p) => (p.elevation || 0) >= 0.5 && (p.elevation || 0) < 0.7,
			).length,
			mountains: points.filter((p) => (p.elevation || 0) >= 0.7).length,
		};

		console.log("Initial elevation distribution:", distribution);
		console.log("Elevation range:", {
			min: Math.min(...points.map((p) => p.elevation || 0)),
			max: Math.max(...points.map((p) => p.elevation || 0)),
			avg:
				points.reduce((sum, p) => sum + (p.elevation || 0), 0) /
				points.length,
		});
		return points;
	}
}
