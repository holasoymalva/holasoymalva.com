/**
 * 8-Bit Pixel Train Toolkit Engine
 * Renders an animated locomotive train carrying Martin's engineering tools as wagons in an infinite loop
 */

(function () {
  let canvas, ctx;
  let width, height;
  let trainX = -1200;
  const trainSpeed = 2.2;
  let particles = [];

  const tools = [
    { name: "Python", color: "#e63946" },
    { name: "JavaScript", color: "#ffb703", textColor: "#000" },
    { name: "TypeScript", color: "#2a9d8f" },
    { name: "React.js", color: "#7209b7" },
    { name: "Vue.js", color: "#38b000" },
    { name: "Golang", color: "#00add8" },
    { name: "Erlang", color: "#a90533" },
    { name: "DeepSeek AI", color: "#38b000" },
    { name: "Three.js", color: "#e63946" },
    { name: "Spark AR", color: "#ffb703", textColor: "#000" },
    { name: "Docker", color: "#2196f3" },
    { name: "Xcode", color: "#7209b7" },
    { name: "Figma", color: "#2a9d8f" }
  ];

  class SteamParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 1.5;
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

    canvas.addEventListener("click", () => {
      spawnSteamBurst();
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

  function spawnSteamBurst() {
    const engineX = trainX + getTrainLength() - 50;
    const trackY = height - 60;
    for (let i = 0; i < 20; i++) {
      particles.push(new SteamParticle(engineX, trackY - 70));
    }
  }

  function getTrainLength() {
    return 140 + tools.length * 130;
  }

  function drawRailwayTrack() {
    const trackY = height - 40;

    // Track Metal Rails
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(0, trackY, width, 6);
    ctx.fillRect(0, trackY + 16, width, 6);

    // Track Wooden Ties (Sleepers)
    for (let x = 0; x < width; x += 30) {
      ctx.fillStyle = "#5c4033";
      ctx.fillRect(x, trackY - 4, 12, 28);
      ctx.fillStyle = "#2b2b2b";
      ctx.strokeRect(x, trackY - 4, 12, 28);
    }
  }

  function drawLocomotiveEngine(x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Locomotive Body
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(0, -50, 90, 50);

    // Driver Cabin
    ctx.fillStyle = "#e63946";
    ctx.fillRect(45, -80, 50, 80);

    // Cabin Roof
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(40, -86, 60, 8);

    // Cabin Window
    ctx.fillStyle = "#ffb703";
    ctx.fillRect(58, -65, 24, 24);

    // Chimney / Funnel
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(15, -75, 20, 25);
    ctx.fillRect(10, -82, 30, 8);

    // Front Cowcatcher Grille
    ctx.fillStyle = "#ffb703";
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(0, -30);
    ctx.lineTo(0, 0);
    ctx.fill();

    // Wheels
    ctx.fillStyle = "#ffb703";
    ctx.beginPath(); ctx.arc(20, 5, 14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(55, 5, 14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(80, 5, 14, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
  }

  function drawWagon(x, y, tool) {
    ctx.save();
    ctx.translate(x, y);

    // Wagon Body
    ctx.fillStyle = tool.color;
    ctx.fillRect(0, -45, 110, 45);

    // Border
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#2b2b2b";
    ctx.strokeRect(0, -45, 110, 45);

    // Tool Name Label
    ctx.fillStyle = tool.textColor || "#ffffff";
    ctx.font = "bold 16px 'Pixelify Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tool.name, 55, -22);

    // Wheels
    ctx.fillStyle = "#2b2b2b";
    ctx.beginPath(); ctx.arc(25, 5, 11, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(85, 5, 11, 0, Math.PI * 2); ctx.fill();

    // Wagon Coupler Link
    ctx.fillStyle = "#2b2b2b";
    ctx.fillRect(-15, -15, 15, 6);

    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    drawRailwayTrack();

    const trackY = height - 40;

    // Update train position
    trainX += trainSpeed;
    const totalTrainLength = getTrainLength();

    if (trainX > width + 100) {
      trainX = -totalTrainLength - 100;
    }

    // Spawn chimney steam particles
    const engineX = trainX + totalTrainLength - 50;
    if (Math.random() < 0.4) {
      particles.push(new SteamParticle(engineX + 25, trackY - 82));
    }

    // Update and draw steam particles
    particles.forEach((p, idx) => {
      p.update();
      p.draw(ctx);
      if (p.opacity <= 0) particles.splice(idx, 1);
    });

    // Draw wagons
    tools.forEach((tool, index) => {
      const wagonX = trainX + index * 125;
      drawWagon(wagonX, trackY, tool);
    });

    // Draw main engine at the front
    const locomotiveX = trainX + tools.length * 125;
    drawLocomotiveEngine(locomotiveX, trackY);

    requestAnimationFrame(loop);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
