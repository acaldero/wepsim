import { defineConfig } from 'vite';
import path from 'path';
import eslint from 'vite-plugin-eslint';

const rootDir = process.cwd();
const webStubPath = path.resolve(rootDir, 'wepsim_nodejs/web_stub.js');
const jqStubPath = path.resolve(rootDir, 'wepsim_nodejs/jquery_stub.js');
const introStubPath = path.resolve(rootDir, 'wepsim_nodejs/intro_stub.js');

export default defineConfig({
    plugins: [eslint({
        exclude: ['**.ts'],
    }
    )],
    resolve: {
        alias: [
            { find: /^jquery$/, replacement: jqStubPath },
            { find: /^intro\.js$/, replacement: introStubPath },
            { find: /^bootstrap$/, replacement: webStubPath },
            { find: /^bootbox$/, replacement: webStubPath },
            { find: /^bootstrap-tokenfield$/, replacement: webStubPath },
            { find: /^jquery-knob$/, replacement: webStubPath },
            { find: /^dropify$/, replacement: webStubPath },
            { find: /^speechkitt$/, replacement: webStubPath },
            { find: /^annyang$/, replacement: webStubPath },
            { find: /^tone$/, replacement: webStubPath },
            { find: /^.*[\\/]wepsim_web[\\/].+$/, replacement: webStubPath },
        ],
    },
    build: {
        outDir: 'ws_dist',
        emptyOutDir: false,
        target: 'node24',
        rolldownOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'EVAL') return;
                warn(warning);
            },
            input: {
                'wepsim': 'src/entries/node-cli.js',
            },
            output: {
                entryFileNames: '[name].mjs',
                chunkFileNames: 'chunks/[name].mjs',
                format: 'es',
                preserveModules: false,
            },
            external: ['fs', 'path', 'perf_hooks', 'os'],
        },
        minify: true,
        ssr: true,
    },
});
