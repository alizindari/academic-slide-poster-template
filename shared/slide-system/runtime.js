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

  function show(next, updateHash) {
    index = Math.max(0, Math.min(total - 1, next));
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
      slide.setAttribute("aria-hidden", slideIndex === index ? "false" : "true");
    });
    document.title = `${slides[index].dataset.title || "Slides"} | ${index + 1}/${total}`;
    if (updateHash) history.replaceState(null, "", `#${index + 1}`);
  }

  function onKey(event) {
    if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      show(index + 1, true);
    } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault();
      show(index - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      show(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      show(total - 1, true);
    }
  }

  renderMath();
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
