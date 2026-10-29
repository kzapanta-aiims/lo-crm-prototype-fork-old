# LoanOptions CRM — screen mocks

Static 1920×1080 mock-ups built on the design system in the Figma file
**CRM-2026** (page: `↪️ Design System`).

## Material 3 versions (this fork)

This fork adds three **M3** screens: the same deals, rebuilt in stock
**Material 3** with only the LoanOptions brand colours applied. They are new
screens, not a restyle — the original versions are untouched and sit beside
them in each prototype view for comparison.

| Page | |
|---|---|
| `worklist-m3.html` | Work list — tab **M3 · Work list** in `index.html` (opens on it) |
| `kanban-m3.html` | Board — tab **M3 · Board** in `kanban.html` (opens on it) |
| `easyview-m3.html` | Easy View — tab **M3 · Easy View** in `index.html` |

The List / Board / Easy View switch in the top bar moves between the three,
and the view, filters, search and sort carry across.

**Hierarchy** follows the brokers' own priority list. On a card or row, most
important first: who · how much · what's next (red when overdue) · where it's
at · who referred it · whose it is · days in stage · documents · source and
reference (lowest). Three text levels only: primary, secondary (`--sub`),
and 11px for reference and source. `--sub` is deliberately light — about
3.6:1 in B2C, under WCAG AA for small text; raise it to 80% in
`css/m3-app.css` to get back to AA.

**What jumps out**, and nothing else does:

| Signal | Treatment |
|---|---|
| New lead | `New · 4 min ago` chip, brand container |
| New lead not called within 15 min | `Not called · 22 min` chip, error container |
| Overdue | The next action turns error-red and medium weight |
| Documents uploaded, waiting to be checked | `2 to check` chip; hover or focus names the documents |
| Rejected documents | `1 rejected` chip; hover or focus names each document and why |
| Possible duplicate | `Possible duplicate` chip, warning container |

Pipeline stages are named, never coloured. Other people's avatars are grey.

**What works** (it is still a prototype — nothing is saved to a server):

- Views in one click, with live counts: my deals, my team, needs attention,
  new today, overdue, waiting on customer, waiting on lender, settling this
  week, documents to review. **Saved views** holds a saved view and sets the
  default view.
- Search by name, phone, email, reference or ABN (`/` focuses it). Contact
  details are mocked in `js/m3-app.js` because the model has none yet.
- **Filters** side sheet: broker, stage, consumer or commercial, loan type,
  source, partner or partner group, amount, created date. Several at once,
  applied instantly.
- **Sort**: newest, oldest, last activity, amount, next follow-up. Stable —
  the order only changes when the sort does.
- **New lead** from anywhere (button, or `N`) — the lead lands in New leads.
- Board: call, SMS, email and a quick menu (request documents, privacy form,
  note, task, move stage, snooze) on every card; the card is a real link, so
  click opens the deal and ⌘/Ctrl- or middle-click opens a new tab; **drag
  cards between stages**, with Undo.
- List: **choose columns**; select deals for **bulk** reassign, move stage,
  message or add task.
- Easy View: your deals only, pin to top, a private note and last-contact
  date per row (kept in localStorage), name filter, status filter, sortable
  headers with Reset, paging.

**Motion.** Every hover and state change eases in and out on a symmetric
curve, `cubic-bezier(0.45, 0, 0.55, 1)` over 250ms; sheets, menus, tooltips and the snackbar come in on
emphasized-decelerate. Re-renders (filtering, sorting, dragging) use the View
Transitions API, so cards and rows glide to their new places, and List /
Board / Easy View crossfade. Material Web's ripple ships with a 15ms hover,
which reads as instant; the vendored bundle is patched to the same 250ms curve — see
`js/vendor/README.md`.

**Components** are Google's Material Web (`@material/web` 2.5.0), bundled into
`js/vendor/material-web-2.5.0.js`. It has no navigation rail, top app bar,
search bar, data table, side sheet, snackbar or rich tooltip, so those are
built in `css/m3-app.css` to the M3 spec. **Type** is Geist on the M3 type
scale, with the page heading alone in the brand face, Articulat CF DemiBold;
icons are Material Symbols. Geist and the icons load from Google Fonts.

**The colours.** `css/m3.css` is generated with Google's
material-color-utilities (the engine behind the Material Theme Builder),
fidelity variant, with the brand's core colours as key colours — primary
`#5614BB`, secondary `#2F0273`, tertiary `#F33829`. Neutrals are the one place this
leaves stock M3: M3 tints every surface with the key colour, which turns the
page lavender, so the surface, text-grey and outline roles map onto the
brand's own neutral scale instead (`#F8F9FA` → `#212529`, extended with
darker steps for B2B). Purple appears only where it marks something. Three roles are pinned to brand values, each marked `brand`
in the file. Success and warning come from the brand's semantic tables. The
Tailwind-style 50–950 scales sit at the top of the same file.

**Audiences.** B2C is light, B2B is dark, switched by
`html[data-audience="b2c" | "b2b"]`:

| | |
|---|---|
| Prototype view | **B2C · Light / B2B · Dark** in the toolbar, or press `A`. Open frames flip live |
| A single page | `?aud=b2b` on the URL, e.g. `/kanban-m3.html?aud=b2b` |
| Otherwise | The last choice, from localStorage; B2C if there is none |

