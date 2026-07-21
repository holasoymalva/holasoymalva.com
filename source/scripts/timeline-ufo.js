/**
 * Career Journey Gamification: Accordion Reveal + Matrix Glitch Text Decoder + Peeking Aliens
 * Handles accordion expansion, character-by-character matrix decoder animation, and peeking 8-bit aliens.
 */

(function () {
  const glitchGlyphs = "█░▓▒#@$%&*<>01!?:;+~=X79АБВГ";

  function scrambleText(element) {
    if (!element || element.dataset.scrambling === "true") return;

    const fullText = element.dataset.originalText || element.innerText.trim();
    if (!fullText) return;

    element.dataset.originalText = fullText;
    element.dataset.scrambling = "true";

    const totalLength = fullText.length;
    let frame = 0;
    const totalFrames = 18; // ~360ms glitch decode

    const interval = setInterval(() => {
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
        } else if (i < resolvedCount + 8) {
          const randomChar = glitchGlyphs[Math.floor(Math.random() * glitchGlyphs.length)];
          outputHTML += `<span class="matrix-char">${randomChar}</span>`;
        }
      }

      element.innerHTML = outputHTML;

      if (frame >= totalFrames) {
        clearInterval(interval);
        element.innerText = fullText;
        delete element.dataset.scrambling;
      }
    }, 22);
  }

  function initTimelineInteractions() {
    const items = document.querySelectorAll(".timeline-item");
    if (!items.length) return;

    items.forEach((item) => {
      const content = item.querySelector(".timeline-content");
      const desc = item.querySelector(".timeline-desc");
      if (!content) return;

      // Save original description text for matrix decoder
      if (desc && !desc.dataset.originalText) {
        desc.dataset.originalText = desc.innerText.trim();
      }

      // Hover trigger for desktop
      item.addEventListener("mouseenter", () => {
        if (desc) scrambleText(desc);
      });

      // Click trigger for mobile & desktop toggle
      content.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Toggle active state
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
