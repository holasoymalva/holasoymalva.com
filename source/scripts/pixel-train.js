/**
 * 3-Track Railway Engine with Authentic 8-Bit Pixel Art Locomotives & Tool Wagons
 * Features 8-bit pixel grid rendering, puffing pixel steam, derailment S-curve waves & fireball explosions.
 */

(function () {
  let canvas, ctx;
  let width, height;
  let explosionParticles = [];
  let scale = 1.0;

  // 3 Railway Tracks & Train Convoy Assignment
  const trainConvoys = [
    // Track 1 (Top, L -> R)
    {
      id: 1,
      trackYRatio: 0.22,
      dir: 1, // Moving Right
      speed: 1.1,
      x: -200,
      state: "RUNNING", // RUNNING, DERAILING, EXPLODING, RESPAWNING
      derailTimer: 0,
      tools: [
        { name: "Python", color: "#e63946" },
        { name: "JavaScript", color: "#ffb703", textColor: "#000" },
        { name: "TypeScript", color: "#2a9d8f" },
      ],
    },
    // Track 2 (Center, R -> L)
    {
      id: 2,
      trackYRatio: 0.52,
      dir: -1, // Moving Left
      speed: 1.1,
      x: 1200,
      state: "RUNNING",
      derailTimer: 0,
      tools: [
        { name: "React.js", color: "#7209b7" },
        { name: "Vue.js", color: "#38b000" },
        { name: "Golang", color: "#00add8" },
      ],
    },
    // Track 3 (Bottom, L -> R)
    {
      id: 3,
      trackYRatio: 0.82,
      dir: 1, // Moving Right
      speed: 1.1,
      x: -400,
      state: "RUNNING",
      derailTimer: 0,
      tools: [
        { name: "Erlang", color: "#a90533" },
        { name: "DeepSeek AI", color: "#38b000" },
        { name: "Three.js", color: "#e63946" },
        { name: "Docker", color: "#2196f3" },
      ],
    },
  ];

  class FireballDebris {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 4.5;
      this.vy = -Math.random() * 4 - 1;
      this.size = Math.random() * 8 + 4;
      this.color = ["#e63946", "#ffb703", "#f3722c", "#1c1917", "#57534e"][
        Math.floor(Math.random() * 5)
      ];
      this.opacity = 0.95;
      this.rot = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.18;
      this.rot += this.vRot;
      this.opacity -= 0.02;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, this.opacity);
      // Pixel block debris
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  function init() {
    canvas = document.getElementById("pixel-train-canvas");
    if (!canvas) return;

    ctx = canvas.getContext("2d");
    resize();

    window.addEventListener("resize", resize);

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      checkTrainClick(clickX, clickY);
    });

    requestAnimationFrame(loop);
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width;
    canvas.height = height;

    scale = width < 600 ? 0.78 : 1.0;
  }

  function triggerExplosion(train, centerX, centerY) {
    train.state = "EXPLODING";
    if (window.playExplosionSound) window.playExplosionSound();

    for (let i = 0; i < 22; i++) {
      explosionParticles.push(new FireballDebris(centerX, centerY));
    }

    setTimeout(() => {
      respawnTrain(train);
    }, 1200);
  }

  function respawnTrain(train) {
    const wagonSpacing = 112 * scale;
    const trainLength = train.tools.length * wagonSpacing + 120 * scale;

    train.state = "RUNNING";
    train.derailTimer = 0;

    if (train.dir === 1) {
      train.x = -trainLength - 150;
    } else {
      train.x = width + 150;
    }
  }

  function checkTrainClick(clickX, clickY) {
    const wagonSpacing = 112 * scale;

    trainConvoys.forEach((train) => {
      if (train.state !== "RUNNING") return;

      const trackY = height * train.trackYRatio;
      const trainLength = train.tools.length * wagonSpacing + 120 * scale;

      let minX, maxX;
      if (train.dir === 1) {
        minX = train.x;
        maxX = train.x + trainLength;
      } else {
        minX = train.x - trainLength;
        maxX = train.x;
      }

      if (
        clickX >= minX &&
        clickX <= maxX &&
        clickY >= trackY - 80 * scale &&
        clickY <= trackY + 30 * scale
      ) {
        train.state = "DERAILING";
        train.derailTimer = 0;
      }
    });
  }

  function drawTrack(trackY) {
    // 8-Bit Pixel Rails
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(0, Math.floor(trackY), width, 4 * scale);
    ctx.fillRect(0, Math.floor(trackY + 16 * scale), width, 4 * scale);

    const tieSpacing = 24 * scale;
    for (let x = 0; x < width; x += tieSpacing) {
      // 8-Bit Wooden Crossties
      ctx.fillStyle = "#57534e";
      ctx.fillRect(Math.floor(x), Math.floor(trackY - 4 * scale), 10 * scale, 24 * scale);
      ctx.fillStyle = "#2b2b2b";
      ctx.fillRect(Math.floor(x), Math.floor(trackY - 4 * scale), 10 * scale, 2 * scale);
      ctx.fillRect(Math.floor(x), Math.floor(trackY + 18 * scale), 10 * scale, 2 * scale);
    }
  }

  // Draw 8-Bit Pixel Art Steam Engine Locomotive
  function drawPixelLocomotive(x, y, dir, time) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Flip horizontally if moving left
    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    // 8-Bit Color Palette
    const C_RED = "#e63946";
    const C_DARK_RED = "#9e1b24";
    const C_BLACK = "#1c1917";
    const C_CHARCOAL = "#2b2b2b";
    const C_YELLOW = "#ffb703";
    const C_WHITE = "#f4ebd9";

    // 1. Headlight Pixel Light Beam
    ctx.fillStyle = "rgba(255, 183, 3, 0.18)";
    ctx.beginPath();
    ctx.moveTo(96, -34);
    ctx.lineTo(160, -54);
    ctx.lineTo(160, -14);
    ctx.closePath();
    ctx.fill();

    // 2. Main Boiler (8-Bit Stepped Cylindrical Hull)
    ctx.fillStyle = C_BLACK;
    ctx.fillRect(40, -48, 56, 44);

    // Boiler Metallic Bands (8-Bit Yellow Highlights)
    ctx.fillStyle = C_YELLOW;
    ctx.fillRect(52, -48, 4, 44);
    ctx.fillRect(72, -48, 4, 44);

    // 3. Driver Cab (8-Bit Stepped Pixel Cabin)
    ctx.fillStyle = C_RED;
    ctx.fillRect(0, -68, 42, 64);

    ctx.fillStyle = C_DARK_RED;
    ctx.fillRect(0, -68, 42, 6); // Cab Roof Trim
    ctx.fillRect(38, -68, 4, 64); // Shadow edge

    // 8-Bit Cab Window & Little Pixel Driver 👨‍✈️
    ctx.fillStyle = C_YELLOW;
    ctx.fillRect(10, -56, 22, 20);
    ctx.fillStyle = C_BLACK;
    ctx.fillRect(10, -56, 22, 2); // Window Frame Top
    ctx.fillRect(10, -38, 22, 2); // Window Frame Bottom
    ctx.fillRect(20, -56, 2, 20); // Window Frame Center Split

    ctx.fillStyle = C_BLACK;
    ctx.fillRect(14, -50, 4, 4); // Driver Eye

    // 4. Smokestack Chimney & 8-Bit Steam Puffs ☁️
    ctx.fillStyle = C_CHARCOAL;
    ctx.fillRect(76, -68, 14, 20);
    ctx.fillStyle = C_YELLOW;
    ctx.fillRect(72, -72, 22, 5); // Chimney Top Cap

    // Animated 8-Bit Steam Clouds
    const steamCycle = Math.floor(time * 12) % 4;
    ctx.fillStyle = C_WHITE;
    ctx.fillRect(70 - steamCycle * 6, -82 - steamCycle * 8, 12 + steamCycle * 4, 10 + steamCycle * 3);
    ctx.fillRect(58 - steamCycle * 8, -96 - steamCycle * 10, 16 + steamCycle * 5, 12 + steamCycle * 4);

    // 5. Front Headlight Block
    ctx.fillStyle = C_CHARCOAL;
    ctx.fillRect(92, -38, 8, 12);
    ctx.fillStyle = C_YELLOW;
    ctx.fillRect(96, -36, 4, 8);

    // 6. Front Cowcatcher Wedge (8-Bit Grate)
    ctx.fillStyle = C_YELLOW;
    ctx.fillRect(96, -18, 12, 14);
    ctx.fillStyle = C_BLACK;
    ctx.fillRect(98, -16, 2, 12);
    ctx.fillRect(102, -16, 2, 12);
    ctx.fillRect(106, -16, 2, 12);

    // 7. Base Chassis Frame
    ctx.fillStyle = C_CHARCOAL;
    ctx.fillRect(-6, -8, 110, 8);

    // 8-Bit Wheelset (Square Pixel Wheels with Spokes)
    function drawPixelWheel(wx, wy, radius) {
      ctx.fillStyle = C_YELLOW;
      ctx.fillRect(wx - radius, wy - radius, radius * 2, radius * 2);
      ctx.fillStyle = C_BLACK;
      ctx.fillRect(wx - radius + 2, wy - radius + 2, radius * 2 - 4, radius * 2 - 4);
      // Center Hub Pin
      ctx.fillStyle = C_RED;
      ctx.fillRect(wx - 2, wy - 2, 4, 4);
    }

    drawPixelWheel(14, 2, 10);
    drawPixelWheel(48, 2, 10);
    drawPixelWheel(82, 2, 10);

    // Connecting Side Rod (8-Bit Drive Shaft)
    const rodOffset = Math.sin(time * 18) * 3;
    ctx.fillStyle = C_YELLOW;
    ctx.fillRect(14, Math.floor(2 + rodOffset), 68, 4);

    ctx.restore();
  }

  // Draw 8-Bit Pixel Art Tool Wagon
  function drawPixelWagon(x, y, tool, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (dir === -1) {
      ctx.scale(-1, 1);
    }

    const wagonW = 100;
    const wagonH = 44;

    // 1. Coupler Bar
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(-14, -14, 16, 6);

    // 2. Wagon Base & Body Frame
    ctx.fillStyle = tool.color;
    ctx.fillRect(0, -wagonH, wagonW, wagonH);

    // 8-Bit Dark Pixel Border & Rivets
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(0, -wagonH, wagonW, 4); // Top Border
    ctx.fillRect(0, -4, wagonW, 4); // Bottom Border
    ctx.fillRect(0, -wagonH, 4, wagonH); // Left Border
    ctx.fillRect(wagonW - 4, -wagonH, 4, wagonH); // Right Border

    // 8-Bit Rivets (Corner Details)
    ctx.fillStyle = "#ffb703";
    ctx.fillRect(6, -wagonH + 6, 3, 3);
    ctx.fillRect(wagonW - 9, -wagonH + 6, 3, 3);
    ctx.fillRect(6, -9, 3, 3);
    ctx.fillRect(wagonW - 9, -9, 3, 3);

    // 3. Tool Label Text (8-Bit Pixel Typography)
    ctx.save();
    if (dir === -1) {
      // Un-flip text if wagon is flipped
      ctx.scale(-1, 1);
      ctx.translate(-wagonW, 0);
    }

    ctx.fillStyle = tool.textColor || "#ffffff";
    ctx.font = "bold 15px 'Pixelify Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tool.name, wagonW / 2, -wagonH / 2);
    ctx.restore();

    // 4. 8-Bit Wheels
    function drawWagonWheel(wx) {
      ctx.fillStyle = "#ffb703";
      ctx.fillRect(wx - 7, 0, 14, 14);
      ctx.fillStyle = "#1c1917";
      ctx.fillRect(wx - 5, 2, 10, 10);
      ctx.fillStyle = "#e63946";
      ctx.fillRect(wx - 2, 5, 4, 4);
    }

    drawWagonWheel(22);
    drawWagonWheel(wagonW - 22);

    ctx.restore();
  }

  function loop(timestamp) {
    ctx.clearRect(0, 0, width, height);

    const timeSec = timestamp / 1000;
    const wagonSpacing = 112 * scale;

    // 1. Draw 3 Railway Tracks
    trainConvoys.forEach((train) => {
      const trackY = height * train.trackYRatio;
      drawTrack(trackY);
    });

    // 2. Update & Draw Train Convoys
    trainConvoys.forEach((train) => {
      const trackY = height * train.trackYRatio;

      if (train.state === "RUNNING") {
        train.x += train.speed * train.dir * scale;

        const trainLength = train.tools.length * wagonSpacing + 120 * scale;
        if (train.dir === 1 && train.x > width + 150) {
          train.x = -trainLength - 100;
        } else if (train.dir === -1 && train.x < -trainLength - 150) {
          train.x = width + 150;
        }
      }

      if (train.state === "DERAILING") {
        train.derailTimer += 0.04;
        if (train.derailTimer > 0.45) {
          const locX = train.dir === 1 ? train.x + 80 * scale : train.x - 80 * scale;
          triggerExplosion(train, locX, trackY - 20 * scale);
        }
      }

      if (train.state === "RUNNING" || train.state === "DERAILING") {
        // Micro-Chugging Vertical Bounce (0.4px)
        const microChugY = train.state === "RUNNING" ? Math.sin(timeSec * 22) * 0.4 * scale : 0;
        const totalWagons = train.tools.length;

        // Draw Locomotive Engine
        let locAngle = 0;
        let locYOffset = microChugY;

        if (train.state === "DERAILING") {
          locAngle = Math.sin(train.derailTimer * 8) * 0.12 * train.dir;
          locYOffset = -Math.abs(Math.sin(train.derailTimer * 8)) * 14 * scale;
        }

        ctx.save();
        const engineLocX = train.dir === 1 ? train.x + totalWagons * wagonSpacing : train.x - totalWagons * wagonSpacing;

        ctx.translate(0, locYOffset);
        if (locAngle !== 0) {
          ctx.translate(engineLocX, trackY);
          ctx.rotate(locAngle);
          ctx.translate(-engineLocX, -trackY);
        }

        drawPixelLocomotive(engineLocX, trackY, train.dir, timeSec);
        ctx.restore();

        // Draw Tool Wagons behind Locomotive
        train.tools.forEach((tool, i) => {
          let wagonAngle = 0;
          let wagonYOffset = microChugY;

          if (train.state === "DERAILING") {
            const phase = i * 0.4;
            wagonAngle = Math.sin((train.derailTimer + phase) * 8) * 0.12 * train.dir;
            wagonYOffset = -Math.abs(Math.sin((train.derailTimer + phase) * 8)) * 14 * scale;
          }

          ctx.save();
          const wagonX = train.dir === 1 ? train.x + i * wagonSpacing : train.x - i * wagonSpacing;

          ctx.translate(0, wagonYOffset);
          if (wagonAngle !== 0) {
            ctx.translate(wagonX, trackY);
            ctx.rotate(wagonAngle);
            ctx.translate(-wagonX, -trackY);
          }

          drawPixelWagon(wagonX, trackY, tool, train.dir);
          ctx.restore();
        });
      }
    });

    // 3. Update & Draw Debris Explosion Particles
    for (let i = explosionParticles.length - 1; i >= 0; i--) {
      const p = explosionParticles[i];
      p.update();
      p.draw(ctx);

      if (p.opacity <= 0) {
        explosionParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
