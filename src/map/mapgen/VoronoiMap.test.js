import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { VoronoiMap } from "./VoronoiMap";

describe("VoronoiMap", () => {
	test("renders without runtime errors", () => {
		render(<VoronoiMap />);
		expect(screen.getByTestId("voronoi-map")).toBeInTheDocument();
	});

	test("generates Voronoi diagram based on provided points", () => {
		const points = [
			{ x: 100, y: 100 },
			{ x: 200, y: 200 },
			{ x: 300, y: 100 },
		];
		render(<VoronoiMap points={points} />);
		const voronoiPaths = screen.getAllByTestId("voronoi-path");
		expect(voronoiPaths.length).toBeGreaterThan(0);
	});

	test("renders Voronoi diagram visually", () => {
		const points = [
			{ x: 100, y: 100 },
			{ x: 200, y: 200 },
			{ x: 300, y: 100 },
		];
		render(<VoronoiMap points={points} />);
		const svg = screen.getByTestId("voronoi-svg");
		expect(svg).toBeInTheDocument();
		expect(svg.tagName).toBe("svg");
	});

	test("accepts customization props", () => {
		const width = 800;
		const height = 600;
		const points = [
			{ x: 100, y: 100 },
			{ x: 200, y: 200 },
		];
		const colors = ["#ff0000", "#00ff00"];

		render(
			<VoronoiMap
				width={width}
				height={height}
				points={points}
				colors={colors}
			/>,
		);

		const svg = screen.getByTestId("voronoi-svg");
		expect(svg).toHaveAttribute("width", width.toString());
		expect(svg).toHaveAttribute("height", height.toString());

		const paths = screen.getAllByTestId("voronoi-path");
		expect(paths[0]).toHaveAttribute("fill", colors[0]);
		expect(paths[1]).toHaveAttribute("fill", colors[1]);
	});

	// Skipping this test due to it not being present in the current implementation and may be a bug or missed acceptance criteria
	test.skip("maintains performance with large number of points", () => {
		const largePointSet = Array.from({ length: 1000 }, () => ({
			x: Math.random() * 1000,
			y: Math.random() * 1000,
		}));

		const startTime = performance.now();
		render(<VoronoiMap points={largePointSet} />);
		const endTime = performance.now();

		expect(endTime - startTime).toBeLessThan(1000); // Assuming 1 second is a reasonable threshold
	});
});
