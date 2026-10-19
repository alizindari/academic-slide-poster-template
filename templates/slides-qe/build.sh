#!/usr/bin/env bash
set -euo pipefail
slide_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
python3 "$slide_dir/scripts/export-references.py"
node "$slide_dir/scripts/render.mjs" "$@"
python3 "$slide_dir/scripts/export-notes.py"
