import { defineConfig, build, UserConfig } from 'vite';

import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';
import { DynamicPublicDirectory } from 'vite-multiple-assets';
import { visualizer } from 'rollup-plugin-visualizer';
import { copyFileSync, mkdirSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { PreRenderedChunk } from 'rollup';

const rootDir = process.cwd();

function wepsimPostBuildPlugin()
{
    var active = false;
    return {
        name: 'wepsim-post-build',
        async closeBundle()
        {
            if (active) return;
            active = true;
            console.time('[post-build] Done');

            const LANGS = ['es', 'en', 'fr', 'kr', 'ja', 'it', 'pt', 'hi', 'zh_cn', 'ru', 'sv', 'de'];

            // 1. Build Node.js CLI
            console.time('\n[post-build] Building Node.js CLI');
            await build({ configFile: path.resolve(rootDir, 'vite.config.node.ts'), logLevel: 'warn' });

            // 2. Copy i18n help HTML files
            console.timeEnd('\n[post-build] Building Node.js CLI');
            console.time('[post-build] Copying help files');
            mkdirSync('ws_dist/help', { recursive: true });
            for (const l of LANGS)
            {
                copyFileSync('wepsim_i18n/' + l + '/simulator.html', 'ws_dist/help/simulator-' + l + '.html');
                copyFileSync('wepsim_i18n/' + l + '/about.html', 'ws_dist/help/about-' + l + '.html');
            }

            // 3. Merge example sets (jq)
            console.timeEnd('[post-build] Copying help files');
            const execAsync = promisify(exec);
            console.time('[post-build] Merging example sets');
            const mkdir_task = [
                mkdir('ws_dist/repo/examples_set/mips', { recursive: true }),
                mkdir('ws_dist/repo/examples_set/rv32', { recursive: true }),
                mkdir('ws_dist/repo/examples_set/arm', { recursive: true }),
                mkdir('ws_dist/repo/examples_set/z80', { recursive: true }),
                mkdir('ws_dist/repo/examples_set/mips_ocw', { recursive: true }),
                mkdir('ws_dist/repo/examples_set/rv32_ag', { recursive: true }),
            ];
            await Promise.all(mkdir_task);
            var jq = async function (inputs: string[], output: string)
            {
                inputs = inputs.map((value) => ('repo/examples_set/' + value));
                output = 'ws_dist/repo/examples_set/' + output;
                await execAsync("node-jq 'reduce inputs as $i (.; . += $i)' " + inputs.join(' ') + ' > ' + output);
            };

            const jq_tasks = [
                jq(['mips/es_ep.json', 'mips/es_ep_native.json', 'mips/es_ep2.json', 'mips/es_ep2_native.json', 'mips/es_poc.json', 'mips/es_poc_native.json'],
                   'mips/default.json'),
                jq(['mips/es_ep_instructive.json', 'mips/es_poc_instructive.json', 'mips/es_ep2_instructive.json'],
                   'mips/default_instructive.json'),
                jq(['rv32/es_ep.json', 'rv32/es_ep_native.json', 'rv32/es_ep2.json', 'rv32/es_ep2_native.json', 'rv32/es_poc.json', 'rv32/es_poc_native.json', 'rv32/es_rv.json'],
                   'rv32/default.json'),
                jq(['rv32/es_ep_instructive.json', 'rv32/es_poc_instructive.json', 'rv32/es_ep2_instructive.json'],
                   'rv32/default_instructive.json'),
                jq(['arm/es_ep.json', 'arm/es_ep2.json'],
                   'arm/default.json'),
                jq(['z80/es_ep.json', 'z80/es_ep2.json'],
                   'z80/default.json'),
                jq(['mips_ocw/es_ep.json', 'mips_ocw/es_ep2.json'],
                   'mips_ocw/default.json'),
                jq(['rv32_ag/es_ep.json', 'rv32_ag/es_poc.json', 'rv32_ag/es_ep2.json'],
                   'rv32_ag/default.json'),
            ];

            await Promise.all(jq_tasks);

            // 4. Export hardware definitions
            console.timeEnd('[post-build] Merging example sets');
            console.time('[post-build] Exporting hardware definitions');
            const modes = ['ep', 'ep2', 'poc', 'rv', 'rvpipe'];

            const hw_tasks = modes.map(async (mode) =>
            {
                const dirPath = `ws_dist/repo/hardware/${mode}`;
                await mkdir(dirPath, { recursive: true });
                const { stdout } = await execAsync('node ws_dist/wepsim.mjs -a export-hardware -m ' + mode);
                await writeFile(`${dirPath}/hw_def.json`, stdout);
                // console.log(mode, stdout.length);
            });
            await Promise.all(hw_tasks);

            console.timeEnd('[post-build] Exporting hardware definitions');
            console.timeEnd('[post-build] Done');
        },
    };
}

export const vite_config_ts:UserConfig = {
    base:    '/wepsim/',
    resolve: {
        alias: {
            'vue':         'vue/dist/vue.esm.js',
            'jquery-knob': path.resolve(__dirname, 'node_modules/jquery-knob/js/jquery.knob.js'),
        },
    },
    define: {
        global: 'globalThis', // For bootstrap-tokenfield
    },
    plugins: [
        checker({
            typescript: true,
        }),
        eslint({
            include:     ['src/**/*.js', 'src/**/*.vue', 'sim_core/**/*.js', 'sim_hw/**/*.js', 'sim_hw/**/*.ts', 'sim_sw/**/*.js', 'wepsim_core/**/*.js', 'wepsim_web/**/*.js', 'wepsim_i18n/**/*.js'],
            exclude:     ['node_modules/**', 'ws_dist/**', 'external/**', 'repo/**', 'devel/**'],
            emitWarning: true,
            emitError:   true,
            fix:         true,
        }),
        DynamicPublicDirectory([
            {
                input:  'repo/**',
                output: 'repo',
            },
            {
                input:  'images/**',
                output: 'images',
            },
            {
                input:  'docs/**',
                output: 'docs',
            },
        ]),
        wepsimPostBuildPlugin(),
        // Visualizer of chunks
        // visualizer({ open: true, filename: 'ws_dist/stats.html', gzipSize: true }),
    ],
    build: {
        outDir:                'ws_dist',
        emptyOutDir:           true,
        minify:                true,
        chunkSizeWarningLimit: 1000,
        rolldownOptions:       {
            onwarn(warning, warn)
            {
                if (warning.code === 'EVAL') return;
                warn(warning);
            },
            input: {
                main: 'index.html',
            },
            checks: {
                pluginTimings: false,
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: (function (chunkInfo: PreRenderedChunk): string
                {
                    let name = chunkInfo.name;
                    for (const mod of chunkInfo.moduleIds)
                    {
                        if (mod.includes('/node_modules/tone/'))
                        {
                            name = 'vendor-tone'; break;
                        }
                        if (mod.includes('/codemirror-vim/'))
                        {
                            name = 'vendor-codemirror-vim'; break;
                        }
                        if (mod.includes('/codemirror-emacs/'))
                        {
                            name = 'vendor-codemirror-emacs'; break;
                        }
                        if (mod.includes('/vis-network/'))
                        {
                            name = 'vendor-vis-network'; break;
                        }
                    }
                    return 'chunks/' + name + '.js';
                } as any),
                assetFileNames: '[name][extname]',
                codeSplitting:  {
                    includeDependenciesRecursively: false,
                    groups:                         [
                        {
                            name:                           'vendor-codemirror',
                            test:                           /\/@codemirror\//,
                            includeDependenciesRecursively: true,
                            priority:                       30,
                        },
                        {
                            name:                           'vendor-jquery',
                            test:                           /\/jquery[\/\-]|jquery-global/,
                            includeDependenciesRecursively: true,
                            priority:                       20,
                        },
                        {
                            name:                           'vendor-bootstrap',
                            test:                           /\/bootstrap\//,
                            includeDependenciesRecursively: true,
                            priority:                       20,
                        },
                        {
                            name:                           'vendor-vue',
                            test:                           /\/vue\/|\/vuex\//,
                            includeDependenciesRecursively: true,
                            priority:                       20,
                        },
                        {
                            name:     'wepsim_core',
                            test:     /wepsim_core/,
                            priority: 1,
                        },
                        {
                            name:     'wepsim_web',
                            test:     /wepsim_web/,
                            priority: 1,
                        },
                        {
                            name:     'sim_core',
                            test:     /sim_core/,
                            priority: 1,
                        },
                        {
                            name:     'sim_sw',
                            test:     /sim_sw/,
                            priority: 1,
                        },
                    ],
                },
            },
        },
    },
};

export default defineConfig(vite_config_ts);
