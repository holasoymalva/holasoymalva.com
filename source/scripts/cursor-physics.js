/**
 * Magnetic Physics Cursor Engine
 * Locomotive / Active Theory style pointer physics with magnetic snapping
 */

(function () {
  let dot, outline;
  let cursorX = 0, cursorY = 0;
  let targetX = 0, targetY = 0;
  let outlineX = 0, outlineY = 0;

  function init() {
    dot = document.querySelector(".custom-cursor-dot");
    outline = document.querySelector(".custom-cursor-outline");

    if (!dot || !outline) return;

    // Track cursor movement
    window.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    // Add magnetic hover listeners
    bindHoverEvents();

    // Start render loop
    requestAnimationFrame(render);
  }

  function bindHoverEvents() {
    const interactiveElements = document.querySelectorAll(
      "a, button, .project-card-3d, .social-pill, .btn-pill, .btn-primary, .btn-secondary, .resource-card"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
      });

      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover");
        el.style.transform = "";
      });

      // Magnetic pull effect
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        // Pull strength limit
        if (el.classList.contains("btn-pill") || el.classList.contains("social-pill") || el.classList.contains("btn-primary")) {
          el.style.transform = `translate(${distanceX * 0.25}px, ${distanceY * 0.25}px)`;
        }
      });
    });
  }

  function render() {
    // Lerp dot
    cursorX += (targetX - cursorX) * 0.5;
    cursorY += (targetY - cursorY) * 0.5;

    // Lerp outline with inertia trailing
    outlineX += (targetX - outlineX) * 0.15;
    outlineY += (targetY - outlineY) * 0.15;

    if (dot) dot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    if (outline) outline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(render);
  }

  window.addEventListener("DOMContentLoaded", init);

  // Expose rebind function for dynamic content updates
  window.rebindCursorEvents = bindHoverEvents;
})();
