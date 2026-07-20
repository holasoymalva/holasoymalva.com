/**
 * 3-Track Bi-Directional Railway Yard Engine
 * Renders 3 parallel tracks with bi-directional trains (L->R and R->L) and smooth slow speed
 */

(function () {
  let canvas, ctx;
  let width, height;
  let particles = [];

  // 3 Railway Tracks & Train Convoy Assignment
  const trainConvoys = [
    // Track 1 (Top, L -> R)
    {
      trackYRatio: 0.22,
      dir: 1, // Moving Right
      speed: 1.1,
      x: -200,
      tools: [
        { name: "Python", color: "#e63946" },
        { name: "JavaScript", color: "#ffb703", textColor: "#000" },
        { name: "TypeScript", color: "#2a9d8f" },
      ],
    },
    // Track 2 (Center, R -> L)
    {
      trackYRatio: 0.52,
      dir: -1, // Moving Left
      speed: 1.1,
      x: 1200,
      tools: [
        { name: "React.js", color: "#7209b7" },
        { name: "Vue.js", color: "#38b000" },
        { name: "Golang", color: "#00add8" },
      ],
    },
    // Track 3 (Bottom, L -> R)
    {
      trackYRatio: 0.82,
      dir: 1, // Moving Right
      speed: 1.1,
      x: -400,
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
      spawnSteamBurst(clickX, clickY);
      if (window.playTrainWhistle) window.playTrainWhistle();
    });

    requestAnimationFrame(loop);
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width;
    canvas.height = height;
  }

  function spawnSteamBurst(targetX, targetY) {
    for (let i = 0; i < 16; i++) {
      particles.push(new SteamParticle(targetX, targetY - 20, 1));
    }
  }

  function drawTrack(trackY) {
    // Metal Rails
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(0, trackY, width, 5);
    ctx.fillRect(0, trackY + 14, width, 5);

    // Wooden Ties
    for (let x = 0; x < width; x += 28) {
      ctx.fillStyle = "#5c4033";
      ctx.fillRect(x, trackY - 3, 10, 22);
      ctx.fillStyle = "#2b2b2b";
      ctx.strokeRect(x, trackY - 3, 10, 22);
    }
  }

  // Draw Locomotive Engine (dir = 1 for Right, dir = -1 for Left)
  function drawLocomotiveEngine(x, y, dir) {
    ctx.save();
    ctx.translate(x, y);

    if (dir === 1) {
      // Facing Right (Motion Left -> Right)
      // Driver Cabin (Back, left)
      ctx.fillStyle = "#e63946";
      ctx.fillRect(0, -65, 42, 65);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#2b2b2b";
      ctx.strokeRect(0, -65, 42, 65);

      ctx.fillStyle = "#2b2b2b"; ctx.fillRect(-4, -70, 50, 6); // Roof
      ctx.fillStyle = "#ffb703"; ctx.fillRect(10, -52, 20, 20); ctx.strokeRect(10, -52, 20, 20); // Window

      // Boiler Cylinder (Front, right)
      ctx.fillStyle = "#1c1917"; ctx.fillRect(42, -45, 52, 45); ctx.strokeRect(42, -45, 52, 45);

      // Chimney
      ctx.fillStyle = "#2b2b2b"; ctx.fillRect(72, -64, 14, 19); ctx.fillRect(68, -69, 22, 6);

      // Cowcatcher (Front right tip)
      ctx.fillStyle = "#ffb703";
      ctx.beginPath(); ctx.moveTo(94, 0); ctx.lineTo(108, 0); ctx.lineTo(94, -24); ctx.closePath(); ctx.fill(); ctx.stroke();

      // Wheels
      ctx.fillStyle = "#ffb703";
      ctx.beginPath(); ctx.arc(16, 4, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(52, 4, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(82, 4, 11, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else {
      // Facing Left (Motion Right -> Left)
      // Driver Cabin (Back, right)
      ctx.fillStyle = "#e63946";
      ctx.fillRect(-42, -65, 42, 65);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#2b2b2b";
      ctx.strokeRect(-42, -65, 42, 65);

      ctx.fillStyle = "#2b2b2b"; ctx.fillRect(-46, -70, 50, 6); // Roof
      ctx.fillStyle = "#ffb703"; ctx.fillRect(-30, -52, 20, 20); ctx.strokeRect(-30, -52, 20, 20); // Window

      // Boiler Cylinder (Front, left)
      ctx.fillStyle = "#1c1917"; ctx.fillRect(-94, -45, 52, 45); ctx.strokeRect(-94, -45, 52, 45);

      // Chimney
      ctx.fillStyle = "#2b2b2b"; ctx.fillRect(-86, -64, 14, 19); ctx.fillRect(-90, -69, 22, 6);

      // Cowcatcher (Front left tip)
      ctx.fillStyle = "#ffb703";
      ctx.beginPath(); ctx.moveTo(-94, 0); ctx.lineTo(-108, 0); ctx.lineTo(-94, -24); ctx.closePath(); ctx.fill(); ctx.stroke();

      // Wheels
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

    const wagonW = 100;
    const wagonH = 40;

    const drawX = dir === 1 ? 0 : -wagonW;

    // Wagon Body
    ctx.fillStyle = tool.color;
    ctx.fillRect(drawX, -wagonH, wagonW, wagonH);

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#2b2b2b";
    ctx.strokeRect(drawX, -wagonH, wagonW, wagonH);

    // Tool Name Label
    ctx.fillStyle = tool.textColor || "#ffffff";
    ctx.font = "bold 14px 'Pixelify Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tool.name, drawX + wagonW / 2, -wagonH / 2);

    // Wheels
    ctx.fillStyle = "#2b2b2b";
    ctx.beginPath(); ctx.arc(drawX + 20, 4, 9, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(drawX + wagonW - 20, 4, 9, 0, Math.PI * 2); ctx.fill();

    // Coupler Link
    ctx.fillStyle = "#2b2b2b";
    const couplerX = dir === 1 ? wagonW : -wagonW - 12;
    ctx.fillRect(couplerX, -15, 12, 5);

    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    // Render 3 Railway Tracks
    const trackY1 = height * trainConvoys[0].trackYRatio;
    const trackY2 = height * trainConvoys[1].trackYRatio;
    const trackY3 = height * trainConvoys[2].trackYRatio;

    drawTrack(trackY1);
    drawTrack(trackY2);
    drawTrack(trackY3);

    // Update and render steam particles
    particles.forEach((p, idx) => {
      p.update();
      p.draw(ctx);
      if (p.opacity <= 0) particles.splice(idx, 1);
    });

    // Render each train on its dedicated track
    trainConvoys.forEach((train, tIdx) => {
      const trackY = height * train.trackYRatio;

      train.x += train.dir * train.speed;

      const wagonSpacing = 112;
      const trainLength = train.tools.length * wagonSpacing + 120;

      // Wrap around bounds depending on direction
      if (train.dir === 1 && train.x > width + 150) {
        train.x = -trainLength - 100;
      } else if (train.dir === -1 && train.x < -trainLength - 150) {
        train.x = width + 150;
      }

      if (train.dir === 1) {
        // Moving Right: Wagons behind (left), Locomotive at front (right)
        train.tools.forEach((tool, idx) => {
          const wagonX = train.x + idx * wagonSpacing;
          drawWagon(wagonX, trackY, tool, 1);
        });

        const locomotiveX = train.x + train.tools.length * wagonSpacing;
        drawLocomotiveEngine(locomotiveX, trackY, 1);

        if (Math.random() < 0.2) {
          particles.push(new SteamParticle(locomotiveX + 80, trackY - 69, 1));
        }
      } else {
        // Moving Left: Wagons behind (right), Locomotive at front (left)
        train.tools.forEach((tool, idx) => {
          const wagonX = train.x - idx * wagonSpacing;
          drawWagon(wagonX, trackY, tool, -1);
        });

        const locomotiveX = train.x - train.tools.length * wagonSpacing;
        drawLocomotiveEngine(locomotiveX, trackY, -1);

        if (Math.random() < 0.2) {
          particles.push(new SteamParticle(locomotiveX - 80, trackY - 69, -1));
        }
      }
    });

    requestAnimationFrame(loop);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
