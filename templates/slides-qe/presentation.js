/* Presentation conveniences; the template runtime owns slide navigation. */
(() => {
  const overlay = document.querySelector('.notes-overlay');
  function showNotes() {
    const slide = document.querySelector('.slide.is-active');
    const notes = slide.querySelector('.speaker-notes');
    overlay.replaceChildren();
    const title = document.createElement('h2');
    title.textContent = slide.dataset.title;
    const timing = document.createElement('p');
    timing.className = 'note-time';
    const seconds = Number(slide.dataset.seconds);
    const state = window.slideDeck.state();
    const labels = JSON.parse(slide.dataset.stepLabels || '["Full slide"]');
    const timingLabel = seconds ? `Planned time: ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}` : slide.hasAttribute('data-backup') ? 'Appendix' : 'References';
    timing.textContent = `${timingLabel} · Step ${state.step + 1}/${state.steps}: ${labels[state.step]} · N or Escape closes notes`;
    const text = document.createElement('p');
    text.textContent = notes?.textContent || '';
    overlay.append(title, timing, text);
  }
  document.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key.toLowerCase() === 'n') {
      showNotes();
      overlay.classList.toggle('is-open');
    } else if (event.key === 'Escape') {
      overlay.classList.remove('is-open');
    } else if (event.key.toLowerCase() === 'f') {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => {});
    } else if (event.key.toLowerCase() === 'b') {
      const backup = document.querySelector('.slide[data-backup]');
      if (backup) location.hash = '#' + backup.id;
    }
  });
  window.addEventListener('slidechange', () => {
    if (overlay.classList.contains('is-open')) showNotes();
  });
})();
