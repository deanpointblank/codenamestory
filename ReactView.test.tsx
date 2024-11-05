import React, { createContext } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReactView } from "./ReactView";
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
		Modal: class MockModal {
			constructor(app: any) {
				this.app = app;
			}
			app: any;
			open() {}
			close() {}
			onOpen() {}
			onClose() {}
		},
	}),
	{ virtual: true },
);

// Create a mock context before mocking the module
const contextValue = { context: () => "context" };

// Mock the main module
jest.mock("./main", () => ({
	AppContext: {
		Provider: ({
			children,
			value,
		}: {
			children: React.ReactNode;
			value: any;
		}) => <div data-testid="mock-context-provider">{children}</div>,
		Consumer: ({
			children,
		}: {
			children: (value: any) => React.ReactNode;
		}) => children(contextValue),
	},
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
});

// Mock the WorldBuildingDashboardView
jest.mock("./src/View/WorldBuildingDashboardView", () => ({
	WorldBuildingDashboardView: class MockWorldBuildingDashboardView {},
}));

describe("ReactView", () => {
	const mockApp = createMockApp();

	test("renders ReactView component", () => {
		render(<ReactView />);
		expect(
			screen.getByText(/world-building dashboard/i),
		).toBeInTheDocument();
	});

	test("renders World-Building Dashboard heading", () => {
		render(<ReactView />);
		const heading = screen.getByRole("heading", {
			name: /world-building dashboard/i,
		});
		expect(heading).toBeInTheDocument();
	});

	test("renders worldbuilding dashboard with story context data", () => {
		render(<ReactView />);
		const dashboardElement = screen.queryByRole("heading", {
			name: /world-building dashboard/i,
		});
		expect(dashboardElement).toBeInTheDocument();
	});

	// next 3 tests should be moved to the WorldList.test.tsx file
	test.skip('displays "You have not created any worlds yet." message when no worlds exist', () => {
		render(<ReactView />);
		const noWorldsMessage = screen.getByText(/No worlds created yet/i);
		expect(noWorldsMessage).toBeInTheDocument();
	});

	test.skip('renders "Create a new world" button', () => {
		render(<ReactView />);
		const createButton = screen.getByRole("button", {
			name: /create a new world/i,
		});
		expect(createButton).toBeInTheDocument();
	});

	// Skipping this test as it's not implemented yet
	test.skip("displays a list of created worlds when worlds exist", () => {
		const mockWorlds = [
			{ name: "Fantasy World", description: "A magical realm" },
			{ name: "Sci-Fi World", description: "A futuristic universe" },
		];
		render(<ReactView />);

		// TODO: Implement this test when world listing functionality is added
		// 	mockWorlds.forEach((world) => {
		// 		expect(screen.getByText(world.name)).toBeInTheDocument();
		// 		expect(screen.getByText(world.description)).toBeInTheDocument();
		// 	});
		expect(true).toBe(true);
	});
});
