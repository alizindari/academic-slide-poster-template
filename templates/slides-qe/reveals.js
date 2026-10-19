/* Reveal meaningful groups without moving or redrawing the slide content.
 * Each array entry is one screen state, starting at zero. Titles stay visible.
 * Keep labels with their shapes/arrows; original paper plots stay intact.
 * Missing selectors fail the build rather than silently breaking a reveal.
 */
(() => {
  'use strict';
  const at = left => `.diagram-label[style*="left:${left}%"]`;
  const grid = transform => `svg > g[transform="translate(${transform})"]`;
  const plans = {
    2: [
      ['Learning When to Adapt', '.paper-sheet:nth-child(1)'],
      ['LoRA vs. Full Fine-Tuning', '.paper-sheet:nth-child(2)'],
      ['Theory of Adaptation and Retention', '.paper-sheet:nth-child(3)']
    ],
    3: [
      ['Learn from a broad text collection', '.pretrain-corpus'],
      ['Expensive training from scratch', '.pretrain-process'],
      ['A general base with broad abilities', '.pretrain-model'],
      ['Reuse the base for many tasks', '.pretrain-reuse']
    ],
    4: [
      ['Pre-trained knowledge', '.ft-overview-before'],
      ['Continue training on task data', '.ft-overview-training'],
      ['Skills for the task', '.ft-overview-after'],
      ['Why reuse the model', '.ft-overview-benefit']
    ],
    5: [
      ['Introduce the fine-tuning example', '.learning-retention-intro'],
      ['An earlier skill: correct German', '.retention-before'],
      ['Train on code', '.retention-change'],
      ['Coding improves; German can worsen', '.retention-after'],
      ['Define forgetting and cite language-forgetting evidence', '.learning-retention-message', '.slide-citation']
    ],
    7: [
      ['Only new-task data updates the model', '.data-ft-row'],
      ['Evaluate the new skill', '.data-eval-heading', '.data-eval-new'],
      ['Pre-training-domain data evaluates retention', '.data-eval-retention'],
      ['Retention data stays outside the fine-tuning loss', '.data-setting-message']
    ],
    6: [
      ['Many matrices transform token vectors', '.matrix-context-chain'],
      ['Highlight the matrix we will study', '.matrix-focus-mark'],
      ['Label the pre-trained weights and input and output arrows', '.matrix-pretrained-label', '.matrix-local-label'],
      ['Focus on one matrix', '.matrix-focus-heading'],
      ['The pre-trained linear operation', '.matrix-before'],
      ['Learn the correction and state the fine-tuning goal', '.matrix-adapt', '.matrix-extension']
    ],
    8: [
      ['Starting weight matrix', '.projection-intro', grid('228 58'), at('30.94406')],
      ['Add an unrestricted update', grid('664 58'), at('69.05594'), at('50.00000')],
      ['Trainable parameters', '.parameter-summary']
    ],
    9: [
      ['Frozen starting matrix', grid('100 58'), at('19.75524')],
      ['Add the low-rank product', grid('552 58'), grid('776 156'), at('50.69930'), at('78.84615'), at('39.51049'), at('60.48951'), '.projection-intro'],
      ['Trainable parameters', '.parameter-summary']
    ],

    10: [
      ['Learn a shared update from new-task data', '.shared-update-intro'],
      ['The correction is learned to help the new task', '.shared-update-new'],
      ['Desired output for the earlier input', '.shared-update-old'],
      ['Compare with the output after fine-tuning', '.shared-update-old .shared-update-output', '.shared-update-old .shared-update-effect'],
      ['Calculate the squared error on the earlier input', '.shared-update-error']
    ],
    11: [
      ['Make the effective correction depend on the input', '.disel-idea-intro'],
      ['Desired behavior: allow a useful correction', '.idea-desired-label', '.idea-adapt-example'],
      ['Suppress the correction when the original answer should stay', '.idea-preserve-example'],
      ['Learn the correction and when to apply it from new-task data', '.disel-idea-message']
    ],
    12: [
      ['Start with the LoRA correction A B', '.disel-case-bridge'],
      ['Insert the input-dependent gate matrix and define its dimension', '.disel-gate-insert', '.disel-case-dimension'],
      ['For a fine-tuning input, fully open gates recover the LoRA update', '.disel-case-input', '.disel-case-result'],
      ['Illustrate the ideal fully open gates', '.disel-case-diagram']
    ],
    13: [
      ['Show the definition, earlier-input condition, and preserved output together', '.disel-case-bridge'],
      ['Illustrate the ideal fully closed gates', '.disel-case-diagram']
    ],
    14: [
      ['The input-dependent LoRA update', '.disel-method-equation'],
      ['Define the input-dependent gate matrix', '.disel-gate-definition'],
      ['Show the diagonal gate matrix and sigmoid together', '.disel-gate-matrix', '.disel-sigmoid']
    ],
    15: [
      ['Recall how the gate matrix depends on W g, x and b', '.gate-definition-reminder'],
      ['Initialize the gate weights and choose the bias hyperparameter', '.gate-init-rule', '.gate-init-hyperparameter'],
      ['Show the scaled initial update and near-closed gate together', '.gate-init-consequence', '.gate-opening-base', '.gate-opening-start', '.gate-initial-caption'],
      ['Training can open the same gate if useful', '.gate-opening-change', '.gate-learned-caption']
    ],
    16: [
      ['Math results', '.plot', '.result-context'],
      ['Read the scores', '.plot-aside > p:not(.result-context)'],
      ['Takeaway', '.takeaway']
    ],
    17: [
      ['Code results', '.plot', '.result-context'],
      ['Read the scores', '.plot-aside > p:not(.result-context)'],
      ['Takeaway', '.takeaway']
    ],
    18: [
      ['Early layers: read density and highlight the near-open gates', '.slide__content > p', '.gate-early-panel', '.gate-density-note'],
      ['Late layers: compare the near-open gates', '.gate-late-panel'],
      ['Input selectivity', '.grid2 > p:first-child'],
      ['Layer selectivity', '.grid2 > p:nth-child(2)']
    ],
    19: [
      ['Recall the input-dependent LoRA correction', '.disel-recap-columns > article:nth-child(1)'],
      ['Learn from new-task data only', '.disel-recap-columns > article:nth-child(2)'],
      ['Summarize adaptation and retention', '.disel-recap-columns > article:nth-child(3)']
    ],
    20: [
      ['Research question', '.paper-summary-question'],
      ['Full fine-tuning', '.paper-summary-panels > article:first-child'],
      ['LoRA', '.paper-summary-panels > article:nth-child(2)'],
      ['Main finding', '.paper-summary-message']
    ],
    21: [
      ['Research question', '.paper-summary-question'],
      ['Little overlap', '.paper-summary-panels > article:first-child'],
      ['More overlap', '.paper-summary-panels > article:nth-child(2)'],
      ['Main finding', '.paper-summary-message']
    ],
    22: [
      ['Research motivation', '.research-philosophy-intro'],
      ['Adapt only where needed', '.research-principles > article:nth-child(1)'],
      ['Learn across many tasks', '.research-principles > article:nth-child(2)'],
      ['Build useful memory', '.research-principles > article:nth-child(3)']
    ]
  };

  try {
    for (const [id, steps] of Object.entries(plans)) {
      const slide = document.getElementById(id);
      if (!slide || slide.hasAttribute('data-backup')) throw new Error(`Invalid reveal slide ${id}`);
      slide.dataset.stepLabels = JSON.stringify(steps.map(([label]) => label));
      steps.forEach(([label, ...selectors], step) => {
        for (const selector of selectors) {
          const elements = slide.querySelectorAll(selector);
          if (!elements.length) throw new Error(`Slide ${id}, ${label}: no match for ${selector}`);
          for (const element of elements) {
            if (element.hasAttribute('data-step')) throw new Error(`Slide ${id}: duplicate reveal target ${selector}`);
            element.dataset.step = step;
          }
        }
      });
      for (const element of slide.querySelectorAll('[data-step]')) {
        const parent = element.parentElement.closest('[data-step]');
        if (parent && Number(parent.dataset.step) > Number(element.dataset.step)) {
          throw new Error(`Slide ${id}: a child is revealed before its parent`);
        }
      }
    }
  } catch (error) {
    document.documentElement.dataset.revealError = error.message;
    throw error;
  }
})();
