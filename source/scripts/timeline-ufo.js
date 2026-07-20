/**
 * Career Journey Gamification: Interactive Peeking Pixel Aliens & UFOs
 * Handles click and hover triggers on career cards to unleash fully animated 8-bit pixel characters!
 */

(function () {
  function initTimelineInteractions() {
    const items = document.querySelectorAll(".timeline-item");
    if (!items.length) return;

    items.forEach((item) => {
      const content = item.querySelector(".timeline-content");
      if (!content) return;

      // Click trigger to toggle active dancing state
      content.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Deactivate all other timeline items
        items.forEach((other) => other.classList.remove("active"));

        if (!isActive) {
          item.classList.add("active");
          if (window.playCoinSound) {
            window.playCoinSound();
          }
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initTimelineInteractions);
})();
