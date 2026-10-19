(function () {
  "use strict";

  const deck = document.querySelector("[data-slide-deck]");
  if (!deck) return;

  const slides = Array.from(deck.querySelectorAll(".slide"));
  const total = slides.length;
  const printSlide = Number(new URLSearchParams(location.search).get("print-slide"));
  const requestedIndex = Number.isInteger(printSlide) && printSlide >= 1 && printSlide <= total
    ? printSlide - 1
    : Number(location.hash.slice(1)) - 1 || 0;
  let index = Math.max(0, Math.min(total - 1, requestedIndex));
  let step = 0;
  const stepCount = slide => JSON.parse(slide.dataset.stepLabels || '["Full slide"]').length;

  function reveal(slide, nextStep) {
    slide.querySelectorAll('[data-step]').forEach(element => {
      element.classList.toggle('reveal-hidden', Number(element.dataset.step) > nextStep);
    });
  }

  if (Number.isInteger(printSlide) && printSlide >= 1 && printSlide <= total) {
    document.body.classList.add("single-slide-print");
  }

  function renderMath() {
    if (typeof window.renderMathInElement !== "function") return;
    window.renderMathInElement(deck, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      macros: {
        "\\mat": "\\mathbf{#1}",
        "\\vect": "\\mathbf{#1}"
      },
      throwOnError: false,
      strict: false
    });
  }

  function fitDeck() {
    const scale = Math.min(window.innerWidth / 1280, window.innerHeight / 720);
    document.documentElement.style.setProperty("--deck-scale", String(scale));
  }

  function show(next, updateHash, nextStep = 0) {
    index = Math.max(0, Math.min(total - 1, next));
    step = Math.max(0, Math.min(stepCount(slides[index]) - 1, nextStep));
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
      slide.setAttribute("aria-hidden", slideIndex === index ? "false" : "true");
    });
    reveal(slides[index], step);
    document.title = `${slides[index].dataset.title || "Slides"} | ${index + 1}/${total}`;
    if (updateHash && location.hash !== `#${index + 1}`) history.replaceState(null, "", `#${index + 1}`);
    window.dispatchEvent(new CustomEvent('slidechange', {detail: {index, step, steps: stepCount(slides[index])}}));
  }

  function forward() {
    if (step + 1 < stepCount(slides[index])) show(index, true, step + 1);
    else if (index + 1 < total) show(index + 1, true);
  }

  function backward() {
    if (step > 0) show(index, true, step - 1);
    else if (index > 0) show(index - 1, true, stepCount(slides[index - 1]) - 1);
  }

  function onKey(event) {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey ||
        event.target.closest?.('input,textarea,select,[contenteditable="true"]') ||
        document.querySelector('.notes-overlay.is-open')) return;
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      forward();
    } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault();
      backward();
    } else if (event.key === "Home") {
      event.preventDefault();
      show(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      show(total - 1, true);
    }
  }

  // Exposed for the local PDF renderer and navigation checks. Index is zero-based.
  window.slideDeck = {
    goTo: (next, nextStep = 0, updateHash = true) => show(next, updateHash, nextStep),
    next: forward,
    previous: backward,
    state: () => ({index, step, steps: stepCount(slides[index])}),
    stepCount,
    reveal
  };
  renderMath();
  slides.forEach(slide => reveal(slide, 0));
  fitDeck();
  show(index, false);
  window.addEventListener("resize", fitDeck);
  window.addEventListener("keydown", onKey);
  window.addEventListener("hashchange", () => {
    const requested = Number(location.hash.slice(1)) - 1;
    if (Number.isFinite(requested)) show(requested, false);
  });

  Promise.resolve(document.fonts ? document.fonts.ready : undefined).then(() => {
    document.documentElement.dataset.ready = "true";
  });
})();
