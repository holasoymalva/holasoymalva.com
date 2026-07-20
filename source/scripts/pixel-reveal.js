/**
 * Pixel Construction Scroll Reveal Engine
 * Assembles cards out of pixelated blocks when scrolled into view
 */

(function () {
  function init() {
    const targets = document.querySelectorAll(
      ".about-card, .timeline-content, .project-card-3d, .resource-card"
    );

    targets.forEach((el, index) => {
      el.classList.add("pixel-reveal-target");
      el.style.animationDelay = `${(index % 3) * 0.15}s`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("pixel-constructed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    targets.forEach((el) => observer.observe(el));
  }

  window.addEventListener("DOMContentLoaded", init);
})();
