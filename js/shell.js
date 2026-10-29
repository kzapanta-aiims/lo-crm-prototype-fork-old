/* ==========================================================================
   Prototype shell — the harness that frames a screen's versions.
   --------------------------------------------------------------------------
   One shell, two prototype views: index.html frames the work list, and
   screen2.html frames the new screen. Each page says what it is and which
   versions it has through `window.SHELL`, set inline before this script:

     window.SHELL = {
       title: 'Work list view',           // the name in the toolbar
       sub:   'LoanOptions CRM prototype',
       start: 'v2',                       // which version opens first
       tour:  true,                       // show the replay-the-tour button
       versions: [ { id, label, sub, file, note } ]
     };

   Add a version to that array and it appears everywhere — tabs, compare
   pickers, keyboard shortcuts and deep links. With only one version the
   compare control stands down, since there is nothing to hold it against.
   ========================================================================== */

/* The LoanOptions mark, as the toolbar badge. The screens take theirs from
   the icon sprite; the harness sits outside that, so it carries its own. */
const SHELL_MARK = `
  <svg width="16" height="9.5" viewBox="0 0 30.0983 17.7854" fill="currentColor">
    <path d="M10.7665 17.7558C12.0956 17.7558 13.1728 16.6893 13.1728 15.3741C13.1728 14.059 12.0956 12.9924 10.7665 12.9924C9.43738 12.9924 8.36021 14.059 8.36021 15.3741C8.36021 16.6893 9.43738 17.7558 10.7665 17.7558Z"/>
    <path d="M27.692 5.69292C29.0211 5.69292 30.0983 4.62633 30.0983 3.31119C30.0983 1.99604 29.0211 0.929456 27.692 0.929456C26.3629 0.929456 25.2857 1.99604 25.2857 3.31119C25.2857 4.62633 26.3629 5.69292 27.692 5.69292Z"/>
    <path d="M25.6679 6.40334C24.5917 5.65387 23.1248 5.93385 22.3914 7.03472L19.6742 11.1011L12.962 1.0523C12.5209 0.395209 11.795 0 11.0147 0C10.2345 0 9.50856 0.3914 9.0674 1.0523L0.410747 13.9856C-0.322661 15.0865 -0.0482183 16.5855 1.02895 17.3349C1.43733 17.6197 1.90004 17.7558 2.35526 17.7558C3.10647 17.7558 3.84737 17.3863 4.30259 16.7035L11.011 6.68427L17.724 16.7331C18.1652 17.3902 18.8911 17.7854 19.6714 17.7854C20.4516 17.7854 21.1775 17.394 21.6187 16.7331L26.2833 9.75357C27.0204 8.6527 26.746 7.15376 25.6688 6.40429L25.6679 6.40334Z"/>
  </svg>`;