The original versions are light only; the switch does nothing to them.
Brand purple stays the filled-button and checkbox fill in both audiences.

**Other files**

| File | |
|---|---|
| `js/m3-app.js` | Renders all three M3 screens from `js/data.js` |
| `js/audience.js` | Sets `data-audience` before first paint, and listens for the toggle |
| `tailwind/theme.css` | The scales and M3 roles as a Tailwind v4 `@theme`, for the real build |

**Known gaps**

- Opening a deal goes to the original application view (`screen2-v1.html`);
  there is no M3 deal screen yet.
- Bulk actions, quick-menu actions, saving a view and contact buttons answer
  with a snackbar but change nothing. Moving a stage (drag or menu) does
  change the board, until reload.
- Tertiary `#F33829` sits next to error red, so it is defined but unused.

No Python? `node serve.mjs` and `node stamp.mjs` do the same jobs as
`serve.py` and `stamp.py`.

## Running

```bash
python serve.py
```

### Seeing your changes

Run `python stamp.py` after editing anything under `css/` or `js/`, and
before committing. It rewrites every page's `<link>` and `<script src>` to
`...css?v=<hash of that file>`.

Without it, an edit can be live on the server and still invisible in the
browser: the URL `css/appview.css` is the same whether or not its contents
changed, and GitHub Pages serves it with `max-age=600`, so a browser that
already has a copy keeps using it. A content hash makes a changed file a
different URL, so it is fetched — and an unchanged file keeps its hash and
stays cached. It is safe to run twice.

`serve.py` is a plain static server that sends `no-store`. That matters here:
versions get rewritten **in place** during iteration, so the filename never
changes and a normal server lets the browser keep showing the previous design
under the current name. If you ever serve this another way, hard-refresh
(`Ctrl+Shift+R`) after any edit.

Then open <http://localhost:8137/> — that's the work-list prototype view,
which is the easiest way in. The other screens have their own prototype
views at <http://localhost:8137/kanban.html> and
<http://localhost:8137/screen2.html>. Individual versions are at
`/worklist-v2.html`, `/kanban-v1.html` etc. if you want one on its own.

Opening the `.html` directly with `file://` will **not** work — the stylesheets
and fonts won't resolve. It needs to be served.

## Prototype views

Each screen gets its own prototype view — a dark harness that frames that
screen's versions and lets you switch between them:

| Page | Screen | Versions |
|---|---|---|
| `index.html` | The work list | v1, v2, v3 |
| `kanban.html` | The kanban board | v1, v2 |
| `screen2.html` | Screen 2 | v1 |

Each numbers its versions **from v1 in its own right**: the kanban's v1 and
the work list's v1 are different screens, not two takes on one.

| Control | |
|---|---|
| `1` `2` `3` … | Jump to a version — one key per version |
| `←` `→` | Step through versions |
| `C` | Compare — two versions side by side, each with its own picker |
| `Z` | Toggle fit-to-window / 100% |

The view is in the URL, so any state can be bookmarked or pasted to someone:
`#v2`, or `#compare=v1,v2`.

### The shared shell

The harness itself — toolbar, tabs, compare, scaling, shortcuts, deep links —
is `js/shell.js` and `css/shell.css`, one copy for both views. A prototype
view is just a page that declares what it frames, inline, before that script:

```js
window.SHELL = {
  title: 'Work list view',
  sub:   'LoanOptions CRM prototype',
  start: 'v2',                 // which version opens first
  tour:  true,                 // show the replay-the-tour button
  versions: [
    { id:'v1', label:'v1', sub:'Pipeline + AI', file:'worklist-v1.html',
      note:'…the line under the toolbar' }
  ]
};
```

To add a version, append one entry to that `versions` array — tabs, compare
pickers, shortcuts and deep links all follow. To add a **screen**, copy one of
the two pages and point it at that screen's versions.

Two controls look after themselves: compare stands down when there is only one
version, since there is nothing to hold it against, and the tour button appears
only where `tour` is set — screen 2 has no tour yet.

## The artboard and scrolling

`.screen` is the 1920×1080 Figma frame, but its height is capped at the
viewport (`min(1080px, 100vh)`). Inside the prototype shell's iframe that is
exactly 1080, so the frame is untouched; opened full size in a window shorter
than 1080 it shrinks to fit.

That cap is what keeps the table's **horizontal scrollbar reachable**. The bar
belongs to `.v1-scroll`, which sits at the bottom of the frame — let the frame
run past the bottom of the window and the bar goes with it, so you have to
scroll the whole page down to find it. The x axis is also `overflow-x: scroll`
rather than `auto`: twelve columns never fit 1920, so the bar is always needed,
and one that appears and disappears just shifts the rows.

## Layout

