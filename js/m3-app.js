/* ==========================================================================
   M3 versions — work list, board and Easy View, in stock Material 3.
   --------------------------------------------------------------------------
   Same deals as every other version (js/data.js); only the presentation is
   new. The page says which screen it is with
   `window.M3_VIEW = 'list' | 'board' | 'easy'`.

   Hierarchy follows the brokers' own priority list. On a card or row,
   most important first:
     who · how much · what's next (loud when overdue) · where it's at ·
     who referred it · whose it is · days in stage · documents ·
     source and reference (lowest)
   and five things that must jump out:
     a new lead · a new lead not called within 15 minutes · overdue work ·
     documents the customer uploaded that need checking · a possible duplicate

   Views, filters, search and sort are real: they run on the deals and apply
   instantly. The order is stable — it only changes when the broker changes
   the sort — and the state survives moving between List, Board and Easy
   View. Actions (call, message, quick menu, bulk) answer with a snackbar;
   nothing is written anywhere except Easy View's pins, notes and dates,
   which are the broker's own and are kept in localStorage.
   ========================================================================== */

(function () {

const VIEW = window.M3_VIEW || 'list';
const ME = 'KZ';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ic = (name, extra = '') => `<md-icon ${extra}>${name}</md-icon>`;
const T  = (role, text, cls = '') => `<span class="md-typescale-${role} ${cls}">${text}</span>`;
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
const first = (d) => d.name.split(' ')[0];
const refShort = (d) => d.ref.replace('#', '');
const store = {
  get(k, dflt) { try { const v = localStorage.getItem(k); return v == null ? dflt : JSON.parse(v); } catch (e) { return dflt; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ---------- What the model does not carry yet -----------------------------
   Contact details for search, and how long ago each new lead arrived (the
   15-minute rule needs it). Mocked, deterministically, off the deal. */

const ARRIVED = { 'Ruben Alvarez': 4, 'Maria Josephin': 22, 'Sofia Kostova': 9 };
DEALS.forEach((d, i) => {
  d.key = `d${i}`;
  const n = d.ref.replace(/\D/g, '');
  d.phone = `04${n.slice(-2)} ${n.slice(-3)} ${n.slice(-3, -1)}${n.slice(-1)}${n.slice(-2, -1)}`.slice(0, 12);
  d.email = `${d.name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`;
  d.abn = d.segment === 'commercial' ? `${n}${n}${n}`.slice(0, 11) : '';
  d.arrived = ARRIVED[d.name] ?? 6;
});

const REJECTED_WHY = {
  'ID': 'Licence has expired — needs a current one',
  'Payslips': 'Older than 90 days',
  'Bank statements': 'Pages 2–3 missing',
  'Tax return': 'Not signed',
  'Asset quote': 'Quote is for a different vehicle',
  'Insurance': "Policy isn't in the client's name"
};

/* ---------- Reading a deal -------------------------------------------------- */

const isNewLead = (d) => d.urgency === 'high' && d.master === 'qualifying' && !d.snoozed;
const notCalled = (d) => isNewLead(d) && d.arrived > 15;
const isLate    = (d) => d.tasksOverdue > 0 && !d.snoozed;
const docsOf    = (d, status) => d.docs.map((s, i) => s === status ? DOC_TYPES[i] : null).filter(Boolean);
const bucket    = (d) => isNewLead(d) ? 'newlead' : (d.snoozed ? 'snoozed' : d.master);
const daysTo    = (s) => Math.round((parseDMY(s) - parseDMY(TODAY)) / 86400000);
const plural    = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

function nextAction(d) {
  const c = docCounts(d);
  if (isNewLead(d)) return { text: 'Call new lead', due: notCalled(d) ? `waiting ${d.arrived} min` : 'within 15 min', icon: 'call', late: notCalled(d) };
  if (d.snoozed)    return { text: `Snoozed until ${d.snoozedUntil}`, due: '', icon: 'snooze', late: false };
  if (d.tasksOverdue > 0)
    return { text: d.nextAction || (c.rejected ? 'Re-request rejected document' : `Chase ${first(d)}`),
             due: `${plural(d.tasksOverdue, 'day')} overdue`, icon: 'schedule', late: true };
  if (d.tasksDue > 0)
    return { text: d.nextAction || 'Follow up', due: `due in ${plural(d.tasksDue, 'day')}`, icon: 'event', late: false };
  return { text: d.nextAction || 'Nothing due', due: '', icon: 'check_circle', late: false };
}

/* The loud signals, most urgent first. Overdue and documents have their own
   places on the card, so they are not repeated here. */
function signals(d) {
  const out = [];
  if (notCalled(d))       out.push(`<span class="tag tag--error">${ic('phone_missed')}Not called · ${d.arrived} min</span>`);
  else if (isNewLead(d))  out.push(`<span class="tag tag--new">${ic('bolt')}New · ${d.arrived} min ago</span>`);
  if (d.duplicate)        out.push(`<span class="tag tag--warn" data-tip="dup:${d.key}">${ic('content_copy')}Possible duplicate</span>`);
  return out;
}

/* Document chips: only the two states that need the broker, each with a
   tooltip naming the documents. */
function docTags(d) {
  const c = docCounts(d);
  return [
    c.rejected ? `<span class="tag tag--error" data-tip="rej:${d.key}" tabindex="0">${ic('block')}${c.rejected} rejected</span>` : '',
    c.review   ? `<span class="tag tag--check" data-tip="rev:${d.key}" tabindex="0">${ic('upload_file')}${c.review} to check</span>` : ''
  ].join('');
}

const avatar = (initials, big) =>
  `<span class="avatar ${initials === ME ? 'avatar--me' : ''} ${big ? 'avatar--lg' : ''}" title="${initials === ME ? 'You' : initials}">${initials}</span>`;

/* ---------- Views, filters, sort -------------------------------------------- */

const VIEWS = [
  { id:'mine',      label:'My deals',            of: d => d.assigned[0] === ME },
  { id:'team',      label:'My team',             of: () => true },
  { id:'attention', label:'Needs attention',     of: d => !d.snoozed && (isLate(d) || notCalled(d) || d.duplicate || docCounts(d).rejected > 0) },
  { id:'new',       label:'New today',           of: isNewLead },
  { id:'overdue',   label:'Overdue',             of: isLate },
  { id:'customer',  label:'Waiting on customer', of: d => !d.snoozed && (d.master === 'discovery' || /Awaiting (reply|acceptance)/.test(d.stage)) },
  { id:'lender',    label:'Waiting on lender',   of: d => !d.snoozed && d.master === 'progress' },
  { id:'settling',  label:'Settling this week',  of: d => d.settlement && daysTo(d.settlement) >= 0 && daysTo(d.settlement) <= 7 },
  { id:'docs',      label:'Documents to review', of: d => docCounts(d).review > 0 }
];

const BROKERS = [...new Map(DEALS.map(d => [d.assigned[0], d.assigned[1]])).entries()];
const uniq = (f) => [...new Set(DEALS.map(f).filter(Boolean))];
const groupsOf = [...new Set(Object.values(PARTNER_GROUPS))];

const FILTERS = [
  { id:'broker',  label:'Broker',      opts: BROKERS.map(([k, n]) => [k, n]),                      of: (d, v) => d.assigned[0] === v },
  { id:'stage',   label:'Stage',       opts: [['newlead', 'New lead'], ...MASTER_STAGES.map(s => [s.id, s.label])], of: (d, v) => bucket(d) === v },
  { id:'segment', label:'Customer',    opts: [['consumer', 'Consumer'], ['commercial', 'Commercial']], of: (d, v) => d.segment === v },
  { id:'product', label:'Loan type',   opts: uniq(d => d.product).map(p => [p, p]),                of: (d, v) => d.product === v },
  { id:'source',  label:'Lead source', opts: uniq(d => d.source).map(s => [s, s]),                 of: (d, v) => d.source === v },
  { id:'partner', label:'Partner',
    opts: [...groupsOf.map(g => [`g:${g}`, `${g} (group)`]), ...uniq(d => d.partner && d.partner.join('|')).map(p => p.split('|')).map(([k, n]) => [k, n])],
    of: (d, v) => v.startsWith('g:') ? partnerGroup(d) === v.slice(2) : (d.partner && d.partner[0] === v) },
  { id:'amount',  label:'Amount',      opts: [['lt100', 'Under $100K'], ['100to500', '$100K – $500K'], ['gt500', 'Over $500K']],
    of: (d, v) => v === 'lt100' ? d.amount < 100000 : v === 'gt500' ? d.amount > 500000 : d.amount >= 100000 && d.amount <= 500000 },
  { id:'created', label:'Created',     opts: [['week', 'This week'], ['month', 'This month'], ['older', 'Older']],
    of: (d, v) => { const n = -daysTo(d.created); return v === 'week' ? n <= 7 : v === 'month' ? n > 7 && n <= 31 : n > 31; } }
];

const SORTS = [
  { id:'newest',   label:'Newest first',   by: (a, b) => parseDMY(b.created) - parseDMY(a.created) },
  { id:'oldest',   label:'Oldest first',   by: (a, b) => parseDMY(a.created) - parseDMY(b.created) },
  { id:'activity', label:'Last activity',  by: (a, b) => parseDMY(b.activity) - parseDMY(a.activity) },
  { id:'amount',   label:'Amount',         by: (a, b) => b.amount - a.amount },
  { id:'followup', label:'Next follow-up', by: (a, b) => (b.tasksOverdue - a.tasksOverdue) || ((a.tasksDue || 99) - (b.tasksDue || 99)) }
];

/* One state for all three screens, kept for the session so switching
   between them keeps the view, filters, search and sort. */
const DEFAULT_VIEW = store.get('lo-m3-default-view', 'team');
const state = Object.assign(
  { view: DEFAULT_VIEW, q: '', f: {}, sort: 'newest', hide: ['source'] },
  (() => { try { return JSON.parse(sessionStorage.getItem('lo-m3-state')) || {}; } catch (e) { return {}; } })()
);
const save = () => { try { sessionStorage.setItem('lo-m3-state', JSON.stringify(state)); } catch (e) {} };
const selected = new Set();

const matchesQ = (d) => {
  if (!state.q) return true;
  const q = state.q.toLowerCase().replace(/\s+/g, '');
  return [d.name, d.ref, d.phone, d.email, d.abn, d.partner && d.partner[1]].some(v => v && String(v).toLowerCase().replace(/\s+/g, '').includes(q));
};
const matchesF = (d) => FILTERS.every(g => !(state.f[g.id] || []).length || state.f[g.id].some(v => g.of(d, v)));
const pool = () => DEALS.filter(d => matchesQ(d) && matchesF(d));
const viewOf = (id) => VIEWS.find(v => v.id === id) || VIEWS[1];
const visible = () => pool().filter(viewOf(state.view).of).sort((SORTS.find(s => s.id === state.sort) || SORTS[0]).by);
const filterCount = () => FILTERS.reduce((n, g) => n + ((state.f[g.id] || []).length ? 1 : 0), 0);

/* ---------- Motion -------------------------------------------------------------
   Re-renders go through the View Transitions API where there is one, so a
   filter or a drag animates cards and rows to their new places. */
const transition = (fn) => {
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return fn();
  const vt = document.startViewTransition(fn);
  [vt.ready, vt.finished, vt.updateCallbackDone].forEach(p => p.catch(() => {}));
};

/* ---------- Chrome ------------------------------------------------------------ */

const rail = () => `
  <nav class="rail" aria-label="Main">
    <md-icon-button class="rail__menu" aria-label="Menu">${ic('menu')}</md-icon-button>
    ${[['home', 'Home'], ['group', 'Leads', true], ['task_alt', 'Tasks'], ['inbox', 'Inbox', false, 3], ['bar_chart', 'Reports']]
      .map(([icon, label, on, badge]) => `
      <a class="rail__dest ${on ? 'is-on' : ''}" ${on ? 'aria-current="page"' : ''}>
        <span class="rail__ind">${ic(icon)}${badge ? `<md-badge class="rail__badge" value="${badge}"></md-badge>` : ''}<md-ripple></md-ripple></span>
        ${T('label-medium', label)}
      </a>`).join('')}
    <span class="rail__spacer"></span>
    <md-icon-button aria-label="Settings">${ic('settings')}</md-icon-button>
  </nav>`;

const SCREENS = [['list', 'List', 'view_list', 'worklist-m3.html'], ['board', 'Board', 'view_kanban', 'kanban-m3.html'], ['easy', 'Easy View', 'table_rows', 'easyview-m3.html']];

const topbar = () => `
  <header class="topbar">
    <div class="topbar__lead">
      <h1 class="page-title" style="margin:0">Leads</h1>
      <md-outlined-segmented-button-set aria-label="Screen">
        ${SCREENS.map(([id, label, icon]) => `
          <md-outlined-segmented-button label="${label}" data-screen="${id}" ${VIEW === id ? 'selected' : ''}>${ic(icon, 'slot="icon"')}</md-outlined-segmented-button>`).join('')}
      </md-outlined-segmented-button-set>
    </div>
    <label class="search">
      ${ic('search')}
      <input id="q" type="search" placeholder="Search name, phone, email, reference or ABN" value="${esc(VIEW === 'easy' ? '' : state.q)}" autocomplete="off" aria-label="Search deals">
      <md-icon-button id="q-clear" aria-label="Clear search" ${state.q && VIEW !== 'easy' ? '' : 'style="visibility:hidden"'}>${ic('close')}</md-icon-button>
    </label>
    <div class="topbar__actions">
      <md-icon-button aria-label="Notifications">${ic('notifications')}</md-icon-button>
      <md-filled-button id="new-lead" title="New lead (N)">${ic('add', 'slot="icon"')}New lead</md-filled-button>
      ${avatar(ME, true)}
    </div>
  </header>`;

function toolbar() {
  if (selected.size) return `
    <div class="selbar" role="toolbar" aria-label="Bulk actions">
      <md-icon-button id="sel-clear" aria-label="Clear selection">${ic('close')}</md-icon-button>
      ${T('title-medium', `${selected.size} selected`, 'selbar__n')}
      ${[['person', 'Reassign'], ['swap_horiz', 'Move stage'], ['sms', 'Message'], ['add_task', 'Add task']]
        .map(([icon, label]) => `<md-text-button data-bulk="${label}">${ic(icon, 'slot="icon"')}${label}</md-text-button>`).join('')}
    </div>`;
  const p = pool();
  const fc = filterCount();
  const sort = SORTS.find(s => s.id === state.sort) || SORTS[0];
  return `
    <div class="toolbar">
      <md-chip-set aria-label="Views">
        ${VIEWS.map(v => `<md-filter-chip data-view="${v.id}" label="${v.label}  ${p.filter(v.of).length}" ${state.view === v.id ? 'selected' : ''}></md-filter-chip>`).join('')}
      </md-chip-set>
      <div class="toolbar__end">
        <md-text-button id="saved-btn" trailing-icon>Saved views${ic('arrow_drop_down', 'slot="icon"')}</md-text-button>
        <md-text-button id="filters-btn">${ic('tune', 'slot="icon"')}Filters${fc ? ` · ${fc}` : ''}</md-text-button>
        <md-text-button id="sort-btn">${ic('sort', 'slot="icon"')}${sort.label}</md-text-button>
        ${VIEW === 'list' ? `<md-icon-button id="cols-btn" aria-label="Choose columns" title="Choose columns">${ic('view_column')}</md-icon-button>` : ''}
      </div>
    </div>`;
}

/* Menus live outside the re-rendered content so they survive a render */
const menus = () => `
  <md-menu id="sort-menu" anchor="sort-btn" positioning="popover">
    ${SORTS.map(s => `<md-menu-item data-sort="${s.id}"><div slot="headline">${s.label}</div>${state.sort === s.id ? ic('check', 'slot="end"') : ''}</md-menu-item>`).join('')}
  </md-menu>
  <md-menu id="saved-menu" anchor="saved-btn" positioning="popover">
    <md-menu-item data-saved="hot"><div slot="headline">Kenn's hot list</div>${ic('bookmark', 'slot="start"')}</md-menu-item>
    <md-divider role="separator"></md-divider>
    <md-menu-item data-saved="save"><div slot="headline">Save current view…</div>${ic('bookmark_add', 'slot="start"')}</md-menu-item>
    <md-menu-item data-saved="default"><div slot="headline">Open on this view by default</div>${ic('home', 'slot="start"')}</md-menu-item>
  </md-menu>
  <md-menu id="cols-menu" anchor="cols-btn" positioning="popover">
    ${COLS.filter(c => !c.fixed).map(c => `<md-menu-item data-colpick="${c.id}" keep-open><div slot="headline">${c.label}</div>${ic(state.hide.includes(c.id) ? 'check_box_outline_blank' : 'check_box', 'slot="start"')}</md-menu-item>`).join('')}
  </md-menu>
  <md-menu id="qa-menu" positioning="popover">
    ${[['upload_file', 'Request documents'], ['privacy_tip', 'Send privacy form'], ['sticky_note_2', 'Add note'], ['add_task', 'Add task']]
      .map(([icon, label]) => `<md-menu-item data-qa="${label}"><div slot="headline">${label}</div>${ic(icon, 'slot="start"')}</md-menu-item>`).join('')}
    <md-divider role="separator"></md-divider>
    ${MASTER_STAGES.filter(s => s.id !== 'snoozed').map(s => `<md-menu-item data-move="${s.id}"><div slot="headline">Move to ${s.label}</div>${ic('arrow_forward', 'slot="start"')}</md-menu-item>`).join('')}
    <md-menu-item data-move="snoozed"><div slot="headline">Snooze</div>${ic('snooze', 'slot="start"')}</md-menu-item>
  </md-menu>`;

const actions = (d, cls = '') => `
  ${isNewLead(d) ? '' : `<md-icon-button class="${cls}" data-act="call" aria-label="Call ${esc(d.name)}">${ic('call')}</md-icon-button>`}
  <md-icon-button class="${cls}" data-act="sms" aria-label="SMS ${esc(d.name)}">${ic('sms')}</md-icon-button>
  <md-icon-button class="${cls}" data-act="email" aria-label="Email ${esc(d.name)}">${ic('mail')}</md-icon-button>
  <md-icon-button class="${cls}" data-act="more" aria-label="More actions for ${esc(d.name)}">${ic('more_vert')}</md-icon-button>`;

const nextHtml = (d, size = 'body-medium', wrap) => {
  const n = nextAction(d);
  return `
    <div class="next ${n.late ? 'is-late' : ''}">
      ${ic(n.icon)}
      <span class="md-typescale-${size} ${wrap ? 'wrap2' : 'clip'}"><span class="next__text">${n.text}</span>${n.due ? ` <span class="next__due sub">· ${n.due}</span>` : ''}</span>
    </div>`;
};

const dealHref = (d) => `screen2-v1.html#${refShort(d)}`;

/* ---------- Work list ------------------------------------------------------------ */

const COLS = [
  { id:'client',   label:'Client',        w:'minmax(240px, 1.3fr)', fixed:true },
  { id:'amount',   label:'Amount',        w:'minmax(110px, .5fr)', fixed:true },
  { id:'next',     label:'Next action',   w:'minmax(250px, 1.3fr)', fixed:true },
  { id:'status',   label:'Where it\'s at', w:'minmax(170px, .9fr)' },
  { id:'docs',     label:'Documents',     w:'minmax(310px, 1.3fr)' },
  { id:'partner',  label:'Partner',       w:'minmax(110px, .6fr)' },
  { id:'broker',   label:'Broker',        w:'52px' },
  { id:'activity', label:'Last activity', w:'minmax(110px, .55fr)' },
  { id:'source',   label:'Source',        w:'minmax(90px, .45fr)' }
];
const shownCols = () => COLS.filter(c => c.fixed || !state.hide.includes(c.id));
const gridTemplate = () => `48px ${shownCols().map(c => c.w).join(' ')} 176px`;

const CELL = {
  client: d => `
    <div class="cell-2">
      <span class="wl-name">${T('title-small', d.name)}${d.pinned ? ic('push_pin', 'aria-label="Pinned"') : ''}${signals(d)[0] || ''}</span>
      <span class="tiny">${refShort(d)}${state.hide.includes('source') ? ` · ${d.source}` : ''}</span>
    </div>`,
  amount: d => `<div class="cell-2 dim">${T('body-large', money(d.amount), 'amt')}<span class="tiny">${d.product}</span></div>`,
  next: d => nextHtml(d),
  status: d => `<div class="cell-2 dim">${T('body-medium', d.snoozed ? `Snoozed · ${d.stage}` : d.stage)}${T('body-small', `${plural(d.day, 'day')} in stage`, 'sub')}</div>`,
  docs: d => {
    const c = docCounts(d);
    return isNewLead(d) ? `<span class="md-typescale-body-small sub">Not requested yet</span>` : `
      <div class="docs dim">
        <md-linear-progress value="${c.ok / d.docs.length}" aria-label="${c.ok} of ${d.docs.length} documents approved"></md-linear-progress>
        <span class="md-typescale-body-small docs__n">${c.ok}/${d.docs.length}</span>
        ${docTags(d)}
      </div>`;
  },
  partner: d => `<span class="md-typescale-body-medium sub clip dim">${d.partner ? d.partner[1] : 'Direct'}</span>`,
  broker: d => `<span class="dim">${avatar(d.assigned[0])}</span>`,
  activity: d => `<div class="cell-2 dim">${T('body-medium', relativeDate(d.activity))}${T('body-small', d.activityTime, 'sub')}</div>`,
  source: d => `<span class="md-typescale-body-small sub dim">${d.source}</span>`
};

const listRow = (d) => `
  <div class="wl-grid wl-row ${d.snoozed ? 'is-snoozed' : ''} ${selected.has(d.key) ? 'is-selected' : ''}" data-ref="${d.key}"
       style="grid-template-columns:${gridTemplate()};view-transition-name:r${d.key}">
    <a class="row-link" href="${dealHref(d)}" aria-label="Open ${esc(d.name)}"></a>
    <span><md-checkbox touch-target="wrapper" data-sel="${d.key}" aria-label="Select ${esc(d.name)}" ${selected.has(d.key) ? 'checked' : ''}></md-checkbox></span>
    ${shownCols().map(c => CELL[c.id](d)).join('')}
    <div class="wl-actions">${actions(d)}</div>
  </div>`;

const LIST_GROUPS = [{ id:'newlead', label:'New leads' }, ...MASTER_STAGES.map(s => ({ id: s.id, label: s.label }))];
const collapsed = new Set(['snoozed']);

function list() {
  const deals = visible();
  const groups = LIST_GROUPS.map(g => {
    const ds = deals.filter(d => bucket(d) === g.id);
    if (!ds.length) return '';
    const late = ds.filter(isLate).length;
    return `
      <div class="wl-group ${collapsed.has(g.id) ? 'is-collapsed' : ''}" data-group="${g.id}">
        <md-icon-button class="wl-group__toggle" aria-label="Show or hide ${g.label}" aria-expanded="${!collapsed.has(g.id)}">${ic('expand_more')}</md-icon-button>
        ${T('title-small', g.label)}
        ${T('body-small', `${plural(ds.length, 'deal')} · ${moneyShort(ds.reduce((a, d) => a + d.amount, 0))}`, 'sub')}
        ${late ? T('body-small', `· ${late} overdue`, 'err') : ''}
      </div>
      <div class="wl-rows"><div>${ds.map(listRow).join('')}</div></div>`;
  }).join('');
  return `
    <section class="sheet">
      <div class="wl-scroll scroll-quiet">
        <div class="wl-grid wl-head md-typescale-label-medium" style="grid-template-columns:${gridTemplate()}">
          <span><md-checkbox touch-target="wrapper" id="sel-all" aria-label="Select all shown" ${deals.length && deals.every(d => selected.has(d.key)) ? 'checked' : ''}></md-checkbox></span>
          ${shownCols().map(c => `<span>${c.label}</span>`).join('')}<span></span>
        </div>
        ${groups || empty()}
      </div>
    </section>`;
}

const empty = () => `<div style="padding:64px;text-align:center">${T('title-medium', 'No deals match')}<br>${T('body-medium', 'Try another view, or clear the search and filters.', 'sub')}</div>`;

/* ---------- Board ------------------------------------------------------------------ */

const COLUMNS = [{ id:'newlead', label:'New leads' }, ...MASTER_STAGES.map(s => ({ id: s.id, label: s.label }))];

function boardCard(d) {
  const fresh = isNewLead(d);
  const sig = signals(d);
  const c = docCounts(d);
  return `
    <article class="card ${d.snoozed ? 'is-snoozed' : ''}" draggable="true" data-ref="${d.key}" style="view-transition-name:c${d.key}">
      <a class="card__link" href="${dealHref(d)}" draggable="false" aria-label="Open ${esc(d.name)}, ${money(d.amount)}"></a>
      ${sig.length ? `<div class="card__signals">${sig.join('')}</div>` : ''}
      <div class="card__who">
        ${T('title-medium', d.name, 'clip')}
        ${T('title-medium', money(d.amount), 'amt')}
      </div>
      ${fresh ? T('body-small', `${d.product} · ${d.stage}`, 'sub') : `
        ${nextHtml(d, 'body-medium', true)}
        ${T('body-small', d.snoozed ? `Back ${d.snoozedUntil} · ${d.stage}` : `${d.stage} · ${plural(d.day, 'day')} in stage`, 'sub')}
        <div class="card__docs">
          <md-linear-progress value="${c.ok / d.docs.length}" aria-label="${c.ok} of ${d.docs.length} documents approved"></md-linear-progress>
          ${T('body-small', `${c.ok}/${d.docs.length}`, 'sub')}
          ${docTags(d)}
        </div>`}
      <div class="card__ref">${T('body-small', d.partner ? d.partner[1] : 'Direct', 'sub')}<span class="tiny">· ${d.source} · ${refShort(d)}</span></div>
      <div class="card__foot">
        ${avatar(d.assigned[0])}
        <span class="spacer"></span>
        ${fresh ? `<md-filled-tonal-button class="call-btn" data-act="call">${ic('call', 'slot="icon"')}Call</md-filled-tonal-button>` : ''}
        ${d.snoozed ? `<md-icon-button data-act="more" aria-label="More actions for ${esc(d.name)}">${ic('more_vert')}</md-icon-button>` : actions(d)}
      </div>
    </article>`;
}

function board() {
  const deals = visible();
  return `
    <section class="board scroll-quiet">
      ${COLUMNS.map(col => {
        const ds = deals.filter(d => bucket(d) === col.id);
        const late = ds.filter(isLate).length;
        return `
          <section class="col" data-col="${col.id}" aria-label="${col.label}">
            <header class="col__head">
              <div class="col__title">${T('title-medium', col.label)}<span class="col__n md-typescale-label-small">${ds.length}</span></div>
              ${T('body-small', `${moneyShort(ds.reduce((a, d) => a + d.amount, 0))}${late ? ` · <span class="err">${late} overdue</span>` : ''}`, 'sub')}
            </header>
            <div class="col__scroll scroll-quiet">${ds.map(boardCard).join('')}</div>
          </section>`;
      }).join('')}
    </section>`;
}

/* ---------- Easy View ----------------------------------------------------------------
   Deliberately plain: a table of the broker's own deals, pin to top, a
   private note and a last-contact date per row, a name filter and a status
   filter, and an order that only changes when the broker changes it. */

const ez = { q: '', status: [], sort: null, page: 0, per: 12 };
const pins = store.get('lo-ez-pins2', DEALS.filter(d => d.pinned).map(d => d.key));
const notes = store.get('lo-ez-notes2', {});
const contacted = store.get('lo-ez-contact2', {});
const STAGE_DOT = { qualifying:'#F79009', discovery:'#0E9FBF', progress:'#7A39DE', approval:'#12B76A', settlement:'#5614BB', snoozed:'var(--md-sys-color-outline)' };

function ezRows() {
  const mine = DEALS.filter(d => d.assigned[0] === ME)
    .filter(d => !ez.q || d.name.toLowerCase().includes(ez.q.toLowerCase()))
    .filter(d => !ez.status.length || ez.status.includes(d.snoozed ? 'snoozed' : d.master));
  const key = ez.sort && {
    name:    d => d.name,
    lender:  d => d.lender ? d.lender[1] : '~',
    stage:   d => d.stage,
    contact: d => contacted[d.key] || '~'
  }[ez.sort.key];
  const sorted = key ? [...mine].sort((a, b) => String(key(a)).localeCompare(String(key(b))) * (ez.sort.dir === 'desc' ? -1 : 1)) : mine;
  return [...sorted.filter(d => pins.includes(d.key)), ...sorted.filter(d => !pins.includes(d.key))];
}

const ezSortBtn = (key, label) => {
  const on = ez.sort && ez.sort.key === key;
  return `<button class="ez-sort ${on ? `is-${ez.sort.dir}` : ''}" data-ezsort="${key}">${label}${ic('arrow_upward')}</button>`;
};

const easy = () => `
    <div class="ez-tools">
      <label class="ez-filter">${ic('person_search')}<input id="ez-q" placeholder="Filter by name" value="${esc(ez.q)}" aria-label="Filter by name"></label>
      <md-assist-chip id="ez-status-btn" label="Status">${ic('add', 'slot="icon"')}</md-assist-chip>
      <md-text-button id="ez-reset" disabled>Reset sorting</md-text-button>
      <span class="spacer"></span>
    </div>
    <md-menu id="ez-status-menu" anchor="ez-status-btn" positioning="popover">
      ${MASTER_STAGES.map(s => `<md-menu-item data-ezstatus="${s.id}" keep-open><div slot="headline">${s.label}</div>${ic('check_box_outline_blank', 'slot="start"')}</md-menu-item>`).join('')}
    </md-menu>
    <div id="ez-sheet" style="display:contents">${ezSheet()}</div>`;

function ezRender() {
  $('#ez-sheet').innerHTML = ezSheet();
  $('#ez-reset').disabled = !ez.sort;
  const chip = $('#ez-status-btn');
  chip.label = `Status${ez.status.length ? ` · ${ez.status.length}` : ''}`;
  chip.querySelector('md-icon').textContent = ez.status.length ? 'filter_alt' : 'add';
}

function ezSheet() {
  const rows = ezRows();
  const pages = Math.max(1, Math.ceil(rows.length / ez.per));
  ez.page = Math.min(ez.page, pages - 1);
  const shown = rows.slice(ez.page * ez.per, ez.page * ez.per + ez.per);
  return `
    <section class="sheet">
      <div class="ez-table scroll-quiet">
        <div class="ez-grid ez-head md-typescale-label-medium">
          <span>Pin</span><span>${ezSortBtn('name', 'Client name')}</span><span>Partner</span>
          <span>${ezSortBtn('lender', 'Lender')}</span><span>${ezSortBtn('stage', 'Status')}</span>
          <span>My note</span><span>${ezSortBtn('contact', 'Last contact')}</span>
        </div>
        ${shown.map(d => `
          <div class="ez-grid ez-row" data-ref="${d.key}">
            <md-icon-button class="ez-pin ${pins.includes(d.key) ? 'is-on' : ''}" data-pin="${d.key}" aria-label="${pins.includes(d.key) ? 'Unpin' : 'Pin'} ${esc(d.name)}" aria-pressed="${pins.includes(d.key)}">${ic('push_pin')}</md-icon-button>
            <div class="cell-2">${T('title-small', d.name)}<span class="tiny">${refShort(d)}</span></div>
            <span class="md-typescale-body-medium sub clip">${d.partner ? d.partner[1] : '—'}</span>
            <span class="md-typescale-body-medium sub clip">${d.lender ? d.lender[1] : '—'}</span>
            <span class="status"><i style="background:${STAGE_DOT[d.snoozed ? 'snoozed' : d.master]}"></i>${d.stage}</span>
            <input class="ez-input" data-note="${d.key}" placeholder="Add a note…" value="${esc(notes[d.key] || '')}" aria-label="Note for ${esc(d.name)}">
            <input class="ez-input ${contacted[d.key] ? 'has-value' : ''}" type="date" data-contact="${d.key}" value="${contacted[d.key] || ''}" aria-label="Last contact with ${esc(d.name)}">
          </div>`).join('') || empty()}
      </div>
      <footer class="ez-foot md-typescale-body-small">
        <span>Showing ${rows.length ? ez.page * ez.per + 1 : 0}–${ez.page * ez.per + shown.length} of ${rows.length}</span>
        <span class="spacer"></span>
        <label>Rows per page <select id="ez-per">${[12, 25, 50].map(n => `<option ${n === ez.per ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
        <span>Page ${ez.page + 1} of ${pages}</span>
        <span>
          <md-icon-button data-ezpage="first" ${ez.page ? '' : 'disabled'} aria-label="First page">${ic('first_page')}</md-icon-button>
          <md-icon-button data-ezpage="prev" ${ez.page ? '' : 'disabled'} aria-label="Previous page">${ic('chevron_left')}</md-icon-button>
          <md-icon-button data-ezpage="next" ${ez.page < pages - 1 ? '' : 'disabled'} aria-label="Next page">${ic('chevron_right')}</md-icon-button>
          <md-icon-button data-ezpage="last" ${ez.page < pages - 1 ? '' : 'disabled'} aria-label="Last page">${ic('last_page')}</md-icon-button>
        </span>
      </footer>
    </section>`;
}

/* ---------- Filters side sheet -------------------------------------------------------- */

const sideSheet = () => `
  <div class="scrim" id="scrim"></div>
  <aside class="side" id="side" aria-label="Filters" aria-hidden="true">
    <div class="side__head">${T('title-large', 'Filters')}<md-icon-button id="side-close" aria-label="Close filters">${ic('close')}</md-icon-button></div>
    <div class="side__body scroll-quiet" id="side-body"></div>
    <div class="side__foot"><span class="md-typescale-body-medium" id="side-count"></span><md-text-button id="side-clear">Clear all</md-text-button></div>
  </aside>`;

function renderSide() {
  $('#side-body').innerHTML = FILTERS.map(g => `
    <div class="side__group">
      ${T('title-small', g.label)}
      <md-chip-set>
        ${g.opts.map(([v, label]) => `<md-filter-chip data-f="${g.id}" data-v="${esc(v)}" label="${esc(label)}" ${(state.f[g.id] || []).includes(v) ? 'selected' : ''}></md-filter-chip>`).join('')}
      </md-chip-set>
    </div>`).join('');
  $('#side-count').textContent = `Showing ${visible().length} of ${DEALS.length} deals`;
}

/* ---------- New lead dialog -------------------------------------------------------------- */

const dialog = () => `
  <md-dialog id="nl-dialog">
    <div slot="headline">New lead</div>
    <form slot="content" id="nl-form" method="dialog" class="form">
      <md-outlined-text-field class="wide" label="Client or business name" name="name" required></md-outlined-text-field>
      <md-outlined-text-field label="Mobile" name="phone" type="tel"></md-outlined-text-field>
      <md-outlined-text-field label="Email" name="email" type="email"></md-outlined-text-field>
      <md-outlined-text-field label="Amount" name="amount" type="number" prefix-text="$"></md-outlined-text-field>
      <md-outlined-select label="Loan type" name="product">
        ${uniq(d => d.product).map((p, i) => `<md-select-option value="${p}" ${i ? '' : 'selected'}><div slot="headline">${p}</div></md-select-option>`).join('')}
      </md-outlined-select>
    </form>
    <div slot="actions">
      <md-text-button form="nl-form" value="cancel">Cancel</md-text-button>
      <md-filled-button form="nl-form" value="add">Add lead</md-filled-button>
    </div>
  </md-dialog>`;

/* ---------- Snackbar and tooltip ---------------------------------------------------------- */

let snackTimer;
function snack(text, undo) {
  const s = $('#snack');
  s.innerHTML = `${T('body-medium', text)}${undo ? '<md-text-button id="snack-undo">Undo</md-text-button>' : ''}`;
  s.classList.add('is-on');
  if (undo) $('#snack-undo').onclick = () => { undo(); s.classList.remove('is-on'); };
  clearTimeout(snackTimer);
  snackTimer = setTimeout(() => s.classList.remove('is-on'), 4000);
}

function tipContent(key) {
  const [kind, ref] = [key.slice(0, 3), key.slice(4)];
  const d = DEALS.find(x => x.key === ref);
  if (!d) return '';
  if (kind === 'rej') return `${T('title-small', 'Rejected — the client needs to resend', 'tip__title')}<ul class="md-typescale-body-medium">${docsOf(d, 'rejected').map(n => `<li><b>${n}</b>${REJECTED_WHY[n]}</li>`).join('')}</ul>`;
  if (kind === 'rev') return `${T('title-small', 'Uploaded by the client — not checked yet', 'tip__title')}<ul class="md-typescale-body-medium">${docsOf(d, 'review').map(n => `<li><b>${n}</b>Uploaded ${relativeDate(d.activity).toLowerCase()}</li>`).join('')}</ul>`;
  if (kind === 'dup') return `${T('title-small', 'Possible duplicate', 'tip__title')}${T('body-medium', `Same client and amount as another application received this month. Check before working it.`)}`;
  return '';
}

let tipTimer, tipEl;
function showTip(el) {
  const tip = $('#tip');
  tip.innerHTML = tipContent(el.dataset.tip);
  const r = el.getBoundingClientRect();
  const left = Math.min(r.left, innerWidth - 316);
  tip.style.left = `${Math.max(8, left)}px`;
  tip.style.top = `${r.bottom + 8}px`;
  requestAnimationFrame(() => {
    const h = tip.offsetHeight;
    if (r.bottom + 8 + h > innerHeight - 8) tip.style.top = `${r.top - h - 8}px`;
    tip.classList.add('is-on');
  });
}
document.addEventListener('pointerover', (e) => {
  const el = e.target.closest('[data-tip]');
  if (el === tipEl) return;
  tipEl = el;
  clearTimeout(tipTimer);
  if (!el) { $('#tip') && $('#tip').classList.remove('is-on'); return; }
  tipTimer = setTimeout(() => showTip(el), 300);
});
document.addEventListener('focusin', (e) => { const el = e.target.closest && e.target.closest('[data-tip]'); if (el) { tipEl = el; showTip(el); } });
document.addEventListener('focusout', () => { tipEl = null; $('#tip') && $('#tip').classList.remove('is-on'); });

/* ---------- Mount and render ---------------------------------------------------------------- */

const app = document.getElementById('app');
app.innerHTML = rail() + `
  <main class="pane">${topbar()}<div id="bar"></div><div id="content" style="display:contents"></div></main>
  ${menus()}${sideSheet()}${dialog()}
  <div class="snack" id="snack" role="status" aria-live="polite"></div>
  <div class="tip" id="tip" role="tooltip"></div>`;

function render() {
  if (VIEW !== 'easy') $('#bar').innerHTML = toolbar();
  $('#content').innerHTML = VIEW === 'board' ? board() : VIEW === 'easy' ? easy() : list();
  if (VIEW !== 'easy') { renderSide(); refreshMenus(); }
  $('#q-clear').style.visibility = (VIEW === 'easy' ? false : state.q) ? 'visible' : 'hidden';
  save();
}
function refreshMenus() {
  $$('#sort-menu md-menu-item').forEach(it => {
    const on = it.dataset.sort === state.sort;
    const end = it.querySelector('[slot="end"]');
    if (on && !end) it.insertAdjacentHTML('beforeend', ic('check', 'slot="end"'));
    if (!on && end) end.remove();
  });
  $$('#cols-menu md-menu-item').forEach(it => { it.querySelector('md-icon').textContent = state.hide.includes(it.dataset.colpick) ? 'check_box_outline_blank' : 'check_box'; });
}
render();

/* ---------- Interactions -------------------------------------------------------------------- */

const dealOf = (el) => DEALS.find(d => d.key === (el.closest('[data-ref]') || {}).dataset?.ref);

// Screen switch — real links between the three pages, crossfaded
$$('[data-screen]').forEach(b => b.addEventListener('click', () => {
  const s = SCREENS.find(x => x[0] === b.dataset.screen);
  if (s[0] !== VIEW) location.href = s[3] + location.search;
}));

// Search — instant, no transition while typing
let qTimer;
$('#q').addEventListener('input', (e) => {
  clearTimeout(qTimer);
  qTimer = setTimeout(() => {
    if (VIEW === 'easy') { ez.q = e.target.value; ez.page = 0; $('#ez-q').value = ez.q; ezRender(); return; }
    state.q = e.target.value.trim(); render();
  }, 60);
});
$('#q-clear').addEventListener('click', () => { $('#q').value = ''; state.q = ''; ez.q = ''; transition(VIEW === 'easy' ? ezRender : render); });

// New lead — from anywhere: the button, or N
const openNew = () => { $('#nl-form').reset(); $('#nl-dialog').show(); };
$('#new-lead').addEventListener('click', openNew);
document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, md-outlined-text-field, md-dialog')) return;
  if (e.key === 'n' || e.key === 'N') { e.preventDefault(); openNew(); }
  if (e.key === '/') { e.preventDefault(); $('#q').focus(); }
});
$('#nl-dialog').addEventListener('close', () => {
  if ($('#nl-dialog').returnValue !== 'add') return;
  const f = $('#nl-form');
  const val = (n) => (f.querySelector(`[name="${n}"]`) || {}).value || '';
  const name = val('name').trim() || 'New client';
  const n = 902 + DEALS.filter(d => d.isNew).length;
  DEALS.push({ key: `n${n}`, name, amount: Number(val('amount')) || 50000, ref: `#APP-2026-0${n}`, product: val('product') || 'Asset finance',
    segment: 'consumer', source: 'Website', created: TODAY, activity: TODAY, urgency: 'high', master: 'qualifying', stage: 'New enquiry', day: 1,
    assigned: [ME, 'Kenn Z.'], associate: null, lender: null, partner: null, docs: ['pending', 'pending', 'pending', 'pending', 'pending', 'pending'],
    tasksDue: 1, tasksOverdue: 0, activityTime: 'just now', nextAction: 'Call new lead', phone: val('phone'), email: val('email'), arrived: 0, isNew: true });
  transition(render);
  snack(`${name} added to New leads`);
});

// Everything inside the content and toolbar, delegated
app.addEventListener('click', (e) => {
  const t = e.target;

  const chip = t.closest('md-filter-chip[data-view]');
  if (chip) { state.view = chip.dataset.view; transition(render); return; }

  const fchip = t.closest('md-filter-chip[data-f]');
  if (fchip) {
    const { f, v } = fchip.dataset;
    const cur = new Set(state.f[f] || []);
    cur.has(v) ? cur.delete(v) : cur.add(v);
    state.f[f] = [...cur];
    transition(() => { $('#bar').innerHTML = toolbar(); $('#content').innerHTML = VIEW === 'board' ? board() : list(); $('#side-count').textContent = `Showing ${visible().length} of ${DEALS.length} deals`; save(); });
    return;
  }

  if (t.closest('#filters-btn')) { renderSide(); $('#side').classList.add('is-open'); $('#side').setAttribute('aria-hidden', 'false'); $('#scrim').classList.add('is-open'); return; }
  if (t.closest('#side-close, #scrim')) { $('#side').classList.remove('is-open'); $('#side').setAttribute('aria-hidden', 'true'); $('#scrim').classList.remove('is-open'); return; }
  if (t.closest('#side-clear')) { state.f = {}; transition(render); return; }

  if (t.closest('#sort-btn'))  { $('#sort-menu').open = !$('#sort-menu').open; return; }
  if (t.closest('#saved-btn')) { $('#saved-menu').open = !$('#saved-menu').open; return; }
  if (t.closest('#cols-btn'))  { $('#cols-menu').open = !$('#cols-menu').open; return; }

  const sortIt = t.closest('[data-sort]');
  if (sortIt) { state.sort = sortIt.dataset.sort; transition(render); return; }

  const colIt = t.closest('[data-colpick]');
  if (colIt) {
    const id = colIt.dataset.colpick;
    state.hide = state.hide.includes(id) ? state.hide.filter(x => x !== id) : [...state.hide, id];
    transition(render); return;
  }

  const savedIt = t.closest('[data-saved]');
  if (savedIt) {
    const a = savedIt.dataset.saved;
    if (a === 'hot') { state.view = 'attention'; state.f = { broker: [ME] }; transition(render); snack("Kenn's hot list — needs attention, my deals"); }
    if (a === 'save') snack(`Saved "${viewOf(state.view).label}${filterCount() ? ' + filters' : ''}" to your views`);
    if (a === 'default') { store.set('lo-m3-default-view', state.view); snack(`Leads will open on "${viewOf(state.view).label}"`); }
    return;
  }

  // Group collapse
  const tog = t.closest('.wl-group__toggle');
  if (tog) {
    const g = tog.closest('.wl-group');
    g.classList.toggle('is-collapsed');
    const id = g.dataset.group;
    collapsed.has(id) ? collapsed.delete(id) : collapsed.add(id);
    tog.setAttribute('aria-expanded', String(!g.classList.contains('is-collapsed')));
    return;
  }

  // Bulk
  if (t.closest('#sel-clear')) { selected.clear(); render(); return; }
  const bulk = t.closest('[data-bulk]');
  if (bulk) { snack(`${bulk.dataset.bulk}: ${plural(selected.size, 'deal')} (prototype — nothing was changed)`); return; }

  // Row and card actions
  const act = t.closest('[data-act]');
  if (act) {
    e.preventDefault();
    const d = dealOf(act);
    if (!d) return;
    if (act.dataset.act === 'more') { qaFor = d; const m = $('#qa-menu'); m.open = false; m.anchorElement = act; m.open = true; return; }
    const say = { call: `Calling ${d.name} · ${d.phone}`, sms: `New SMS to ${first(d)}`, email: `New email to ${d.email}` }[act.dataset.act];
    snack(say);
    return;
  }

  // Quick menu items
  const qa = t.closest('[data-qa]');
  if (qa && qaFor) { snack(`${qa.dataset.qa} — ${qaFor.name}`); return; }
  const mv = t.closest('[data-move]');
  if (mv && qaFor) { moveDeal(qaFor, mv.dataset.move); return; }

  // Easy View
  const es = t.closest('[data-ezsort]');
  if (es) {
    const key = es.dataset.ezsort;
    ez.sort = !ez.sort || ez.sort.key !== key ? { key, dir: 'asc' } : ez.sort.dir === 'asc' ? { key, dir: 'desc' } : null;
    transition(ezRender); return;
  }
  if (t.closest('#ez-reset')) { ez.sort = null; transition(ezRender); return; }
  if (t.closest('#ez-status-btn')) { $('#ez-status-menu').open = !$('#ez-status-menu').open; return; }
  const est = t.closest('[data-ezstatus]');
  if (est) {
    const id = est.dataset.ezstatus;
    ez.status = ez.status.includes(id) ? ez.status.filter(x => x !== id) : [...ez.status, id];
    est.querySelector('md-icon').textContent = ez.status.includes(id) ? 'check_box' : 'check_box_outline_blank';
    ez.page = 0;
    transition(ezRender);
    return;
  }
  const pin = t.closest('[data-pin]');
  if (pin) {
    const ref = pin.dataset.pin;
    const i = pins.indexOf(ref);
    i >= 0 ? pins.splice(i, 1) : pins.push(ref);
    store.set('lo-ez-pins2', pins);
    transition(ezRender); return;
  }
  const pg = t.closest('[data-ezpage]');
  if (pg) {
    const pages = Math.ceil(ezRows().length / ez.per);
    ez.page = { first: 0, prev: ez.page - 1, next: ez.page + 1, last: pages - 1 }[pg.dataset.ezpage];
    transition(ezRender); return;
  }
});

let qaFor = null;

// Selection
app.addEventListener('change', (e) => {
  const box = e.target.closest('md-checkbox');
  if (box && box.id === 'sel-all') { visible().forEach(d => box.checked ? selected.add(d.key) : selected.delete(d.key)); render(); return; }
  if (box && box.dataset.sel) {
    box.checked ? selected.add(box.dataset.sel) : selected.delete(box.dataset.sel);
    box.closest('.wl-row').classList.toggle('is-selected', box.checked);
    $('#bar').innerHTML = toolbar();
    return;
  }
  // Easy View inputs persist as you type / pick
  if (e.target.dataset.contact) { contacted[e.target.dataset.contact] = e.target.value; store.set('lo-ez-contact2', contacted); e.target.classList.toggle('has-value', !!e.target.value); }
  if (e.target.id === 'ez-per') { ez.per = Number(e.target.value); ez.page = 0; transition(ezRender); }
});
app.addEventListener('input', (e) => {
  if (e.target.dataset.note) { notes[e.target.dataset.note] = e.target.value; store.set('lo-ez-notes2', notes); }
  if (e.target.id === 'ez-q') {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => { ez.q = e.target.value; ez.page = 0; ezRender(); }, 80);
  }
});

/* ---------- Moving a deal: drag on the board, or the quick menu anywhere ------------------ */

function moveDeal(d, to) {
  const before = { master: d.master, snoozed: d.snoozed, urgency: d.urgency, day: d.day };
  if (bucket(d) === to) return;
  if (to === 'snoozed') { d.snoozed = true; d.snoozedUntil = d.snoozedUntil || '06/02/26'; }
  else { d.snoozed = false; d.master = to; d.day = 1; if (d.urgency === 'high') d.urgency = 'med'; }
  transition(render);
  const label = to === 'snoozed' ? 'Snoozed' : `Moved to ${(MASTER_STAGES.find(s => s.id === to) || {}).label}`;
  snack(`${label} — ${d.name}`, () => { Object.assign(d, before); transition(render); });
}

let dragRef = null;
app.addEventListener('dragstart', (e) => {
  const card = e.target.closest && e.target.closest('.card');
  if (!card) return;
  dragRef = card.dataset.ref;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragRef);
  requestAnimationFrame(() => card.classList.add('is-dragging'));
});
app.addEventListener('dragend', () => { dragRef = null; $$('.card.is-dragging').forEach(c => c.classList.remove('is-dragging')); $$('.col.is-drop').forEach(c => c.classList.remove('is-drop')); });
app.addEventListener('dragover', (e) => {
  const col = e.target.closest && e.target.closest('.col');
  if (!col || !dragRef || col.dataset.col === 'newlead') return;
  e.preventDefault();
  $$('.col.is-drop').forEach(c => c !== col && c.classList.remove('is-drop'));
  col.classList.add('is-drop');
});
app.addEventListener('dragleave', (e) => {
  const col = e.target.closest && e.target.closest('.col');
  if (col && !col.contains(e.relatedTarget)) col.classList.remove('is-drop');
});
app.addEventListener('drop', (e) => {
  const col = e.target.closest && e.target.closest('.col');
  if (!col || !dragRef) return;
  e.preventDefault();
  const d = DEALS.find(x => x.key === dragRef);
  col.classList.remove('is-drop');
  if (d) moveDeal(d, col.dataset.col);
});

})();
