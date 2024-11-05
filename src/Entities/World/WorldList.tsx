import React, { useContext, useEffect, useState } from "react";
import { Plus, Globe } from "lucide-react";
import { getAPI } from "obsidian-dataview";
import { AppContext } from "../../../main";
import { AddEntityModal } from "../../Modal/AddEntityModal";
import { EntityFactory } from "../../Utils/EntityFactory";
import { TFile } from "obsidian";
import { MapGenerator } from "../../map/MapGenerator";
import { LayerManagerProvider } from "../../map/MapLayers/LayerManager";

interface World {
	name: string;
	description: string;
	worldType: string;
	file: {
		path: string;
	};
}

const WorldList: React.FC = () => {
	const obsidianApp = useContext(AppContext);

	const [worlds, setWorlds] = useState<World[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchWorlds = async () => {
		try {
			const dv = getAPI(obsidianApp);
			if (!dv) {
				throw new Error("Dataview plugin is not available");
			}

			const worldPages = dv
				.pages('"World"')
				.where((p: { type: string }) => p.type === "world")
				.map(
					(p: {
						name: any;
						description: any;
						worldType: any;
						file: any;
					}) => ({
						name: p.name,
						description: p.description,
						worldType: p.worldType,
						file: p.file,
					}),
				);

			setWorlds(Array.from(worldPages));
			setLoading(false);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch worlds",
			);
			setLoading(false);
		}
	};

	const handleCreateWorld = () => {
		if (obsidianApp) {
			const modal = new AddEntityModal(
				obsidianApp,
				async (entityType: string) => {
					const entity = await EntityFactory.createEntity(
						obsidianApp,
						entityType,
					);
					if (entity) {
						// Refresh the world list after creation
						await fetchWorlds();

						// Open the newly created world
						const worldFile =
							obsidianApp.vault.getAbstractFileByPath(
								`${entity.entityType}/${entity.name}/Overview.md`,
							);
						if (worldFile instanceof TFile) {
							await obsidianApp.workspace
								.getLeaf(true)
								.openFile(worldFile);
						}
					}
				},
			);
			modal.open();
		} else {
			console.error("Application context not found");
		}
	};

	useEffect(() => {
		fetchWorlds();
	}, [obsidianApp]);

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-gray-500">Loading worlds...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 mt-4 bg-red-50 border border-red-200 rounded">
				<p className="text-red-600">Error: {error}</p>
				<p className="mt-2 text-sm text-red-500">
					Please make sure the Dataview plugin is installed and
					enabled.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Your Worlds</h2>
				<button
					onClick={handleCreateWorld}
					className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
				>
					<Plus className="h-4 w-4" />
					Create New World
				</button>
			</div>

			<div className="border-t border-b py-6 my-6">
				<h3 className="text-xl font-bold mb-4">Map Preview</h3>
				<LayerManagerProvider>
					<MapGenerator width={600} height={400} numPoints={500} />
				</LayerManagerProvider>
			</div>

			{worlds.length === 0 ? (
				<div className="border rounded p-6 bg-white shadow">
					<div className="flex flex-col items-center justify-center text-center">
						<Globe className="h-12 w-12 text-gray-400 mb-4" />
						<p className="text-lg font-medium">
							No worlds created yet
						</p>
						<p className="text-sm text-gray-500 mt-2">
							Start by creating your first world!
						</p>
					</div>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{worlds.map((world) => (
						<div
							key={world.file.path}
							className="border rounded bg-white p-4 hover:shadow-lg transition-shadow"
						>
							<div className="mb-4">
								<h3 className="text-lg font-semibold">
									{world.name}
								</h3>
								<p className="text-sm text-gray-500">
									{world.worldType}
								</p>
							</div>
							<p className="text-sm text-gray-600">
								{world.description}
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default WorldList;