```
assets/fonts/    Articulat CF (Regular / Medium / DemiBold / Bold)
assets/brand/    logo.svg and assist.svg, exported from CRM-2026 — the sprite
                 in js/icons.js carries copies, these are the sources.
                 stage-path.png is used directly, see below.
css/tokens.css   Design tokens — colours, spacing, radius, elevation, type ramp.
                 Variable names match the code syntax set on the Figma variables.
css/shell.css    The prototype views' own chrome — the dark harness, not the
                 mocks it frames. Shared by index.html and screen2.html.
js/shell.js      The harness itself: tabs, compare, scaling, shortcuts, deep
                 links. Driven by the page's window.SHELL.
css/worklist.css Layout + components. Shared by all work-list versions.
css/draft2.css   Overrides for the draft-parity page only.
stamp.py         Rewrites asset links with a content hash, see above.
js/icons.js      SVG sprite + icon() helper. Shared by all versions.
js/rows.js       Row data (ROWS) + renderer for the redesign versions.
js/rows-draft2.js Frozen data + renderer for the draft-parity page.
css/variants.css  Concept styles, scoped per version (v3–v5).
js/data.js        Shared deal data + document vocabulary for the concepts.
js/popups.js      Row popups — Tasks / Notes / Activity cards, with their
                  seeded mock content.
js/tour.js        Points-of-interest tour — engine and the step list per
                  version.
css/tour.css      Spotlight and callout styles.
js/appview.js     Application view — the screen a deal opens into (v1).
css/appview.css   Its styles.
js/kanban.js      Kanban board — the deals as cards. See below.
css/kanban.css    Its styles, on top of worklist.css.
js/screen2.js     Screen 2 — a standalone copy of the application view, being
css/screen2.css   reworked into a different screen. See below.
js/variants.js    Concept renderers (v3–v5).
worklist-draft2.html  Reference — the original Figma draft, rebuilt. Not in
                      the shell; open it directly if you need it.
worklist-v1.html      v1 — top nav is a placeholder band.
worklist-v2.html      v2 — real global navigation bar.
index.html            The work-list prototype view — v1, v2, v3.
kanban.html           The kanban prototype view — v1, v2.
kanban-v1.html        v1 — alert states, tasks as tinted blocks.
kanban-v2.html        v2 — alert states, text and colour only.
screen2.html          The screen-2 prototype view — v1.
screen2-v1.html       Screen 2, v1 — the copy of the application view.
```

## Versions

| Page | What it is |
|---|---|
| **v1** Pipeline + AI | Grouped by master pipeline stage. Sticky column chooser, multi-select, quick actions, contact tiles, Broker Assist popup. Documents as a segmented meter. The three quick-action pills each float their own card. |
| **v2** Colour coded | v1 as its base (its shell carries both classes), with stage colour through the dots, labels, sub-stage tags and a key line, and documents as four status boxes. Broker Assist is a tab in the quick-view sidebar rather than its own floating card. |

v2 is a **skin over v1**, not a copy: one `renderWorklist(opts)` builds both, so
a change to the shared base lands in both versions.

### Removed

Each review narrowed the set, and the survivors were renumbered so the
numbering stays contiguous:

- **Calm cards** and **power grid** — cut after the first review.
- **Contextual-CTA version** (`Fix` / `Chase` / `Submit`, per-document traffic
  lights) — cut after the second.
- **Redesign baseline, nav-bar version, Customise and Action rail** — cut after
  the third; the two survivors became v1 and v2.
- **Draft 2** — dropped from the shell after the fourth. The page and its
  frozen data still exist at `worklist-draft2.html`, so it can be opened
  directly, but it is no longer a tab or a compare option.

Files, renderers and styles for all of them are deleted.

All concepts share `js/data.js`, so the underlying deals are identical — only
the presentation changes.

The draft-parity page carries **its own copy of the row data** in
`js/rows-draft2.js`. That is deliberate — it is a frozen reference, so editing
`ROWS` for the redesign must not change what it shows.

## Application view

Clicking into a deal opens the full application screen — a rebuild
of the Figma frame **`Draft #2 - 1920px TO CODE`** (node `4124:6173`) on the
working file. Three columns on the 1920 artboard, 420 / 790 / 420 with the
113px gutters the frame uses:

| Column | |
|---|---|
| **Left** | Identity, call/email/SMS, overall progress, the activity feed and internal notes |
| **Middle** | Quick Summary with the four score dials, then Loan / Personal / Employment / Financial / Assets sections |
| **Right** | Next required actions, Documents, and Broker Assist |

**Interactions are deliberately thin**, as asked — it is a mock, not a working
form. Nothing submits and no field edits:

- every section folds away from its header
- Broker Assist is docked to the bottom edge rather than stacked with the other
  cards; its chevron raises it over Documents, stopping just under that card's
  heading so you can still see what is behind
- the middle column scrolls, and each list (activity, notes, tasks, documents) scrolls inside its card
- the expand control on Activity or Internal notes lifts that panel over the
  whole left column, covering the identity block and the other panel; only one
  can be expanded, since they take the same space
- the external/internal tabs switch
- `Esc` or the `×` closes it

**The way in is the lead-details cell** — the name and reference are what
identify the deal, so that is what opens it. It takes a pointer and the name
underlines on hover. Every other cell keeps doing its own job: the pills still
open their popups, the sparkle still opens Broker Assist.

The affordance is added by the mount rather than written into the stylesheet,
so it can only ever appear on a version that has actually wired the view up.

