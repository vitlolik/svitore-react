/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [
		react(),
		dts({
			exclude: ["demo"],
			rollupTypes: true,
		}),
	],
	build: {
		lib: {
			entry: "./src/index.ts",
			fileName: "index",
			formats: ["es"],
		},
		rollupOptions: {
			external: ["react", "svitore"],
			output: {
				globals: {
					react: "React",
					svitore: "svitore",
				},
			},
		},
	},
	test: {
		environment: "jsdom",
	},
});
