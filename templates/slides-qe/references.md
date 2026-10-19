# Sources and figure credits

This template preserves Ali Zindari's QE research content as supplied,
including the brief overview and citation of *Theory of Adaptation and
Retention*. That manuscript is identified as under review in the deck; no
manuscript PDF or public identifier is included for it. Publication-status
labels reflect the supplied presentation, not a live status check.

Full bibliographic records are in [`references.bib`](references.bib). The
references slide is generated from those records with BibTeX.

## Research and background

- Zindari, Jiang, Mulayoff, and Stich: [Learning When to Adapt](https://arxiv.org/abs/2605.19028).
- Zindari, Mulayoff, and Stich: [LoRA vs. Full Fine-Tuning: A Theoretical Perspective](https://arxiv.org/abs/2605.19018).
- Zindari, Mulayoff, Loureiro, and Stich: *Theory of Adaptation and Retention*, supplied manuscript, 2026.
- Devlin et al.: [BERT](https://aclanthology.org/N19-1423/).
- Hu et al.: [LoRA](https://arxiv.org/abs/2106.09685).
- Vu et al.: [Overcoming Catastrophic Forgetting in Zero-Shot Cross-Lingual Generation](https://aclanthology.org/2022.emnlp-main.630/).
- Vaswani et al.: [Attention Is All You Need](https://arxiv.org/abs/1706.03762).
- Xiong et al.: [On Layer Normalization in the Transformer Architecture](https://proceedings.mlr.press/v119/xiong20b.html).
- Ouyang et al.: [Training Language Models to Follow Instructions with Human Feedback](https://proceedings.neurips.cc/paper/2022/hash/b1efde53be364a73914f58805a001731-Abstract-Conference.html).
- Rafailov et al.: [Direct Preference Optimization](https://proceedings.neurips.cc/paper_files/paper/2023/hash/a85b405ed65c6477a4fe8302b5e06ce7-Abstract.html).

Third-party reference PDFs, institutional instructions, and unrelated
presentations are not bundled. The slide links use public source pages where
available. References to supplied manuscripts in the speaker notes describe
the original preparation sources, not files required to build this template.

## Included figure assets

The six displayed SVG assets come from the supplied practical DISeL paper.
Original plot colors, labels, legends, curves, and values are retained. Page
numbers below refer to the source PDF used to prepare the deck and may differ
from other versions. Coordinates are PDF points `(left, top, right, bottom)`.

| Slide | Asset | Source and crop |
| --- | --- | --- |
| 16 | `llama_tradeoff_highlighted.svg` | Fig. 2a, p. 6; `(108, 81, 306, 221)` |
| 17 | `mistral_tradeoff_with_legend_highlighted.svg` | Fig. 2b, p. 6; plot `(311.5, 81, 505, 221)`, shared legend `(129, 147, 213, 201)`, and vertical label `(106.5, 104, 118.5, 184)` |
| 18 | `gate_domains_early.svg`, `gate_domains_late.svg` | Fig. 3, p. 7; early `(108, 79, 244.5, 197)`, late `(381, 79, 505, 197)` |
| A12 | `roberta_tradeoff.svg` | Fig. 1, p. 5; `(108, 80, 505, 241)` |
| A13 | `gate_attention_projections.svg` | Fig. 10, p. 30; first row `(108, 79, 505, 166)` |

The two tradeoff figures add burgundy outlines and DISeL labels as visual
guides, not new results or statistical regions. The code figure repeats the
shared legend and vertical-axis label. The gate slide shows only the early
and late panels, with unfilled highlighting ovals drawn in HTML. Appendix A13
keeps the query, key, value, and output panels; the MLP row is omitted.

All other diagrams are native HTML/SVG illustrations, not measured results.
The code-to-German forgetting example is hypothetical. The gate initialization
slide uses the supplied illustrative setting `W_g = 0`, `b = -3`, which differs
from the reported experiments' initialization; the speaker notes retain that
distinction. The related-paper drawings are conceptual, not manuscript plots.

## Dataset examples and attribution

Complete records, source revisions, and zero-based row indices are retained in
[`data/appendix-examples.json`](data/appendix-examples.json). The supplied records
were retrieved on 29 September 2026. They are dataset examples, not predictions.

| Slide | Dataset | Record |
| --- | --- | --- |
| A6 | [ARC-Easy](https://huggingface.co/datasets/allenai/ai2_arc/viewer/ARC-Easy/test), test | Row 15, `Mercury_SC_401777`, answer B |
| A6 | [WinoGrande](https://huggingface.co/datasets/allenai/winogrande/viewer/winogrande_xl/validation), XL validation | Row 0, answer 2 |
| A7 | [MetaMathQA](https://huggingface.co/datasets/meta-math/MetaMathQA/viewer/default/train), train | Row 9, `GSM_AnsAug`, answer 102 |
| A8 | [MetaMathQA](https://huggingface.co/datasets/meta-math/MetaMathQA/viewer/default/train), train | Row 3, `MATH_AnsAug`, answer 91 |

Credits: ARC, Peter Clark et al./Allen Institute for AI; WinoGrande, Keisuke
Sakaguchi et al./Allen Institute for AI; MetaMathQA, Weihao Yu et al./MetaMath.
The source metadata records [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
for ARC and [MIT](https://opensource.org/license/mit) for MetaMathQA. The retrieved
WinoGrande record has no declared license; only the short example is reproduced.
The dataset excerpts retain their source terms, independently of the template
code's MIT license. Slide typesetting normalizes math and line breaks, expands
the WinoGrande blank visually, and omits the redundant `#### 102` answer marker.

## Template credits

The base typography and slide shell come from this repository's
[visual transformer deck](../slides-transformer/). The outlined takeaway
frames follow the [mathematical deck](../slides-math/). The text font is TeX
Gyre Termes, with KaTeX mathematics. Shared font and KaTeX licenses are retained
under [`shared/slide-system`](../../shared/slide-system/).

Original template code: MIT, © 2026 Ali Zindari. The research figures and
dataset excerpts are credited above and are not relicensed by the code license.