**What is real and what is dressing.** The name, reference, amount, loan type
and the six document rows with their statuses come from the deal you clicked,
so the view keeps telling the same story as the list. Scores, dates, addresses
and the financial figures are fixed mock values from the frame.

The score dials are drawn as SVG arcs rather than dropped in as artwork, so the
arc follows the value — change a number in `AV_SCORES` and the dial follows.

**The stage path is a flat image** — `assets/brand/stage-path.png`, the frame's
own run of chevrons exported at 1305×32 and dropped in at 1:1.

It was built in CSS first and did not hold up. The chevrons have to interlock
tightly, and a clip-path run cannot do both halves of that: notch the left edge
and the labels no longer fit ("Application submitted" needs 119px of the 126px
a step has), leave it straight and visible gaps open up between the steps.
Rather than keep trading one off against the other it is a picture for now.

That means it does not reflect the deal — every application shows
*Application pending*. When the stage needs to be real, this is the piece to
rebuild, and the greys to match are `#E5E5E5` for a step not yet reached, white
for one already done, and `#F3E9FF` with `#5614BB` text for the one in
progress, sampled from the frame.

All three versions open into it: each passes `appView` to the shared mount.
They still differ in the row itself — v2 keeps Broker Assist in its quick-view
sidebar, v3 keeps the split action columns — but the screen behind a deal is
the same one.

## Kanban view

The board is a rebuild of the Figma frame **`Draft #2 - 1440 px`** (node
`4235:8867`) — the deals as cards, grouped by the master pipeline stage. The
card in it comes from a later frame; see **Alert states** below.

**It runs on the same deals as the work list.** `js/data.js` already carried
everything a card needs, so nothing is invented: the name, reference, amount,
product, created and last-activity dates, the stage and its day count, the
documents, the people on the deal and the task / note / activity counts all
come from the deal. The column counts are the real ones, so they move when
the data does.

| Column | |
|---|---|
| New lead | Arrivals nobody has called yet. Sits in front of the pipeline, on a light red ground |
| Qualifying, Discovery, In Progress, Approval, Settlement | `MASTER_STAGES`, in order |
| Snoozed | Broker-set, and it wins over the pipeline stage — the same rule the grouped work list uses. Two steps darker than the others, its cards at 70%, and the contact buttons replaced by `Snoozed until <date>` |

New lead and Snoozed are the two ends of the same idea — one is the arrivals
tray, the other is what has been deliberately parked — so they are the two
columns that do not look like the pipeline between them. A parked deal also
drops its call, SMS and email buttons: there is no point offering to ring
someone you have put off until February, so the card says when it comes back
instead. `snoozedUntil` is on the deal, beside the `snoozed` flag.

**New lead is the board's own column, not a new pipeline stage.** `KB_STAGES`
puts it in front of `MASTER_STAGES` locally, because that array is the work
list's spine too and an arrivals tray is a board idea rather than a change to
the pipeline. Membership is the immediate state: a deal that wants calling
right now *is* a new arrival, which is what keeps the call-now card exclusive
to that one column instead of scattered down the board.

**The artboard is this project's 1920, not the frame's 1440.** The column is
the unit and keeps the frame's size (340 wide, 12px gutter, 312px cards), so
the wider artboard shows more of the board rather than a wider board. Six
columns still do not fit, so the board scrolls sideways — as it does in the
frame, where four of the six are visible.

**Where it leaves the frame**, and why:

- the icons are the sprite's, not the frame's exports — `js/icons.js` already
  carried every one of them
- the per-column filter reads `View all` on every column; the frame shows a
  filter glyph on two of them, and there is no filter state to drive it yet

**Interactions are thin**, as on the other screens: the columns scroll, the
board scrolls sideways, the column filter toggles. **Nothing drags yet**, and
a card does not open the application view — both are the obvious next
things.

#### The toolbar

The global CRM nav sits above the board in both versions, the same `navBar()`
the work list uses, in place of the placeholder band.

The toolbar under it is shared: both versions get the same one, and with it
the same views menu, filter panel, sort, select mode, bulk banner and
`+ New lead`. They differ below the bar, not in it. Seven things the brief
asks for, and where each one went:

| | |
|---|---|
| Switch board / list / Easy View | Three tabs with a glyph, as before |
| Jump to a common view | A `Your views` dropdown beside the board name, replacing the deal-type select |
| Search | The one field, saying what it actually searches |
| Filter | A side panel that applies as you change it |
| Sort | The `-Sort by-` dropdown |
| Add a lead | `+ New lead` |
| Work on several deals | `Select`, which turns the board into checkboxes and raises a bulk bar |

**The views, filters and sort are real**, not drawn. `kbDeals()` is the one
path: it runs the view's predicate, then the saved view's, then each filter
group, then the amount and date ranges, then the sort — so a view and a
filter compose instead of fighting, and the column headings count what is
actually on screen. The nine views give 10 / 22 / 12 / 1 / 14 / 19 / 4 / 2 /
20 deals against today's data.

**A saved view is a set of filters with a name on it**, not a rule of its
own. That is what lets it be adjusted: applying one loads its filters into
the panel, so a broker can see and change exactly what it stands for, and
changing anything by hand detaches the name — the dropdown stops claiming to
be a view it no longer is.

