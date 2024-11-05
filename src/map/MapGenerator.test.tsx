import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MapGenerator } from "./MapGenerator";
import { LayerManager } from "./MapLayers/LayerManager";
import { MapPoint, PlateMovement } from "./mapTypes";

// Extend Jest's mocking types
jest.mock("./MapLayers/LayerManager");
const MockedLayerManager = LayerManager as jest.MockedClass<
	typeof LayerManager
>;

type MockLayer = {
	id: string;
	isVisible: boolean;
	render: jest.Mock;
};

// Mock implementation of LayerManager
const createMockLayerManager = (
	width: number | undefined,
	height: number | undefined,
	numPoints: number | undefined,
) => {
	return {
		getPoints: jest.fn().mockReturnValue(
			Array(numPoints)
				.fill(null)
				.map(
					() =>
						({
							x: Math.random() * (width || 0),
							y: Math.random() * (height || 0),
							elevation: Math.random(),
						}) as MapPoint,
				),
		),
		getAllLayers: jest.fn().mockReturnValue([
			{
				id: "elevation",
				isVisible: true,
				render: jest.fn(), // Add mock render function
			},
			{
				id: "tectonic",
				isVisible: false,
				render: jest.fn(),
			},
			{
				id: "plates",
				isVisible: false,
				render: jest.fn(),
			},
			{
				id: "voronoi",
				isVisible: false,
				render: jest.fn(),
			},
		]),
		getActiveLayers: jest.fn().mockReturnValue([
			{
				id: "elevation",
				isVisible: true,
				render: jest.fn(),
			},
		]),
		isLayerActive: jest
			.fn()
			.mockImplementation((layerId: string) => layerId === "elevation"),
		toggleLayer: jest.fn(),
	};
};

// Setup the mock implementation
beforeEach(() => {
	MockedLayerManager.mockImplementation(
		(width, height, numPoints) =>
			createMockLayerManager(
				width,
				height,
				numPoints,
			) as unknown as LayerManager,
	);
});

// Mock canvas context
const mockContext = {
	clearRect: jest.fn(),
	fillRect: jest.fn(),
	beginPath: jest.fn(),
	moveTo: jest.fn(),
	lineTo: jest.fn(),
	closePath: jest.fn(),
	fill: jest.fn(),
	stroke: jest.fn(),
	strokeStyle: undefined,
};

// Helper function to create a mock MapPoint
const createMockPoint = (elevation: number = Math.random()): MapPoint => ({
	x: Math.random() * 800,
	y: Math.random() * 600,
	elevation,
	temperature: Math.random(),
	rainfall: Math.random(),
});

