const translations = {
  en: {
    heroTag: "Available for High-Impact Projects",
    heroTitle: "CREATIVE SOFTWARE ENGINEER & TECH ARCHITECT",
    heroSubtitle: "Hi, I'm Martin Manriquez (@holasoymalva). Building next-gen AI tools, WebGL experiences, and high-performance distributed systems.",
    exploreBtn: "Explore Selected Works",
    terminalBtn: "Launch CLI Shell ~",
    
    ticker1: "META ALUMNI",
    ticker2: "BLACKLINE SOFTWARE ENGINEER",
    ticker3: "GUROS TECH LEAD",
    ticker4: "CREATIVE CODING & WEBGL",
    ticker5: "AI AGENTS & CLI TOOLS",

    aboutTag: "01 // ABOUT ME",
    aboutTitle: "Engineering with humor, precision & high speed.",
    aboutP1: "I am a Software Engineer based in Mexico City with experience at world-class companies like Meta (Co-Dev Lead Meta DevC), Globant, Grupo Salinas, Guros, and BlackLine.",
    aboutP2: "Passionate about Python, TypeScript, Go, WebGL 3D, and AI agent architectures. From building financial platforms to open-source developer CLI assistants, I love solving hard technical challenges.",

    expTag: "02 // CAREER JOURNEY",
    expTitle: "Proven track record at top tech companies.",

    techTag: "03 // TECH STACK PHYSICS",
    techTitle: "Drag & interact with my engineering toolkit.",

    projectsTag: "04 // FEATURED WORKS",
    projectsTitle: "Award-caliber applications & AI tools.",

    resourcesTag: "05 // KNOWLEDGE BASE",
    resourcesTitle: "Guides & Community Resources.",

    contactTag: "06 // GET IN TOUCH",
    contactTitle: "LET'S BUILD SOMETHING CRAZY TOGETHER",
    contactSub: "Have a project, startup idea, or technical challenge? Reach out and let's talk.",

    footerMsg: "Crafted with 🌮, WebGL & Good Vibes in Mexico City."
  },
  es: {
    heroTag: "Disponible para proyectos de alto impacto",
    heroTitle: "CREATIVE SOFTWARE ENGINEER & TECH ARCHITECT",
    heroSubtitle: "Hola, soy Martín Manríquez (@holasoymalva). Construyendo herramientas de IA de última generación, experiencias WebGL y sistemas distribuidos de alto rendimiento.",
    exploreBtn: "Explorar Trabajos",
    terminalBtn: "Abrir Terminal CLI ~",

    ticker1: "META ALUMNI",
    ticker2: "BLACKLINE SOFTWARE ENGINEER",
    ticker3: "GUROS TECH LEAD",
    ticker4: "CREATIVE CODING & WEBGL",
    ticker5: "HERRAMIENTAS IA & CLI",

    aboutTag: "01 // SOBRE MÍ",
    aboutTitle: "Ingeniería con precisión, velocidad y buen humor.",
    aboutP1: "Soy Ingeniero de Software basado en Ciudad de México con experiencia en compañías de nivel mundial como Meta (Co-Dev Lead Meta DevC), Globant, Grupo Salinas, Guros y BlackLine.",
    aboutP2: "Apasionado por Python, TypeScript, Go, WebGL 3D y arquitecturas de agentes de IA. Desde la creación de plataformas financieras hasta asistentes CLI open-source, me encanta resolver grandes retos técnicos.",

    expTag: "02 // TRAYECTORIA",
    expTitle: "Experiencia comprobada en líderes tecnológicos.",

    techTag: "03 // FÍSICAS DE TECH STACK",
    techTitle: "Arrastra e interactúa con mi toolkit de ingeniería.",

    projectsTag: "04 // PROYECTOS DESTACADOS",
    projectsTitle: "Aplicaciones y herramientas IA de alto nivel.",

    resourcesTag: "05 // RECURSOS & COMUNIDAD",
    resourcesTitle: "Guías y contenido de valor para devs.",

    contactTag: "06 // CONTACTO",
    contactTitle: "HAGAMOS ALGO INCREÍBLE JUNTOS",
    contactSub: "¿Tienes un proyecto, idea o desafío técnico? Escríbeme y pongámonos en contacto.",

    footerMsg: "Creado con 🌮, WebGL y Good Vibes en CDMX."
  }
};

(function () {
  let currentLang = localStorage.getItem("preferredLang") || "en";

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("preferredLang", lang);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    const langBtn = document.getElementById("languageButton");
    if (langBtn) {
      langBtn.innerHTML = lang === "en" ? "🇺🇸 EN" : "🇪🇸 ES";
    }
  }

  function init() {
    setLanguage(currentLang);

    const langBtn = document.getElementById("languageButton");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        const nextLang = currentLang === "en" ? "es" : "en";
        setLanguage(nextLang);
      });
    }
  }

  window.addEventListener("DOMContentLoaded", init);
  window.setLanguage = setLanguage;
})();