Saving happens in the **filter panel**, where the thing being saved was made
and can be seen, rather than in the views menu. `Edit saved views` at the
foot of the menu — the one red thing in it — turns the saved list into rows
that can be renamed in place, adjusted (which loads the view and opens the
panel on it) or deleted. Nothing persists past a reload; this is a
prototype.

**Amount and date lead the filter panel**, because they are the two a broker
reaches for without first deciding whose deals they are looking at. Broker,
partner and partner group follow, and all three are searched rather than
ticked: type a name, pick it from the suggestions, and it becomes a
removable tag. That is the work list's own `.chip-person`, so a person keeps
the colour they have on a row and in a panel; a group has no initials of its
own and wears the first letter of each word instead, so Auto Retail Group is
`AR`. Partner group sits directly under partner because it is the same
question asked one level up. Typing narrows the suggestions without touching
the board — nothing filters until a name is picked. The four closed lists
(stage, consumer or commercial, loan type, lead source) stay as ticks, which
are quicker for a short list.

**Filters apply instantly**, so there is no Apply button and nothing to
press. The panel says `Showing N of 27 deals` instead, which is the feedback
the button would have carried, and the Filter control takes a badge counting
the groups that are actually constraining.

**Sorting cannot jump around.** It orders on `created`, `activity`, `amount`
and the next follow-up — all of them dates and counts the *deal* records.
Opening a card or its quick-actions panel changes none of them, so the board
a broker comes back to is the board they left.

**Select mode** puts a box on every card and a `Select all` on every column.
Picking anything raises a banner **over the board's own toolbar** rather than
floating a bar over the cards: the selection is a mode the board is in, so it
takes the row that chooses what you are looking at — the row that stops
applying while a selection is live. The CRM header above it stays put,
because leaving the board entirely is still allowed. A cross on the left drops the selection, the
count sits beside it, and each action opens a small form under its own chip:

| Action | The form |
|---|---|
| Reassign broker | Search by name, pick one, it becomes a removable chip |
| Move stage | The seven stages, one of them chosen |
| Message | SMS or Email, then free text |
| Add a task | What needs doing, who it is for, when it is due — the quick-actions panel's own vocabulary |
| Add a note | Free text, landing on every selected deal as an internal note |

Save is live only once the form has been told enough to act on, and the
confirmation sits **beside** the actions rather than replacing them, since
having just reassigned, the next thing a broker wants is often to message the
same deals. Nothing is written: the board behind the banner is unchanged, and
the line says what would have happened.

The selection itself is real, and it survives filtering.

Three things the data gained for this: `segment` (consumer or commercial,
which follows the product), `source` (where the lead came from, which nothing
could previously express), and `PARTNER_GROUPS`, so a broker can filter by a
whole partner group rather than naming each dealership. Two settlement dates
were also pulled into the current week, so `Settling this week` is not an
empty view in the mock data.

#### Quick actions

The `Note` and `Task` pills on a card open the same two things the work list
offers, and each version borrows the shape that suits it:

| | |
|---|---|
| **v1** | The full-height sidebar, on the tab you pressed |
| **v2** | A card floated beside the pill, the way the work list's own quick actions do — `js/popups.js`, unchanged |

v2's are the work list's popups outright: `Next required actions` and
`Internal notes`, seeded off the deal, so the same row tells the same story
wherever it is opened from.

The sidebar, in v1: It is the work list's panel, not a
copy: `css/variants.css` supplies the `.dp-*` styles and `js/variants.js`
supplies `panelTasks` and `panelNotes`, so the task and note lists are the
ones the work list already tells. Both files come along on the kanban pages
for that alone — `window.VARIANT` is unset there, so the work-list renderer
loads and never runs.

What the kanban changes is the head and the tabs:

| | |
|---|---|
| Head | `Quick actions`, the client's name, then **amount · day in stage · stage**. The reference and the product are on the card already, so the panel names the three things the card does not repeat |
| Tabs | **Add task**, **Add note**, **Docs & forms** |

`Docs & forms` is a placeholder: it holds the shape of the panel but has no
renderer, so it is drawn disabled and titled `Nothing here yet`. `Request
docs` on the card stays inert for the same reason — there is nothing yet for
it to open.

The card the panel belongs to takes a brand ring, since the panel covers the
right of the board and can hide it. `Esc` or a click anywhere outside closes.

#### + New lead

Both versions open the same panel behind the toolbar's `+ New lead`, from the
Figma frame of that name (`4633:26032`). It is the board's second full-height
sidebar, so it keeps the filter panel's geometry and motion and differs only
where the frame does: 460px rather than 380, a rounded leading edge, and a
form rather than a list of controls.

| | |
|---|---|
| Head | `New lead` and a close cross |
| Tabs | **Main details**, **Enquiry details** *(optional)*, **Lead details** *(optional)* |
| Main details | Mobile no. (`+61` and the number in one field), Email address, First / Last name, Applicant type as **Person · Business**, then Assign broker, Assign partner, Referral source and Referring person as person chips |
| Foot | `Don't send welcome SMS & Email`, `Send broker notifications`, and **Add now** |

The two optional tabs have no fields behind them in the frame, so they say so
rather than showing an empty form — the same honesty `Docs & forms` keeps.

