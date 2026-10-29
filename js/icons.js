/* ==========================================================================
   Icon sprite — shared by every version.
   Each glyph is a <symbol> carrying its own viewBox, so icon() only has to
   set a pixel size and the symbol scales to fit.
   16-grid glyphs are hand-drawn; 24-grid glyphs follow the Feather geometry.
   ========================================================================== */

const ICON_SPRITE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>

  <!-- ---------- 16 grid: row + control glyphs ---------- -->
  <symbol id="i-phone" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.5 2.5h2l1 2.5-1.4 1a8.5 8.5 0 0 0 3.9 3.9l1-1.4 2.5 1v2a1 1 0 0 1-1.1 1A10.6 10.6 0 0 1 3.5 3.6a1 1 0 0 1 1-1.1z"/>
  </symbol>
  <symbol id="i-mail" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3.5" width="12" height="9" rx="2"/><path d="m2.6 4.8 5.4 4 5.4-4"/>
  </symbol>
  <symbol id="i-chat" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13.5 9.2A1.8 1.8 0 0 1 11.7 11H6.2L3.2 13.4V4.3a1.8 1.8 0 0 1 1.8-1.8h6.7a1.8 1.8 0 0 1 1.8 1.8z"/>
  </symbol>
  <symbol id="i-clock" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="8" r="5.6"/><path d="M8 4.8V8.2l2.2 1.3"/>
  </symbol>
  <!-- Calendar with a clock, exported from the task rows on the CRM-2026
       "To upload" page. The one filled glyph in this sprite rather than a
       stroked one, so it carries a fill where the others carry a stroke.
       Both resolve to currentColor, so it still takes the colour around it. -->
  <symbol id="i-calendar-clock" viewBox="0 0 16.4834 16.4834" fill="currentColor">
    <path d="M3.43404 5.49487H13.0494V4.12126H3.43404V5.49487ZM3.43404 15.1102C3.0563 15.1102 2.73292 14.9757 2.46392 14.7067C2.19492 14.4377 2.06042 14.1143 2.06042 13.7366V4.12126C2.06042 3.74351 2.19492 3.42014 2.46392 3.15114C2.73292 2.88214 3.0563 2.74764 3.43404 2.74764H4.12085V1.37402H5.49447V2.74764H10.9889V1.37402H12.3625V2.74764H13.0494C13.4271 2.74764 13.7505 2.88214 14.0195 3.15114C14.2885 3.42014 14.423 3.74351 14.423 4.12126V8.01889C14.2055 7.91587 13.9823 7.83002 13.7533 7.76134C13.5244 7.69266 13.2897 7.64115 13.0494 7.60681V6.86849H3.43404V13.7366H7.76093C7.84106 13.9884 7.9355 14.2288 8.04424 14.4577C8.15299 14.6867 8.28176 14.9041 8.43057 15.1102H3.43404ZM9.93297 14.7925C9.26333 14.1229 8.92851 13.313 8.92851 12.363C8.92851 11.4129 9.26333 10.603 9.93297 9.93337C10.6026 9.26373 11.4125 8.92891 12.3625 8.92891C13.3126 8.92891 14.1225 9.26373 14.7921 9.93337C15.4618 10.603 15.7966 11.4129 15.7966 12.363C15.7966 13.313 15.4618 14.1229 14.7921 14.7925C14.1225 15.4622 13.3126 15.797 12.3625 15.797C11.4125 15.797 10.6026 15.4622 9.93297 14.7925ZM13.513 13.9941L13.9937 13.5134L12.706 12.2256V10.3025H12.0191V12.5003L13.513 13.9941Z"/>
  </symbol>
  <symbol id="i-note" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="2.2" width="10" height="11.6" rx="2"/><path d="M5.6 6.2h4.8M5.6 9.2h4.8"/>
  </symbol>
  <symbol id="i-activity" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.8 8a5.2 5.2 0 1 1 1.7 3.9"/><path d="M2.6 4.9v3.2h3.2"/>
  </symbol>
  <symbol id="i-pin" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 2.2h4l-.9 1.3v3.2l2.3 2.6H4.6l2.3-2.6V3.5z"/><path d="M8 9.3v4"/>
  </symbol>
  <symbol id="i-kebab" viewBox="0 0 16 16" fill="currentColor">
    <circle cx="8" cy="3.4" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="8" cy="12.6" r="1.3"/>
  </symbol>
  <symbol id="i-chevron-down" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="m4 6.3 4 4 4-4"/>
  </symbol>
  <symbol id="i-chevron-up" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="m4 9.7 4-4 4 4"/>
  </symbol>
  <symbol id="i-search" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="7.2" cy="7.2" r="4.6"/><path d="m10.6 10.6 2.9 2.9"/>
  </symbol>
  <symbol id="i-grid" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2" width="5.2" height="5.2" rx="1.4"/><rect x="8.8" y="2" width="5.2" height="5.2" rx="1.4"/>
    <rect x="2" y="8.8" width="5.2" height="5.2" rx="1.4"/><rect x="8.8" y="8.8" width="5.2" height="5.2" rx="1.4"/>
  </symbol>
  <symbol id="i-rows" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="3" width="12" height="2.2" rx="1.1"/><rect x="2" y="6.9" width="12" height="2.2" rx="1.1"/>
    <rect x="2" y="10.8" width="12" height="2.2" rx="1.1"/>
  </symbol>

  <symbol id="i-plus" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <path d="M8 3.4v9.2M3.4 8h9.2"/>
  </symbol>
  <symbol id="i-sort" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.4 3v10M2.4 5l2-2 2 2"/><path d="M11.6 13V3M9.6 11l2 2 2-2"/>
  </symbol>

  <!-- Contact glyphs: one stroke per icon, carrying a purple-to-red gradient.
       userSpaceOnUse keeps every element on a single ramp across the 16x16
       box — otherwise each dot of the chat icon would run the full range. -->
  <linearGradient id="contactGradient" gradientUnits="userSpaceOnUse" x1="1.5" y1="1.5" x2="14.5" y2="14.5">
    <stop offset="0%"   stop-color="var(--icon-grad-from, var(--brand-600))"/>
    <stop offset="55%"  stop-color="var(--icon-grad-mid, var(--brand-500))"/>
    <stop offset="100%" stop-color="var(--accent-red)"/>
  </linearGradient>

  <symbol id="i-phone-duo" viewBox="0 0 16 16" fill="none" stroke="url(#contactGradient)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5.9 2.3a1 1 0 0 1 1 .6l.9 2.2a1 1 0 0 1-.27 1.15l-1 .83a8.6 8.6 0 0 0 3.4 3.4l.83-1a1 1 0 0 1 1.15-.27l2.2.9a1 1 0 0 1 .6 1v1.8a1.2 1.2 0 0 1-1.3 1.2A11.6 11.6 0 0 1 2.3 3.6 1.2 1.2 0 0 1 3.5 2.3z"/>
  </symbol>
  <symbol id="i-mail-duo" viewBox="0 0 16 16" fill="none" stroke="url(#contactGradient)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <rect x="1.7" y="3.3" width="12.6" height="9.4" rx="2.2"/>
    <path d="m2.4 4.8 4.6 3.6a1.6 1.6 0 0 0 2 0l4.6-3.6"/>
  </symbol>
  <symbol id="i-chat-duo" viewBox="0 0 16 16" fill="none" stroke="url(#contactGradient)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13.7 8.8a1.9 1.9 0 0 1-1.9 1.9H6.3L3 13.4V4.3a1.9 1.9 0 0 1 1.9-1.9h6.9a1.9 1.9 0 0 1 1.9 1.9z"/>
    <g fill="url(#contactGradient)" stroke="none">
      <circle cx="5.8" cy="6.6" r=".9"/><circle cx="8.4" cy="6.6" r=".9"/><circle cx="11" cy="6.6" r=".9"/>
    </g>
  </symbol>

  <!-- Split quick-action columns: alarm (tasks), bubble (notes), history (activity) -->
  <symbol id="i-alarm" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="9" r="5.3"/><path d="M8 6.5V9l1.8 1.1"/>
    <path d="M2.4 3.2 4.3 1.7M13.6 3.2 11.7 1.7"/>
  </symbol>
  <symbol id="i-bubble" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13.6 9A1.8 1.8 0 0 1 11.8 10.8H6.3L3.2 13.2V4.4a1.8 1.8 0 0 1 1.8-1.8h6.8a1.8 1.8 0 0 1 1.8 1.8z"/>
    <path d="M5.8 5.9h5M5.8 8.1h3.2"/>
  </symbol>
  <symbol id="i-history" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.6 8a5.4 5.4 0 1 0 1.6-3.8"/><path d="M2.3 2.6v3.2h3.2"/>
    <path d="M8 5.4V8.2l2 1.2"/>
  </symbol>

  <symbol id="i-paperclip" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M13.2 7.4 8 12.6a3.2 3.2 0 0 1-4.5-4.5l5.6-5.6a2.1 2.1 0 1 1 3 3l-5.5 5.6a1 1 0 0 1-1.5-1.5l4.9-4.9"/>
  </symbol>

  <symbol id="i-check-sm" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m3.4 8.4 3 3 6.2-6.8"/>
  </symbol>
  <symbol id="i-close" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <path d="m4.4 4.4 7.2 7.2M11.6 4.4 4.4 11.6"/>
  </symbol>
  <symbol id="i-star" viewBox="0 0 16 16" fill="currentColor" stroke="none">
    <path d="m8 1.8 1.86 3.77 4.16.6-3.01 2.94.71 4.14L8 11.3l-3.72 1.95.71-4.14L1.98 6.17l4.16-.6z"/>
  </symbol>
  <symbol id="i-columns" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round">
    <rect x="2" y="2.6" width="12" height="10.8" rx="1.8"/><path d="M6 2.6v10.8M10 2.6v10.8"/>
  </symbol>
  <symbol id="i-bolt" viewBox="0 0 16 16" fill="currentColor" stroke="none">
    <path d="M9.3 1.4 3.6 9h3.4l-.7 5.6L12.6 7H9.1z"/>
  </symbol>
  <symbol id="i-send" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14.2 1.8 7.3 8.7M14.2 1.8l-4.4 12.4-2.5-5.5-5.5-2.5z"/>
  </symbol>
  <symbol id="i-alert" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 2.2 14.6 13.4H1.4z"/><path d="M8 6.4v3M8 11.6h.01"/>
  </symbol>
  <symbol id="i-sparkle" viewBox="0 0 16 16" fill="currentColor" stroke="none">
    <path d="M8 1.2 9.5 5.4 13.7 6.9 9.5 8.4 8 12.6 6.5 8.4 2.3 6.9 6.5 5.4z"/>
    <path d="M12.9 10.4l.62 1.73 1.73.62-1.73.62-.62 1.73-.62-1.73-1.73-.62 1.73-.62z"/>
  </symbol>
  <symbol id="i-filter" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.4 3.1h11.2L9.1 8.5v4.3l-2.2 1.1V8.5z"/>
  </symbol>
  <symbol id="i-sliders" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
    <path d="M2.6 4.6h10.8M2.6 11.4h10.8"/>
    <circle cx="6" cy="4.6" r="1.9" fill="var(--bg-base)"/><circle cx="10.4" cy="11.4" r="1.9" fill="var(--bg-base)"/>
  </symbol>

  <!-- ---------- Brand mark (kept exactly as the LO logo) ---------- -->
  <!-- The real wordless mark, exported from CRM-2026. Filled rather than
       stroked, and not square (30.1 x 17.8), so callers should size the
       <svg> to that ratio - a square box letterboxes it. -->
  <symbol id="i-logo" viewBox="0 0 30.0983 17.7854" fill="currentColor">
    <path d="M10.7665 17.7558C12.0956 17.7558 13.1728 16.6893 13.1728 15.3741C13.1728 14.059 12.0956 12.9924 10.7665 12.9924C9.43738 12.9924 8.36021 14.059 8.36021 15.3741C8.36021 16.6893 9.43738 17.7558 10.7665 17.7558Z"/>
    <path d="M27.692 5.69292C29.0211 5.69292 30.0983 4.62633 30.0983 3.31119C30.0983 1.99604 29.0211 0.929456 27.692 0.929456C26.3629 0.929456 25.2857 1.99604 25.2857 3.31119C25.2857 4.62633 26.3629 5.69292 27.692 5.69292Z"/>
    <path d="M25.6679 6.40334C24.5917 5.65387 23.1248 5.93385 22.3914 7.03472L19.6742 11.1011L12.962 1.0523C12.5209 0.395209 11.795 0 11.0147 0C10.2345 0 9.50856 0.3914 9.0674 1.0523L0.410747 13.9856C-0.322661 15.0865 -0.0482183 16.5855 1.02895 17.3349C1.43733 17.6197 1.90004 17.7558 2.35526 17.7558C3.10647 17.7558 3.84737 17.3863 4.30259 16.7035L11.011 6.68427L17.724 16.7331C18.1652 17.3902 18.8911 17.7854 19.6714 17.7854C20.4516 17.7854 21.1775 17.394 21.6187 16.7331L26.2833 9.75357C27.0204 8.6527 26.746 7.15376 25.6688 6.40429L25.6679 6.40334Z"/>
  </symbol>

  <!-- ---------- 24 grid: top navigation glyphs ---------- -->
  <symbol id="i-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </symbol>
  <symbol id="i-user-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/>
  </symbol>
  <symbol id="i-settings" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </symbol>
  <symbol id="i-help" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
  </symbol>
  <symbol id="i-apps" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="5" r="1.9"/><circle cx="12" cy="5" r="1.9"/><circle cx="19" cy="5" r="1.9"/>
    <circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/>
    <circle cx="5" cy="19" r="1.9"/><circle cx="12" cy="19" r="1.9"/><circle cx="19" cy="19" r="1.9"/>
  </symbol>


  <!-- ---------- Application view ---------- -->
  <symbol id="i-pencil" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11.2 2.6a1.6 1.6 0 0 1 2.2 2.2L5.6 12.6l-3 .8.8-3z"/>
  </symbol>
  <symbol id="i-expand" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9.6 2.4h4v4M6.4 13.6h-4v-4M13.6 2.4 9.2 6.8M2.4 13.6l4.4-4.4"/>
  </symbol>
  <symbol id="i-check-circle" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="8" r="6.2"/><path d="m5.3 8.2 1.9 1.9 3.5-3.9"/>
  </symbol>
  <symbol id="i-check-fill" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="currentColor"/>
    <path d="m5 8.2 2 2 4-4.3" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </symbol>
  <symbol id="i-warn-tri" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 2.6 14.4 13.4H1.6z"/><path d="M8 6.6v3M8 11.6v.01"/>
  </symbol>
  <symbol id="i-x-circle" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="currentColor"/>
    <path d="m5.8 5.8 4.4 4.4M10.2 5.8l-4.4 4.4" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
  </symbol>
  <symbol id="i-save" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3.4 2.6h7l3 3v8a.8.8 0 0 1-.8.8H3.4a.8.8 0 0 1-.8-.8V3.4a.8.8 0 0 1 .8-.8z"/>
    <path d="M5.2 2.6v4h5.2v-4M5.2 10.2h5.6"/>
  </symbol>
  <symbol id="i-arrow-forward" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9.4 3.4 14 8l-4.6 4.6"/><path d="M14 8H4.6A2.6 2.6 0 0 0 2 10.6v2"/>
  </symbol>
  <symbol id="i-article" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2.4" y="2.4" width="11.2" height="11.2" rx="2"/><path d="M5 5.8h6M5 8.4h6M5 11h3.6"/>
  </symbol>
  <symbol id="i-chevron-right" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="m6.3 4 4 4-4 4"/>
  </symbol>
  <symbol id="i-sort" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.4 2.8v10.4M2.2 11l2.2 2.2L6.6 11M11.6 13.2V2.8M9.4 5l2.2-2.2L13.8 5"/>
  </symbol>
  <!-- Broker Assist. Two-stop gradient rather than a flat fill, so this one
       ignores currentColor - exported from CRM-2026. -->
  <symbol id="i-assist" viewBox="0 0 14 14">
    <path fill="url(#assist-grad)" d="M5.55625 4.65208C5.15764 4.25347 4.95833 3.77222 4.95833 3.20833C4.95833 2.64444 5.15764 2.16319 5.55625 1.76458C5.95486 1.36597 6.43611 1.16667 7 1.16667C7.56389 1.16667 8.04514 1.36597 8.44375 1.76458C8.84236 2.16319 9.04167 2.64444 9.04167 3.20833C9.04167 3.77222 8.84236 4.25347 8.44375 4.65208C8.04514 5.05069 7.56389 5.25 7 5.25C6.43611 5.25 5.95486 5.05069 5.55625 4.65208ZM7.61979 3.82813C7.78993 3.65799 7.875 3.45139 7.875 3.20833C7.875 2.96528 7.78993 2.75868 7.61979 2.58854C7.44965 2.4184 7.24306 2.33333 7 2.33333C6.75694 2.33333 6.55035 2.4184 6.38021 2.58854C6.21007 2.75868 6.125 2.96528 6.125 3.20833C6.125 3.45139 6.21007 3.65799 6.38021 3.82813C6.55035 3.99826 6.75694 4.08333 7 4.08333C7.24306 4.08333 7.44965 3.99826 7.61979 3.82813ZM7 12.8333L3.5 9.33333C3.30556 9.13889 3.15972 8.92014 3.0625 8.67708C2.96528 8.43403 2.91667 8.16667 2.91667 7.875C2.91667 7.30139 3.11354 6.81771 3.50729 6.42396C3.90104 6.03021 4.38472 5.83333 4.95833 5.83333C5.24028 5.83333 5.50035 5.88681 5.73854 5.99375C5.97674 6.1007 6.19306 6.25139 6.3875 6.44583L7 7.05833L7.6125 6.44583C7.80694 6.25139 8.02326 6.1007 8.26146 5.99375C8.49965 5.88681 8.75972 5.83333 9.04167 5.83333C9.61528 5.83333 10.099 6.03021 10.4927 6.42396C10.8865 6.81771 11.0833 7.30139 11.0833 7.875C11.0833 8.16667 11.0347 8.43403 10.9375 8.67708C10.8403 8.92014 10.6944 9.13889 10.5 9.33333L7 12.8333ZM7 11.1708L9.65417 8.51667C9.74167 8.42917 9.80729 8.32951 9.85104 8.21771C9.89479 8.1059 9.91667 7.99167 9.91667 7.875C9.91667 7.64167 9.83403 7.4375 9.66875 7.2625C9.50347 7.0875 9.29444 7 9.04167 7C8.925 7 8.82049 7.01701 8.72813 7.05104C8.63576 7.08507 8.54583 7.14583 8.45833 7.23333L7 8.69167L5.54167 7.23333C5.48333 7.175 5.40799 7.12153 5.31563 7.07292C5.22326 7.02431 5.10417 7 4.95833 7C4.70556 7 4.49653 7.0875 4.33125 7.2625C4.16597 7.4375 4.08333 7.64167 4.08333 7.875C4.08333 7.99167 4.10764 8.10104 4.15625 8.20313C4.20486 8.30521 4.26806 8.4 4.34583 8.4875L7 11.1708Z"/>
  </symbol>
  <linearGradient id="assist-grad" x1="2.91667" y1="7" x2="11.0833" y2="7" gradientUnits="userSpaceOnUse">
    <stop offset="0.495192" stop-color="var(--icon-grad-mid, #5614BB)"/>
    <stop offset="1" stop-color="#F33829"/>
  </linearGradient>

</defs></svg>`;

document.addEventListener('DOMContentLoaded', () => {
  document.body.insertAdjacentHTML('afterbegin', ICON_SPRITE);
});

/** Render an icon at a given pixel size. The symbol's own viewBox does the scaling. */
const icon = (id, size = 16) =>
  `<svg width="${size}" height="${size}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
