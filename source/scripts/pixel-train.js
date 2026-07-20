/**
 * 3-Track Railway Yard Engine with Click Derailment, Pixel Fireball Explosions & Replacement Respawns
 */

(function () {
  let canvas, ctx;
  let width, height;
  let particles = [];
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
      derailAngle: 0,
      yOffset: 0,
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
      derailAngle: 0,
      yOffset: 0,
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
      derailAngle: 0,
      yOffset: 0,
      tools: [
        { name: "Erlang", color: "#a90533" },
        { name: "DeepSeek AI", color: "#38b000" },
        { name: "Three.js", color: "#e63946" },
        { name: "Docker", color: "#2196f3" },
      ],
    },
  ];

  class SteamParticle {
    constructor(x, y, dir) {
      this.x = x;
      this.y = y;
      this.vx = -dir * (Math.random() * 1.5 + 0.5);
      this.vy = -Math.random() * 1.8 - 0.8;
      this.size = Math.random() * 8 + 5;
      this.opacity = 0.8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.size += 0.25;
      this.opacity -= 0.02;
    }

    draw(ctx) {
      ctx.save();
      ctx.fillStyle = `rgba(244, 235, 217, ${this.opacity})`;
      ctx.fillRect(this.x, this.y, this.size, this.size);
      ctx.restore();
    }
  }

  class FireballDebris {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 10;
      this.vy = -Math.random() * 8 - 2;
      this.size = Math.random() * 12 + 6;
      this.color = ["#e63946", "#ffb703", "#f3722c", "#1c1917", "#57534e"][
        Math.floor(Math.random() * 5)
      ];
      this.opacity = 1;
      this.rot = Math.random() * Math.PI * 2;
      this.vRot = (Math.random() - 0.5) * 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.4; // Gravity
      this.rot += this.vRot;
      this.opacity -= 0.025;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, this.opacity);
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

    for (let i = 0; i < 45; i++) {
      explosionParticles.push(new FireballDebris(centerX, centerY));
    }

    // Schedule respawn after 1.2s
    setTimeout(() => {
      respawnTrain(train);
    }, 1200);
  }

  function respawnTrain(train) {
    const wagonSpacing = 112 * scale;
    const trainLength = train.tools.length * wagonSpacing + 120 * scale;

    train.state = "RUNNING";
    train.derailTimer = 0;
    train.derailAngle = 0;
    train.yOffset = 0;

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

      // Check if click is near this train on its track Y
      if (
        clickX >= minX &&
        clickX <= maxX &&
        clickY >= trackY - 80 * scale &&
        clickY <= trackY + 30 * scale
      ) {
        // Derail train!
        train.state = "DERAILING";
        train.derailTimer = 0;
      }
    });
  }

  function drawTrack(trackY) {
    // Metal Rails
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(0, trackY, width, 4 * scale);
    ctx.fillRect(0, trackY + 14 * scale, width, 4 * scale);

    // Wooden Ties
    const tieSpacing = 28 * scale;
    for (let x = 0; x < width; x += tieSpacing) {
      ctx.fillStyle = "#5c4033";
      ctx.fillRect(x, trackY - 3 * scale, 10 * scale, 22 * scale);
      ctx.fillStyle = "#2b2b2b";
      ctx.strokeRect(x, trackY - 3 * scale, 10 * scale, 22 * scale);
    }
  }

  // Draw Locomotive Engine
  function drawLocomotiveEngine(x, y, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (dir === 1) {
      // Facing Right
      ctx.fillStyle = "#e63946"; ctx.fillRect(0, -65, 42, 65);
      ctx.lineWidth = 2.5; ctx.strokeStyle = "#2b2b2b"; ctx.strokeRect(0, -65, 42, 65);

      ctx.fillStyle = "#2b2b2b"; ctx.fillRect(-4, -70, 50, 6);
      ctx.fillStyle = "#ffb703"; ctx.fillRect(10, -52, 20, 20); ctx.strokeRect(10, -52, 20, 20);

      ctx.fillStyle = "#1c1917"; ctx.fillRect(42, -45, 52, 45); ctx.strokeRect(42, -45, 52, 45);

      ctx.fillStyle = "#2b2b2b"; ctx.fillRect(72, -64, 14, 19); ctx.fillRect(68, -69, 22, 6);

      ctx.fillStyle = "#ffb703";
      ctx.beginPath(); ctx.moveTo(94, 0); ctx.lineTo(108, 0); ctx.lineTo(94, -24); ctx.closePath(); ctx.fill(); ctx.stroke();

      ctx.fillStyle = "#ffb703";
      ctx.beginPath(); ctx.arc(16, 4, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(52, 4, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(82, 4, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else {
      // Facing Left
      ctx.fillStyle = "#e63946"; ctx.fillRect(-42, -65, 42, 65);
      ctx.lineWidth = 2.5; ctx.strokeStyle = "#2b2b2b"; ctx.strokeRect(-42, -65, 42, 65);

      ctx.fillStyle = "#2b2b2b"; ctx.fillRect(-46, -70, 50, 6);
      ctx.fillStyle = "#ffb703"; ctx.fillRect(-30, -52, 20, 20); ctx.strokeRect(-30, -52, 20, 20);

      ctx.fillStyle = "#1c1917"; ctx.fillRect(-94, -45, 52, 45); ctx.strokeRect(-94, -45, 52, 45);

      ctx.fillStyle = "#2b2b2b"; ctx.fillRect(-86, -64, 14, 19); ctx.fillRect(-90, -69, 22, 6);

      ctx.fillStyle = "#ffb703";
      ctx.beginPath(); ctx.moveTo(-94, 0); ctx.lineTo(-108, 0); ctx.lineTo(-94, -24); ctx.closePath(); ctx.fill(); ctx.stroke();

      ctx.fillStyle = "#ffb703";
      ctx.beginPath(); ctx.arc(-16, 4, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(-52, 4, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(-82, 4, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }

    ctx.restore();
  }

  function drawWagon(x, y, tool, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const wagonW = 100;
    const wagonH = 40;
    const drawX = dir === 1 ? 0 : -wagonW;

    ctx.fillStyle = tool.color;
    ctx.fillRect(drawX, -wagonH, wagonW, wagonH);

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#2b2b2b";
    ctx.strokeRect(drawX, -wagonH, wagonW, wagonH);

    ctx.fillStyle = tool.textColor || "#ffffff";
    ctx.font = "bold 14px 'Pixelify Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tool.name, drawX + wagonW / 2, -wagonH / 2);

    ctx.fillStyle = "#2b2b2b";
    ctx.beginPath(); ctx.arc(drawX + 20, 4, 9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(drawX + wagonW - 20, 4, 9, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#2b2b2b";
    const couplerX = dir === 1 ? wagonW : -wagonW - 12;
    ctx.fillRect(couplerX, -15, 12, 5);

    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    const trackY1 = height * trainConvoys[0].trackYRatio;
    const trackY2 = height * trainConvoys[1].trackYRatio;
    const trackY3 = height * trainConvoys[2].trackYRatio;

    drawTrack(trackY1);
    drawTrack(trackY2);
    drawTrack(trackY3);

    // Render steam particles
    particles.forEach((p, idx) => {
      p.update();
      p.draw(ctx);
      if (p.opacity <= 0) particles.splice(idx, 1);
    });

    // Render fireball explosion debris
    explosionParticles.forEach((ep, idx) => {
      ep.update();
      ep.draw(ctx);
      if (ep.opacity <= 0) explosionParticles.splice(idx, 1);
    });

    // Render each train
    trainConvoys.forEach((train) => {
      const trackY = height * train.trackYRatio;
      const wagonSpacing = 112 * scale;
      const trainLength = train.tools.length * wagonSpacing + 120 * scale;

      if (train.state === "RUNNING") {
        train.x += train.dir * train.speed;

        if (train.dir === 1 && train.x > width + 150) {
          train.x = -trainLength - 100;
        } else if (train.dir === -1 && train.x < -trainLength - 150) {
          train.x = width + 150;
        }
      } else if (train.state === "DERAILING") {
        train.derailTimer++;
        train.derailAngle += train.dir * 0.15;
        train.yOffset -= 2.5;

        // Emit derailment smoke & sparks
        const sparkX = train.x + (Math.random() - 0.5) * trainLength;
        particles.push(new SteamParticle(sparkX, trackY + train.yOffset, train.dir));

        if (train.derailTimer > 20) {
          const centerX = train.dir === 1 ? train.x + trainLength / 2 : train.x - trainLength / 2;
          triggerExplosion(train, centerX, trackY + train.yOffset);
        }
      } else if (train.state === "EXPLODING" || train.state === "RESPAWNING") {
        // Train is exploded, hidden while debris flies & waiting to respawn
        return;
      }

      // Draw train with derailment transformation
      ctx.save();
      ctx.translate(0, train.yOffset);

      if (train.dir === 1) {
        train.tools.forEach((tool, idx) => {
          const wagonX = train.x + idx * wagonSpacing;
          drawWagon(wagonX, trackY, tool, 1);
        });

        const locomotiveX = train.x + train.tools.length * wagonSpacing;
        drawLocomotiveEngine(locomotiveX, trackY, 1);

        if (train.state === "RUNNING" && Math.random() < 0.2) {
          particles.push(new SteamParticle(locomotiveX + 80 * scale, trackY - 69 * scale, 1));
        }
      } else {
        train.tools.forEach((tool, idx) => {
          const wagonX = train.x - idx * wagonSpacing;
          drawWagon(wagonX, trackY, tool, -1);
        });

        const locomotiveX = train.x - train.tools.length * wagonSpacing;
        drawLocomotiveEngine(locomotiveX, trackY, -1);

        if (train.state === "RUNNING" && Math.random() < 0.2) {
          particles.push(new SteamParticle(locomotiveX - 80 * scale, trackY - 69 * scale, -1));
        }
      }

      ctx.restore();
    });

    requestAnimationFrame(loop);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
