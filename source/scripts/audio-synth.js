/**
 * 8-Bit Chiptune Web Audio API Synthesizer
 * Generates authentic retro arcade sound effects using square & sawtooth waves
 */

(function () {
  let audioCtx = null;
  let isMuted = true; // Off by default for user preference

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // 8-Bit retro blip on hover
  function playTick() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  }

  // 8-Bit arcade coin / select sound on click
  function playClick() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (e) {}
  }

  function init() {
    const soundToggleBtn = document.getElementById("soundToggle");
    const storedState = localStorage.getItem("audioMuted");
    if (storedState !== null) {
      isMuted = storedState === "true";
    }

    updateButtonUI(soundToggleBtn);

    if (soundToggleBtn) {
      soundToggleBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        localStorage.setItem("audioMuted", isMuted);
        updateButtonUI(soundToggleBtn);
        if (!isMuted) playClick();
      });
    }

    // Attach sound triggers
    document.querySelectorAll("a, button, .project-card-3d").forEach((el) => {
      el.addEventListener("mouseenter", playTick);
      el.addEventListener("click", playClick);
    });
  }

  function updateButtonUI(btn) {
    if (!btn) return;
    if (isMuted) {
      btn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> <span>8-BIT OFF</span>`;
      btn.style.opacity = "0.7";
    } else {
      btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span>8-BIT ON</span>`;
      btn.style.opacity = "1";
    }
  }

  window.addEventListener("DOMContentLoaded", init);
  window.playAudioClick = playClick;
})();
