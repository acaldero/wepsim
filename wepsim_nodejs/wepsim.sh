#!/bin/bash

pushd . >& /dev/null

DIR="$(cd "$(dirname "$0")" && pwd)"
cd $DIR
#node "./wepsim.mjs" "$@"
bun run "./wepsim.js" "$@"

popd >& /dev/null

