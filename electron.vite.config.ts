import { defineConfig } from 'electron-vite';
import { vite_config_ts } from './vite.config';

export default defineConfig({
    main: {
        build: {
            emptyOutDir:   true,
            outDir:        'ws_dist/electron',
            rollupOptions: {
                input: {
                    main: 'src/electron/main.js',
                },
                output: {
                    format:         'es',
                    entryFileNames: 'main.js',
                },
            },
        },
    },
    preload: {
        build: {
            emptyOutDir:   false,
            outDir:        'ws_dist/electron',
            rollupOptions: {
                input: {
                    preload: 'src/electron/preload.js',
                },
                output: {
                    format:         'cjs',
                    entryFileNames: 'preload.js',
                },
            },
        },
    },
    renderer: {
        root:  '.',
        ...vite_config_ts,
        build: {
            ...vite_config_ts.build,
            emptyOutDir: false,
        },
    },
});
