/* ==========================================================================
   Shared deal data for the concept versions (v3–v7).
   One model feeds all five, so a change to the story shows up everywhere.
   ========================================================================== */

const DOC_TYPES = ['ID', 'Payslips', 'Bank statements', 'Tax return', 'Asset quote', 'Insurance'];

/* Document status vocabulary, shared by every version:
     ok       — received and approved
     review   — received, being checked
     rejected — received but failed, client must resend
     pending  — never supplied                                             */
const DOC_STATUS = {
  ok:       { label: 'Approved', short: 'OK',  colour: 'var(--success-base)',  bg: 'var(--success-bg)',  text: 'var(--success-text)' },
  review:   { label: 'In review', short: 'REV', colour: 'var(--accent-amber)', bg: 'var(--warning-bg)',  text: 'var(--warning-text)' },
  rejected: { label: 'Rejected', short: 'REJ', colour: 'var(--error-base)',    bg: 'var(--error-bg)',    text: 'var(--error-text)' },
  pending:  { label: 'Not supplied', short: '—', colour: 'var(--neutral-400)', bg: 'var(--neutral-200)', text: 'var(--neutral-600)' }
};

/* `master` is the pipeline stage the application sits in — the spine of the
   board. `snoozed` is broker-set and overrides it in any grouped view. */
const MASTER_STAGES = [
  /* `tint` / `ink` are used by the colour-coded variant, which paints each
     stage container in its own hue instead of a neutral grey. */
  { id:'qualifying', label:'Qualifying',  note:'Lead captured, not yet qualified',          colour:'var(--accent-orange)', tint:'var(--stage-qualifying-tint)', ink:'var(--stage-qualifying-ink)' },
  { id:'discovery',  label:'Discovery',   note:'Gathering documents and requirements',      colour:'var(--accent-teal)',   tint:'var(--stage-discovery-tint)', ink:'var(--stage-discovery-ink)' },
  { id:'progress',   label:'In Progress', note:'Submitted and progressing with the lender', colour:'var(--accent-yellow)', tint:'var(--stage-progress-tint)', ink:'var(--stage-progress-ink)' },
  { id:'approval',   label:'Approval',    note:'Conditional or formal approval received',   colour:'var(--success-base)',  tint:'var(--stage-approval-tint)', ink:'var(--stage-approval-ink)' },
  { id:'settlement', label:'Settlement',  note:'Settlement booked or in progress',          colour:'var(--brand-600)',     tint:'var(--stage-settlement-tint)', ink:'var(--stage-settlement-ink)' },
  /* Broker-set rather than a pipeline stage: darker surface, clock glyph,
     and collapsed by default so paused deals stay out of the way. */
  { id:'snoozed',    label:'Snoozed',     note:'Paused by you',                           colour:'var(--neutral-400)',
    custom:true, glyph:'clock', collapsed:true }
];

/* Two things the board's filters need that nothing else could imply.
   `segment` follows the product — vehicle finance is the consumer line, the
   rest are business lending. `source` is where the lead came from, which the
   model had no way to say at all. */
/* `snoozedUntil` is when a paused deal comes back. The kanban's Snoozed
   column says it on the card, in place of the contact buttons — there is no
   point offering to ring someone you have deliberately parked. */
/* `duplicate` marks an application the system thinks it has seen before —
   the same client and amount arriving twice. It is set on the deal rather
   than worked out, because nothing else in the model implies it, and the
   kanban's alert states need it. */
