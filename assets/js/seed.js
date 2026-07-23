/* ============================================================
   Seed data — Acme Studios digital agency
   Realistic sample data used on first load (stored in localStorage).
   ============================================================ */

const AVATAR_COLORS = [
  '#6366f1', '#0ea5e9', '#f59e0b', '#10b981', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#3b82f6',
];

function seedData() {
  const team = [
    { id: 'u1', name: 'Maya Chen',      role: 'Account Lead',    email: 'maya@acmestudios.co' },
    { id: 'u2', name: 'Devon Parker',   role: 'Design Director', email: 'devon@acmestudios.co' },
    { id: 'u3', name: 'Priya Nair',     role: 'Project Manager', email: 'priya@acmestudios.co' },
    { id: 'u4', name: 'Liam Foster',    role: 'Lead Developer',  email: 'liam@acmestudios.co' },
    { id: 'u5', name: 'Sofia Martinez', role: 'Strategist',      email: 'sofia@acmestudios.co' },
  ];

  const clients = [
    { id: 'c1',  name: 'Innovate Solutions', industry: 'SaaS',          contact: 'Rachel Kim',    email: 'rachel@innovate.io',    onboarding: 'completed',  progress: 100, since: '2025-11-02', mrr: 8500 },
    { id: 'c2',  name: 'GreenLeaf Markets',  industry: 'Retail',        contact: 'Tom Bradley',   email: 'tom@greenleaf.com',     onboarding: 'in-progress', progress: 60,  since: '2026-05-14', mrr: 6200 },
    { id: 'c3',  name: 'QuickClinics',       industry: 'Healthcare',    contact: 'Dr. Amara Osei', email: 'amara@quickclinics.co', onboarding: 'in-progress', progress: 40,  since: '2026-06-20', mrr: 9800 },
    { id: 'c4',  name: 'Northwind Capital',  industry: 'Finance',       contact: 'James Whitmore', email: 'james@northwind.co',   onboarding: 'completed',  progress: 100, since: '2025-09-18', mrr: 14200 },
    { id: 'c5',  name: 'Pulse Fitness',      industry: 'Wellness',      contact: 'Elena Petrova',  email: 'elena@pulsefit.app',   onboarding: 'not-started', progress: 5,   since: '2026-07-19', mrr: 4400 },
    { id: 'c6',  name: 'Cobalt Robotics',    industry: 'Hardware',      contact: 'Wei Zhang',      email: 'wei@cobalt.tech',      onboarding: 'in-progress', progress: 75,  since: '2026-04-08', mrr: 11500 },
    { id: 'c7',  name: 'Sunrise Bakery Co.', industry: 'Food & Bev',    contact: 'Marco Rossi',    email: 'marco@sunrisebakery.com', onboarding: 'completed', progress: 100, since: '2025-12-11', mrr: 3200 },
    { id: 'c8',  name: 'Atlas Logistics',    industry: 'Supply Chain',  contact: 'Nadia Ahmed',    email: 'nadia@atlaslog.com',   onboarding: 'in-progress', progress: 55,  since: '2026-06-02', mrr: 7600 },
    { id: 'c9',  name: 'Bloom Cosmetics',    industry: 'Beauty',        contact: 'Hana Yamamoto',  email: 'hana@bloomco.com',     onboarding: 'not-started', progress: 10,  since: '2026-07-15', mrr: 5100 },
    { id: 'c10', name: 'Vertex Studios',     industry: 'Media',         contact: 'Chris Okafor',   email: 'chris@vertex.media',   onboarding: 'completed',  progress: 100, since: '2025-10-27', mrr: 6900 },
  ];

  const projects = [
    { id: 'p1',  name: 'Brand Identity Refresh',   clientId: 'c2',  type: 'Brand Identity', status: 'in-progress', priority: 'high',   progress: 65, budget: 24000, start: '2026-06-01', end: '2026-08-15', assignee: 'u2' },
    { id: 'p2',  name: 'Marketing Website Build',  clientId: 'c3',  type: 'Web Design',     status: 'in-progress', priority: 'high',   progress: 40, budget: 42000, start: '2026-06-22', end: '2026-09-30', assignee: 'u4' },
    { id: 'p3',  name: 'Q3 Campaign Launch',       clientId: 'c1',  type: 'Marketing',     status: 'review',      priority: 'medium', progress: 90, budget: 18500, start: '2026-05-05', end: '2026-07-28', assignee: 'u5' },
    { id: 'p4',  name: 'Mobile App UI Kit',        clientId: 'c6',  type: 'Product Design', status: 'in-progress', priority: 'high',   progress: 72, budget: 55000, start: '2026-04-15', end: '2026-08-30', assignee: 'u2' },
    { id: 'p5',  name: 'E-commerce Replatform',    clientId: 'c8',  type: 'Development',    status: 'planning',    priority: 'medium', progress: 15, budget: 68000, start: '2026-07-10', end: '2026-11-20', assignee: 'u4' },
    { id: 'p6',  name: 'Investor Deck & Reports',  clientId: 'c4',  type: 'Design',        status: 'completed',   priority: 'low',    progress: 100, budget: 12000, start: '2026-03-01', end: '2026-05-10', assignee: 'u2' },
    { id: 'p7',  name: 'Onboarding Flow Redesign', clientId: 'c1',  type: 'Product Design', status: 'in-progress', priority: 'medium', progress: 50, budget: 21000, start: '2026-06-12', end: '2026-08-25', assignee: 'u3' },
    { id: 'p8',  name: 'Packaging Design System',  clientId: 'c9',  type: 'Brand Identity', status: 'planning',    priority: 'low',    progress: 8,  budget: 16000, start: '2026-07-20', end: '2026-10-05', assignee: 'u2' },
    { id: 'p9',  name: 'SEO & Content Strategy',   clientId: 'c7',  type: 'Marketing',     status: 'completed',   priority: 'low',    progress: 100, budget: 9500,  start: '2026-01-15', end: '2026-04-01', assignee: 'u5' },
  ];

  const tasks = [
    { id: 't1',  title: 'Finalize logo concepts',        projectId: 'p1', assignee: 'u2', due: '2026-07-25', status: 'completed' },
    { id: 't2',  title: 'Present color palette options',  projectId: 'p1', assignee: 'u2', due: '2026-07-28', status: 'pending' },
    { id: 't3',  title: 'Wireframe homepage',             projectId: 'p2', assignee: 'u4', due: '2026-07-24', status: 'completed' },
    { id: 't4',  title: 'Build responsive nav component',  projectId: 'p2', assignee: 'u4', due: '2026-07-30', status: 'pending' },
    { id: 't5',  title: 'Set up analytics tracking',       projectId: 'p2', assignee: 'u4', due: '2026-08-04', status: 'pending' },
    { id: 't6',  title: 'Draft campaign copy',             projectId: 'p3', assignee: 'u5', due: '2026-07-22', status: 'completed' },
    { id: 't7',  title: 'Schedule social posts',           projectId: 'p3', assignee: 'u5', due: '2026-07-26', status: 'pending' },
    { id: 't8',  title: 'Design iconography set',          projectId: 'p4', assignee: 'u2', due: '2026-07-29', status: 'pending' },
    { id: 't9',  title: 'Component library handoff',       projectId: 'p4', assignee: 'u3', due: '2026-08-06', status: 'pending' },
    { id: 't10', title: 'Migrate product catalog',         projectId: 'p5', assignee: 'u4', due: '2026-08-12', status: 'pending' },
    { id: 't11', title: 'Kickoff discovery workshop',      projectId: 'p5', assignee: 'u3', due: '2026-07-24', status: 'completed' },
    { id: 't12', title: 'User testing round 1',            projectId: 'p7', assignee: 'u3', due: '2026-07-31', status: 'pending' },
  ];

  const requests = [
    { id: 'r1', title: 'Add dark mode to dashboard mockups', clientId: 'c3', priority: 'medium', status: 'open',        created: '2026-07-21', desc: 'Client would like to see dark theme variants for the reporting screens.' },
    { id: 'r2', title: 'Revise hero section copy',           clientId: 'c2', priority: 'low',    status: 'in-progress', created: '2026-07-20', desc: 'Tone should feel more approachable and less corporate.' },
    { id: 'r3', title: 'Export brand assets as SVG',         clientId: 'c1', priority: 'low',    status: 'resolved',    created: '2026-07-15', desc: 'Need vector versions of the new logo for print.' },
    { id: 'r4', title: 'Urgent: fix checkout button color',  clientId: 'c8', priority: 'high',   status: 'open',        created: '2026-07-22', desc: 'CTA fails contrast check on mobile — flagged in accessibility audit.' },
    { id: 'r5', title: 'Add second language to nav',         clientId: 'c6', priority: 'medium', status: 'in-progress', created: '2026-07-19', desc: 'Spanish localization for the primary navigation.' },
    { id: 'r6', title: 'New pricing page layout',            clientId: 'c3', priority: 'medium', status: 'open',        created: '2026-07-23', desc: 'Three-tier pricing table with an annual toggle.' },
  ];

  const files = [
    { id: 'f1', name: 'Brand-Guidelines-v3.pdf',   clientId: 'c2', kind: 'pdf',   size: '4.2 MB',  uploaded: '2026-07-21', by: 'u2' },
    { id: 'f2', name: 'Homepage-Mockup.fig',       clientId: 'c3', kind: 'design', size: '18.7 MB', uploaded: '2026-07-20', by: 'u2' },
    { id: 'f3', name: 'Q3-Campaign-Brief.docx',    clientId: 'c1', kind: 'doc',   size: '820 KB',  uploaded: '2026-07-18', by: 'u5' },
    { id: 'f4', name: 'Logo-Package.zip',          clientId: 'c1', kind: 'zip',   size: '32.1 MB', uploaded: '2026-07-16', by: 'u2' },
    { id: 'f5', name: 'Analytics-Report-June.xlsx', clientId: 'c4', kind: 'sheet', size: '1.1 MB',  uploaded: '2026-07-14', by: 'u5' },
    { id: 'f6', name: 'Product-Photography.jpg',   clientId: 'c9', kind: 'image', size: '9.6 MB',  uploaded: '2026-07-15', by: 'u2' },
    { id: 'f7', name: 'Contract-Signed.pdf',       clientId: 'c8', kind: 'pdf',   size: '640 KB',  uploaded: '2026-06-02', by: 'u1' },
    { id: 'f8', name: 'Sitemap-v2.pdf',            clientId: 'c3', kind: 'pdf',   size: '1.4 MB',  uploaded: '2026-07-19', by: 'u3' },
  ];

  const invoices = [
    { id: 'i1', clientId: 'c1', amount: 8500,  status: 'paid',    due: '2026-07-01' },
    { id: 'i2', clientId: 'c2', amount: 12000, status: 'due',     due: '2026-07-31' },
    { id: 'i3', clientId: 'c3', amount: 21000, status: 'due',     due: '2026-08-05' },
    { id: 'i4', clientId: 'c4', amount: 6000,  status: 'overdue', due: '2026-07-10' },
    { id: 'i5', clientId: 'c6', amount: 27500, status: 'due',     due: '2026-08-01' },
    { id: 'i6', clientId: 'c8', amount: 9200,  status: 'overdue', due: '2026-07-15' },
    { id: 'i7', clientId: 'c7', amount: 4750,  status: 'paid',    due: '2026-06-20' },
  ];

  const activity = [
    { id: 'a1', kind: 'rocket',  text: '<b>QuickClinics</b> started the onboarding process', time: '2 hours ago' },
    { id: 'a2', kind: 'check',   text: '<b>Maya Chen</b> completed “Kickoff discovery workshop”', time: '5 hours ago' },
    { id: 'a3', kind: 'upload',  text: '<b>Devon Parker</b> uploaded Homepage-Mockup.fig', time: 'Yesterday' },
    { id: 'a4', kind: 'message', text: 'New request from <b>Atlas Logistics</b>: fix checkout button', time: 'Yesterday' },
    { id: 'a5', kind: 'award',   text: '<b>Innovate Solutions</b> finished onboarding 🎉', time: '2 days ago' },
    { id: 'a6', kind: 'dollar',  text: 'Invoice #1042 paid by <b>Sunrise Bakery Co.</b>', time: '3 days ago' },
  ];

  const onboardingSteps = [
    { label: 'Welcome & kickoff call',      state: 'done' },
    { label: 'Brand & asset intake',        state: 'done' },
    { label: 'Contract & billing setup',    state: 'done' },
    { label: 'Project scoping workshop',    state: 'active' },
    { label: 'Team & tools access',         state: 'todo' },
    { label: 'First deliverable review',    state: 'todo' },
  ];

  return { team, clients, projects, tasks, requests, files, invoices, activity, onboardingSteps };
}
