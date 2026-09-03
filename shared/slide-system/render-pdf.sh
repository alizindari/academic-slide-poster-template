#!/bin/sh
set -eu

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  echo "Usage: $0 path/to/index.html [path/to/output.pdf]" >&2
  exit 2
fi

input_file=$1
output_file=${2:-$(dirname "$input_file")/slides.pdf}

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

if ! command -v pdfunite >/dev/null 2>&1; then
  echo "pdfunite was not found. Install Poppler and try again." >&2
  exit 1
fi

input_dir=$(cd "$(dirname "$input_file")" && pwd)
input_path="$input_dir/$(basename "$input_file")"
mkdir -p "$(dirname "$output_file")"
output_dir=$(cd "$(dirname "$output_file")" && pwd)
output_path="$output_dir/$(basename "$output_file")"
page_count=$(grep -c '<section class="slide' "$input_path")
render_dir=$(mktemp -d "${TMPDIR:-/tmp}/html-slides.XXXXXX")

cleanup() {
  rm -rf "$render_dir"
}
trap cleanup EXIT HUP INT TERM

page=1
while [ "$page" -le "$page_count" ]; do
  page_name=$(printf "slide-%03d.pdf" "$page")
  "$chrome_bin" \
    --headless=new \
    --disable-gpu \
    --allow-file-access-from-files \
    --virtual-time-budget=1000 \
    --no-pdf-header-footer \
    --print-to-pdf="$render_dir/$page_name" \
    "file://$input_path?print-slide=$page" >/dev/null 2>&1
  page=$((page + 1))
done

pdfunite "$render_dir"/slide-*.pdf "$render_dir/combined.pdf"
cp "$render_dir/combined.pdf" "$output_path"

echo "$output_path"
