import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			entry: "./src/index.ts",
			fileName: "index",
			name: "svitore-react",
			formats: ["es", "cjs", "umd"],
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
});
