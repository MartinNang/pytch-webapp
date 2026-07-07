#!/bin/bash -e

mydir="$(dirname "$0")"
WEBAPP_ROOT="$(cd "$mydir" && git rev-parse --show-toplevel)"
TOPLEVEL_ROOT="$(cd "$mydir" && git rev-parse --show-superproject-working-tree)"

if [ -z "$TOPLEVEL_ROOT" ]; then
    1>&2 echo Directory "$mydir" seemingly not part of submodule
    exit 1
fi

CONTENT_REPO_SYMLINK=pytch-demo-catalogue-content
BUILD_TOOL_REPO_SYMLINK=pytch-demo-catalogue-build-tool

if [ ! -L "$TOPLEVEL_ROOT"/"$CONTENT_REPO_SYMLINK" ] \
       || [ ! -L "$TOPLEVEL_ROOT"/"$BUILD_TOOL_REPO_SYMLINK" ]; then
    1>&2 echo Problem with at least one symlink:
    1>&2 echo pytch-demo-catalogue-content
    1>&2 echo pytch-demo-catalogue-build-tool
    exit 1
fi

DIST_DIR="$WEBAPP_ROOT"/cypress/fixtures/demo-catalogue
REPO_DIR=$(mktemp -d)

BUILD_TOOL_ROOT="$TOPLEVEL_ROOT"/"$BUILD_TOOL_REPO_SYMLINK"/build-tool
poetry -P "$BUILD_TOOL_ROOT" run \
       build-test-repo --dist="$DIST_DIR" --start-ref=catalogue "$REPO_DIR"

rm -rf "$REPO_DIR"
