#!/bin/sh
set -e


#*
#*  Copyright 2015-2026 The WepSIM team (see docs/WEPSIM-TEAM.md)
#*
#*  This file is part of WepSIM.
#*
#*  WepSIM is free software: you can redistribute it and/or modify
#*  it under the terms of the GNU Lesser General Public License as published by
#*  the Free Software Foundation, either version 3 of the License, or
#*  (at your option) any later version.
#*
#*  WepSIM is distributed in the hope that it will be useful,
#*  but WITHOUT ANY WARRANTY; without even the implied warranty of
#*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#*  GNU Lesser General Public License for more details.
#*
#*  You should have received a copy of the GNU Lesser General Public License
#*  along with WepSIM.  If not, see <http://www.gnu.org/licenses/>.
#*


# welcome
echo ""
echo "  WepSIM packer"
echo " ---------------"
echo ""


# arguments
while getopts 'vdh' opt; do
  case "$opt" in
    v)
      echo "  getopts: processing verbose..."
      echo ""
      set -x
      ;;

    d)
      echo "  Please install dependencies first by using:"
      echo ""
      echo "   sudo apt install jq"
      echo "   sudo npm install -g typescript@6"
      echo ""
      echo "   npm i terser jshint eslint"
      echo "   npm i webpack webpack-cli terser-webpack-plugin"
      echo ""
      echo "   npm i yargs clear inquirer@8.2.6 fuzzy commander async"
      echo "   npm i inquirer-command-prompt inquirer-autocomplete-prompt@1"
      echo ""
      echo "   npm i codemirror @codemirror/lang-javascript"
      echo "   npm i codemirror @codemirror/view";
      echo "   npm i codemirror @codemirror/state";
      echo "   npm i codemirror @codemirror/language";
      echo ""
      exit
      ;;

    ?|h)
      echo "  Usage: $(basename $0) [-v] [-d]"
      echo ""
      exit 1
      ;;
  esac
done
shift "$(($OPTIND -1))"


# install npm dependencies
echo "  Step for npm dependencies to install/update:"
npm install
echo "  Done."
echo ""


# TypeScript files
echo "  Step for TypeScript:"
tsc -p ./tsconfig.json || { echo "ERROR: TypeScript compilation failed"; exit 1; }
echo "  Done."
echo ""


# Build the initial directory tree
echo "  Step for packing:"
echo "  * ws_dist"
                    mkdir -p ws_dist
                    touch    ws_dist/index.html
                    mkdir -p ws_dist/external
                    touch    ws_dist/external/index.html
cp external/jquery.min.js    ws_dist/external
                    mkdir -p ws_dist/help
                    touch    ws_dist/help/index.html


# # pre-bundle
# echo "  Step for rollup:"
# echo "  * codemirror6"
# node_modules/.bin/rollup -c external/codemirror6/rollup.config.mjs
# terser -o external/codemirror6/min.codemirror.js external/codemirror6/codemirror.bundle.js
# rm -fr external/codemirror6/codemirror.bundle.js
# echo "  Done."
# echo ""


# Build ws_dist/min.*
echo "  Step for webpack:"
npm run wp


# Add resources to ws_dist/
echo "  * ws_dist/help/..."
for LANG in es en fr kr ja it pt hi zh_cn ru sv de; do
cp  wepsim_i18n/$LANG/simulator.html ws_dist/help/simulator-"$LANG".html
cp  wepsim_i18n/$LANG/about.html     ws_dist/help/about-"$LANG".html
done


#  (1/2) WepSIM web engine
cat ws_dist/min.sim_all.js \
    ws_dist/min.wepsim_i18n.js \
    ws_dist/min.wepsim_core.js \
    ws_dist/min.wepsim_webui.js   > ws_dist/wepsim_web.js
terser -o ws_dist/min.wepsim_web.js ws_dist/wepsim_web.js
rm -fr ws_dist/wepsim_web.js

#  (2/2) WepSIM nodejs engine
echo "  * ws_dist/min.wepsim_node.js"
cat wepsim_nodejs/wepsim_node_adapt.js \
    ws_dist/min.sim_all.js \
    ws_dist/min.wepsim_i18n.js \
    ws_dist/min.wepsim_core.js \
    \
    wepsim_nodejs/wepsim_node_core.js \
    wepsim_nodejs/wepsim_node_action.js > ws_dist/min.wepsim_node.js


