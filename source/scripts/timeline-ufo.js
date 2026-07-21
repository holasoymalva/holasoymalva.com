/**
 * Career Journey Gamification: Accordion Reveal + Matrix Glitch Text Decoder + Peeking Aliens
 * Handles accordion expansion, smooth character-by-character matrix decoder animation on EVERY hover, and peeking 8-bit aliens.
 */

(function () {
  const glitchGlyphs = "█░▓▒#@$%&*<>01!?:;+~=X79АБВГ";

  function scrambleText(element) {
    if (!element) return;

    // Cache original pristine text on first run
    if (!element.dataset.originalText) {
      element.dataset.originalText = element.innerText.trim();
    }

    const fullText = element.dataset.originalText;
    if (!fullText) return;

    // Clear any previous running scramble timer so it restarts fresh on every hover
    if (element._scrambleTimer) {
      clearInterval(element._scrambleTimer);
    }

    const totalLength = fullText.length;
    let frame = 0;
    const totalFrames = 42; // ~1.3s smooth cinematic matrix decode (much slower & enjoyable!)

    element._scrambleTimer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const resolvedCount = Math.floor(progress * totalLength);

      let outputHTML = "";
      for (let i = 0; i < totalLength; i++) {
        const char = fullText[i];
        if (char === " " || char === "\n") {
          outputHTML += char;
        } else if (i < resolvedCount) {
          outputHTML += char;
        } else if (i < resolvedCount + 10) {
          const randomChar = glitchGlyphs[Math.floor(Math.random() * glitchGlyphs.length)];
          outputHTML += `<span class="matrix-char">${randomChar}</span>`;
        }
      }

      element.innerHTML = outputHTML;

      if (frame >= totalFrames) {
        clearInterval(element._scrambleTimer);
        element._scrambleTimer = null;
        element.innerText = fullText;
      }
    }, 30);
  }

  function initTimelineInteractions() {
    const items = document.querySelectorAll(".timeline-item");
    if (!items.length) return;

    items.forEach((item) => {
      const content = item.querySelector(".timeline-content");
      const desc = item.querySelector(".timeline-desc");
      if (!content) return;

      // Save original description text immediately
      if (desc && !desc.dataset.originalText) {
        desc.dataset.originalText = desc.innerText.trim();
      }

      // Hover trigger for desktop - FIRES EVERY SINGLE TIME MOUSE ENTERS
      item.addEventListener("mouseenter", () => {
        if (desc) scrambleText(desc);
      });

      // Click trigger for mobile & desktop toggle
      content.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        items.forEach((other) => {
          if (other !== item) other.classList.remove("active");
        });

        if (!isActive) {
          item.classList.add("active");
          if (desc) scrambleText(desc);
          if (window.playCoinSound) window.playCoinSound();
        } else {
          item.classList.remove("active");
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initTimelineInteractions);
})();
