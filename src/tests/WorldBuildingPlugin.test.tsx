import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import WorldBuildingPlugin from "../../main";
import { WorldBuildingDashboardView } from "../View/WorldBuildingDashboardView";
import { EntityFormModal } from "../Modal/EntityFormModal";
import { App, WorkspaceLeaf } from "obsidian";

jest.mock("obsidian", () => ({
	App: jest.fn(),
	Modal: jest.fn(),
	Plugin: jest.fn(),
	WorkspaceLeaf: jest.fn(),
	ItemView: jest.fn(),
}));

jest.mock("../../src/Modal/EntityFormModal");

describe("WorldBuildingPlugin", () => {
	let plugin: WorldBuildingPlugin;

	beforeEach(() => {
		plugin = new WorldBuildingPlugin(new App(), null);
	});

	test("displays full-screen modal when plugin loads", async () => {
		await plugin.onload();
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	test('opens EntityFormModal with World entity type when "Create New World" is selected', () => {
		render(<WorldBuildingDashboardView leaf={new WorkspaceLeaf()} />);
		const createNewWorldButton = screen.getByText("Create New World");
		fireEvent.click(createNewWorldButton);
		expect(EntityFormModal).toHaveBeenCalledWith(
			expect.anything(),
			"World",
			expect.any(Function),
		);
	});

	test('displays list of existing worlds when "Load Existing World" is selected', () => {
		render(<WorldBuildingDashboardView leaf={new WorkspaceLeaf()} />);
		const loadExistingWorldButton = screen.getByText("Load Existing World");
		fireEvent.click(loadExistingWorldButton);
		expect(
			screen.getByRole("list", { name: "Existing Worlds" }),
		).toBeInTheDocument();
	});

	test("opens WorldBuildingDashboardView with selected world data when a world is selected", () => {
		render(<WorldBuildingDashboardView leaf={new WorkspaceLeaf()} />);
		const loadExistingWorldButton = screen.getByText("Load Existing World");
		fireEvent.click(loadExistingWorldButton);
		const worldItem = screen.getByText("Test World");
		fireEvent.click(worldItem);
		expect(
			screen.getByTestId("world-building-dashboard"),
		).toHaveTextContent("Test World");
	});

	test("closes modal when clicking outside or on close button", () => {
		render(<WorldBuildingDashboardView leaf={new WorkspaceLeaf()} />);
		const modal = screen.getByRole("dialog");
		const closeButton = screen.getByRole("button", { name: "Close" });
		fireEvent.click(closeButton);
		expect(modal).not.toBeInTheDocument();
	});
});