#  external
echo "  * ws_dist/min.external.js"
cat external/vue/vue.min.js \
    external/vue/vuex.min.js \
    external/popper.min.js \
    external/bootstrap/bootstrap.min.js \
    external/bootbox/bootbox.all.min.js \
    external/tone.min.js \
    external/codemirror/codemirror.js \
    external/codemirror/mode/javascript/javascript.js \
    external/codemirror/mode/gas/gas.js \
    external/codemirror/keymap/sublime.js \
    external/codemirror/keymap/emacs.js \
    external/codemirror/keymap/vim.js \
    external/codemirror/addon/edit/matchbrackets.js \
    external/codemirror/addon/fold/foldcode.js \
    external/codemirror/addon/fold/foldgutter.js \
    external/codemirror/addon/fold/brace-fold.js \
    external/codemirror/addon/fold/xml-fold.js \
    external/codemirror/addon/fold/comment-fold.js \
    external/codemirror/addon/fold/indent-fold.js \
    external/codemirror/addon/fold/markdown-fold.js \
    external/codemirror/addon/hint/show-hint.js \
    external/codemirror/addon/runmode/colorize.js \
    external/codemirror/addon/comment/comment.js \
    external/codemirror/addon/comment/continuecomment.js \
    external/codemirror/addon/search/jump-to-line.js \
    external/codemirror/addon/search/searchcursor.js \
    external/codemirror/addon/search/search.js \
    external/codemirror/addon/dialog/dialog.js \
    external/jquery.knob.min.js \
    external/vis/vis-network.min.js \
    external/async.min.js \
    external/compress/lz-string.min.js \
    external/qrcode/qrcode.min.js \
    external/bootstrap-tokenfield.js \
    external/introjs/introjs.min.js \
    external/speech-input.js \
    external/annyang.min.js \
    external/speechkitt/speechkitt.min.js \
    external/dropify/dropify.min.js | grep -v sourceMappingURL > ws_dist/external.js
terser --comments -o ws_dist/min.external.js ws_dist/external.js
rm -fr ws_dist/external.js


echo "  * ws_dist/min.external.css"
cat external/bootstrap/bootstrap.min.css \
    external/codemirror/codemirror.css \
    external/codemirror/theme/blackboard.css \
    external/codemirror/theme/eclipse.css \
    external/codemirror/theme/cobalt.css \
    external/codemirror/theme/idea.css \
    external/codemirror/theme/the-matrix.css \
    external/codemirror/theme/neat.css \
    external/codemirror/theme/abbott.css \
    external/codemirror/theme/mdn-like.css \
    external/codemirror/theme/duotone-light.css \
    external/codemirror/theme/erlang-dark.css \
    external/codemirror/addon/fold/foldgutter.css \
    external/codemirror/addon/hint/show-hint.css \
    external/codemirror/addon/dialog/dialog.css \
    external/vis/vis-network.min.css \
    external/bootstrap-tokenfield.css \
    external/introjs/introjs.min.css \
    external/speech-input.css \
    external/dropify/dropify.min.css \
    external/css-tricks.css | grep -v sourceMappingURL > ws_dist/min.external.css


echo "  * ws_dist/external/..."
cp    -a external/fontawesome           ws_dist/external
                                  touch ws_dist/external/fontawesome/index.html
cp    -a external/dropify               ws_dist/external/
                                  touch ws_dist/external/dropify/index.html
cp    -a external/speechkitt            ws_dist/external/
                                  touch ws_dist/external/speechkitt/index.html
cp    -a external/cordova.js            ws_dist/external/cordova.js

### default available examples
# MIPS
DEFAULT_EXAMPLE_SET_P1="repo/examples_set/mips/es_ep.json  repo/examples_set/mips/es_ep_native.json"
DEFAULT_EXAMPLE_SET_P2="repo/examples_set/mips/es_ep2.json repo/examples_set/mips/es_ep2_native.json"
DEFAULT_EXAMPLE_SET_P3="repo/examples_set/mips/es_poc.json repo/examples_set/mips/es_poc_native.json"
DEFAULT_EXAMPLE_SET="$DEFAULT_EXAMPLE_SET_P1 $DEFAULT_EXAMPLE_SET_P2 $DEFAULT_EXAMPLE_SET_P3"
jq 'reduce inputs as $i (.; . += $i)' $DEFAULT_EXAMPLE_SET > repo/examples_set/mips/default.json

# MIPS instructive
DEFAULT_EXAMPLE_SET="repo/examples_set/mips/es_ep_instructive.json repo/examples_set/mips/es_poc_instructive.json     repo/examples_set/mips/es_ep2_instructive.json"
jq 'reduce inputs as $i (.; . += $i)' $DEFAULT_EXAMPLE_SET > repo/examples_set/mips/default_instructive.json