const DEALS = [
  { name:'Maria Josephin', amount:250000, ref:'#APP-2026-0892', product:'Asset finance', segment:'commercial', source:'Partner', created:'15/01/26', activity:'23/01/26',
    urgency:'high', pinned:true, stage:'First contact', day:1, tone:'brand', master:'qualifying',
    lastAction:'Call logged', assigned:['KZ','Kenn Z.'], associate:['JF','Jess F.'], lender:null, partner:['AA','Acme Autos'],
    docs:['ok','rejected','pending','pending','review','pending'],
    tasksDue:2, tasksOverdue:1, notesUnread:2,
    activityText:"Kenn Z. logged a call with Maria", activityTime:'11:12am',
    tasks:5, notes:2, events:3, unread:true, people:['KZ','JF','CE','SM'], extra:2,
    settlement:null, nextAction:'Call client' },

  /* A lead that arrived this afternoon: nothing requested, nothing done.
     The kanban's New lead column needs arrivals to hold, and the work list
     gains one more row in Qualifying. */
  { name:'Ruben Alvarez', amount:145000, ref:'#APP-2026-0901', product:'Vehicle finance', segment:'consumer', source:'AILO', created:'22/01/26', activity:'22/01/26',
    urgency:'high', pinned:false, stage:'New enquiry', day:1, tone:'brand', master:'qualifying',
    lastAction:'Enquiry received', assigned:['KZ','Kenn Z.'], associate:null, lender:null, partner:['CF','CityFleet'],
    docs:['pending','pending','pending','pending','pending','pending'],
    tasksDue:1, tasksOverdue:0, notesUnread:0,
    activityText:"Enquiry received from the website", activityTime:'4:07pm',
    tasks:1, notes:0, events:1, unread:false, people:['KZ'], extra:0,
    settlement:null, nextAction:'Call new lead' },

  { name:'Cielo Escandor', amount:80000, ref:'#APP-2026-0876', product:'Asset finance', segment:'commercial', source:'Referral', created:'14/01/26', activity:'22/01/26',
    urgency:'high', pinned:false, stage:'Docs requested', day:3, tone:'info', master:'discovery',
    lastAction:'Docs requested', assigned:['KZ','Kenn Z.'], associate:['CE','Cara E.'], lender:['WP','Westpac'], partner:null,
    docs:['ok','ok','review','pending','pending','pending'],
    tasksDue:2, tasksOverdue:0, notesUnread:2,
    activityText:"Kenn Z. requested documents from Cielo", activityTime:'11:09am',
    tasks:3, notes:2, events:3, unread:true, people:['KZ','JF','CE'], extra:1,
    settlement:null, nextAction:'Chase 3 docs' },

  { name:'Mikey Gahona', amount:35000, ref:'#APP-2026-0871', product:'Asset finance', segment:'commercial', source:'Website', created:'13/01/26', activity:'20/01/26',
    urgency:'med', pinned:false, stage:'Follow up booked', day:2, tone:'brand', master:'qualifying',
    lastAction:'Email sent', assigned:['KZ','Kenn Z.'], associate:['SM','Sam M.'], lender:null, partner:['TM','TruckMart'],
    docs:['ok','ok','ok','review','rejected','pending'],
    tasksDue:0, tasksOverdue:2, notesUnread:0,
    activityText:"Kenn Z. sent an email to Mikey", activityTime:'1:01pm',
    tasks:5, notes:4, events:6, unread:false, people:['KZ','SM'], extra:1,
    settlement:null, nextAction:'Review rejected doc' },

  { name:'Daniel Whitmore', amount:420000, ref:'#APP-2026-0864', product:'Equipment finance', segment:'commercial', source:'Partner', created:'11/01/26', activity:'19/01/26',
    urgency:'high', pinned:false, stage:'With lender', day:6, tone:'warning', master:'progress',
    lastAction:'Sent to lender', assigned:['JF','Jess F.'], associate:['CE','Cara E.'], lender:['MQ','Macquarie'], partner:['AA','Acme Autos'],
    docs:['ok','ok','ok','ok','review','pending'],
    tasksDue:1, tasksOverdue:1, notesUnread:2,
    activityText:"Jess F. submitted to the lender", activityTime:'3:11pm',
    tasks:2, notes:6, events:9, unread:true, people:['JF','CE','SM'], extra:3,
    settlement:'18/03/26', nextAction:'Chase insurance' },

  { name:'Priya Raghunathan', amount:165000, ref:'#APP-2026-0858', product:'Asset finance', segment:'commercial', source:'Referral', created:'09/01/26', activity:'18/01/26',
    urgency:'med', pinned:false, stage:'Conditional approval', day:8, tone:'success', master:'approval',
    lastAction:'Approval received', assigned:['KZ','Kenn Z.'], associate:null, lender:['CB','CommBank'], partner:null,
    docs:['ok','ok','ok','ok','ok','review'],
    tasksDue:0, tasksOverdue:1, notesUnread:0,
    activityText:"Approval received from the lender", activityTime:'2:07pm',
    tasks:1, notes:3, events:7, unread:false, people:['KZ','CE'], extra:2,
    settlement:'02/03/26', nextAction:'Confirm settlement' },

  { name:'Tom Blakely', amount:92500, ref:'#APP-2026-0849', product:'Vehicle finance', segment:'consumer', source:'Partner', created:'08/01/26', activity:'16/01/26', duplicate:true,
    urgency:'low', pinned:false, stage:'Awaiting payslips', day:4, tone:'warning', master:'discovery',
    lastAction:'SMS sent', assigned:['JF','Jess F.'], associate:['SM','Sam M.'], lender:null, partner:['TM','TruckMart'], snoozed:true, snoozedUntil:'30/01/26',
    docs:['ok','rejected','rejected','pending','pending','pending'],
    tasksDue:2, tasksOverdue:0, notesUnread:0,
    activityText:"Jess F. sent an SMS to Tom", activityTime:'4:13pm',
    tasks:6, notes:2, events:4, unread:false, people:['JF','SM','KZ'], extra:1,
    settlement:null, nextAction:'Resend doc request' },

  { name:'Hannah Okonkwo', amount:310000, ref:'#APP-2026-0841', product:'Equipment finance', segment:'commercial', source:'AILO', created:'05/01/26', activity:'09/01/26',
    urgency:'low', pinned:false, stage:'Settlement booked', day:11, tone:'success', master:'settlement',
    lastAction:'Settlement booked', assigned:['KZ','Kenn Z.'], associate:['CE','Cara E.'], lender:['AN','ANZ'], partner:['AA','Acme Autos'],
    docs:['ok','ok','ok','ok','ok','ok'],
    tasksDue:0, tasksOverdue:0, notesUnread:0,
    activityText:"Kenn Z. booked settlement", activityTime:'11:12am',
    tasks:0, notes:5, events:11, unread:false, people:['KZ','JF','CE','SM'], extra:4,
    settlement:'26/02/26', nextAction:'Submit to lender' },

  { name:'Oliver Nguyen', amount:128000, ref:'#APP-2026-0837', product:'Vehicle finance', segment:'consumer', source:'Referral', created:'05/01/26', activity:'17/01/26', duplicate:true,
    urgency:'med', pinned:false, stage:'Docs requested', day:3, tone:'info', master:'discovery',
    lastAction:'Note added', assigned:['SM','Sam M.'], associate:null, lender:['WP','Westpac'], partner:null,
    docs:['ok','ok','pending','pending','ok','pending'],
    tasksDue:0, tasksOverdue:0, notesUnread:1,
    activityText:"Sam M. added a file note", activityTime:'4:38pm',
    tasks:4, notes:1, events:2, unread:true, people:['SM','KZ'], extra:1,
    settlement:null, nextAction:'Chase 3 docs' },
  { name:'Aisha Rahman', amount:680000, ref:'#APP-2026-0828', product:'Equipment finance', segment:'commercial', source:'Website', created:'01/01/26', activity:'09/01/26',
    urgency:'low', pinned:false, stage:'Follow up booked', day:3, tone:'brand', master:'qualifying',
    lastAction:'Call attempted', assigned:['JF','Jess F.'], associate:['RH','Ruby H.'], lender:null, partner:['CF','CityFleet'],
    docs:['pending','pending','pending','ok','pending','review'],
    tasksDue:0, tasksOverdue:2, notesUnread:0,
    activityText:"Jess F. attempted a call to Aisha", activityTime:'9:06am',
    tasks:2, notes:1, events:4, unread:false, people:['JF','RH','KZ'], extra:4,
    settlement:null },
  { name:'Ben Carmichael', amount:515000, ref:'#APP-2026-0701', product:'Commercial property', segment:'commercial', source:'Partner', created:'01/01/26', activity:'10/01/26',
    urgency:'med', pinned:false, stage:'Qualifying call', day:2, tone:'brand', master:'qualifying',
    lastAction:'Call attempted', assigned:['KZ','Kenn Z.'], associate:null, lender:['NA','NAB'], partner:['GM','GreenMach'],
    docs:['pending','review','pending','ok','pending','pending'],
    tasksDue:2, tasksOverdue:0, notesUnread:1,
    activityText:"Kenn Z. attempted a call to Ben", activityTime:'9:36am',
    tasks:6, notes:6, events:7, unread:true, people:['KZ','KZ'], extra:2,
    settlement:null },
  { name:'Sofia Kostova', amount:48000, ref:'#APP-2026-0839', product:'Vehicle finance', segment:'consumer', source:'Referral', created:'03/01/26', activity:'06/01/26',
    urgency:'high', pinned:false, stage:'Awaiting reply', day:1, tone:'brand', master:'qualifying',
    lastAction:'Call logged', assigned:['JF','Jess F.'], associate:['KZ','Kenn Z.'], lender:null, partner:null,
    docs:['pending','pending','pending','ok','review','pending'],
    tasksDue:0, tasksOverdue:1, notesUnread:1,
    activityText:"Jess F. logged a call with Sofia", activityTime:'9:17am',
    tasks:1, notes:5, events:4, unread:true, people:['JF','KZ','DP'], extra:2,
    settlement:null },
  { name:'Liam O’Donnell', amount:35000, ref:'#APP-2026-0738', product:'Business loan', segment:'commercial', source:'Website', created:'03/01/26', activity:'14/01/26',
    urgency:'high', pinned:false, stage:'Docs requested', day:4, tone:'info', master:'discovery',
    lastAction:'Quote revised', assigned:['RH','Ruby H.'], associate:['SM','Sam M.'], lender:['NA','NAB'], partner:null,
    docs:['ok','pending','review','ok','pending','rejected'],
    tasksDue:0, tasksOverdue:0, notesUnread:3,
    activityText:"Ruby H. revised the quote", activityTime:'9:22am',
    tasks:0, notes:5, events:1, unread:true, people:['RH','SM','KZ'], extra:1,
    settlement:null },
  { name:'Nina Petrova', amount:210000, ref:'#APP-2026-0839', product:'Asset finance', segment:'commercial', source:'AILO', created:'12/01/26', activity:'16/01/26',
    urgency:'med', pinned:false, stage:'Docs partially in', day:4, tone:'info', master:'discovery',
    lastAction:'Doc uploaded', assigned:['KZ','Kenn Z.'], associate:['JF','Jess F.'], lender:null, partner:['AA','Acme Autos'],
    docs:['ok','review','ok','pending','pending','rejected'],
    tasksDue:0, tasksOverdue:1, notesUnread:0,
    activityText:"Nina uploaded a document", activityTime:'8:53am',
    tasks:1, notes:1, events:8, unread:false, people:['KZ','JF','RH'], extra:2,
    settlement:null },
  { name:'Marcus Webb', amount:62000, ref:'#APP-2026-0711', product:'Asset finance', segment:'commercial', source:'Partner', created:'12/01/26', activity:'22/01/26',
    urgency:'med', pinned:false, stage:'Docs partially in', day:3, tone:'info', master:'discovery',
    lastAction:'Note added', assigned:['CE','Cara E.'], associate:['SM','Sam M.'], lender:['NA','NAB'], partner:['AA','Acme Autos'],
    docs:['pending','rejected','pending','ok','ok','review'],
    tasksDue:1, tasksOverdue:1, notesUnread:2,
    activityText:"Cara E. added a file note", activityTime:'4:25pm',
    tasks:6, notes:3, events:4, unread:true, people:['CE','SM','RH'], extra:2,
    settlement:null },
  { name:'Thanh Nguyen', amount:515000, ref:'#APP-2026-0838', product:'Equipment finance', segment:'commercial', source:'Website', created:'16/01/26', activity:'19/01/26',
    urgency:'med', pinned:false, stage:'With lender', day:5, tone:'warning', master:'progress',
    lastAction:'Call logged', assigned:['KZ','Kenn Z.'], associate:null, lender:['CB','CommBank'], partner:['TM','TruckMart'],
    docs:['ok','review','ok','ok','pending','ok'],
    tasksDue:3, tasksOverdue:0, notesUnread:0,
    activityText:"Kenn Z. logged a call with Thanh", activityTime:'8:02am',
    tasks:5, notes:1, events:4, unread:false, people:['KZ','DP'], extra:1,
    settlement:'27/01/26' },
  { name:'Elena Rossi', amount:120000, ref:'#APP-2026-0821', product:'Asset finance', segment:'commercial', source:'Partner', created:'03/01/26', activity:'11/01/26',
    urgency:'med', pinned:false, stage:'Further info requested', day:7, tone:'warning', master:'progress',
    lastAction:'Call logged', assigned:['JF','Jess F.'], associate:['DP','Dev P.'], lender:['NA','NAB'], partner:['BE','BuildEquip'],
    docs:['ok','ok','pending','ok','review','ok'],
    tasksDue:3, tasksOverdue:0, notesUnread:0,
    activityText:"Jess F. logged a call with Elena", activityTime:'8:47am',
    tasks:3, notes:1, events:10, unread:false, people:['JF','DP','RH'], extra:4,
    settlement:'26/03/26' },
  { name:'Jacob Mensah', amount:35000, ref:'#APP-2026-0718', product:'Equipment finance', segment:'commercial', source:'Referral', created:'20/01/26', activity:'22/01/26',
    urgency:'low', pinned:false, stage:'With lender', day:10, tone:'warning', master:'progress',
    lastAction:'Doc uploaded', assigned:['DP','Dev P.'], associate:['JF','Jess F.'], lender:['MQ','Macquarie'], partner:null,
    docs:['ok','pending','ok','review','ok','ok'],
    tasksDue:3, tasksOverdue:1, notesUnread:0,
    activityText:"Jacob uploaded a document", activityTime:'9:16am',
    tasks:6, notes:2, events:10, unread:false, people:['DP','JF','KZ'], extra:1,
    settlement:'26/02/26' },
  { name:'Freya Lindqvist', amount:340000, ref:'#APP-2026-0756', product:'Business loan', segment:'commercial', source:'Website', created:'06/01/26', activity:'18/01/26',
    urgency:'med', pinned:false, stage:'Conditional approval', day:13, tone:'success', master:'approval',
    lastAction:'Meeting booked', assigned:['KZ','Kenn Z.'], associate:['DP','Dev P.'], lender:['CB','CommBank'], partner:null,
    docs:['ok','ok','review','ok','ok','ok'],
    tasksDue:3, tasksOverdue:2, notesUnread:1,
    activityText:"Kenn Z. booked a meeting with Freya", activityTime:'4:52pm',
    tasks:7, notes:2, events:4, unread:true, people:['KZ','DP','SM'], extra:4,
    settlement:'24/02/26' },
  { name:'Omar Haddad', amount:48000, ref:'#APP-2026-0769', product:'Equipment finance', segment:'commercial', source:'AILO', created:'08/01/26', activity:'17/01/26',
    urgency:'low', pinned:false, stage:'Conditional approval', day:13, tone:'success', master:'approval',
    lastAction:'SMS sent', assigned:['JF','Jess F.'], associate:null, lender:['AN','ANZ'], partner:null,
    docs:['ok','review','ok','ok','ok','ok'],
    tasksDue:1, tasksOverdue:0, notesUnread:2,
    activityText:"Jess F. sent an SMS to Omar", activityTime:'9:01am',
    tasks:3, notes:2, events:4, unread:true, people:['JF','KZ'], extra:2,
    settlement:'29/01/26' },
  { name:'Grace Lombardi', amount:420000, ref:'#APP-2026-0793', product:'Commercial property', segment:'commercial', source:'Partner', created:'09/01/26', activity:'15/01/26',
    urgency:'med', pinned:false, stage:'Awaiting acceptance', day:12, tone:'success', master:'approval',
    lastAction:'Doc uploaded', assigned:['CE','Cara E.'], associate:['KZ','Kenn Z.'], lender:['MQ','Macquarie'], partner:['GM','GreenMach'],
    docs:['ok','ok','ok','ok','ok','review'],
    tasksDue:2, tasksOverdue:1, notesUnread:3,
    activityText:"Grace uploaded a document", activityTime:'8:03am',
    tasks:6, notes:5, events:1, unread:true, people:['CE','KZ','JF'], extra:1,
    settlement:'03/03/26' },
  { name:'Caleb Turner', amount:340000, ref:'#APP-2026-0720', product:'Equipment finance', segment:'commercial', source:'Website', created:'01/01/26', activity:'08/01/26',
    urgency:'high', pinned:false, stage:'Docs signed', day:15, tone:'success', master:'settlement',
    lastAction:'Lender update', assigned:['SM','Sam M.'], associate:null, lender:['CB','CommBank'], partner:['GM','GreenMach'],
    docs:['ok','ok','ok','ok','ok','ok'],
    tasksDue:1, tasksOverdue:1, notesUnread:0,
    activityText:"Lender updated the application", activityTime:'8:44am',
    tasks:2, notes:4, events:9, unread:false, people:['SM','CE'], extra:4,
    settlement:'18/03/26' },
  { name:'Leila Farouk', amount:275000, ref:'#APP-2026-0770', product:'Equipment finance', segment:'commercial', source:'Partner', created:'09/01/26', activity:'11/01/26',
    urgency:'med', pinned:false, stage:'Docs signed', day:16, tone:'success', master:'settlement',
    lastAction:'SMS sent', assigned:['RH','Ruby H.'], associate:['DP','Dev P.'], lender:['AN','ANZ'], partner:['CF','CityFleet'],
    docs:['ok','ok','ok','ok','ok','ok'],
    tasksDue:1, tasksOverdue:0, notesUnread:0,
    activityText:"Ruby H. sent an SMS to Leila", activityTime:'9:42am',
    tasks:1, notes:1, events:6, unread:false, people:['RH','DP','KZ'], extra:3,
    settlement:'20/02/26' },
  { name:'Ethan Park', amount:515000, ref:'#APP-2026-0837', product:'Vehicle finance', segment:'consumer', source:'Referral', created:'06/01/26', activity:'15/01/26',
    urgency:'low', pinned:false, stage:'Funds disbursed', day:20, tone:'success', master:'settlement',
    lastAction:'Meeting booked', assigned:['SM','Sam M.'], associate:['DP','Dev P.'], lender:['AN','ANZ'], partner:['CF','CityFleet'],
    docs:['ok','ok','ok','ok','ok','ok'],
    tasksDue:0, tasksOverdue:1, notesUnread:0,
    activityText:"Sam M. booked a meeting with Ethan", activityTime:'3:30pm',
    tasks:5, notes:3, events:10, unread:false, people:['SM','DP','RH'], extra:2,
    settlement:'11/03/26' },
  { name:'Noor Siddiqui', amount:275000, ref:'#APP-2026-0787', product:'Asset finance', segment:'commercial', source:'Partner', created:'01/01/26', activity:'10/01/26',
    urgency:'low', pinned:false, stage:'Client overseas', day:14, tone:'warning', master:'snoozed', snoozed:true, snoozedUntil:'16/02/26',
    lastAction:'Note added', assigned:['JF','Jess F.'], associate:['SM','Sam M.'], lender:null, partner:['TM','TruckMart'],
    docs:['ok','ok','rejected','pending','review','pending'],
    tasksDue:0, tasksOverdue:0, notesUnread:1,
    activityText:"Jess F. added a file note", activityTime:'10:15am',
    tasks:0, notes:3, events:4, unread:true, people:['JF','SM','JF'], extra:1,
    settlement:null },
  { name:'Dylan Hayes', amount:165000, ref:'#APP-2026-0790', product:'Business loan', segment:'commercial', source:'AILO', created:'06/01/26', activity:'13/01/26',
    urgency:'high', pinned:false, stage:'On hold – pricing', day:15, tone:'warning', master:'snoozed', snoozed:true, snoozedUntil:'06/02/26',
    lastAction:'Lender update', assigned:['JF','Jess F.'], associate:['DP','Dev P.'], lender:['WP','Westpac'], partner:['AA','Acme Autos'],
    docs:['pending','ok','pending','rejected','review','ok'],
    tasksDue:0, tasksOverdue:1, notesUnread:0,
    activityText:"Lender updated the application", activityTime:'11:49am',
    tasks:1, notes:2, events:8, unread:false, people:['JF','DP','RH'], extra:4,
    settlement:null },
  { name:'Ravi Chandra', amount:420000, ref:'#APP-2026-0702', product:'Business loan', segment:'commercial', source:'Referral', created:'10/01/26', activity:'17/01/26',
    urgency:'med', pinned:false, stage:'Awaiting client decision', day:8, tone:'warning', master:'snoozed', snoozed:true, snoozedUntil:'02/02/26',
    lastAction:'Email sent', assigned:['SM','Sam M.'], associate:['JF','Jess F.'], lender:null, partner:null,
    docs:['ok','pending','rejected','pending','ok','review'],
    tasksDue:1, tasksOverdue:0, notesUnread:1,
    activityText:"Sam M. sent an email to Ravi", activityTime:'10:01am',
    tasks:6, notes:1, events:8, unread:true, people:['SM','JF','CE'], extra:4,
    settlement:null }
];

