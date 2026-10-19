"""Generate the references slide from real BibTeX records, using BibTeX itself."""
from pathlib import Path
import re
import shutil
import subprocess
import tempfile

root = Path(__file__).resolve().parents[1]
# The first three numbers match the existing method citation footnotes.
keys = [
    'devlin2019bert', 'hu2022lora', 'zindari2026adapt',
    'zindari2026lora', 'zindari2026retention',
    'ouyang2022instructions', 'rafailov2023dpo',
    'vaswani2017attention', 'xiong2020layernorm',
    'vu2022forgetting',
]
if not shutil.which('bibtex'):
    raise SystemExit('The references slide requires BibTeX (included in TeX Live/MacTeX).')
with tempfile.TemporaryDirectory(prefix='qe-references-') as directory:
    work = Path(directory)
    shutil.copyfile(root / 'references.bib', work / 'references.bib')
    shutil.copyfile(root / 'scripts/slides-html.bst', work / 'slides-html.bst')
    (work / 'references.aux').write_text(
        '\\relax\n\\citation{' + ','.join(keys) + '}\n'
        '\\bibstyle{slides-html}\n\\bibdata{references}\n'
    )
    result = subprocess.run(['bibtex', 'references'], cwd=work,
                            capture_output=True, text=True)
    if result.returncode or 'Warning--' in result.stdout:
        raise SystemExit(result.stdout + result.stderr)
    rendered = (work / 'references.bbl').read_text()

# These records use plain-text titles with BibTeX case-protection braces.
# Author abbreviations are formatted by BibTeX, not split by hand.
rendered = rendered.replace('{', '').replace('}', '').replace('~', ' ')
if '\\' in rendered:
    raise SystemExit('Add an explicit HTML conversion for the TeX command in the bibliography.')
entries = re.findall(r'<article\b.*?</article>', rendered, re.S)
actual = [re.search(r'data-bib-key="([^"]+)"', entry).group(1) for entry in entries]
if actual != keys:
    raise SystemExit(f'Unexpected reference order: {actual}')
columns = []
for heading, items in [('Methods and research', entries[:5]), ('Background', entries[5:])]:
    columns.append('<div class="reference-column"><h2>' + heading + '</h2>\n'
                   + '\n'.join(items) + '\n</div>')
block = ('<!-- BIBLIOGRAPHY:START -->\n'
         '<!-- Generated from references.bib; edit that file, then run build.sh. -->\n'
         '<div class="references-grid">\n' + '\n'.join(columns)
         + '\n</div>\n<!-- BIBLIOGRAPHY:END -->')
path = root / 'index.html'
source, count = re.subn(r'<!-- BIBLIOGRAPHY:START -->.*?<!-- BIBLIOGRAPHY:END -->',
                       lambda _: block, path.read_text(), flags=re.S)
if count != 1:
    raise SystemExit('Expected one bibliography block in index.html.')
path.write_text(source)
print(f'Updated references slide from references.bib ({len(entries)} entries).')
