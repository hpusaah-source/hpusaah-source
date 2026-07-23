/* ============================================================
   Acme Studios — Onboarding Dashboard app logic
   Vanilla JS SPA with localStorage persistence.
   ============================================================ */

const STORE_KEY = 'acme_onboarding_v1';

/* ---------------------------------------------------------- Store */
const Store = {
  data: null,
  load() {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      try { this.data = JSON.parse(raw); return; } catch (e) { /* fall through */ }
    }
    this.data = seedData();
    this.save();
  },
  save() { localStorage.setItem(STORE_KEY, JSON.stringify(this.data)); },
  reset() { localStorage.removeItem(STORE_KEY); this.load(); },
  nextId(prefix) {
    let n = 1;
    while (this.data[collectionFor(prefix)].some(x => x.id === prefix + n)) n++;
    return prefix + n;
  },
};

function collectionFor(prefix) {
  return { c: 'clients', p: 'projects', t: 'tasks', r: 'requests', f: 'files', i: 'invoices' }[prefix];
}

/* ---------------------------------------------------------- App state */
const UI = {
  view: 'dashboard',
  role: 'agency',       // 'agency' | 'client'
  activeClient: 'c1',   // used when role === 'client'
};

/* ---------------------------------------------------------- Helpers */
const $  = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function money(n) { return '$' + Number(n).toLocaleString('en-US'); }
function moneyK(n) { return n >= 1000 ? '$' + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k' : '$' + n; }
function avatarColor(id) {
  const seed = String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[seed % AVATAR_COLORS.length];
}
function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}
function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtDateShort(d) {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function clientName(id) { const c = Store.data.clients.find(c => c.id === id); return c ? c.name : '—'; }
function teamMember(id) { return Store.data.team.find(u => u.id === id); }
function projectName(id) { const p = Store.data.projects.find(p => p.id === id); return p ? p.name : '—'; }

/* Data filtered by current role/client scope */
function scopedClients() {
  return UI.role === 'client'
    ? Store.data.clients.filter(c => c.id === UI.activeClient)
    : Store.data.clients;
}
function scopedProjects() {
  return UI.role === 'client'
    ? Store.data.projects.filter(p => p.clientId === UI.activeClient)
    : Store.data.projects;
}
function scopedRequests() {
  return UI.role === 'client'
    ? Store.data.requests.filter(r => r.clientId === UI.activeClient)
    : Store.data.requests;
}
function scopedTasks() {
  if (UI.role !== 'client') return Store.data.tasks;
  const pids = new Set(Store.data.projects.filter(p => p.clientId === UI.activeClient).map(p => p.id));
  return Store.data.tasks.filter(t => pids.has(t.projectId));
}
function scopedFiles() {
  return UI.role === 'client'
    ? Store.data.files.filter(f => f.clientId === UI.activeClient)
    : Store.data.files;
}

/* Badge builders */
const ONBOARD_BADGE = {
  'completed':   ['b-green',  'dot-green',  'Completed'],
  'in-progress': ['b-amber',  'dot-amber',  'In progress'],
  'not-started': ['b-slate',  'dot-slate',  'Not started'],
};
const PROJECT_BADGE = {
  'planning':    ['b-slate',  'dot-slate',  'Planning'],
  'in-progress': ['b-blue',   'dot-blue',   'In progress'],
  'review':      ['b-violet', 'dot-violet', 'In review'],
  'completed':   ['b-green',  'dot-green',  'Completed'],
};
const REQUEST_BADGE = {
  'open':        ['b-amber',  'dot-amber',  'Open'],
  'in-progress': ['b-blue',   'dot-blue',   'In progress'],
  'resolved':    ['b-green',  'dot-green',  'Resolved'],
};
const PRIORITY_BADGE = {
  'high':   ['b-red',   'High'],
  'medium': ['b-amber', 'Medium'],
  'low':    ['b-slate', 'Low'],
};
function statusBadge(map, key) {
  const [cls, dot, label] = map[key] || ['b-slate', 'dot-slate', key];
  return `<span class="badge ${cls}"><span class="dot ${dot}"></span>${label}</span>`;
}
function priorityBadge(key) {
  const [cls, label] = PRIORITY_BADGE[key] || ['b-slate', key];
  return `<span class="badge ${cls}">${label}</span>`;
}
function avatarFor(id, name, sizeCls) {
  return `<span class="ava ${sizeCls || ''}" style="background:${avatarColor(id)}">${initials(name)}</span>`;
}
function progressBar(pct, green) {
  return `<div class="progress-row"><div class="progress ${green ? 'green' : ''}"><span style="width:${pct}%"></span></div><span class="pct">${pct}%</span></div>`;
}

/* ---------------------------------------------------------- Views */
const Views = {

  /* ------------------------------ Dashboard */
  dashboard() {
    return UI.role === 'agency' ? this.agencyDashboard() : this.clientDashboard();
  },

  agencyDashboard() {
    const d = Store.data;
    const activeProjects = d.projects.filter(p => p.status !== 'completed').length;
    const openRequests = d.requests.filter(r => r.status !== 'resolved').length;
    const revenueDue = d.invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);
    const overdue = d.invoices.filter(i => i.status === 'overdue');
    const overdueTotal = overdue.reduce((s, i) => s + i.amount, 0);

    const kpis = [
      { icn: 'users',    tint: 'tint-brand', label: 'Total clients',    value: d.clients.length, delta: '+2 this month', dir: 'up' },
      { icn: 'folder',   tint: 'tint-blue',  label: 'Active projects',  value: activeProjects,   delta: '+3 this month', dir: 'up' },
      { icn: 'inbox',    tint: 'tint-amber', label: 'Open requests',    value: openRequests,     delta: '4 need reply',  dir: 'flat' },
      { icn: 'dollar',   tint: 'tint-green', label: 'Revenue due',      value: moneyK(revenueDue), delta: '+12% MoM',    dir: 'up' },
      { icn: 'alert',    tint: 'tint-red',   label: 'Overdue invoices', value: overdue.length,   delta: money(overdueTotal), dir: 'down' },
    ];

    const kpiHtml = kpis.map(k => `
      <div class="kpi">
        <div class="kpi-top">
          <div>
            <div class="kpi-label">${k.label}</div>
            <div class="kpi-value">${k.value}</div>
          </div>
          <div class="kpi-icn ${k.tint}">${icon(k.icn)}</div>
        </div>
        <div class="kpi-delta ${k.dir}">${k.dir === 'up' ? icon('trending') : k.dir === 'down' ? icon('trendDown') : ''}${k.delta}</div>
      </div>`).join('');

    // Recent clients (by onboarding activity)
    const recentClients = [...d.clients]
      .sort((a, b) => new Date(b.since) - new Date(a.since)).slice(0, 5)
      .map(c => `
        <tr>
          <td><div class="who">${avatarFor(c.id, c.name)}<div><div class="cell-main">${esc(c.name)}</div><div class="cell-sub">${esc(c.industry)}</div></div></div></td>
          <td>${statusBadge(ONBOARD_BADGE, c.onboarding)}</td>
          <td style="min-width:150px">${progressBar(c.progress, c.progress === 100)}</td>
        </tr>`).join('');

    const activityHtml = d.activity.map((a, i) => `
      <div class="tl-item">
        <div class="tl-dot ${activityTint(a.kind)}">${icon(a.kind)}</div>
        <div class="tl-line"></div>
        <div class="tl-body"><div class="tl-title">${a.text}</div><div class="tl-time">${a.time}</div></div>
      </div>`).join('');

    return `
      <div class="kpi-grid">${kpiHtml}</div>
      <div class="grid-2">
        <div class="card">
          <div class="card-head">
            <h3>Recent clients</h3><div class="spacer"></div>
            <a class="link" data-nav="clients">View all →</a>
          </div>
          <div class="table-wrap">
            <table class="tbl">
              <thead><tr><th>Client</th><th>Onboarding</th><th>Progress</th></tr></thead>
              <tbody>${recentClients}</tbody>
            </table>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>Activity feed</h3></div>
          <div class="card-pad"><div class="timeline">${activityHtml}</div></div>
        </div>
      </div>`;
  },

  clientDashboard() {
    const c = Store.data.clients.find(c => c.id === UI.activeClient);
    const projects = scopedProjects();
    const active = projects.filter(p => p.status !== 'completed');
    const requests = scopedRequests().filter(r => r.status !== 'resolved');
    const invoices = Store.data.invoices.filter(i => i.clientId === c.id);
    const due = invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);

    const kpis = [
      { icn: 'folder',  tint: 'tint-blue',  label: 'Active projects', value: active.length },
      { icn: 'inbox',   tint: 'tint-amber', label: 'Open requests',   value: requests.length },
      { icn: 'file',    tint: 'tint-violet',label: 'Shared files',    value: scopedFiles().length },
      { icn: 'dollar',  tint: 'tint-green', label: 'Balance due',     value: moneyK(due) },
    ];
    const kpiHtml = kpis.map(k => `
      <div class="kpi">
        <div class="kpi-top">
          <div><div class="kpi-label">${k.label}</div><div class="kpi-value">${k.value}</div></div>
          <div class="kpi-icn ${k.tint}">${icon(k.icn)}</div>
        </div>
      </div>`).join('');

    const projHtml = active.length ? active.map(p => this.projectCard(p)).join('') :
      emptyState('folder', 'No active projects', 'New projects will show up here.');

    const stepsHtml = Store.data.onboardingSteps.map((s, i) => `
      <div class="step ${s.state === 'done' ? 'done' : s.state === 'active' ? 'active' : ''}">
        <div class="step-num">${s.state === 'done' ? icon('check') : i + 1}</div>
        <div class="step-label">${esc(s.label)}</div>
        <div class="step-tag">${s.state === 'done' ? '<span class="badge b-green">Done</span>' : s.state === 'active' ? '<span class="badge b-brand">In progress</span>' : '<span class="badge b-slate">Upcoming</span>'}</div>
      </div>`).join('');

    return `
      <div class="card card-pad" style="margin-bottom:24px;display:flex;align-items:center;gap:18px;background:linear-gradient(120deg,var(--brand-600),#7c3aed);color:#fff;border:none">
        <div class="avatar" style="width:52px;height:52px;font-size:18px;background:rgba(255,255,255,.2)">${initials(c.name)}</div>
        <div>
          <div style="font-size:12.5px;opacity:.85">Welcome back,</div>
          <div style="font-size:20px;font-weight:800;letter-spacing:-.02em">${esc(c.name)}</div>
        </div>
        <div style="margin-left:auto;text-align:right">
          <div style="font-size:12.5px;opacity:.85">Onboarding progress</div>
          <div style="font-size:22px;font-weight:800">${c.progress}%</div>
        </div>
      </div>
      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">${kpiHtml}</div>
      <div class="grid-2">
        <div>
          <div class="section-head"><h2>Your projects</h2></div>
          <div class="proj-grid" style="grid-template-columns:1fr">${projHtml}</div>
        </div>
        <div class="card" style="align-self:start">
          <div class="card-head">${icon('rocket', 'text-2')}<h3>Onboarding checklist</h3></div>
          <div class="card-pad"><div class="steps">${stepsHtml}</div></div>
        </div>
      </div>`;
  },

  /* ------------------------------ Clients */
  clients() {
    const rows = scopedClients().map(c => {
      const projects = Store.data.projects.filter(p => p.clientId === c.id).length;
      return `
        <tr>
          <td><div class="who">${avatarFor(c.id, c.name)}<div><div class="cell-main">${esc(c.name)}</div><div class="cell-sub">${esc(c.contact)} · ${esc(c.email)}</div></div></div></td>
          <td><span class="badge b-slate">${esc(c.industry)}</span></td>
          <td>${statusBadge(ONBOARD_BADGE, c.onboarding)}</td>
          <td style="min-width:150px">${progressBar(c.progress, c.progress === 100)}</td>
          <td class="cell-main">${projects}</td>
          <td class="money text-2">${money(c.mrr)}/mo</td>
          <td class="cell-sub">${fmtDate(c.since)}</td>
        </tr>`;
    }).join('');

    return `
      <div class="section-head">
        <h2>Clients</h2><span class="muted">${scopedClients().length} total</span>
        <div class="spacer"></div>
        <button class="btn btn-primary" data-add="client">${icon('plus')}Add client</button>
      </div>
      <div class="card">
        <div class="table-wrap">
          <table class="tbl">
            <thead><tr><th>Client</th><th>Industry</th><th>Onboarding</th><th>Progress</th><th>Projects</th><th>MRR</th><th>Client since</th></tr></thead>
            <tbody>${rows || `<tr><td colspan="7">${emptyState('users', 'No clients yet', 'Add your first client to get started.')}</td></tr>`}</tbody>
          </table>
        </div>
      </div>`;
  },

  /* ------------------------------ Projects */
  projects() {
    const list = scopedProjects();
    const cards = list.length ? list.map(p => this.projectCard(p)).join('') :
      emptyState('folder', 'No projects yet', 'Create a project to start tracking work.');
    return `
      <div class="section-head">
        <h2>Projects</h2><span class="muted">${list.length} total</span>
        <div class="spacer"></div>
        <button class="btn btn-primary" data-add="project">${icon('plus')}New project</button>
      </div>
      <div class="proj-grid">${cards}</div>`;
  },

  projectCard(p) {
    const client = Store.data.clients.find(c => c.id === p.clientId);
    const lead = teamMember(p.assignee);
    return `
      <div class="proj">
        <div class="proj-top">
          <div>
            <div class="proj-name">${esc(p.name)}</div>
            <div class="proj-client">${esc(client ? client.name : '—')}</div>
          </div>
          ${statusBadge(PROJECT_BADGE, p.status)}
        </div>
        <div class="chips">
          <span class="badge b-slate">${esc(p.type)}</span>
          ${priorityBadge(p.priority)}
        </div>
        ${progressBar(p.progress, p.status === 'completed')}
        <div class="proj-meta">
          <span>${icon('calendar', 'text-3')} ${fmtDateShort(p.start)} – ${fmtDateShort(p.end)}</span>
        </div>
        <div class="proj-foot">
          <div class="proj-budget money">${money(p.budget)}</div>
          <div class="proj-team">${lead ? avatarFor(lead.id, lead.name) : ''}<span>${lead ? esc(lead.name.split(' ')[0]) : 'Unassigned'}</span></div>
        </div>
      </div>`;
  },

  /* ------------------------------ Requests */
  requests() {
    const list = scopedRequests();
    const rows = list.length ? list.map(r => `
      <div class="list-row">
        <div class="req-icn ${activityTint('message')}">${icon('message')}</div>
        <div class="list-main">
          <div class="list-title">${esc(r.title)}</div>
          <div class="list-sub">${esc(clientName(r.clientId))} · ${fmtDate(r.created)}</div>
        </div>
        ${priorityBadge(r.priority)}
        ${statusBadge(REQUEST_BADGE, r.status)}
      </div>`).join('') : emptyState('inbox', 'No requests', 'Client requests will appear here.');

    return `
      <div class="section-head">
        <h2>Requests</h2><span class="muted">${list.filter(r => r.status !== 'resolved').length} open</span>
        <div class="spacer"></div>
        <button class="btn btn-primary" data-add="request">${icon('plus')}New request</button>
      </div>
      <div class="card"><div class="card-pad">${rows}</div></div>`;
  },

  /* ------------------------------ Tasks */
  tasks() {
    const list = scopedTasks();
    const grouped = {};
    list.forEach(t => { (grouped[t.projectId] = grouped[t.projectId] || []).push(t); });

    const done = list.filter(t => t.status === 'completed').length;
    const sections = Object.keys(grouped).map(pid => {
      const items = grouped[pid].map(t => {
        const who = teamMember(t.assignee);
        return `
          <div class="task ${t.status === 'completed' ? 'done' : ''}">
            <button class="check ${t.status === 'completed' ? 'done' : ''}" data-toggle-task="${t.id}" aria-label="Toggle task">${icon('check')}</button>
            <div class="task-body">
              <div class="task-title">${esc(t.title)}</div>
              <div class="task-sub">${who ? esc(who.name) : 'Unassigned'} · Due ${fmtDateShort(t.due)}</div>
            </div>
            ${t.status === 'completed' ? '<span class="badge b-green">Completed</span>' : '<span class="badge b-slate">Pending</span>'}
          </div>`;
      }).join('');
      return `
        <div class="card" style="margin-bottom:16px">
          <div class="card-head">${icon('folder', 'text-3')}<h3>${esc(projectName(pid))}</h3><div class="spacer"></div>
            <span class="cell-sub">${grouped[pid].filter(t => t.status === 'completed').length}/${grouped[pid].length} done</span>
          </div>
          <div class="card-pad" style="padding-top:2px"><div class="task-list">${items}</div></div>
        </div>`;
    }).join('');

    return `
      <div class="section-head">
        <h2>Tasks</h2><span class="muted">${done}/${list.length} completed</span>
        <div class="spacer"></div>
        <button class="btn btn-primary" data-add="task">${icon('plus')}Add task</button>
      </div>
      ${sections || emptyState('check', 'No tasks', 'Add tasks to track project work.')}`;
  },

  /* ------------------------------ Files */
  files() {
    const list = scopedFiles();
    const rows = list.length ? list.map(f => {
      const by = teamMember(f.by);
      return `
        <div class="list-row">
          <div class="file-icn ${fileTint(f.kind)}">${icon(fileIcon(f.kind))}</div>
          <div class="list-main">
            <div class="list-title">${esc(f.name)}</div>
            <div class="list-sub">${esc(clientName(f.clientId))} · ${f.size} · ${by ? esc(by.name) : ''}</div>
          </div>
          <span class="cell-sub">${fmtDate(f.uploaded)}</span>
        </div>`;
    }).join('') : emptyState('file', 'No files', 'Uploaded files will appear here.');

    return `
      <div class="section-head">
        <h2>Files</h2><span class="muted">${list.length} files</span>
        <div class="spacer"></div>
        <button class="btn btn-primary" data-add="file">${icon('upload')}Upload file</button>
      </div>
      <div class="card"><div class="card-pad">${rows}</div></div>`;
  },
};

