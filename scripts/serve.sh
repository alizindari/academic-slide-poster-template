#!/usr/bin/env sh
set -eu

repo_dir=$(cd "$(dirname "$0")/.." && pwd)
port=${PORT:-8000}

echo "Serving http://localhost:$port"
cd "$repo_dir"
python3 -m http.server "$port"
