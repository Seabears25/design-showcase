// site.js — shared behavior for every template. No dependencies.

document.addEventListener('DOMContentLoaded', () => {

  // Scroll-triggered reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Nav gains a border/background once the page has scrolled
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile drawer
  const toggle = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (toggle && drawer) {
    const close = () => { drawer.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
    const open = () => { drawer.classList.add('is-open'); toggle.setAttribute('aria-expanded', 'true'); };
    toggle.addEventListener('click', () => {
      drawer.classList.contains('is-open') ? close() : open();
    });
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    const drawerClose = drawer.querySelector('.mobile-drawer-close');
    if (drawerClose) drawerClose.addEventListener('click', close);
  }

});