/* Tint + icon helpers for activity / files */
function activityTint(kind) {
  return ({
    rocket: 'tint-brand', check: 'tint-green', upload: 'tint-blue', message: 'tint-amber',
    award: 'tint-violet', dollar: 'tint-green', flag: 'tint-red',
  })[kind] || 'tint-slate';
}
function fileIcon(kind) {
  return ({ pdf: 'file', doc: 'file', design: 'image', image: 'image', sheet: 'sheet', zip: 'folder' })[kind] || 'file';
}
function fileTint(kind) {
  return ({ pdf: 'tint-red', doc: 'tint-blue', design: 'tint-violet', image: 'tint-violet', sheet: 'tint-green', zip: 'tint-amber' })[kind] || 'tint-slate';
}
function emptyState(ic, title, sub) {
  return `<div class="empty">${icon(ic)}<h4>${title}</h4><div>${sub}</div></div>`;
}

/* ---------------------------------------------------------- Nav config */
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'clients',   label: 'Clients',   icon: 'users',  agencyOnly: true },
  { id: 'projects',  label: 'Projects',  icon: 'folder' },
  { id: 'requests',  label: 'Requests',  icon: 'inbox' },
  { id: 'tasks',     label: 'Tasks',     icon: 'check' },
  { id: 'files',     label: 'Files',     icon: 'file' },
];
const VIEW_TITLE = {
  dashboard: ['Dashboard', 'Overview of clients, projects & operations'],
  clients:   ['Clients', 'Manage client accounts and onboarding'],
  projects:  ['Projects', 'Track project delivery and progress'],
  requests:  ['Requests', 'Client requests and change orders'],
  tasks:     ['Tasks', 'Assigned work across all projects'],
  files:     ['Files', 'Shared assets and documents'],
};

