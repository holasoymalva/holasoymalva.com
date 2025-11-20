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
  const supportsIO = 'IntersectionObserver' in window;
  const observer = supportsIO ? new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }) : null;

  function inViewport(el) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    return r.top <= vh * 0.9 && r.bottom >= vh * 0.1 && r.right >= 0 && r.left <= vw;
  }
  function fallbackObserve(el) {
    if (inViewport(el)) { el.classList.add('in-view'); return; }
    const handler = () => { if (inViewport(el)) { el.classList.add('in-view'); window.removeEventListener('scroll', handler); window.removeEventListener('resize', handler); } };
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
  }

  elements.forEach(({ el, type }, idx) => {
    el.classList.add('reveal');
    if (type) el.classList.add(type);
    el.style.setProperty('--reveal-delay', `${Math.min(idx * 60, 360)}ms`);
    if (prefersReduced) {
      el.classList.add('in-view');
    } else if (supportsIO) {
      observer.observe(el);
    } else {
      fallbackObserve(el);
    }
  });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    const t = el.dataset.reveal;
    el.classList.add('reveal');
    if (t) el.classList.add(`reveal-${t}`);
    if (prefersReduced) {
      el.classList.add('in-view');
    } else if (supportsIO) {
      observer.observe(el);
    } else {
      fallbackObserve(el);
    }
  });
});