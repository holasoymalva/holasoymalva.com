/**
 * 8-Bit Arcade Pixel Snake Game Simulation
 * Snakes slither across the screen, hunt pixel apples, grow, and dodge the mouse pointer on approach
 */

(function () {
  let canvas, ctx;
  let width, height;
  let snakes = [];
  let apples = [];
  let mouse = { x: -1000, y: -1000 };

  const gridSize = 16;

  const snakeColors = [
    { head: "#38b000", body: "#70e000" }, // Green CRT
    { head: "#e63946", body: "#ff758f" }, // Crimson Arcade
    { head: "#ffb703", body: "#ffd166" }, // Amber Gold
    { head: "#2a9d8f", body: "#4ea8de" }, // 8-Bit Teal
  ];

  class PixelSnake {
    constructor(colorScheme) {
      this.color = colorScheme;
      this.reset();
    }

    reset() {
      const startX = Math.floor((Math.random() * (width - 100) + 50) / gridSize) * gridSize;
      const startY = Math.floor((Math.random() * (height - 100) + 50) / gridSize) * gridSize;

      this.body = [
        { x: startX, y: startY },
        { x: startX - gridSize, y: startY },
        { x: startX - gridSize * 2, y: startY },
        { x: startX - gridSize * 3, y: startY },
      ];

      this.dir = { x: 1, y: 0 };
      this.moveTimer = 0;
      this.moveInterval = 8; // Steps per movement update
      this.maxLength = 12;
    }

    update() {
      this.moveTimer++;
      if (this.moveTimer < this.moveInterval) return;
      this.moveTimer = 0;

      const head = this.body[0];

      // Mouse Avoidance Steering
      const dx = head.x - mouse.x;
      const dy = head.y - mouse.y;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);

      if (distToMouse < 160) {
        // Dodge mouse! Steer away from cursor
        if (Math.abs(dx) > Math.abs(dy)) {
          this.dir = { x: dx > 0 ? 1 : -1, y: 0 };
        } else {
          this.dir = { x: 0, y: dy > 0 ? 1 : -1 };
        }
      } else {
        // Find nearest apple
        let targetApple = null;
        let minDist = Infinity;

        apples.forEach((apple) => {
          const adx = apple.x - head.x;
          const ady = apple.y - head.y;
          const adist = Math.sqrt(adx * adx + ady * ady);
          if (adist < minDist) {
            minDist = adist;
            targetApple = apple;
          }
        });

        if (targetApple && Math.random() < 0.8) {
          const adx = targetApple.x - head.x;
          const ady = targetApple.y - head.y;

          if (Math.abs(adx) > Math.abs(ady)) {
            this.dir = { x: adx > 0 ? 1 : -1, y: 0 };
          } else {
            this.dir = { x: 0, y: ady > 0 ? 1 : -1 };
          }
        } else if (Math.random() < 0.25) {
          // Random turn
          const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
          ];
          this.dir = directions[Math.floor(Math.random() * directions.length)];
        }
      }

      // Calculate new head position
      const newHead = {
        x: head.x + this.dir.x * gridSize,
        y: head.y + this.dir.y * gridSize,
      };

      // Wrap around bounds
      if (newHead.x < 0) newHead.x = Math.floor(width / gridSize) * gridSize - gridSize;
      if (newHead.x >= width) newHead.x = 0;
      if (newHead.y < 0) newHead.y = Math.floor(height / gridSize) * gridSize - gridSize;
      if (newHead.y >= height) newHead.y = 0;

      this.body.unshift(newHead);

      // Check apple collision
      let ate = false;
      apples.forEach((apple, idx) => {
        if (Math.abs(apple.x - newHead.x) < gridSize && Math.abs(apple.y - newHead.y) < gridSize) {
          ate = true;
          apples.splice(idx, 1);
          spawnApple();
          if (window.playCoinSound) window.playCoinSound();
        }
      });

      if (!ate && this.body.length > this.maxLength) {
        this.body.pop();
      }
    }

    draw(ctx) {
      ctx.save();
      this.body.forEach((segment, idx) => {
        ctx.fillStyle = idx === 0 ? this.color.head : this.color.body;
        ctx.fillRect(segment.x, segment.y, gridSize - 2, gridSize - 2);

        // Snake eyes on head
        if (idx === 0) {
          ctx.fillStyle = "#000000";
          ctx.fillRect(segment.x + 3, segment.y + 3, 3, 3);
          ctx.fillRect(segment.x + gridSize - 6, segment.y + 3, 3, 3);
        }
      });
      ctx.restore();
    }
  }

  function spawnApple() {
    const x = Math.floor((Math.random() * (width - 60) + 30) / gridSize) * gridSize;
    const y = Math.floor((Math.random() * (height - 60) + 30) / gridSize) * gridSize;
    apples.push({ x, y });
  }

  function init() {
    canvas = document.getElementById("pixel-rain-canvas");
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    resize();

    // Spawn 4 Pixel Snakes
    snakeColors.forEach((color) => {
      snakes.push(new PixelSnake(color));
    });

    // Spawn initial apples
    for (let i = 0; i < 6; i++) {
      spawnApple();
    }

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("resize", resize);

    requestAnimationFrame(loop);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function drawApples(ctx) {
    ctx.save();
    apples.forEach((apple) => {
      // 8-Bit Pixel Apple 🍎
      ctx.fillStyle = "#e63946";
      ctx.fillRect(apple.x, apple.y, gridSize - 2, gridSize - 2);

      // Apple Leaf
      ctx.fillStyle = "#38b000";
      ctx.fillRect(apple.x + 6, apple.y - 3, 4, 4);
    });
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    drawApples(ctx);

    snakes.forEach((snake) => {
      snake.update();
      snake.draw(ctx);
    });

    requestAnimationFrame(loop);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