(function () {

const cfg = window.SHELL;
if (!cfg || !cfg.versions || !cfg.versions.length) return;

const VERSIONS = cfg.versions;

/* One version has nothing to be held against, so the control and its
   shortcut stand down rather than sitting there doing nothing. */
const CAN_COMPARE = VERSIONS.length > 1;

const W = 1920, H = 1080;

/* Versions get rewritten in place during iteration, so the filename alone is
   not enough to bust the browser cache — a stale frame would show the previous
   design under the current name. One token per shell load keeps frames fresh. */
const BUILD = Date.now();

/* The version pages read `tour` to decide whether to run their spotlight
   tour: off in the side-by-side view, where two at once would be chaos,
   and forced for one render after the toolbar button is pressed. */
let tourForce = false;
const bust = (file, mode) => `${file}?b=${BUILD}&tour=${mode}`;

const $ = (s) => document.querySelector(s);
const byId = (id) => VERSIONS.find(v => v.id === id) || VERSIONS[0];

const state = {
  current: byId(cfg.start).id,
  compare: false,
  left: VERSIONS[0].id,
  right: (VERSIONS[1] || VERSIONS[0]).id,
  fit: true
};

/* ---------- Chrome ---------- */

document.body.insertAdjacentHTML('afterbegin', `
<div class="bar">
  <div class="bar__brand">
    <div class="bar__mark">${SHELL_MARK}</div>
    <div>
      <div class="bar__title">${cfg.title}</div>
      <div class="bar__sub">${cfg.sub || ''}</div>
    </div>
  </div>

  <div class="seg" id="seg" role="tablist"></div>

  <span class="bar__spacer"></span>

  <div class="aud" id="aud" role="radiogroup" aria-label="Audience" title="Audience for the M3 versions — B2C is light, B2B is dark (A). The original versions are light only.">
    <button role="radio" data-aud="b2c">B2C · Light</button>
    <button role="radio" data-aud="b2b">B2B · Dark</button>
  </div>

  ${cfg.tour ? `<button class="ctrl ctrl--tour" id="tourBtn" title="Replay the spotlight tour from ${VERSIONS[0].label}">Highlight the points of interest</button>` : ''}
  ${CAN_COMPARE ? `<button class="ctrl" id="compareBtn" aria-pressed="false">Compare <span class="kbd">C</span></button>` : ''}
  <button class="ctrl" id="zoomBtn">Fit <span class="kbd">Z</span></button>
  <a class="ctrl" id="openBtn" target="_blank" rel="noopener">Open full size &nearr;</a>
</div>

<div class="stage" id="stage"></div>

<div class="hint" id="hint">
  <span><span id="hintKeys"></span> switch</span>
  <span><span class="kbd">&larr;</span> <span class="kbd">&rarr;</span> step</span>
  ${CAN_COMPARE ? '<span><span class="kbd">C</span> compare</span>' : ''}
  <span><span class="kbd">Z</span> zoom</span>
</div>`);

/* ---------- URL state so a view can be bookmarked or shared ---------- */

function readHash() {
  const h = decodeURIComponent(location.hash.replace(/^#/, ''));
  if (!h) return;
  if (h.startsWith('compare=') && CAN_COMPARE) {
    const [l, r] = h.slice(8).split(',');
    if (VERSIONS.some(v => v.id === l) && VERSIONS.some(v => v.id === r)) {
      state.compare = true;
      state.left = l;
      state.right = r;
    }
  } else if (VERSIONS.some(v => v.id === h)) {
    state.compare = false;
    state.current = h;
  }
}

function writeHash() {
  const h = state.compare ? `compare=${state.left},${state.right}` : state.current;
  history.replaceState(null, '', '#' + h);
}

/* ---------- Toolbar ---------- */

function renderTabs() {
  $('#seg').innerHTML = VERSIONS.map(v => `
    <button role="tab" data-id="${v.id}" aria-selected="${!state.compare && state.current === v.id}" title="${v.note}">
      <span class="seg__label">${v.label}</span>
      <span class="seg__sub">${v.sub}</span>
    </button>`).join('');

  $('#seg').querySelectorAll('button').forEach(b => {
    b.onclick = () => { state.compare = false; state.current = b.dataset.id; render(); };
  });

  if (CAN_COMPARE) $('#compareBtn').setAttribute('aria-pressed', String(state.compare));
  $('#zoomBtn').firstChild.nodeValue = state.fit ? 'Fit ' : '100% ';
  /* Opened on its own it is still a first view, so the tour applies there
     too — and if it has already been seen, 'auto' leaves it alone. */
  $('#openBtn').href = bust(state.compare ? byId(state.left).file : byId(state.current).file, 'auto');
}

/* ---------- Stage ---------- */

function paneMarkup(id, side) {
  const v = byId(id);
  const mode = side ? 'off' : (tourForce ? 'force' : 'auto');
  const picker = side
    ? `<select class="pane__select" data-side="${side}">
         ${VERSIONS.map(o => `<option value="${o.id}" ${o.id === id ? 'selected' : ''}>${o.label} — ${o.sub}</option>`).join('')}
       </select>`
    : `<span class="pane__meta">${v.note}</span>`;
  return `
    <div class="pane" data-pane="${side || 'single'}">
      <div class="pane__head">
        <span class="pane__name">${v.label}${side ? '' : ' · ' + v.sub}</span>
        ${picker}
      </div>
      <div class="holder">
        <div class="holder__inner"><iframe src="${bust(v.file, mode)}" title="${v.label}" loading="eager"></iframe></div>
      </div>
    </div>`;
}

function render() {
  const stage = $('#stage');
  stage.innerHTML = state.compare
    ? paneMarkup(state.left, 'left') + paneMarkup(state.right, 'right')
    : paneMarkup(state.current, null);

  stage.querySelectorAll('.pane__select').forEach(sel => {
    sel.onchange = () => { state[sel.dataset.side] = sel.value; render(); };
  });

  renderTabs();
  writeHash();
  scale();
  tourForce = false;      // one render only
}

/* Scale each frame to fit, sizing the holder to the scaled box so the
   flex centring stays honest. */
function scale() {
  const stage = $('#stage');
  const panes = [...stage.querySelectorAll('.pane')];
  if (!panes.length) return;

  const gap = 24, padding = 48, headH = 32;
  const availW = (stage.clientWidth - padding - (panes.length - 1) * gap) / panes.length;
  const availH = stage.clientHeight - padding - headH;

  const s = state.fit ? Math.min(1, availW / W, availH / H) : 1;

  panes.forEach(p => {
    const holder = p.querySelector('.holder');
    const inner = p.querySelector('.holder__inner');
    holder.style.width = Math.round(W * s) + 'px';
    holder.style.height = Math.round(H * s) + 'px';
    inner.style.transform = `scale(${s})`;
  });
}

/* ---------- Controls ---------- */

if (CAN_COMPARE) {
  $('#compareBtn').onclick = () => {
    state.compare = !state.compare;
    if (state.compare && state.left === state.right) {
      state.right = state.current;
      state.left = VERSIONS.find(v => v.id !== state.current).id;
    }
    render();
  };
}

$('#zoomBtn').onclick = () => { state.fit = !state.fit; renderTabs(); scale(); };

/* Audience. The frames read it from localStorage (js/audience.js), and the
   'storage' event reaches every frame that is open, so writing it here is
   enough to flip both panes of a compare at once. */
const AUD_KEY = 'lo-audience';
function readAud() { try { return localStorage.getItem(AUD_KEY) === 'b2b' ? 'b2b' : 'b2c'; } catch (e) { return 'b2c'; } }
function setAud(a) {
  try { localStorage.setItem(AUD_KEY, a); } catch (e) {}
  $('#aud').querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', String(b.dataset.aud === a)));
}
$('#aud').querySelectorAll('button').forEach(b => { b.onclick = () => setAud(b.dataset.aud); });
setAud(readAud());

/* Replaying clears what each version remembers of its tour and drops back to
   the first one, which is where the full set of points lives. */
if (cfg.tour) {
  $('#tourBtn').onclick = () => {
    VERSIONS.forEach(v => { try { sessionStorage.removeItem(`lo-tour:${v.id}`); } catch (e) {} });
    tourForce = true;
    state.compare = false;
    state.current = VERSIONS[0].id;
    render();
  };
}

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'SELECT') return;
  const k = e.key.toLowerCase();

  if (k >= '1' && k <= String(VERSIONS.length)) {
    state.compare = false;
    state.current = VERSIONS[+k - 1].id;
    render();
  } else if (k === 'arrowright' || k === 'arrowleft') {
    const i = VERSIONS.findIndex(v => v.id === state.current);
    const next = (i + (k === 'arrowright' ? 1 : VERSIONS.length - 1)) % VERSIONS.length;
    state.compare = false;
    state.current = VERSIONS[next].id;
    render();
  } else if (k === 'c' && CAN_COMPARE) {
    $('#compareBtn').click();
  } else if (k === 'z') {
    $('#zoomBtn').click();
  } else if (k === 'a') {
    setAud(readAud() === 'b2b' ? 'b2c' : 'b2b');
  }
});

window.addEventListener('resize', scale);
window.addEventListener('hashchange', () => { readHash(); render(); });

/* One key per version, so the hint cannot fall behind the version list. */
$('#hintKeys').innerHTML = VERSIONS.map((v, i) => `<span class="kbd">${i + 1}</span>`).join(' ');

readHash();
render();

setTimeout(() => $('#hint').classList.add('hint--gone'), 5000);

})();
