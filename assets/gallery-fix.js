// gallery-fix.js
// Clears any "stuck" :hover state left behind by fast trackpad scrolling.
// Standard technique: briefly disable pointer-events on the whole document
// during scroll, which forces the browser to drop stale hover state; hover
// is recalculated fresh from the real cursor position once scrolling stops.
(function () {
  let ticking = false;
  function unstickHover() {
    document.documentElement.style.pointerEvents = 'none';
    requestAnimationFrame(function () {
      document.documentElement.style.pointerEvents = '';
      ticking = false;
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      unstickHover();
    }
  }, { passive: true });
})();
