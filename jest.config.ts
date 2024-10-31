import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
	clearMocks: true,
	collectCoverage: true,

	preset: "ts-jest",
	testEnvironment: "jsdom",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
		"^.+\\.(js|jsx)$": "babel-jest",
	},
	transformIgnorePatterns: [
		"/node_modules/(?!(d3-delaunay|d3-path|delaunator|robust-predicates)/)",
	],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
	testMatch: [
		"**/__tests__/**/*.[jt]s?(x)",
		"**/?(*.)+(spec|test).[jt]s?(x)",
	],
};

export default config;