describe("MapGenerator", () => {
	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();
		// Mock canvas getContext
		HTMLCanvasElement.prototype.getContext = jest
			.fn()
			.mockReturnValue(mockContext);
	});

	describe("Initial Map Creation", () => {
		test("renders with default dimensions", () => {
			render(<MapGenerator />);
			const canvas = screen.getByRole("img"); // canvas elements are treated as img roles
			expect(canvas).toBeInTheDocument();
			expect(canvas).toHaveAttribute("width", "800");
			expect(canvas).toHaveAttribute("height", "600");
		});

		test("renders with custom dimensions", () => {
			const customWidth = 1000;
			const customHeight = 800;
			render(<MapGenerator width={customWidth} height={customHeight} />);
			const canvas = screen.getByRole("img");
			expect(canvas).toHaveAttribute("width", customWidth.toString());
			expect(canvas).toHaveAttribute("height", customHeight.toString());
		});

		test("initializes with correct number of points", () => {
			const numPoints = 500;
			render(<MapGenerator numPoints={numPoints} />);
			expect(MockedLayerManager).toHaveBeenCalledWith(
				expect.any(Number),
				expect.any(Number),
				numPoints,
			);
		});

		test("initializes with elevation layer active", () => {
			render(<MapGenerator />);
			const layerButtons = screen.getAllByRole("button");
			const elevationButton = layerButtons.find((button) =>
				button.textContent?.includes("Elevation"),
			);
			expect(elevationButton).toHaveAttribute("aria-pressed", "true");
		});
	});

	describe("Map Regeneration", () => {
		test("regenerates map with new points on button click", () => {
			render(<MapGenerator />);
			const initialPoints =
				MockedLayerManager.mock.results[0].value.getPoints();

			const regenerateButton = screen.getByText(/regenerate map/i);
			fireEvent.click(regenerateButton);

			const newPoints =
				MockedLayerManager.mock.results[1].value.getPoints();
			expect(newPoints).not.toEqual(initialPoints);
			expect(MockedLayerManager).toHaveBeenCalledTimes(2);
		});

		test("maintains canvas dimensions after regeneration", () => {
			const width = 1200;
			const height = 900;
			render(<MapGenerator width={width} height={height} />);

			const regenerateButton = screen.getByText(/regenerate map/i);
			fireEvent.click(regenerateButton);

			const canvas = screen.getByRole("img");
			expect(canvas).toHaveAttribute("width", width.toString());
			expect(canvas).toHaveAttribute("height", height.toString());
		});

		test("regenerates with different elevation distributions", () => {
			render(<MapGenerator />);
			const initialPoints =
				MockedLayerManager.mock.results[0].value.getPoints();
			const initialElevations = initialPoints.map(
				(p: { elevation: any }) => p.elevation,
			);

			const regenerateButton = screen.getByText(/regenerate map/i);
			fireEvent.click(regenerateButton);

			const newPoints =
				MockedLayerManager.mock.results[1].value.getPoints();
			const newElevations = newPoints.map(
				(p: { elevation: any }) => p.elevation,
			);

			// Compare elevation distributions
			const initialAvg =
				initialElevations.reduce((a: any, b: any) => a! + b!) /
				initialElevations.length;
			const newAvg =
				newElevations.reduce((a: any, b: any) => a! + b!) /
				newElevations.length;

			expect(newAvg).not.toBe(initialAvg);
			expect(newElevations).not.toEqual(initialElevations);
		});

		test("maintains geological feature relationships after regeneration", () => {
			const mockLayerManager = {
				...createMockLayerManager(800, 600, 100),
				getTectonicFeatures: jest.fn().mockReturnValue([
					{
						type: PlateMovement.CONVERGENT,
						points: [0, 1, 2],
						elevation: 0.9,
					},
				]),
			};

			MockedLayerManager.mockImplementation(
				() => mockLayerManager as unknown as LayerManager,
			);

			render(<MapGenerator />);

			const regenerateButton = screen.getByText(/regenerate map/i);
			fireEvent.click(regenerateButton);

			const points = mockLayerManager.getPoints();
			const convergentPoints = mockLayerManager
				.getTectonicFeatures()
				.filter(
					(f: { type: PlateMovement }) =>
						f.type === PlateMovement.CONVERGENT,
				)
				.flatMap((f: { points: any }) => f.points);

			const convergentElevations = convergentPoints.map(
				(i: string | number) => points[i].elevation,
			);
			expect(Math.min(...convergentElevations)).toBeGreaterThan(0.7);
		});
	});

	describe("Layer Controls", () => {
		test("toggles layer visibility on button click", () => {
			render(<MapGenerator />);
			const tectonicButton = screen.getByTestId("tectonic-button");

			fireEvent.click(tectonicButton);
			expect(
				MockedLayerManager.mock.results[0].value.toggleLayer,
			).toHaveBeenCalledWith("tectonic");
		});

		test("updates button state when layer is toggled", () => {
			render(<MapGenerator />);
			const tectonicButton = screen.getByTestId("tectonic-button");

			expect(tectonicButton).toHaveAttribute("aria-pressed", "false");
			fireEvent.click(tectonicButton);
		});
	});

	describe("Edge Cases", () => {
		test("handles zero points gracefully", () => {
			render(<MapGenerator numPoints={0} />);
			const canvas = screen.getByRole("img");
			expect(canvas).toBeInTheDocument();
		});

		test("handles minimum dimensions", () => {
			render(<MapGenerator width={1} height={1} />);
			const canvas = screen.getByRole("img");
			expect(canvas).toHaveAttribute("width", "1");
			expect(canvas).toHaveAttribute("height", "1");
		});

		test("handles extremely large dimensions", () => {
			render(<MapGenerator width={10000} height={10000} />);
			const canvas = screen.getByRole("img");
			expect(canvas).toHaveAttribute("width", "10000");
			expect(canvas).toHaveAttribute("height", "10000");
		});
	});

	describe("Tectonic Feature Validation", () => {
		test("creates mountains at convergent plate boundaries", () => {
			const mockLayerManager = {
				...createMockLayerManager(800, 600, 100),
				getTectonicFeatures: jest.fn().mockReturnValue([
					{
						type: PlateMovement.CONVERGENT,
						points: [0, 1, 2],
						elevation: 0.9,
					},
				]),
			};

			MockedLayerManager.mockImplementation(
				() => mockLayerManager as unknown as LayerManager,
			);

			render(<MapGenerator />);
			const points = mockLayerManager.getPoints();
			const elevatedPoints = points.filter(
				(p: { elevation: number }) => p.elevation > 0.8,
			);
			expect(elevatedPoints.length).toBeGreaterThan(0);
		});

		test("creates trenches at oceanic-oceanic convergent boundaries", () => {
			const mockLayerManager = {
				...createMockLayerManager(800, 600, 100),
				getTectonicFeatures: jest.fn().mockReturnValue([
					{
						type: PlateMovement.CONVERGENT,
						isOceanic: true,
						points: [0, 1, 2],
						elevation: 0.2,
					},
				]),
			};

			MockedLayerManager.mockImplementation(
				() => mockLayerManager as unknown as LayerManager,
			);

			render(<MapGenerator />);
			const points = mockLayerManager.getPoints();
			const trenchPoints = points.filter(
				(p: { elevation: number }) => p.elevation < 0.3,
			);
			expect(trenchPoints.length).toBeGreaterThan(0);
		});

		test("creates rifts at divergent boundaries", () => {
			const mockLayerManager = {
				...createMockLayerManager(800, 600, 100),
				getTectonicFeatures: jest.fn().mockReturnValue([
					{
						type: PlateMovement.DIVERGENT,
						points: [0, 1, 2],
						elevation: 0.4,
					},
				]),
			};

			MockedLayerManager.mockImplementation(
				() => mockLayerManager as unknown as LayerManager,
			);

			render(<MapGenerator />);
			const points = mockLayerManager.getPoints();
			const riftPoints = points.filter(
				(p: { elevation: number }) =>
					p.elevation > 0.3 && p.elevation < 0.5,
			);
			expect(riftPoints.length).toBeGreaterThan(0);
		});
	});

	describe("Visual Debug Features", () => {
		test("highlights tectonic boundaries with appropriate colors", () => {
			const mockLayerManager = {
				...createMockLayerManager(800, 600, 100),
				getTectonicFeatures: jest.fn().mockReturnValue([
					{
						type: PlateMovement.CONVERGENT,
						points: [0, 1],
					},
					{
						type: PlateMovement.DIVERGENT,
						points: [2, 3],
					},
					{
						type: PlateMovement.TRANSFORM,
						points: [4, 5],
					},
				]),
			};

			MockedLayerManager.mockImplementation(
				() => mockLayerManager as unknown as LayerManager,
			);

			render(<MapGenerator showDebug={true} />);

			expect(mockContext.strokeStyle).toHaveBeenCalledWith("#ff4d4d"); // Convergent
			expect(mockContext.strokeStyle).toHaveBeenCalledWith("#4dff4d"); // Divergent
			expect(mockContext.strokeStyle).toHaveBeenCalledWith("#4d4dff"); // Transform
		});

		test("displays debug information panel when enabled", () => {
			render(<MapGenerator showDebug={true} />);

			expect(screen.getByText(/active layers/i)).toBeInTheDocument();
			expect(
				screen.getByText(/elevation distribution/i),
			).toBeInTheDocument();
			expect(screen.getByText(/tectonic features/i)).toBeInTheDocument();
		});
	});
});
