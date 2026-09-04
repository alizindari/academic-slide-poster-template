(() => {
  const root = document.documentElement;
  const dimensions = {
    vertical: [860, 1160],
    horizontal: [1160, 860]
  };
  const requested = new URLSearchParams(window.location.search).get("orientation");
  const fallback = root.dataset.orientation || "vertical";
  const orientation = Object.hasOwn(dimensions, requested) ? requested : fallback;
  const [width, height] = dimensions[orientation];

  root.dataset.orientation = orientation;

  const pageRule = document.createElement("style");
  pageRule.dataset.posterPageSize = orientation;
  pageRule.textContent = `@page { size: ${width}mm ${height}mm; margin: 0; }`;
  document.head.append(pageRule);
})();
