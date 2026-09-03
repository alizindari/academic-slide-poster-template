#!/usr/bin/env sh
set -eu

if [ "$#" -gt 2 ]; then
  echo "Usage: $0 [path/to/index.html] [path/to/output.pdf]" >&2
  exit 2
fi

input_file=${1:-templates/poster/index.html}
output_file=${2:-$(dirname "$input_file")/poster.pdf}

if [ -n "${CHROME_BIN:-}" ]; then
  chrome_bin=$CHROME_BIN
elif [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
  chrome_bin="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif command -v google-chrome >/dev/null 2>&1; then
  chrome_bin=$(command -v google-chrome)
elif command -v chromium >/dev/null 2>&1; then
  chrome_bin=$(command -v chromium)
elif command -v chromium-browser >/dev/null 2>&1; then
  chrome_bin=$(command -v chromium-browser)
else
  chrome_bin=""
fi

if [ ! -f "$input_file" ]; then
  echo "Input file does not exist: $input_file" >&2
  exit 1
fi

if [ -z "$chrome_bin" ] || [ ! -x "$chrome_bin" ]; then
  echo "Chrome executable not found. Set CHROME_BIN to a Chromium-based browser." >&2
  exit 1
fi

input_dir=$(cd "$(dirname "$input_file")" && pwd)
input_path="$input_dir/$(basename "$input_file")"
mkdir -p "$(dirname "$output_file")"
output_dir=$(cd "$(dirname "$output_file")" && pwd)
output_path="$output_dir/$(basename "$output_file")"

"$chrome_bin" \
  --headless=new \
  --disable-gpu \
  --allow-file-access-from-files \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=5000 \
  --no-pdf-header-footer \
  --print-to-pdf="$output_path" \
  "file://$input_path" >/dev/null 2>&1

echo "$output_path"
