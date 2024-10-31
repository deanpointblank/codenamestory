import React, { createContext } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReactView } from "./ReactView";

// Mock the obsidian module
jest.mock(
	"obsidian",
	() => ({
		App: jest.fn(),
		PluginSettingTab: jest.fn(),
		Setting: jest.fn(),
		// Add any other obsidian exports that you use in your code
	}),
	{ virtual: true },
);

// Mock the AppContext
const mockAppContext = createContext({ context: () => "context" });
jest.mock("./main", () => ({
	AppContext: mockAppContext,
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
	// Add other required properties as needed
});

describe("ReactView", () => {
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

	// Skipping this test due to it not being present in the current implementation
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
});