/* ---------- Derived helpers, shared by every renderer ---------- */

/* The mock's "now". Dates in the data are DD/MM/YY and read relative to this. */
/* Partners belong to groups, so a broker can filter by the whole group
   rather than naming each dealership. */
const PARTNER_GROUPS = {
  AA: 'Auto Retail Group', CF: 'Auto Retail Group', TM: 'Auto Retail Group',
  GM: 'Equipment Partners', BE: 'Equipment Partners'
};
const partnerGroup = (d) => (d.partner ? PARTNER_GROUPS[d.partner[0]] || null : null);

const TODAY = '23/01/26';

const parseDMY = (s) => {
  const [d, m, y] = s.split('/').map(Number);
  return new Date(2000 + y, m - 1, d);
};

const relativeDate = (s) => {
  const days = Math.round((parseDMY(TODAY) - parseDMY(s)) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
};

const docCounts = (d) => d.docs.reduce((a, s) => (a[s]++, a), { ok:0, review:0, rejected:0, pending:0 });
const docPct    = (d) => Math.round((docCounts(d).ok / d.docs.length) * 100);
const money     = (n) => '$' + n.toLocaleString('en-AU');
const moneyShort = (n) => n >= 1000000 ? '$' + (n / 1000000).toFixed(1) + 'M' : '$' + Math.round(n / 1000) + 'K';

const URGENCY = {
  high: { label:'High',   colour:'var(--error-base)',    bg:'var(--error-bg)',    text:'var(--error-text)' },
  med:  { label:'Medium', colour:'var(--accent-amber)',  bg:'var(--warning-bg)',  text:'var(--warning-text)' },
  low:  { label:'Low',    colour:'var(--neutral-500)',   bg:'var(--neutral-200)', text:'var(--neutral-700)' }
};

/* Shared top navigation, carried over from v2 so the concepts differ
   in the worklist itself rather than in the chrome around it. */
const navBar = () => `
  <nav class="nav">
    <div class="nav__brand">
      <div class="nav__mark"><svg width="22" height="13"><use href="#i-logo"/></svg></div>
      <span class="nav__wordmark t-label-lg">loanoptions</span>
      <span class="nav__product t-body-lg">CRM</span>
    </div>
    <div class="nav__search t-body-lg">
      <svg width="16" height="16"><use href="#i-search"/></svg>
      Search for anything&hellip;
    </div>
    <div class="nav__actions">
      <span class="nav__btn"><svg width="20" height="20"><use href="#i-bell"/></svg><span class="nav__badge"></span></span>
      <span class="nav__btn"><svg width="20" height="20"><use href="#i-user-plus"/></svg></span>
      <span class="nav__btn"><svg width="20" height="20"><use href="#i-settings"/></svg></span>
      <span class="nav__btn"><svg width="20" height="20"><use href="#i-help"/></svg></span>
      <span class="nav__btn"><svg width="18" height="18"><use href="#i-apps"/></svg></span>
      <span class="nav__divider"></span>
      <span class="avatar avatar--sm avatar--solid t-label-sm">KZ</span>
    </div>
  </nav>`;
