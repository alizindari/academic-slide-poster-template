"""Export speaker notes and timing from the editable HTML deck."""
from pathlib import Path
import html
import re

root = Path(__file__).resolve().parents[1]
source = (root / 'index.html').read_text()
sections = re.findall(r'<section\b([^>]*)>(.*?)</section>', source, re.S)
rows, notes, cumulative, appendix_number = [], [], 0, 0
for index, (attrs, body) in enumerate(sections, 1):
    title = html.unescape(re.search(r'data-title="([^"]+)"', attrs).group(1))
    seconds = re.search(r'data-seconds="(\d+)"', attrs)
    match = re.search(r'<aside class="speaker-notes">(.*?)</aside>', body, re.S)
    text = html.unescape(re.sub(r'<[^>]+>', '', match.group(1))).strip() if match else ''
    if 'appendix-divider' in attrs:
        label = 'Appendix'
    elif 'data-backup' in attrs:
        appendix_number += 1
        label = f'A{appendix_number}'
    else:
        label = str(index)
    if 'data-references' in attrs:
        rows.append(f'| {label} | {title} | n/a | After the conclusion |')
        context = 'Reference page; no speaking time allocated.'
    elif seconds:
        duration = int(seconds.group(1))
        start = cumulative
        cumulative += duration
        window = f'{start//60}:{start%60:02d} to {cumulative//60}:{cumulative%60:02d}'
        rows.append(f'| {label} | {title} | {duration//60}:{duration%60:02d} | {window} |')
        context = f'Planned time: {window}.'
    else:
        context = 'Optional appendix, outside the timed talk.'
    heading = title if label == 'Appendix' else f'{label}. {title}'
    notes.append(f'## {heading}\n\n{context}\n\n{text}\n')

header = f'''# QE speaker notes

Generated from `index.html`. Edit the notes and `data-seconds` values there,
then run `build.sh`. The sample's planned speaking time is
**{cumulative//60}:{cumulative%60:02d}**, excluding the appendix. These are
estimates, not measured delivery times or a universal QE time limit.

Use Right or Space to reveal the next group, and Left to go back. The
presentation PDF has one page per reveal step, while the handout PDF shows
complete slides. Both retain the same logical slide numbers. Include reveal
clicks when rehearsing.

Press **N** in the HTML deck to open notes. They appear on the same screen,
so use them for preparation rather than opening them on the projector.

## Time budget

| Slide | Topic | Time | Cumulative window |
| --- | --- | --- | --- |
'''
(root / 'speaker-notes.md').write_text(header + '\n'.join(rows) + '\n\n' + '\n'.join(notes))
print(f'Updated {root / "speaker-notes.md"}')
