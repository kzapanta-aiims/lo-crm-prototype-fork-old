/* ==========================================================================
   Audience — B2C (light) or B2B (dark).
   --------------------------------------------------------------------------
   Loaded in <head>, not deferred, so the attribute is on <html> before the
   first paint and a dark page never flashes light. css/m3.css keys every
   colour role off html[data-audience].

   Where it comes from, first match wins:
     ?aud=b2b / ?aud=b2c   — a link that wants a specific audience
     localStorage          — what the prototype view's toggle last chose
     b2c                   — the default

   The prototype view writes localStorage; the 'storage' event carries that
   into every open frame, so its toggle flips them without a reload.
   ========================================================================== */
(function () {
  const KEY = 'lo-audience';
  const valid = (a) => (a === 'b2b' || a === 'b2c') ? a : null;
  const set = (a) => { document.documentElement.dataset.audience = valid(a) || 'b2c'; };

  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  set(valid(new URLSearchParams(location.search).get('aud')) || stored);

  window.addEventListener('storage', (e) => { if (e.key === KEY) set(e.newValue); });
})();
