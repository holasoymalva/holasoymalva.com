/**
 * Enriched 8-Bit Chiptune Web Audio API Synthesizer
 * Generates Train Whistles, Coin Pickup, Level-Up Chimes, and Retro UI Sound FX
 */

(function () {
  let audioCtx = null;
  let isMuted = true; // Muted by default to respect user settings

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

  // 8-Bit Hover Blip
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

  // 8-Bit Coin Pickup (Ding!)
  function playCoinSound() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6

      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  }

  // 8-Bit Train Choo-Choo Steam Whistle
  function playTrainWhistle() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "triangle";
      osc2.type = "square";

      osc1.frequency.setValueAtTime(600, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.15);
      osc1.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.35);

      osc2.frequency.setValueAtTime(900, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(1125, ctx.currentTime + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  }

  // Level-Up Chime (Terminal open)
  function playLevelUp() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.1);
      });
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
        if (!isMuted) playLevelUp();
      });
    }

    // Attach sound triggers
    document.querySelectorAll("a, button, .project-card-3d").forEach((el) => {
      el.addEventListener("mouseenter", playTick);
      el.addEventListener("click", playCoinSound);
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

  // Export functions to global scope
  window.playAudioClick = playCoinSound;
  window.playCoinSound = playCoinSound;
  window.playTrainWhistle = playTrainWhistle;
  window.playLevelUp = playLevelUp;
})();
