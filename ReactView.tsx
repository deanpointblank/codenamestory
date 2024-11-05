import React, { useContext } from "react";
import { AppContext } from "./main";
import WorldList from "./src/Entities/World/WorldList";

export const ReactView: React.FC = () => {
	const obsidianApp = useContext(AppContext);

	return (
		<>
			<div className="p-6">
				<h1
					className="text-3xl font-bold mb-6"
					role="heading"
					aria-label="world-building dashboard"
				>
					World-Building Dashboard
				</h1>
				{obsidianApp ? (
					<WorldList />
				) : (
					<p className="text-red-500">
						Error: Application context not found
					</p>
				)}
			</div>
		</>
	);
};
