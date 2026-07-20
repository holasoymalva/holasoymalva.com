/**
 * Multi-Train Freight & Locomotive Engine
 * Renders multiple mini-trains, each pulling 2-3 tool wagons with proper forward locomotive orientation
 */

(function () {
  let canvas, ctx;
  let width, height;
  let particles = [];

  const trainGroups = [
    {
      id: 1,
      speed: 2.2,
      x: -300,
      tools: [
        { name: "Python", color: "#e63946" },
        { name: "JavaScript", color: "#ffb703", textColor: "#000" },
        { name: "TypeScript", color: "#2a9d8f" },
      ],
    },
    {
      id: 2,
      speed: 2.2,
      x: -900,
      tools: [
        { name: "React.js", color: "#7209b7" },
        { name: "Vue.js", color: "#38b000" },
        { name: "Golang", color: "#00add8" },
      ],
    },
    {
      id: 3,
      speed: 2.2,
      x: -1500,
      tools: [
        { name: "Erlang", color: "#a90533" },
        { name: "DeepSeek AI", color: "#38b000" },
        { name: "Three.js", color: "#e63946" },
      ],
    },
    {
      id: 4,
      speed: 2.2,
      x: -2100,
      tools: [
        { name: "Spark AR", color: "#ffb703", textColor: "#000" },
        { name: "Docker", color: "#2196f3" },
        { name: "Xcode", color: "#7209b7" },
        { name: "Figma", color: "#2a9d8f" },
      ],
    },
  ];

  class SteamParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = -Math.random() * 1.5 - 0.5;
      this.vy = -Math.random() * 2 - 1;
      this.size = Math.random() * 10 + 6;
      this.opacity = 0.8;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.size += 0.3;
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
      spawnSteamBurst(clickX);
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

  function spawnSteamBurst(targetX) {
    const trackY = height - 40;
    for (let i = 0; i < 20; i++) {
      particles.push(new SteamParticle(targetX, trackY - 70));
    }
  }

  function drawRailwayTrack() {
    const trackY = height - 40;

    // Metal Rails
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(0, trackY, width, 6);
    ctx.fillRect(0, trackY + 16, width, 6);

    // Wooden Ties
    for (let x = 0; x < width; x += 30) {
      ctx.fillStyle = "#5c4033";
      ctx.fillRect(x, trackY - 4, 12, 28);
      ctx.fillStyle = "#2b2b2b";
      ctx.strokeRect(x, trackY - 4, 12, 28);
    }
  }

  // Draw Forward-Facing Locomotive (Engine leads at front right, cabin in back)
  function drawLocomotiveEngine(x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Driver Cabin (Back of engine, left)
    ctx.fillStyle = "#e63946";
    ctx.fillRect(0, -80, 48, 80);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#2b2b2b";
    ctx.strokeRect(0, -80, 48, 80);

    // Cabin Roof
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(-4, -86, 56, 8);

    // Cabin Window
    ctx.fillStyle = "#ffb703";
    ctx.fillRect(12, -65, 24, 24);
    ctx.strokeRect(12, -65, 24, 24);

    // Boiler Cylinder (Front of engine, right)
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(48, -55, 60, 55);
    ctx.strokeRect(48, -55, 60, 55);

    // Chimney / Funnel (On top of boiler near front)
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(80, -78, 16, 23);
    ctx.fillRect(75, -84, 26, 8);

    // Front Cowcatcher Grille (Facing forward right)
    ctx.fillStyle = "#ffb703";
    ctx.beginPath();
    ctx.moveTo(108, 0);
    ctx.lineTo(124, 0);
    ctx.lineTo(108, -28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wheels
    ctx.fillStyle = "#ffb703";
    ctx.beginPath(); ctx.arc(20, 5, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(60, 5, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(95, 5, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    ctx.restore();
  }

  function drawWagon(x, y, tool) {
    ctx.save();
    ctx.translate(x, y);

    // Wagon Body
    ctx.fillStyle = tool.color;
    ctx.fillRect(0, -45, 110, 45);

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#2b2b2b";
    ctx.strokeRect(0, -45, 110, 45);

    // Tool Name Label
    ctx.fillStyle = tool.textColor || "#ffffff";
    ctx.font = "bold 15px 'Pixelify Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tool.name, 55, -22);

    // Wheels
    ctx.fillStyle = "#2b2b2b";
    ctx.beginPath(); ctx.arc(25, 5, 11, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(85, 5, 11, 0, Math.PI * 2); ctx.fill();

    // Coupler Link
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(110, -18, 15, 6);

    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    drawRailwayTrack();

    const trackY = height - 40;

    // Render steam particles
    particles.forEach((p, idx) => {
      p.update();
      p.draw(ctx);
      if (p.opacity <= 0) particles.splice(idx, 1);
    });

    // Loop through each mini-train
    trainGroups.forEach((train) => {
      train.x += train.speed;

      const trainWidth = train.tools.length * 125 + 130;

      // Loop around canvas when off-screen
      if (train.x > width + 200) {
        train.x = -trainWidth - (Math.random() * 300 + 200);
      }

      // Draw wagons
      train.tools.forEach((tool, idx) => {
        const wagonX = train.x + idx * 125;
        drawWagon(wagonX, trackY, tool);
      });

      // Draw forward-facing locomotive engine at front
      const locomotiveX = train.x + train.tools.length * 125;
      drawLocomotiveEngine(locomotiveX, trackY);

      // Steam chimney emission
      if (Math.random() < 0.25) {
        particles.push(new SteamParticle(locomotiveX + 88, trackY - 84));
      }
    });

    requestAnimationFrame(loop);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
