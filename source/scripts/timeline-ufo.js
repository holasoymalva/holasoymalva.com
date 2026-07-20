/**
 * Career Journey Gamification: 8-Bit Pixel UFO & Alien Easter Egg Engine
 * Renders floating Pixel Saucers on timeline cards that beam down lasers on hover
 * and detonate in 8-bit particle explosions upon secret clicks.
 */

(function () {
  function initTimelineUFOs() {
    const cards = document.querySelectorAll(".timeline-content");
    if (!cards.length) return;

    cards.forEach((card, index) => {
      // Avoid duplicate initialization
      if (card.querySelector(".timeline-ufo-badge")) return;

      // Ensure relative positioning
      card.style.position = "relative";

      // Create UFO Container Badge
      const ufoBadge = document.createElement("div");
      ufoBadge.className = "timeline-ufo-badge";
      ufoBadge.title = "???";

      const canvas = document.createElement("canvas");
      canvas.width = 48;
      canvas.height = 48;
      canvas.className = "ufo-canvas";

      ufoBadge.appendChild(canvas);
      card.appendChild(ufoBadge);

      const ctx = canvas.getContext("2d");
      ctx.imageRendering = "pixelated";

      let animFrame = null;
      let state = "idle"; // idle, floating, exploding, destroyed
      let particles = [];
      let bobTime = index * 1.2;

      function drawPixelUFO(time) {
        ctx.clearRect(0, 0, 48, 48);

        if (state === "exploding") {
          // Render 8-Bit Explosion Burst
          let allDead = true;
          particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // Gravity
            p.life -= 0.04;

            if (p.life > 0) {
              allDead = false;
              ctx.fillStyle = p.color;
              ctx.globalAlpha = Math.max(0, p.life);
              ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
            }
          });
          ctx.globalAlpha = 1;

          if (allDead) {
            state = "destroyed";
            setTimeout(() => {
              state = "idle";
            }, 1800);
          } else {
            animFrame = requestAnimationFrame(() => drawPixelUFO(time + 0.05));
          }
          return;
        }

        if (state === "destroyed") {
          return;
        }

        // Floating Bobbing Offset
        const bobY = Math.sin(time * 3.5 + bobTime) * 3;
        const ufoY = 10 + bobY;

        // Draw Tractor Beam (on Hover)
        if (state === "floating") {
          ctx.fillStyle = "rgba(56, 176, 0, 0.25)";
          ctx.beginPath();
          ctx.moveTo(18, ufoY + 16);
          ctx.lineTo(30, ufoY + 16);
          ctx.lineTo(40, 48);
          ctx.lineTo(8, 48);
          ctx.closePath();
          ctx.fill();

          // Beam Pulse Lines
          ctx.fillStyle = "#38b000";
          const scanY = (Math.floor(time * 30) % 20) + ufoY + 16;
          if (scanY < 46) {
            ctx.fillRect(14, scanY, 20, 2);
          }
        }

        // Draw 8-Bit Pixel Flying Saucer (24x24 scale x 2)
        // Cockpit Glass (Cyan/Green Glow)
        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(20, ufoY + 2, 8, 4);
        ctx.fillRect(18, ufoY + 4, 12, 4);

        // Little Pixel Alien Head inside Cockpit 👾
        ctx.fillStyle = "#38b000";
        ctx.fillRect(22, ufoY + 4, 4, 4);
        ctx.fillStyle = "#000000";
        ctx.fillRect(22, ufoY + 4, 1, 2);
        ctx.fillRect(25, ufoY + 4, 1, 2);

        // Saucer Metallic Body
        ctx.fillStyle = "#4a4e69";
        ctx.fillRect(14, ufoY + 8, 20, 4);
        ctx.fillStyle = "#9a8c98";
        ctx.fillRect(10, ufoY + 10, 28, 4);
        ctx.fillRect(6, ufoY + 12, 36, 4);

        // Indicator Lights (Blinking Red & Yellow)
        const blink = Math.floor(time * 6) % 2 === 0;
        ctx.fillStyle = blink ? "#e63946" : "#ffb703";
        ctx.fillRect(10, ufoY + 13, 3, 2);
        ctx.fillRect(22, ufoY + 13, 4, 2);
        ctx.fillRect(35, ufoY + 13, 3, 2);

        // Under-carriage Thruster
        ctx.fillStyle = "#ffb703";
        ctx.fillRect(18, ufoY + 16, 12, 2);

        animFrame = requestAnimationFrame(() => drawPixelUFO(time + 0.04));
      }

      // Event Listeners for Hover & Click
      card.addEventListener("mouseenter", () => {
        if (state !== "exploding" && state !== "destroyed") {
          state = "floating";
          if (!animFrame) animFrame = requestAnimationFrame(() => drawPixelUFO(0));
        }
      });

      card.addEventListener("mouseleave", () => {
        if (state === "floating") {
          state = "idle";
        }
      });

      ufoBadge.addEventListener("click", (e) => {
        e.stopPropagation();
        if (state === "exploding" || state === "destroyed") return;

        state = "exploding";
        particles = [];

        // Spawn 22 8-bit Pixel Explosion Debris Particles
        const colors = ["#e63946", "#ffb703", "#38b000", "#00ffcc", "#ffffff"];
        for (let i = 0; i < 22; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 4.5;
          particles.push({
            x: 24,
            y: 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            size: Math.floor(Math.random() * 3) + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1.0,
          });
        }

        // Play 8-Bit Explosion Sound
        if (window.playExplosionSound) {
          window.playExplosionSound();
        }

        // Trigger Screen Shake / Card Jiggle Effect
        card.classList.add("ufo-detonated");
        setTimeout(() => card.classList.remove("ufo-detonated"), 400);
      });

      // Start initial idle loop
      animFrame = requestAnimationFrame(() => drawPixelUFO(0));
    });
  }

  document.addEventListener("DOMContentLoaded", initTimelineUFOs);
})();
