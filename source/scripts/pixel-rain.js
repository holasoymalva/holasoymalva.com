/**
 * Maximalist 8-Bit Falling Pixel Game Items Physics
 * Renders interactive falling coins, stars, invaders, hearts that react to pointer collisions & click explosions
 */

(function () {
  let canvas, ctx;
  let width, height;
  let items = [];
  let confetti = [];
  let mouse = { x: -1000, y: -1000 };

  const itemTypes = ["coin", "star", "invader", "heart"];

  class PixelItem {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = -Math.random() * height - 20;
      this.size = Math.random() * 10 + 16;
      this.vy = Math.random() * 1.5 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      this.rot = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.05;
    }

    update() {
      // Pointer deflection force
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        const force = (100 - dist) / 100;
        this.vx += (dx / dist) * force * 3;
        this.vy += (dy / dist) * force * 3;
      }

      this.vx *= 0.95;
      this.x += this.vx;
      this.y += this.vy;
      this.rot += this.vRot;

      if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);

      if (this.type === "coin") {
        ctx.fillStyle = "#ffb703";
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.fillStyle = "#e63946";
        ctx.fillRect(-this.size / 4, -this.size / 4, this.size / 2, this.size / 2);
      } else if (this.type === "star") {
        ctx.fillStyle = "#ffb703";
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      } else if (this.type === "heart") {
        ctx.fillStyle = "#e63946";
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      } else {
        ctx.fillStyle = "#38b000";
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      }

      ctx.restore();
    }
  }

  class PixelConfetti {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 8;
      this.vy = (Math.random() - 0.5) * 8;
      this.size = Math.random() * 6 + 4;
      this.color = ["#e63946", "#ffb703", "#38b000", "#2a9d8f", "#7209b7"][
        Math.floor(Math.random() * 5)
      ];
      this.opacity = 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.2;
      this.opacity -= 0.03;
    }

    draw() {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillRect(this.x, this.y, this.size, this.size);
      ctx.restore();
    }
  }

  function init() {
    canvas = document.getElementById("pixel-rain-canvas");
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    resize();

    const count = Math.min(Math.floor(width / 35), 35);
    for (let i = 0; i < count; i++) {
      items.push(new PixelItem());
    }

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("click", (e) => {
      spawnExplosion(e.clientX, e.clientY);
      if (window.playCoinSound) window.playCoinSound();
    });

    window.addEventListener("resize", resize);

    requestAnimationFrame(loop);
  }

  function spawnExplosion(x, y) {
    for (let i = 0; i < 24; i++) {
      confetti.push(new PixelConfetti(x, y));
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    items.forEach((item) => {
      item.update();
      item.draw();
    });

    confetti.forEach((c, idx) => {
      c.update();
      c.draw();
      if (c.opacity <= 0) confetti.splice(idx, 1);
    });

    requestAnimationFrame(loop);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
