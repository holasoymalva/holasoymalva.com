const translations = {
  en: {
    intro: "Hi, I’m <span class='t__marker'>Martin</span><span class='wave'>👋</span>",
    introDescription: "Developer, Maker & Designer",
    about: "Hi <span class='wave'>👋</span>, My name is <span class='t__uva'>Martin</span> and I am a <span class='t__bold t__uva'>Software Engineer 🧑🏽‍💻</span> with experience at companies like <span class='t__uva'>Facebook, Amazon, and Disney</span>, as well as various open source projects. I am passionate about using my skills to build innovative and user-friendly applications that make a positive impact on people's lives.",
    techStack: "My main technology stack includes <span class='t__uva'>6+ years of JavaScript and TypeScript</span>,  along with <span class='t__uva'>3+ years of Python</span> experience. I specialize in modern web frameworks like <span class='t__uva'>Angular, React, and Vue.js</span>, and have extensive experience with cloud platforms including <span class='t__uva'>AWS and Google Cloud Platform</span>.",
    experience: "In my career, I have had the opportunity to work on a wide range of projects, from large-scale web applications to small utility tools, and I have always enjoyed the challenge of finding creative solutions to complex problems. While I take my work seriously, I also believe in having fun and bringing a sense of humor to everything I do.",
    contact: "I hope this website gives you a sense of who I am as a developer and a person, and I look forward to connecting with you and learning more about your projects and interests. Thank you for visiting!",

    // Section titles
    aboutTitle: "<span class='t__marker'>About</span> Me",
    techStackTitle: "<span class='t__marker'>Tech</span>Stack",
    experienceTitle: "My<span class='t__marker'>Experience</span>",
    projectsTitle: "My<span class='t__marker'>Projects</span>",
    contactTitle: "<span class='t__marker'>Contact</span>Me",
    contentTitle: "<span class='t__marker'>Content</span> and resources",

    // Job titles and positions
    softwareEngineer: "Software Engineer",
    coDevLead: "Co Dev Lead",
    teacher: "Teacher",
    techLead: "Tech Lead",
    productManager: "Product Manager - Co Founder",

    // Projects section
    projectsIntro: "I'm Working full-time at <span class='t__uva t__rainbow'>BlackLine</span> while I study a <a href='https://www.sps.nyu.edu/homepage/academics/divisions-and-departments/division-of-applied-undergraduate-studies/credit-for-nyux-microbachelors-programs.html' target='_blank' class='t__uva t__rainbow'>MicroBachelors® in Computer Science</a>, But I'm open to experimenting and working on projects that are of interest to me, some of which you can see here <span class='wave'>👇</span>",

    // Project descriptions
    artSeriesTitle: "Spark AR - Art Series",
    artSeriesDesc: "A practical guide with the use of resources of public domine to create interactive experiences for museums, artists, schools or everyone who love instagram filters. 🚀.",
    saymeTitle: "Sayme",
    saymeDesc: "A chatbot assistant for travers, with the use of translations and image processing. 🚀.",

    // Resources section
    englishResources: "Resources for learning English",
    webDevResources: "Resources for learning Web Development",
    cvFormat: "CV Format",

    // Footer
    footer: "Made with 🌮 and Good Vibes 🍟"
  },
  es: {
    intro: "Hola, soy <span class='t__marker'>Martin</span><span class='wave'>👋</span>",
    introDescription: "Desarrollador, Creador y Diseñador",
    about: "Hola <span class='wave'>👋</span>, Mi nombre es <span class='t__uva'>Martin</span> y soy un <span class='t__bold t__uva'>Ingeniero de Software 🧑🏽‍💻</span> con experiencia en empresas como <span class='t__uva'>Facebook, Amazon y Disney</span>, así como en varios proyectos de código abierto. Me apasiona usar mis habilidades para crear aplicaciones innovadoras y fáciles de usar que tengan un impacto positivo en la vida de las personas.",
    techStack: "Mi stack tecnológico principal incluye <span class='t__uva'>más de 6 años de experiencia en JavaScript y TypeScript</span>, junto con <span class='t__uva'>más de 3 años de experiencia en Python</span>. Me especializo en frameworks web modernos como <span class='t__uva'>Angular, React y Vue.js</span>, y tengo amplia experiencia con plataformas cloud incluyendo <span class='t__uva'>AWS y Google Cloud Platform</span>.",
    experience: "En mi carrera, he tenido la oportunidad de trabajar en una amplia gama de proyectos, desde aplicaciones web a gran escala hasta pequeñas herramientas utilitarias, y siempre he disfrutado el desafío de encontrar soluciones creativas a problemas complejos. Aunque tomo mi trabajo en serio, también creo en divertirme y traer un sentido del humor a todo lo que hago.",
    contact: "Espero que este sitio web te dé una idea de quién soy como desarrollador y persona, y espero conectar contigo y aprender más sobre tus proyectos e intereses. ¡Gracias por visitar!",
    // Section titles
    aboutTitle: "<span class='t__marker'>Sobre</span> Mí",
    techStackTitle: "<span class='t__marker'>Stack</span> Tecnológico",
    experienceTitle: "Mi<span class='t__marker'>Experiencia</span>",
    projectsTitle: "Mis<span class='t__marker'>Proyectos</span>",
    contactTitle: "<span class='t__marker'>Contáctame</span>",
    contentTitle: "<span class='t__marker'>Contenido</span> y recursos",

    // Job titles and positions
    softwareEngineer: "Ingeniero de Software",
    coDevLead: "Co Líder de Desarrollo",
    teacher: "Profesor",
    techLead: "Líder Técnico",
    productManager: "Gerente de Producto - Co Fundador",

    // Projects section
    projectsIntro: "Estoy trabajando tiempo completo en <span class='t__uva t__rainbow'>BlackLine</span> mientras estudio una <a href='https://www.sps.nyu.edu/homepage/academics/divisions-and-departments/division-of-applied-undergraduate-studies/credit-for-nyux-microbachelors-programs.html' target='_blank' class='t__uva t__rainbow'>Micro-Licenciatura® en Ciencias de la Computación</a>, pero estoy abierto a experimentar y trabajar en proyectos que sean de mi interés, algunos de los cuales puedes ver aquí <span class='wave'>👇</span>",

    // Project descriptions
    artSeriesTitle: "Spark AR - Serie de Arte",
    artSeriesDesc: "Una guía práctica con el uso de recursos de dominio público para crear experiencias interactivas para museos, artistas, escuelas o todos los que aman los filtros de Instagram. 🚀.",
    saymeTitle: "Sayme",
    saymeDesc: "Un asistente chatbot para viajeros, con el uso de traducciones y procesamiento de imágenes. 🚀.",

    // Resources section
    englishResources: "Recursos para aprender inglés",
    webDevResources: "Recursos para aprender desarrollo web",
    cvFormat: "Formato de CV",

    // Footer
    footer: "Hecho con 🌮 y Buenas Vibras 🍟"
  }
};
let currentLanguage = localStorage.getItem('language') || navigator.language.split('-')[0];
if (!translations[currentLanguage]) currentLanguage = 'en';