The person chips are the work list's `personChip`, so a broker wears the same
colour here as on a row; the cross on one clears it back to `+ Assign`. The
checkboxes, the segmented control and the tabs all toggle. Nothing is
submitted: `Add now` is inert.

The button is wired by delegation from the screen rather than bound to
itself, because v1 repaints its whole toolbar whenever a view, filter or sort
changes. `Esc` or a click anywhere outside closes.

#### Removed

- **The first board card** — the one from the `Draft #2 - 1440 px` frame, with
  the documents ring and the assignee stack. The alert-state card replaced it.
- **Visual cues 1** — the treatment that ran the tasks as full-bleed bands
  across the card, separated by hairlines. Cut after review; `Visual cues 2`
  survived and is now v1.

Their renderers and styles are deleted, as with the work list's removed
versions.

### Styling versions — Ribbon

**The `.2` suffix means Ribbon.** `v1.2` is v1 restyled and `v2.2` is v2
restyled — same markup, same renderers, same text hierarchy, same seven
functions on the toolbar, the same quick actions, filter panel, bulk banner
and `+ New lead` as the version they are a skin over. Each page loads one or
two extra stylesheets after `css/kanban.css` and sets a skin class on its
`.screen`:

| | Page | `KB_VARIANT` | Skin class | Stylesheet |
|---|---|---|---|---|
| **v1.2** Ribbon | `kanban-v1-2.html` | `v1-2` | `.skin-ribbon` | `css/kanban-ribbon.css` |
| **v2.2** Ribbon | `kanban-v2-2.html` | `v2-2` | `.skin-ribbon .skin-ribbon-text` | the same, plus `css/kanban-ribbon-text.css` |

Each page names its own variant in `KB_VARIANTS`, which says which card
renderer it uses and which column heading — two decisions that used to be
one.

`css/kanban-ribbon.css` is **shared**, so the stage ribbons and their capsule
markers, the 12px card with the spine inside it, the small caps labels, the
tabular figures, the capsule chips, the toolbar and the panels move for both
at once. `css/kanban-ribbon-text.css` is only the places where v2's card is
a different shape from v1's, and the places where carrying Ribbon over would
have cost v2 what it is for.

So there is **no second board** to keep in step: a change to `js/kanban.js`
reaches every version, and a styling direction can be thrown away by
deleting one file and one page. Nothing in `js/kanban.js` knows which skin
is on. Another direction is another sheet and another page beside these.

The one thing the JS gained for it is `kbTone()`, which hands each column
its stage's `colour`, `tint` and `ink` from `MASTER_STAGES` as `--kb-stage`,
`--kb-tint` and `--kb-ink`. Those three values already existed for the
colour-coded work list; the skin reaches for them rather than restating the
palette, and v1 and v2 simply ignore them. New lead is not a pipeline stage
and has no entry, so it borrows the system's error tint — the ground it
already stands on.

#### v2.2 — Ribbon, answering with type

v2 is the text-and-colour version: no tinted task blocks, no documents bar,
fewer objects and more words. So where v1.2 answers a question with a shape,
v2.2 answers it with type:

| | v1.2 | v2.2 |
|---|---|---|
| An overdue task | A solid red bar across the card | The task goes red and demibold and its due date goes with it, in the list it was already in |
| Documents | A bar in four status colours, every colour keyed to a dot | No bar, so nothing for a dot to key to — the counts carry their colour as words, and the dots are turned off |

**The column heading is v1.2's**, not v2's. `kbColumnHead()` used to pick
its treatment from the card mode, which meant the text-and-colour card came
with the line-of-text heading whether or not that was wanted; `KB_VARIANTS`
in `js/kanban.js` now names the card and the heading separately, so v2.2
takes v2's card under v1.2's heading. That also settles a fit problem: v2's
heading spells the total out, and seven figures beside a stage name does not
fit 340px, so three of the seven names were being truncated.

**`Upcoming tasks` drops to 10px**: set in capitals it is wider than the
sentence case it replaces, and it is the one label on the card that takes
width from the task name, which is what a broker is reading.

#### What Ribbon does

A broker reading this board is time poor, so every signal on it is ranked
rather than merely present, and the geometry is the brand's own roundness
rather than v1's.

| | |
|---|---|
| Board | White end to end. No column grounds and no rules between columns — the heading ribbons are what mark one column from the next |
| Column heading | A **rounded ribbon in the stage's own `tint`**, its name in that stage's `ink`, with a **capsule in its `colour`** at the head of the row. A column is found by colour before a word of it is read |
| What is late | A **solid red pill** in that ribbon. It is the loudest thing in the heading because it is the only thing in the heading to act on |
| Card | 12px, with a hairline the same weight on all four sides and the barest lift. A **5px spine** runs inside it, full height, curving with the corner because the card clips it. Every card has one, so the quiet ones are grey and the loud ones are a colour rather than a new shape |
| Labels | Uppercase, letterspaced, 10–11px: the stage name, the card's day-and-stage line, the document and task labels |
| Figures | `font-variant-numeric: tabular-nums` on the whole board, so amounts, counts and dates line up down a column |
| Documents | A bar in the system's four status colours — green received, amber with us, red rejected, grey not requested — with **each colour repeated as a dot against the word for it** underneath, and the green dot on `3 of 6`. The bar is the picture and the line under it is the key |
| The action row | 8px squircles — v1's footer is four pills in a row, and this one should not be mistaken for it |

