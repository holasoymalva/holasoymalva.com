/**
 * 8-Bit Pixel Tech Stack 2D Rigid Body Physics Engine
 * Canvas simulation with pixelated badges, vintage paper colors, and drag physics
 */

(function () {
  let canvas, ctx;
  let width, height;
  let badges = [];
  let draggedBadge = null;
  let mouse = { x: 0, y: 0, isDown: false };

  const techList = [
    { name: "Python 🐍", color: "#e63946", textColor: "#ffffff" },
    { name: "JavaScript ⚡", color: "#ffb703", textColor: "#000000" },
    { name: "TypeScript 📘", color: "#2a9d8f", textColor: "#ffffff" },
    { name: "React ⚛️", color: "#7209b7", textColor: "#ffffff" },
    { name: "Vue.js 🟢", color: "#38b000", textColor: "#ffffff" },
    { name: "Golang 🐹", color: "#00add8", textColor: "#ffffff" },
    { name: "Erlang 🔴", color: "#a90533", textColor: "#ffffff" },
    { name: "Three.js 🔮", color: "#e63946", textColor: "#ffffff" },
    { name: "DeepSeek AI 🤖", color: "#38b000", textColor: "#ffffff" },
    { name: "Django 🎸", color: "#2b2b2b", textColor: "#ffffff" },
    { name: "Spark AR 👓", color: "#ffb703", textColor: "#000000" },
    { name: "Figma 🎨", color: "#2a9d8f", textColor: "#ffffff" },
    { name: "Xcode 🛠️", color: "#7209b7", textColor: "#ffffff" }
  ];

  class Badge {
    constructor(x, y, tech) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4;
      this.name = tech.name;
      this.color = tech.color;
      this.textColor = tech.textColor || "#ffffff";
      
      ctx.font = "bold 16px 'VT323', monospace";
      const textMetrics = ctx.measureText(this.name);
      this.width = textMetrics.width + 36;
      this.height = 36;
    }

    update() {
      if (this === draggedBadge) {
        this.vx = (mouse.x - this.x) * 0.2;
        this.vy = (mouse.y - this.y) * 0.2;
        this.x = mouse.x;
        this.y = mouse.y;
        return;
      }

      this.vx *= 0.98;
      this.vy *= 0.98;
      this.vy += 0.05;

      this.x += this.vx;
      this.y += this.vy;

      if (this.x - this.width / 2 < 0) {
        this.x = this.width / 2;
        this.vx *= -0.7;
      }
      if (this.x + this.width / 2 > width) {
        this.x = width - this.width / 2;
        this.vx *= -0.7;
      }
      if (this.y - this.height / 2 < 0) {
        this.y = this.height / 2;
        this.vy *= -0.7;
      }
      if (this.y + this.height / 2 > height) {
        this.y = height - this.height / 2;
        this.vy *= -0.7;
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);

      // Pixelated Rect with 3D drop shadow
      ctx.fillStyle = "#2b2b2b";
      ctx.fillRect(-this.width / 2 + 4, -this.height / 2 + 4, this.width, this.height);

      ctx.fillStyle = this.color;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#2b2b2b";
      ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

      // Text
      ctx.fillStyle = this.textColor;
      ctx.font = "bold 18px 'VT323', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.name, 0, 1);

      ctx.restore();
    }

    containsPoint(px, py) {
      return (
        px >= this.x - this.width / 2 &&
        px <= this.x + this.width / 2 &&
        py >= this.y - this.height / 2 &&
        py <= this.y + this.height / 2
      );
    }
  }

  function init() {
    canvas = document.getElementById("tech-physics-canvas");
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    resize();

    techList.forEach((tech) => {
      const x = Math.random() * (width - 100) + 50;
      const y = Math.random() * (height - 100) + 50;
      badges.push(new Badge(x, y, tech));
    });

    canvas.addEventListener("mousedown", onPointerDown);
    canvas.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);

    window.addEventListener("resize", resize);

    requestAnimationFrame(loop);
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width;
    canvas.height = height;
  }

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left,
      y: (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top,
    };
  }

  function onPointerDown(e) {
    const coords = getCanvasCoords(e);
    mouse.x = coords.x;
    mouse.y = coords.y;
    mouse.isDown = true;

    for (let badge of badges) {
      if (badge.containsPoint(mouse.x, mouse.y)) {
        draggedBadge = badge;
        break;
      }
    }
  }

  function onTouchStart(e) {
    e.preventDefault();
    onPointerDown(e);
  }

  function onPointerMove(e) {
    const coords = getCanvasCoords(e);
    mouse.x = coords.x;
    mouse.y = coords.y;
  }

  function onTouchMove(e) {
    e.preventDefault();
    onPointerMove(e);
  }

  function onPointerUp() {
    mouse.isDown = false;
    draggedBadge = null;
  }

  function handleCollisions() {
    for (let i = 0; i < badges.length; i++) {
      for (let j = i + 1; j < badges.length; j++) {
        const b1 = badges[i];
        const b2 = badges[j];

        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (b1.width + b2.width) / 3;

        if (dist < minDist && dist > 0) {
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;

          b1.x -= nx * overlap * 0.5;
          b1.y -= ny * overlap * 0.5;
          b2.x += nx * overlap * 0.5;
          b2.y += ny * overlap * 0.5;

          const tempVx = b1.vx;
          const tempVy = b1.vy;
          b1.vx = b2.vx * 0.8;
          b1.vy = b2.vy * 0.8;
          b2.vx = tempVx * 0.8;
          b2.vy = tempVy * 0.8;
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    handleCollisions();
    badges.forEach((b) => {
      b.update();
      b.draw();
    });
    requestAnimationFrame(loop);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