/* ---------------------------------------------------------- Render */
function renderNav() {
  const counts = {
    clients: Store.data.clients.length,
    projects: scopedProjects().filter(p => p.status !== 'completed').length,
    requests: scopedRequests().filter(r => r.status !== 'resolved').length,
    tasks: scopedTasks().filter(t => t.status !== 'completed').length,
    files: scopedFiles().length,
  };
  $('#nav').innerHTML = NAV
    .filter(n => !(n.agencyOnly && UI.role === 'client'))
    .map(n => `
      <button class="nav-item ${UI.view === n.id ? 'active' : ''}" data-nav="${n.id}">
        ${icon(n.icon)}<span>${n.label}</span>
        ${counts[n.id] != null && counts[n.id] > 0 ? `<span class="count">${counts[n.id]}</span>` : ''}
      </button>`).join('');
}

function renderTopbar() {
  const [title, sub] = VIEW_TITLE[UI.view];
  const clientOptions = Store.data.clients.map(c =>
    `<option value="${c.id}" ${c.id === UI.activeClient ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  const me = UI.role === 'agency' ? 'Maya Chen' : (Store.data.clients.find(c => c.id === UI.activeClient) || {}).contact || 'Client';

  $('#topbar').innerHTML = `
    <button class="menu-btn" id="menuBtn">${icon('menu')}</button>
    <div>
      <h1>${title}</h1>
      <div class="sub">${sub}</div>
    </div>
    <div class="topbar-spacer"></div>
    <div class="search">${icon('search')}<input placeholder="Search…" id="searchInput"></div>
    <div class="role-switch">
      <button class="${UI.role === 'agency' ? 'active' : ''}" data-role="agency">Agency</button>
      <button class="${UI.role === 'client' ? 'active' : ''}" data-role="client">Client</button>
    </div>
    ${UI.role === 'client' ? `<select class="client-picker" id="clientPicker">${clientOptions}</select>` : ''}
    <div class="avatar" title="${esc(me)}">${initials(me)}</div>`;
}

function renderView() {
  $('#content').innerHTML = Views[UI.view] ? Views[UI.view]() : '';
}

function render() {
  renderNav();
  renderTopbar();
  renderView();
}

/* ---------------------------------------------------------- Modal / forms */
const MODAL_CONFIG = {
  client: {
    title: 'Add client',
    fields: [
      { name: 'name', label: 'Company name', type: 'text', required: true, placeholder: 'Acme Corp' },
      { row: true, fields: [
        { name: 'contact', label: 'Primary contact', type: 'text', required: true, placeholder: 'Jane Doe' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@acme.com' },
      ]},
      { row: true, fields: [
        { name: 'industry', label: 'Industry', type: 'text', placeholder: 'SaaS' },
        { name: 'mrr', label: 'Monthly value ($)', type: 'number', placeholder: '5000' },
      ]},
      { name: 'onboarding', label: 'Onboarding status', type: 'select', options: [
        ['not-started', 'Not started'], ['in-progress', 'In progress'], ['completed', 'Completed'] ] },
    ],
    build(v) {
      return {
        id: Store.nextId('c'), name: v.name, contact: v.contact, email: v.email || '',
        industry: v.industry || 'General', onboarding: v.onboarding || 'not-started',
        progress: v.onboarding === 'completed' ? 100 : v.onboarding === 'in-progress' ? 30 : 5,
        since: todayISO(), mrr: Number(v.mrr) || 0,
      };
    },
    collection: 'clients',
  },
  project: {
    title: 'New project',
    fields: [
      { name: 'name', label: 'Project name', type: 'text', required: true, placeholder: 'Website redesign' },
      { row: true, fields: [
        { name: 'clientId', label: 'Client', type: 'clientSelect', required: true },
        { name: 'type', label: 'Project type', type: 'select', options: [
          ['Brand Identity','Brand Identity'],['Web Design','Web Design'],['Product Design','Product Design'],
          ['Development','Development'],['Marketing','Marketing'],['Design','Design'] ] },
      ]},
      { row: true, fields: [
        { name: 'priority', label: 'Priority', type: 'select', options: [['low','Low'],['medium','Medium'],['high','High']], default: 'medium' },
        { name: 'assignee', label: 'Assign to', type: 'teamSelect' },
      ]},
      { row: true, fields: [
        { name: 'start', label: 'Start date', type: 'date', default: todayISO() },
        { name: 'end', label: 'End date', type: 'date' },
      ]},
      { name: 'budget', label: 'Budget ($)', type: 'number', placeholder: '20000' },
    ],
    build(v) {
      return {
        id: Store.nextId('p'), name: v.name, clientId: v.clientId, type: v.type || 'Design',
        status: 'planning', priority: v.priority || 'medium', progress: 0,
        budget: Number(v.budget) || 0, start: v.start || todayISO(), end: v.end || '', assignee: v.assignee || '',
      };
    },
    collection: 'projects',
  },
  request: {
    title: 'New request',
    fields: [
      { name: 'title', label: 'Request', type: 'text', required: true, placeholder: 'Update homepage hero' },
      { row: true, fields: [
        { name: 'clientId', label: 'Client', type: 'clientSelect', required: true },
        { name: 'priority', label: 'Priority', type: 'select', options: [['low','Low'],['medium','Medium'],['high','High']], default: 'medium' },
      ]},
      { name: 'desc', label: 'Details', type: 'textarea', placeholder: 'Describe the request…' },
    ],
    build(v) {
      return {
        id: Store.nextId('r'), title: v.title, clientId: v.clientId, priority: v.priority || 'medium',
        status: 'open', created: todayISO(), desc: v.desc || '',
      };
    },
    collection: 'requests',
  },
  task: {
    title: 'Add task',
    fields: [
      { name: 'title', label: 'Task', type: 'text', required: true, placeholder: 'Design landing page' },
      { row: true, fields: [
        { name: 'projectId', label: 'Project', type: 'projectSelect', required: true },
        { name: 'assignee', label: 'Assign to', type: 'teamSelect' },
      ]},
      { name: 'due', label: 'Due date', type: 'date', default: todayISO() },
    ],
    build(v) {
      return { id: Store.nextId('t'), title: v.title, projectId: v.projectId, assignee: v.assignee || '', due: v.due || todayISO(), status: 'pending' };
    },
    collection: 'tasks',
  },
  file: {
    title: 'Upload file',
    fields: [
      { name: 'name', label: 'File name', type: 'text', required: true, placeholder: 'Brand-Assets.zip' },
      { row: true, fields: [
        { name: 'clientId', label: 'Client', type: 'clientSelect', required: true },
        { name: 'kind', label: 'Type', type: 'select', options: [
          ['pdf','PDF'],['doc','Document'],['design','Design'],['image','Image'],['sheet','Spreadsheet'],['zip','Archive'] ] },
      ]},
      { row: true, fields: [
        { name: 'size', label: 'Size', type: 'text', placeholder: '2.4 MB' },
        { name: 'by', label: 'Uploaded by', type: 'teamSelect' },
      ]},
    ],
    build(v) {
      return { id: Store.nextId('f'), name: v.name, clientId: v.clientId, kind: v.kind || 'pdf', size: v.size || '—', uploaded: todayISO(), by: v.by || 'u1' };
    },
    collection: 'files',
  },
};

function todayISO() { return '2026-07-23'; }

function fieldHtml(f) {
  if (f.row) return `<div class="field-row">${f.fields.map(fieldHtml).join('')}</div>`;
  const req = f.required ? 'required' : '';
  let input;
  if (f.type === 'select') {
    input = `<select name="${f.name}" ${req}>${f.options.map(o => `<option value="${o[0]}" ${f.default === o[0] ? 'selected' : ''}>${o[1]}</option>`).join('')}</select>`;
  } else if (f.type === 'clientSelect') {
    input = `<select name="${f.name}" ${req}>${Store.data.clients.map(c => `<option value="${c.id}" ${c.id === UI.activeClient && UI.role === 'client' ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>`;
  } else if (f.type === 'projectSelect') {
    input = `<select name="${f.name}" ${req}>${scopedProjects().map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select>`;
  } else if (f.type === 'teamSelect') {
    input = `<select name="${f.name}"><option value="">Unassigned</option>${Store.data.team.map(u => `<option value="${u.id}">${esc(u.name)}</option>`).join('')}</select>`;
  } else if (f.type === 'textarea') {
    input = `<textarea name="${f.name}" placeholder="${f.placeholder || ''}" ${req}></textarea>`;
  } else {
    input = `<input type="${f.type}" name="${f.name}" placeholder="${f.placeholder || ''}" value="${f.default || ''}" ${req}>`;
  }
  return `<div class="field"><label>${f.label}${f.required ? ' *' : ''}</label>${input}</div>`;
}

function openModal(kind) {
  const cfg = MODAL_CONFIG[kind];
  if (!cfg) return;
  $('#modalRoot').innerHTML = `
    <div class="modal-overlay" id="overlay">
      <form class="modal" id="modalForm" novalidate>
        <div class="modal-head"><h3>${cfg.title}</h3><button type="button" class="close" data-close>${icon('x')}</button></div>
        <div class="modal-body">${cfg.fields.map(fieldHtml).join('')}</div>
        <div class="modal-foot">
          <button type="button" class="btn" data-close>Cancel</button>
          <button type="submit" class="btn btn-primary">${icon('check')}${cfg.title}</button>
        </div>
      </form>
    </div>`;
  requestAnimationFrame(() => $('#overlay').classList.add('open'));
  const firstInput = $('#modalForm input, #modalForm select');
  if (firstInput) setTimeout(() => firstInput.focus(), 120);

  $('#modalForm').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const values = {};
    $$('[name]', form).forEach(el => values[el.name] = el.value.trim());
    const record = cfg.build(values);
    Store.data[cfg.collection].unshift(record);
    Store.save();
    closeModal();
    render();
    toast(`${cfg.title.replace(/^(Add|New|Upload) /, '').replace(/^\w/, c => c.toUpperCase())} saved`);
  });
  $$('[data-close]').forEach(b => b.addEventListener('click', closeModal));
  $('#overlay').addEventListener('click', e => { if (e.target.id === 'overlay') closeModal(); });
}
function closeModal() {
  const ov = $('#overlay');
  if (!ov) return;
  ov.classList.remove('open');
  setTimeout(() => { $('#modalRoot').innerHTML = ''; }, 180);
}