**The alert band is ranked three ways at once** — fill, weight and height —
rather than by hue alone:

| State | Band | Height | Also |
|---|---|---|---|
| Call now | Solid red, white small caps | Tallest | The whole card's box turns red, and the call key with it |
| Documents to review | Amber tint, amber ink, 2px amber rule under | Middle | Amber spine |
| Possible duplicate | Grey tint, near-black ink | Shortest | Near-black spine |

Height is doing most of the work, and it costs nothing to read. v1 ranks the
three by colour alone, which is why a board where half the cards carry
something reads flat.

**An overdue task is a solid red bar**, bled to both edges of the card.
Nothing else in the body spans the card's full width, so the bleed is what
makes it read as a cut across the card rather than one more line in the
list — and it is why a tint could never do this job however saturated: a
pale ground inside the text column is still a row. The glyph stays the
calendar clock the other task rows carry, since it is the same kind of
thing as they are and only its state is different. White on `#D92D20` is
4.8:1, and the lateness is held back from white in small caps so the bar
reads task first.

Everything else that is late says so in red type rather than red fill — a
rejected document is set in red demibold — so the bar, the column's overdue
pill and the call-now band stay the only solid red on the board.

The tint and ink pairs are the design system's own and clear 4.5:1 as drawn,
so the count beside each stage name takes the lighter weight rather than a
lower opacity, which would take it under.

#### Removed

- **v1.3 Midnight** — v1 dropped onto a deep plum from the top of the brand
  ramp, with glass columns and lifted white cards. Cut in favour of working
  one direction properly.
- **Ledger** — the first pass at this direction, and what Ribbon was
  duplicated from: the same thinking drawn as a ruled document, square and
  hairlined, with the stage band bled to the column's rules. Cut once the
  rounded version had it.

### Alert states

All three versions use the alert-state card from the CRM-2026 `To upload` page
(node `4622:10931`). The board is identical in all of them — each
passes its own card renderer to `renderKanban`, so the columns, the toolbar
and the chrome are shared rather than copied, and v1.2 uses v1's renderer
outright.

| | The card | The column heading |
|---|---|---|
| **v1** Visual cues | One body, and the tasks are rounded tinted blocks inside it | The total as plain text at the stage name's size, and the overdue count as a chip, with the value shortened to `$1.2M` |
| **v2** Text & colour | No tints and no progress bar: a labelled two-column task list, and the documents as words | The totals as a line of text, value spelled out, colour doing the work |

**Each heading carries four things**, in the order a broker reads them: the
stage, how many deals, what they are worth, and what is late — one row, with
the totals where the `View all` control used to sit. The stage's description
moved onto the name as a tooltip, since that is where it went with the
control. Both totals are summed from the column's own deals, so a heading
cannot drift from the cards under it, and both drop the overdue count when
there is none, since an empty `0 overdue` on every column is what stops the
real ones registering.

**The four states are read off the deal**, not set by hand — `kbState()` in
`js/kanban.js` is the whole rule:

| State | When | How it shows |
|---|---|---|
| Immediate | A high-urgency deal still in Qualifying, not snoozed | Red banner, `New lead - call now`, a red outline on v1, and the card moves to the New lead column |
| Urgent | Documents the client sent that have sat unchecked for ten days | Amber banner naming the count |
| Warning | `duplicate` is set on the deal | Grey banner, `Possible duplicate` |
| None | Nothing wants attention | No banner |

**The band is about documents, not tasks.** An overdue task already says so
on the task itself, in a red bar across the card, so a band repeating the
count above it spends the loudest thing on the card telling a broker
something they can already see. The band is left to the one thing the body
does not carry: work that has arrived and is waiting on them to look at it.

**The threshold is what keeps the board honest.** An alert on every card is
the same as no alerts at all, and 20 of the 27 deals have a document in
review at any moment — so firing on arrival would put a band on three cards
in four. A document in review for two days is the process working; one
sitting for ten is not. That gives **3 immediate, 5 urgent, 2 warning and 17
quiet** — a board a broker could triage rather than a wall of amber.

**A call-now card drops its tasks and its documents** in both versions. The
only thing being asked for is the call, and rows of progress underneath argue
with it; what is left is who, how much, the day and stage, and the three ways
to reach them.

**`duplicate` is the one field the model gained for this.** Everything else a
card shows was already in `js/data.js`. The task rows are derived from
`nextAction`, `tasksOverdue` and `tasksDue`, so the due counts stand in for
real dates — `kbTasks()` is the single place to change when the model
carries them.

Two values are sampled from the frame rather than taken from a token: the
filled contact pill (`#ECDEFE`) and the neutral task block (`#EFEFEF`). Both
sit between steps on the ramp, and matching the frame mattered more than
inventing a token for them.

## Screen 2 — the copy of the application view