function updateTranslations() {
  const elements = {
    // Basic content
    'intro': { type: 'innerHTML' },
    'introDescription': { type: 'textContent' },
    'about': { type: 'innerHTML' },
    'techStack': { type: 'innerHTML' },
    'experience': { type: 'innerHTML' },
    'contact': { type: 'innerHTML' },
    
    // Section titles - Ahora usando IDs directamente
    'aboutTitle': { type: 'innerHTML' },
    'techStackTitle': { type: 'innerHTML' },
    'experienceTitle': { type: 'innerHTML' },
    'projectsTitle': { type: 'innerHTML' },
    'contactTitle': { type: 'innerHTML' },
    'contentTitle': { type: 'innerHTML' },
    
    // Projects
    'projectsIntro': { type: 'innerHTML' },
    'artSeriesTitle': { type: 'innerHTML', selector: '.project:nth-child(1) .t__uva' },
    'artSeriesDesc': { type: 'innerHTML', selector: '.project:nth-child(1) .project__description' },
    'saymeTitle': { type: 'innerHTML', selector: '.project:nth-child(2) .t__uva' },
    'saymeDesc': { type: 'innerHTML', selector: '.project:nth-child(2) .project__description' },
    
    // Resources
    'englishResources': { type: 'textContent', selector: 'li:nth-child(1) a' },
    'webDevResources': { type: 'textContent', selector: 'li:nth-child(2) a' },
    'cvFormat': { type: 'textContent', selector: 'li:nth-child(3) a' },
    
    // Footer
    'footer': { type: 'innerHTML', selector: 'footer' }
  };

  // Actualizar elementos por ID o selector
  for (const [key, config] of Object.entries(elements)) {
    const element = config.selector ?
      document.querySelector(config.selector) :
      document.getElementById(key);

    if (element && translations[currentLanguage][key]) {
      element[config.type] = translations[currentLanguage][key];
    }
  }

  // Update job titles
  document.querySelectorAll('.mrg-20.t__uva').forEach(element => {
    const currentText = element.textContent.trim();
    const translationKey = Object.keys(translations.en).find(key =>
      translations.en[key] === currentText || translations.es[key] === currentText
    );
    if (translationKey) {
      element.textContent = translations[currentLanguage][translationKey];
    }
  });
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
  document.documentElement.lang = currentLanguage;
  localStorage.setItem('language', currentLanguage);
  updateTranslations();
}

// Initialize translations and event listener
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.lang = currentLanguage;
  updateTranslations();
  document.getElementById('languageButton').addEventListener('click', toggleLanguage);
});
