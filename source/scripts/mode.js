(function () {
  const modeButton = document.getElementById("modeButton");
  const body = document.body;

  // Default theme is dark for Locomotive aesthetics
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
  }

  if (modeButton) {
    modeButton.addEventListener("click", () => {
      body.classList.toggle("light-mode");
      const isLight = body.classList.contains("light-mode");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      modeButton.innerHTML = isLight ? "☀️ LIGHT" : "🌙 DARK";
    });
  }
})();