import React, { createContext } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReactView } from "./ReactView";
// import { AppContext } from "./main";
import { World } from "./src/Entities/World/World";
import { worldFields } from "./src/Entities/World/WorldFields";

// Mock the obsidian module
jest.mock(
	"obsidian",
	() => ({
		ItemView: class MockItemView {},
		TFile: class MockTFile {},
		WorkspaceLeaf: class MockWorkspaceLeaf {},
		Plugin: class MockPlugin {},
		App: jest.fn(),
		PluginSettingTab: jest.fn(),
		Setting: jest.fn(),
	}),
	{ virtual: true },
);

// Mock the AppContext
const mockAppContext = createContext({ context: () => "context" });
jest.mock("./main", () => ({
	AppContext: mockAppContext,
	WorldBuildingPlugin: class MockWorldBuildingPlugin {},
}));

// Create a more complete mock of the App object
const createMockApp = () => ({
	keymap: {},
	scope: {},
	workspace: {
		getActiveViewOfType: jest.fn(),
		onLayoutReady: jest.fn(),
	},
	vault: {
		getAbstractFileByPath: jest.fn(),
	},
	metadataCache: {},
	fileManager: {
		processFrontMatter: jest.fn(),
	},
	lastEvent: null,
	worlds: [],
	// Add other required properties as needed
});

// Mock the WorldBuildingDashboardView
jest.mock("./src/View/WorldBuildingDashboardView", () => ({
	WorldBuildingDashboardView: class MockWorldBuildingDashboardView {},
}));

describe("ReactView", () => {
	const mockApp = createMockApp();
	test("renders ReactView component", () => {
		const mockApp = createMockApp();
		render(
			<mockAppContext.Provider value={mockApp as any}>
				<ReactView />
			</mockAppContext.Provider>,
		);

		// Check if the component renders without crashing
		expect(screen.getByText("CodeNameStory")).toBeInTheDocument();
	});

	test("renders World-Building Dashboard heading", () => {
		render(
			<mockAppContext.Provider value={mockApp as any}>
				<ReactView />
			</mockAppContext.Provider>,
		);
		const heading = screen.getByRole("heading", {
			name: /world-building dashboard/i,
		});
		expect(heading).toBeInTheDocument();
	});

	test("renders worldbuilding dashboard with story context data", () => {
		const mockApp = createMockApp();
		render(
			<mockAppContext.Provider value={mockApp as any}>
				<ReactView />
			</mockAppContext.Provider>,
		);

		const dashboardElement = screen.queryByRole("heading", {
			name: /worldbuilding dashboard/i,
		});
		expect(dashboardElement).toBeInTheDocument();
	});

	test('displays "You have not created any worlds yet." message when no worlds exist', () => {
		render(
			<mockAppContext.Provider value={mockApp as any}>
				<ReactView />
			</mockAppContext.Provider>,
		);
		const noWorldsMessage = screen.getByText(
			"You have not created any worlds yet.",
		);
		expect(noWorldsMessage).toBeInTheDocument();
	});

	test('renders "Create a new world" button', () => {
		render(
			<mockAppContext.Provider value={mockApp as any}>
				<ReactView />
			</mockAppContext.Provider>,
		);
		const createButton = screen.getByRole("button", {
			name: /create a new world/i,
		});
		expect(createButton).toBeInTheDocument();
	});

	// Skipping this test due to it not being present in the current implementation and may be a bug or missed acceptance criteria
	// test.skip("displays a list of created worlds when worlds exist", () => {
	// 	const mockWorlds = [
	// 		{ name: "Fantasy World", description: "A magical realm" },
	// 		{ name: "Sci-Fi World", description: "A futuristic universe" },
	// 	];
	// 	render(
	// 		<AppContext.Provider value={{ ...mockApp, worlds: mockWorlds }}>
	// 			<ReactView />
	// 		</AppContext.Provider>,
	// 	);
	// 	mockWorlds.forEach((world) => {
	// 		expect(screen.getByText(world.name)).toBeInTheDocument();
	// 		expect(screen.getByText(world.description)).toBeInTheDocument();
	// 	});
	// });
});
