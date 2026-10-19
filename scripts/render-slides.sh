#!/usr/bin/env sh
set -eu

repo_dir=$(cd "$(dirname "$0")/.." && pwd)
renderer="$repo_dir/shared/slide-system/render-pdf.sh"

cd "$repo_dir"

"$renderer" templates/slides-math/index.html templates/slides-math/slides.pdf
"$renderer" templates/slides-transformer/index.html templates/slides-transformer/slides.pdf
bash templates/slides-qe/build.sh

echo "Rendered every HTML slide deck beside its source."