`screen2-v1.html` is a **standalone duplicate of the application view**, the
starting point for a different screen. It is a copy rather than a second
skin, because the two are meant to diverge: the `av` prefix was renamed to
`s2` throughout, so `js/screen2.js` and `css/screen2.css` can be reshaped
freely without any of it reaching the screen a deal opens into.

It still shares what is genuinely common — `css/tokens.css`, the icon sprite
in `js/icons.js`, and the deal data in `js/data.js`.

Two things differ from the original, both because this is a screen in its own
right rather than an overlay over the work list:

- it renders on load, from `DEALS[0]`, instead of waiting for a row to be
  clicked — so the `.is-open` gate and the row-opening wiring are gone
- the close `×` is gone from the top bar: there is nothing behind it to close
  back to

The interactions that were asked for are all still there — sections collapse,
Activity and Internal notes expand over the column, Broker Assist raises, the
external/internal tabs switch, the lists scroll.

It has its own prototype view at `screen2.html`, where it is **v1** — the
numbering starts again, because this is a different screen rather than another
take on the work list. The page itself is `screen2-v1.html`, and it opens on
its own at `/screen2-v1.html`.

A second version of this screen goes the way the work list's do: a page that
sets `window.S2_VARIANT`, an entry in `S2_MOUNTERS` at the bottom of
`js/screen2.js` skinning the same mount, and one line in the `versions` array
in `screen2.html`.

## Points-of-interest tour

The first time a version is viewed it spotlights its main controls, one at a
time. Everything dims except the control being introduced, a callout says what
it does, and **the step only advances once that control is actually used** —
the cog is clicked, the sparkle is clicked, the table is scrolled. Nothing is
blocked: the dim is purely visual, so the prototype stays explorable and a step
simply waits its turn. `Esc` or **Skip** ends it.

| | Steps |
|---|---|
| **v1** | Column chooser · Broker Assist · the quick-action popups · scrolling sideways for the rest of the columns |
| **v2** | Quick actions · Broker Assist in the sidebar |
| **v3** | None — nothing in it differs from v1 |

v2 deliberately repeats neither the column chooser nor the sideways scroll:
they behave exactly as they do in v1, so only what changed is worth pointing at.

**Replaying.** The toolbar's **Highlight the points of interest** button clears
what every version remembers and drops back to v1, which carries the full set.

**Progress** is per-version in `sessionStorage`, so leaving a version half-done
and coming back resumes on the same step rather than starting over. It clears
when the tab closes — the "exited the prototype" case — and survives a reload.

The tour lives in the version page rather than the shell, so it scales with the
frame and behaves the same opened full size. The shell drives it through a URL
parameter: `tour=auto` (default, skip if finished), `tour=force` (replay from
the top), `tour=off` (the side-by-side compare view, where two at once would be
chaos). To change the steps, edit `TOURS` at the top of `js/tour.js`.

## Broker Assist

In **v1** and **v3** the sparkle button floats Broker Assist as its own card.

In **v2** it is the fourth tab of the quick-view sidebar, beside Action tasks,
Notes and Activity — same summary, same vocabulary, one surface instead of
two. The sparkle button is just another way in: it opens the sidebar on that
tab, and clicking it again closes it. `#hailo` is never wired up in v2, so
there is no second overlay to collide with.

Which sections a version offers is `PANEL_SETS` in `js/variants.js`, picked by
the `assistInPanel` option that `MOUNTERS.v2` passes to `mountV1`.

## Row popups

In v1 the **Tasks**, **Notes** and **Activity** pills on a row each open a
floating card anchored under the pill — the three screens from the Figma
mock-up. They are static: nothing is editable, and the only live behaviour is
opening, closing (click off, `Esc`, or the `×`) and flipping above the pill
when the row sits near the bottom of the window.

Content is **seeded off the row index** in `js/popups.js`, so every row tells a
different story and the same row tells the same one on every reload. Change the
word lists at the top of that file to change the flavour.

Only one overlay is ever up: opening a card dismisses Broker Assist and the
column chooser, and vice versa. Nothing opens on load.

## Versioning

Each iteration is a new `worklist-vN.html`. They all share the CSS and JS, so:

- a change to a **token** (brand colour, radius, type size) hits every version
- a change to **layout or a component** hits every version
- a change that should apply to **one version only** goes in a `<style>` block
  inside that version's HTML, or its own stylesheet if it is substantial
  (see `css/draft2.css`)

Keeping old versions intact means you can open two side by side and compare.

## Editing the data

Row content lives in the `ROWS` array in `js/rows.js`. Add, remove or edit
entries and every version re-renders — nothing else to touch.

| Field | Notes |
|---|---|
| `pinned` | Draws the brand ring on the row |
| `pct` | Document progress, 0–100. 100 turns the ring green |
| `unread` | Puts the red dot on the Notes pill |
| `tone` | Stage badge colour: `brand`, `info`, `warning`, `success`, `neutral` |
| `settlement` | `null` renders the em-dash placeholder |

## Relationship to Figma

`worklist-v1.html` is a 1:1 rebuild of the Figma frame
**`Work list view — Redesign (1920)`** on the `↪️ Redesign` page.

The one difference is the typeface: this version uses the real **Articulat CF**,
loaded from `assets/fonts/`. The Figma version is still on Figtree, because
Figma's remote MCP server can only see cloud fonts.
