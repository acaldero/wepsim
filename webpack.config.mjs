
// 10. imports
import fs     from 'fs';
import path   from 'path';
import * as globPkg from 'glob';

import { fileURLToPath } from 'url';
import { minify }        from 'terser';
import TerserPlugin from 'terser-webpack-plugin';


// 20. base variables
const globSync = globPkg.globSync || globPkg; 
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);


// 30. Auxiliar functions
function WepSIM_build_i18n_index ( )
{
     const dirIndexes = path.resolve(__dirname, 'devel/webpack_indexes');
     if (! fs.existsSync(dirIndexes)) {
           fs.mkdirSync(dirIndexes, { recursive: true });
     }

     const ws_i18n_files = globSync('wepsim_i18n/*/*.js');
     const ws_i18n_list  = "import '../../wepsim_i18n/i18n.js';\n" +
                            ws_i18n_files.map(file => `import '../../${file}';`).join('\n');

     fs.writeFileSync('./devel/webpack_indexes/min.wepsim_i18n.js', ws_i18n_list);
}

async function WepSIM_PlanarConcatenation ( )
{
    console.log('\n[WepSIM] re-packing as flat file...');

    // 1. Mapping rollup index to final file
    const mapCompilation = [
      { index: 'min.wepsim_i18n.js',  destination: 'ws_dist/min.wepsim_i18n.js' },
      { index: 'min.sim_all.js',      destination: 'ws_dist/min.sim_all.js' },
      { index: 'min.wepsim_webui.js', destination: 'ws_dist/min.wepsim_webui.js' },
      { index: 'min.wepsim_core.js',  destination: 'ws_dist/min.wepsim_core.js' },
      { index: 'min.wepsim_node.js',  destination: 'ws_dist/min.wepsim_node.js' }
    ];

    // 2. Work on each file...
    for (const item of mapCompilation) 
    {
        const { index, destination } = item;

        const dirIndexes = path.resolve('./devel/webpack_indexes');
        const indexPath  = path.join(dirIndexes, index);
        if (!fs.existsSync(indexPath)) return;
      
        // read index file associated
        const contenidoIndice = fs.readFileSync(indexPath, 'utf-8');
        const regexImports    = /import\s+['"]([^'"]+)['"]/g;
      
        // extract path one by one
        let codigoUnificado = '\n\n';
        let match;
        while ((match = regexImports.exec(contenidoIndice)) !== null)
        {
           const rutaRelativa = match[1];
           const rutaAbsoluta = path.resolve(path.dirname(indexPath), rutaRelativa);
        
           // if it exists then read the file content
           if (fs.existsSync(rutaAbsoluta)) {
               codigoUnificado += `\n/* --- WepSIM file: ${rutaRelativa} --- */\n`;
               codigoUnificado += fs.readFileSync(rutaAbsoluta, 'utf-8') + '\n';
           }
        }

        // 3. If code readed, overwrite bundle
        if (codigoUnificado)
        {
            try
            {
               const outputTerser = await minify(codigoUnificado, {
                    compress: true,
                    mangle:   false,
                    format: {
                       comments: /Copyright/i
                    }
               });

               if (outputTerser.code) {
                   codigoUnificado = outputTerser.code;
               }
            }
            catch (e) {
               console.error(`[WepSIM] Terser ERROR on ${destination}: `, e.message);
            }

            const destinationAbsolutePath = path.resolve(destination);
            fs.mkdirSync(path.dirname(destinationAbsolutePath), { recursive: true });
            fs.writeFileSync(destinationAbsolutePath, codigoUnificado, 'utf-8');

            console.log(`[WepSIM] -> ${destination} added...`);
        }
    }
    
    console.log('[WepSIM] Done !.\n');
}


// 40. pre-processing
WepSIM_build_i18n_index() ;


// 50. export default
export default
{
    // development | production <- minify
    mode: 'development',

    // 30.a multiple entries
    entry: {
      'ws_dist/min.wepsim_i18n':  './devel/webpack_indexes/min.wepsim_i18n.js',
      'ws_dist/min.sim_all':      './devel/webpack_indexes/min.sim_all.js',
      'ws_dist/min.wepsim_webui': './devel/webpack_indexes/min.wepsim_webui.js',
      'ws_dist/min.wepsim_core':  './devel/webpack_indexes/min.wepsim_core.js'
    },

    // 30.b output options
    output: {
      path: path.resolve(__dirname),
      filename: '[name].js',  // [name] will be replace by 'entry:' keys
      scriptType: 'text/javascript',
      devtoolModuleFilenameTemplate: '[resource-path]'
    },

    devtool: 'source-map', // sourcemap: on

    optimization: {
      usedExports: false,
      sideEffects: false,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            mangle: false,
            parse:  { bare_returns: true },
          },
        }),
      ]
    },

    resolve: {
      // try to find at node_modules
      modules: ['node_modules', path.resolve(__dirname)],
      extensions: ['.js', '.json'],

      // Fallbacks if cjs used for node
      fallback: {
        "fs": false,
        "path": false
      }
    },

    // ignore eval()
    ignoreWarnings: [
      {
        module: /min\.wepsim_web\.js/,
        message: /eval/,
      },
      {
        module: /min\.sim_all\.js/,
        message: /eval/,
      }
    ],

    plugins: [
       {
           // afterEmit is executed just after Webpack writes on 'ws_dist'
           apply: (compiler) => {
               compiler.hooks.afterEmit.tap('WepSIM_PlanarConcatenationPlugin',
                                             WepSIM_PlanarConcatenation);
           }
       }
    ]
};