/* ---------------------------------------------------------- Toast */
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `${icon('checkCircle')}<span>${esc(msg)}</span>`;
  $('#toastWrap').appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 320); }, 2600);
}

/* ---------------------------------------------------------- Events */
function navigate(view) {
  if (!VIEW_TITLE[view]) return;
  UI.view = view;
  render();
  $('.sidebar')?.classList.remove('open');
}

document.addEventListener('click', e => {
  const nav = e.target.closest('[data-nav]');
  if (nav) { navigate(nav.getAttribute('data-nav')); return; }

  const add = e.target.closest('[data-add]');
  if (add) { openModal(add.getAttribute('data-add')); return; }

  const role = e.target.closest('[data-role]');
  if (role) {
    UI.role = role.getAttribute('data-role');
    if (UI.role === 'client' && UI.view === 'clients') UI.view = 'dashboard';
    render();
    return;
  }

  const toggle = e.target.closest('[data-toggle-task]');
  if (toggle) {
    const id = toggle.getAttribute('data-toggle-task');
    const t = Store.data.tasks.find(t => t.id === id);
    if (t) {
      t.status = t.status === 'completed' ? 'pending' : 'completed';
      Store.save();
      render();
    }
    return;
  }

  if (e.target.closest('#menuBtn')) { $('.sidebar').classList.toggle('open'); return; }
});

document.addEventListener('change', e => {
  if (e.target.id === 'clientPicker') {
    UI.activeClient = e.target.value;
    render();
  }
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* Reset demo data (exposed for the sidebar link) */
function resetDemo() {
  if (confirm('Reset all demo data to the original sample set?')) {
    Store.reset();
    UI.view = 'dashboard';
    render();
    toast('Demo data reset');
  }
}

/* ---------------------------------------------------------- Boot */
Store.load();
render();
window.resetDemo = resetDemo;
