import { defineConfig, build } from 'vite';

import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';
import { DynamicPublicDirectory } from 'vite-multiple-assets';
import { visualizer } from 'rollup-plugin-visualizer';
import { copyFileSync, mkdirSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const rootDir = process.cwd();

function wepsimPostBuildPlugin() {
    var active = false;
    return {
        name: 'wepsim-post-build',
        async closeBundle() {
            if (active) return;
            active = true;

            const LANGS = ['es', 'en', 'fr', 'kr', 'ja', 'it', 'pt', 'hi', 'zh_cn', 'ru', 'sv', 'de'];

            // 1. Build Node.js CLI
            console.log('\n  [post-build] Building Node.js CLI...');
            await build({ configFile: path.resolve(rootDir, 'vite.config.node.ts'), logLevel: 'warn' });

            // 2. Copy i18n help HTML files
            console.log('  [post-build] Copying help files...');
            mkdirSync('ws_dist/help', { recursive: true });
            for (const l of LANGS) {
                copyFileSync('wepsim_i18n/' + l + '/simulator.html', 'ws_dist/help/simulator-' + l + '.html');
                copyFileSync('wepsim_i18n/' + l + '/about.html', 'ws_dist/help/about-' + l + '.html');
            }

            // 3. Merge example sets (jq)
            console.log('  [post-build] Merging example sets...');
            var jq = function (inputs: string[], output: string) {
                execSync(
                    "jq 'reduce inputs as $i (.; . += $i)' " + inputs.join(' ') + ' > ' + output,
                    { shell: 'true', stdio: 'inherit' }
                );
            };
            var JR = function (path: string): string { return 'repo/examples_set/' + path; };
            var WD = function (path: string): string { return 'ws_dist/repo/examples_set/' + path; };

            jq([JR('mips/es_ep.json'),
            JR('mips/es_ep_native.json'),
            JR('mips/es_ep2.json'),
            JR('mips/es_ep2_native.json'),
            JR('mips/es_poc.json'),
            JR('mips/es_poc_native.json'),],
                WD('mips/default.json'));

            jq([JR('mips/es_ep_instructive.json'),
            JR('mips/es_poc_instructive.json'),
            JR('mips/es_ep2_instructive.json')],
                WD('mips/default_instructive.json'));

            jq([JR('rv32/es_ep.json'),
            JR('rv32/es_ep_native.json'),
            JR('rv32/es_ep2.json'),
            JR('rv32/es_ep2_native.json'),
            JR('rv32/es_poc.json'),
            JR('rv32/es_poc_native.json'),
            JR('rv32/es_rv.json')],
                WD('rv32/default.json'));

            jq([JR('rv32/es_ep_instructive.json'),
            JR('rv32/es_poc_instructive.json'),
            JR('rv32/es_ep2_instructive.json')],
                WD('rv32/default_instructive.json'));

            jq([JR('arm/es_ep.json'),
            JR('arm/es_ep2.json')],
                WD('arm/default.json'));

            jq([JR('z80/es_ep.json'),
            JR('z80/es_ep2.json')],
                WD('z80/default.json'));

            jq([JR('mips_ocw/es_ep.json'),
            JR('mips_ocw/es_ep2.json')],
                WD('mips_ocw/default.json'));

            jq([JR('rv32_ag/es_ep.json'),
            JR('rv32_ag/es_poc.json'),
            JR('rv32_ag/es_ep2.json')],
                WD('rv32_ag/default.json'));

            // 4. Export hardware definitions
            console.log('  [post-build] Exporting hardware definitions...');
            for (var mode of ['ep', 'ep2', 'poc', 'rv', 'rvpipe']) {
                mkdirSync('ws_dist/repo/hardware/' + mode, { recursive: true });
                var out = execSync(
                    'node ws_dist/wepsim.mjs -a export-hardware -m ' + mode,
                    { encoding: 'utf-8', shell: 'true' }
                );
                writeFileSync('ws_dist/repo/hardware/' + mode + '/hw_def.json', out);
            }

            console.log('  [post-build] Done.\n');
        }
    };
}

export default defineConfig({
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            'jquery-knob': path.resolve(__dirname, 'node_modules/jquery-knob/js/jquery.knob.js'),
        },
    },
    plugins: [
        checker({
            typescript: true,
        }),
        eslint({
            include: ['src/**/*.js', 'src/**/*.vue', 'sim_core/**/*.js', 'sim_hw/**/*.js', 'sim_sw/**/*.js', 'wepsim_core/**/*.js', 'wepsim_web/**/*.js', 'wepsim_i18n/**/*.js'],
            exclude: ['node_modules/**', 'ws_dist/**', 'external/**', 'sim_hw/ts_out/**'],
            emitWarning: true,
            emitError: true,
        }),
        DynamicPublicDirectory([
            {
                input: "repo/**",
                output: "repo",
            },
            {
                input: "images/**",
                output: "images",
            },
            {
                input: "docs/**",
                output: "docs",
            },
        ]),
        wepsimPostBuildPlugin(),
        // visualizer({ open: true, filename: 'dist/stats.html' }),
    ],
    build: {
        outDir: 'ws_dist',
        emptyOutDir: true,
        minify: true,
        cssCodeSplit: false,
        rolldownOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'EVAL') return;
                warn(warning);
            },
            input: {
                main: 'index.html', // Nombre estándar 'main' en lugar de 'index'
            },
            checks: {
                pluginTimings: false,
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: 'chunks/[name].js',
                assetFileNames: '[name][extname]',
                codeSplitting: {
                    includeDependenciesRecursively: false,
                    groups: [{
                        name(id) {
                            if (id.includes('node_modules')) {
                                if (id.includes('/tone/')) return 'vendor-tone';
                                if (id.includes('/codemirror/')) return 'vendor-codemirror';
                                if (id.includes('/jquery') ||
                                    id.includes('/bootstrap-tokenfield/') ||
                                    id.includes('/dropify/')) return 'vendor-jquery';
                                if (id.includes('/bootstrap/')) return 'vendor-bootstrap';
                                if (id.includes('/vue/') || id.includes('/vuex/')) return 'vendor-vue';
                                return 'vendor';
                            }
                            if (id.includes('wepsim_i18n')) {
                                const parts = path.dirname(id).split(path.sep);
                                const idx = parts.lastIndexOf('wepsim_i18n');
                                if (idx >= 0 && idx + 1 < parts.length) return 'wepsim_i18n-' + parts[idx + 1];
                                return 'wepsim_i18n';
                            }
                            const dirs = ['wepsim_core', 'wepsim_web', 'sim_core', 'sim_hw', 'sim_sw'];
                            for (const dir of dirs) {
                                if (id.includes(dir)) return dir;
                            }
                            return null;
                        },
                    }],
                },
            },
        },
    },
});
