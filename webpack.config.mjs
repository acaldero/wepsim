
// 10. imports
import * as globPkg from 'glob';
const globSync = globPkg.globSync || globPkg; 

import fs     from 'fs';
import path   from 'path';

import { fileURLToPath } from 'url';
import { minify }        from 'terser';
import TerserPlugin from 'terser-webpack-plugin';


// 20. base variables
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);


// 30. index for wepsim_i18n
const ws_i18n_files = globSync('wepsim_i18n/*/*.js');
const ws_i18n_list  = "import '../../wepsim_i18n/i18n.js';\n" +
                      ws_i18n_files.map(file => `import '../../${file}';`).join('\n');
fs.writeFileSync('./devel/webpack_indexes/min.wepsim_i18n.js', ws_i18n_list);


// 40. Auxiliar function for plugin
async function WepSimPlanarConcatenation ( )
{
    console.log('\n[WepSIM] re-packing as flat file...');

    // 1. Mapping rollup index to final file
    const mapeoCompilacion = [
      { indice: 'min.wepsim_i18n.js',  destino: 'ws_dist/min.wepsim_i18n.js' },
      { indice: 'min.sim_all.js',      destino: 'ws_dist/min.sim_all.js' },
      { indice: 'min.wepsim_webui.js', destino: 'ws_dist/min.wepsim_webui.js' },
      { indice: 'min.wepsim_core.js',  destino: 'ws_dist/min.wepsim_core.js' },
      { indice: 'min.wepsim_web.js',   destino: 'ws_dist/min.wepsim_web.js' },
      { indice: 'min.wepsim_node.js',  destino: 'ws_dist/min.wepsim_node.js' }
    ];

    // 2. Work on each file...
    for (const item of mapeoCompilacion) 
    {
      const { indice, destino } = item;
      const dirIndices = path.resolve('./devel/webpack_indexes');
      const indicePath = path.join(dirIndices, indice);
      
      if (!fs.existsSync(indicePath)) return;
      
      // read index file associated
      const contenidoIndice = fs.readFileSync(indicePath, 'utf-8');
      const regexImports    = /import\s+['"]([^'"]+)['"]/g;
      
      // extract path one by one
      let codigoUnificado = '\n\n';
      let match;
      while ((match = regexImports.exec(contenidoIndice)) !== null)
      {
         const rutaRelativa = match[1];
         const rutaAbsoluta = path.resolve(path.dirname(indicePath), rutaRelativa);
        
         // if it exists then read the file content
         if (fs.existsSync(rutaAbsoluta)) {
             codigoUnificado += `\n/* --- WepSIM file: ${rutaRelativa} --- */\n`;
             codigoUnificado += fs.readFileSync(rutaAbsoluta, 'utf-8') + '\n';
         }
      }

      // 3. If code readed, overwrite bundle
      if (codigoUnificado)
      {
          const rutaDestinoAbsoluta = path.resolve(destino);
          fs.mkdirSync(path.dirname(rutaDestinoAbsoluta), { recursive: true });

          console.log(`[WepSIM] -> minifying ${destino} ...`);
          try {
             const resultadoTerser = await minify(codigoUnificado, {
                  compress: true,
                  mangle:   false,
                  format: {
                     comments: /Copyright/i
                  }
             });

             if (resultadoTerser.code) {
                 codigoUnificado = resultadoTerser.code;
             }
          }
          catch (e) {
             console.error(`[WepSIM] Terser ERROR on ${destino}: `, e.message);
          }

          fs.writeFileSync(rutaDestinoAbsoluta, codigoUnificado, 'utf-8');
          console.log(`[WepSIM] -> ${destino} added...`);
      }
    }
    
    console.log('[WepSIM] Done !.\n');
}


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
      'ws_dist/min.wepsim_core':  './devel/webpack_indexes/min.wepsim_core.js',
      'ws_dist/min.wepsim_web':   './devel/webpack_indexes/min.wepsim_web.js'
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
         apply: (compiler) => { compiler.hooks.afterEmit.tap('WepSimPlanarConcatenationPlugin', WepSimPlanarConcatenation); }
       }
    ]
};

