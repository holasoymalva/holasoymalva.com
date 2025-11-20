// /Users/malva/Desktop/holasoymalva.com/source/scripts/scroll.js
document.addEventListener('DOMContentLoaded', () => {
  const groups = [
    { selector: '.marvel__intro', type: null },
    { selector: '.marvel__section', type: null },
    { selector: '.marvel__card', type: null },
    { selector: '.project', type: 'reveal-zoom' },
    { selector: '.marvel__column li', type: 'reveal-left' },
    { selector: '.stage', type: null },
    { selector: 'footer', type: null }
  ];

  const elements = [];
  groups.forEach(g => {
    document.querySelectorAll(g.selector).forEach(el => elements.push({ el, type: g.type }));
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  elements.forEach(({ el, type }, idx) => {
    el.classList.add('reveal');
    if (type) el.classList.add(type);
    el.style.setProperty('--reveal-delay', `${Math.min(idx * 60, 360)}ms`);
    if (prefersReduced) {
      el.classList.add('in-view');
    } else {
      observer.observe(el);
    }
  });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    const t = el.dataset.reveal;
    el.classList.add('reveal');
    if (t) el.classList.add(`reveal-${t}`);
    prefersReduced ? el.classList.add('in-view') : observer.observe(el);
  });
});