
## Development support


## Pre-requisites

```bash
   sudo apt install jq

   npm i --save-dev typescript@6
   npm i --save-dev webpack webpack-cli terser-webpack-plugin
   npm i --save-dev ts-loader
   npm i --save-dev terser jshint eslint glob

   npm i yargs clear inquirer@8.2.6 fuzzy commander async
   npm i inquirer-command-prompt inquirer-autocomplete-prompt@1

   npm i codemirror
   npm i @codemirror/lang-javascript
   npm i @codemirror/view
   npm i @codemirror/state
   npm i @codemirror/language
```


## Distribution files

* ws_dist/min.external.css
* ws_dist/min.external.js
  * External libraries
* ws_dist/min.sim_all.js
  * hardware model + software model + core (simulation ctrl + UI)
* ws_dist/min.wepsim_i18n.js
  * WepSIM internalization (i18n)
* ws_dist/min.wepsim_core.js
  * WepSIM core
* ws_dist/min.wepsim_webui.js
  * WepSIM Web-based UI
* ws_dist/min.wepsim_node.js
  * WepSIM command-line UI
* ws_dist/min.wepsim_web.js
  * TODO!



