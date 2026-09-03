#!/usr/bin/env sh
set -eu

repo_dir=$(cd "$(dirname "$0")/.." && pwd)
cd "$repo_dir"

./scripts/render-slides.sh
./scripts/render-poster.sh templates/poster/index.html templates/poster/poster.pdf
./scripts/render-poster.sh examples/poster-disel/index.html examples/poster-disel/poster.pdf
./scripts/render-poster.sh examples/poster-lora/index.html examples/poster-lora/poster.pdf

echo "Rendered every poster and slide PDF beside its source."