# RV32
DEFAULT_EXAMPLE_SET_P1="repo/examples_set/rv32/es_ep.json   repo/examples_set/rv32/es_ep_native.json"
DEFAULT_EXAMPLE_SET_P2="repo/examples_set/rv32/es_ep2.json  repo/examples_set/rv32/es_ep2_native.json"
DEFAULT_EXAMPLE_SET_P3="repo/examples_set/rv32/es_poc.json  repo/examples_set/rv32/es_poc_native.json"
DEFAULT_EXAMPLE_SET_P4="repo/examples_set/rv32/es_rv.json"
DEFAULT_EXAMPLE_SET_P5="repo/examples_set/rv32/es_rvpipe.json"
DEFAULT_EXAMPLE_SET="$DEFAULT_EXAMPLE_SET_P1 $DEFAULT_EXAMPLE_SET_P2 $DEFAULT_EXAMPLE_SET_P3 $DEFAULT_EXAMPLE_SET_P4 $DEFAULT_EXAMPLE_SET_P5"
jq 'reduce inputs as $i (.; . += $i)' $DEFAULT_EXAMPLE_SET > repo/examples_set/rv32/default.json

# RV32 instructive
DEFAULT_EXAMPLE_SET="repo/examples_set/rv32/es_ep_instructive.json repo/examples_set/rv32/es_poc_instructive.json     repo/examples_set/rv32/es_ep2_instructive.json"
jq 'reduce inputs as $i (.; . += $i)' $DEFAULT_EXAMPLE_SET > repo/examples_set/rv32/default_instructive.json

# ARM
DEFAULT_EXAMPLE_SET="repo/examples_set/arm/es_ep.json          repo/examples_set/arm/es_ep2.json"
jq 'reduce inputs as $i (.; . += $i)' $DEFAULT_EXAMPLE_SET > repo/examples_set/arm/default.json

# Z80
DEFAULT_EXAMPLE_SET="repo/examples_set/z80/es_ep.json          repo/examples_set/z80/es_ep2.json"
jq 'reduce inputs as $i (.; . += $i)' $DEFAULT_EXAMPLE_SET > repo/examples_set/z80/default.json

# OpenCourseWare
DEFAULT_EXAMPLE_SET="repo/examples_set/mips_ocw/es_ep.json     repo/examples_set/mips_ocw/es_ep2.json"
jq 'reduce inputs as $i (.; . += $i)' $DEFAULT_EXAMPLE_SET > repo/examples_set/mips_ocw/default.json

# Aula Global (UC3M)
DEFAULT_EXAMPLE_SET="repo/examples_set/rv32_ag/es_ep.json repo/examples_set/rv32_ag/es_poc.json       repo/examples_set/rv32_ag/es_ep2.json"
jq 'reduce inputs as $i (.; . += $i)' $DEFAULT_EXAMPLE_SET > repo/examples_set/rv32_ag/default.json


#  examples
echo "  * ws_dist/repo/..."
cp -a repo    ws_dist/

#  docs
echo "  * ws_dist/docs/..."
cp -a docs    ws_dist/

#  images
echo "  * ws_dist/images/..."
cp -a images  ws_dist/

#  user interface
echo "  * ws_dist/*.html"
cp   wepsim_web/wepsim_web_classic.html   ws_dist/index.html
cp   wepsim_web/wepsim_web_classic.html   ws_dist/wepsim-classic.html
cp   wepsim_web/wepsim_web_compact.html   ws_dist/wepsim-compact.html
cp   wepsim_web/wepsim_web_null.html      ws_dist/wepsim-null.html
cp   wepsim_web/wepsim_web_pwa.js         ws_dist/min.wepsim_web_pwa.js

echo "  * ws_dist/*.sh"
cp   docs/manifest.webapp         ws_dist/
cp wepsim_nodejs/wepsim.sh        ws_dist/
chmod a+x ws_dist/*.sh

#  json: update processors
./ws_dist/wepsim.sh -a export-hardware -m ep  > ws_dist/repo/hardware/ep/hw_def.json
./ws_dist/wepsim.sh -a export-hardware -m ep2 > ws_dist/repo/hardware/ep2/hw_def.json
./ws_dist/wepsim.sh -a export-hardware -m poc > ws_dist/repo/hardware/poc/hw_def.json
./ws_dist/wepsim.sh -a export-hardware -m rv  > ws_dist/repo/hardware/rv/hw_def.json

# the end
echo ""
echo "  WepSIM packed in ws_dist (if no error was shown)."

