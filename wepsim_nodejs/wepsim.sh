#!/bin/bash

pushd .

DIR="$(cd "$(dirname "$0")" && pwd)"
cd $DIR
node "./wepsim.mjs" "$@"

popd

