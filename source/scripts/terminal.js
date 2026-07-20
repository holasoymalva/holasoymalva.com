/**
 * Retro Arcade CRT Developer Terminal (~/arcade)
 * Green Phosphor monitor experience with interactive commands & Easter Egg
 */

(function () {
  let modal, input, output, closeBtn;

  const commands = {
    help: `
[RETRO ARCADE COMMANDS]
  - about      : Bio & career background
  - skills     : Technical stack & tools
  - projects   : Featured apps & AI tools
  - exp        : Career history
  - contact    : Socials & email
  - matrix     : Trigger CRT matrix digital downfall
  - theme      : Toggle light cream / CRT night theme
  - sudo hire  : High priority recruiter intent 🎮
  - clear      : Clear CRT screen
`,
    about: `
Martin Manriquez (@holasoymalva)
Creative Software Engineer & Tech Architect.
Ex-Meta DevC Co-Lead, Globant, Guros Tech Lead, BlackLine.
Specialist in Python, TypeScript, Go, WebGL 3D, and AI Agent CLI tools.
`,
    skills: `
[ENGINEERING TOOLKIT]
  • Languages   : Python, JavaScript, TypeScript, Golang, Erlang, Java
  • Frameworks  : React, Vue.js, Angular, Django, Flask, HTML5/CSS3
  • 3D & Audio  : Three.js, WebGL, Spark AR, Web Audio API, Unity
  • Infrastructure: Docker, Git, Linux, Xcode, Figma
`,
    projects: `
[FEATURED PROJECTS]
  1. Many LLMs (https://www.manyllm.pro/)
     Run local LLMs. Local-first privacy, unified chat & OpenAI API.
  2. Deepseek-cli (https://github.com/holasoymalva/deepseek-cli)
     Terminal AI coding assistant powered by DeepSeek Coder.
  3. Spark AR - Art Series (https://devpost.com/software/spart-ar)
     Interactive guide for Instagram AR filter creators & museum experiences.
  4. Sayme (https://devpost.com/software/sayme)
     AI Chatbot assistant for travelers with computer vision & translation.
`,
    exp: `
[CAREER TRAYECTORIA]
  • BlackLine       - Software Engineer (Current)
  • Guros           - Tech Lead
  • HeyGrows        - Product Manager / Co-Founder
  • Globant         - Software Engineer
  • Meta DevC CDMX  - Co-Dev Lead
  • Coderhouse      - Tech Instructor
  • Grupo Salinas   - Software Engineer
`,
    contact: `
[COMMUNICATION FREQUENCY]
  • Email     : contact@holasoymalva.com
  • GitHub    : https://github.com/holasoymalva
  • LinkedIn  : https://www.linkedin.com/in/martin-manriquez/
  • X/Twitter : https://twitter.com/holasoymalva
  • Instagram : https://www.instagram.com/holasoymalva/
`,
    "sudo hire": `
[INSERT COIN] High Priority Offer Registered! 🪙
Notification sent directly to contact@holasoymalva.com!
`,
  };

  function init() {
    modal = document.getElementById("terminalModal");
    input = document.getElementById("terminalInput");
    output = document.getElementById("terminalOutput");
    closeBtn = document.getElementById("terminalClose");
    const triggers = document.querySelectorAll(".terminal-trigger");

    if (!modal || !input || !output) return;

    triggers.forEach((trig) => {
      trig.addEventListener("click", openTerminal);
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeTerminal);
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeTerminal();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const cmd = input.value.trim().toLowerCase();
        handleCommand(cmd);
        input.value = "";
      }
    });
  }

  function openTerminal() {
    modal.classList.add("active");
    input.focus();
  }

  function closeTerminal() {
    modal.classList.remove("active");
  }

  function handleCommand(cmd) {
    appendLine(`~/arcade $ ${cmd}`, "terminal-prompt");

    if (cmd === "") return;

    if (cmd === "clear") {
      output.innerHTML = "";
      return;
    }

    if (cmd === "matrix") {
      appendLine("Initiating 8-bit CRT matrix sequence...", "highlight");
      triggerMatrixEffect();
      return;
    }

    if (cmd === "theme") {
      const modeBtn = document.getElementById("modeButton");
      if (modeBtn) modeBtn.click();
      appendLine("CRT Theme Toggled.", "highlight");
      return;
    }

    if (commands[cmd]) {
      appendLine(commands[cmd]);
    } else if (cmd.startsWith("sudo hire")) {
      appendLine(commands["sudo hire"]);
    } else {
      appendLine(`Command not recognized: '${cmd}'. Type 'help' for arcade instructions.`, "error");
    }

    output.scrollTop = output.scrollHeight;
  }

  function appendLine(text, className = "") {
    const line = document.createElement("div");
    line.className = className;
    line.textContent = text;
    output.appendChild(line);
  }

  function triggerMatrixEffect() {
    let count = 0;
    const chars = "010101010101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%*<>~";
    const interval = setInterval(() => {
      let str = "";
      for (let i = 0; i < 40; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      appendLine(str, "matrix-line");
      output.scrollTop = output.scrollHeight;
      count++;
      if (count > 25) clearInterval(interval);
    }, 40);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
