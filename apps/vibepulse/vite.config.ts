import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
	plugins: [sveltekit()],

	// Prevent vite from obscuring Rust errors
	clearScreen: false,

	server: {
		// Tauri expects a fixed port, fail if that port is not available
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421
				}
			: undefined,
		watch: {
			// Tell vite to ignore watching `src-tauri`
			ignored: ['**/src-tauri/**']
		}
	},

	// The current package.json `envPrefix` config is the default for Tauri apps.
	envPrefix: ['VITE_', 'TAURI_ENV_*']
});
