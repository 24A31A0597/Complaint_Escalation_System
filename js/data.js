/* ===== DATA STORE ===== */

const LEVELS = {
  1: { label: 'Level 1 — Support', color: '#47ffa0', escalateAfterHours: 24 },
  2: { label: 'Level 2 — Supervisor', color: '#e8ff47', escalateAfterHours: 48 },
  3: { label: 'Level 3 — Manager', color: '#ff8c47', escalateAfterHours: 72 },
  4: { label: 'Level 4 — Executive', color: '#ff4f4f', escalateAfterHours: null }
};

const CATEGORIES = ['Billing', 'Technical', 'Service Quality', 'Delivery', 'Product Defect', 'Staff Behavior', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['Open', 'In Progress', 'Escalated', 'Critical', 'Resolved', 'Closed'];

function generateId() {
  return 'CMP-' + Date.now().toString(36).toUpperCase().slice(-6);
}

function hoursAgo(h) {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

const AppData = {
  complaints: [
    {
      id: 'CMP-A1B2C3', title: 'Invoice charged twice for same order',
      category: 'Billing', priority: 'High', status: 'Escalated',
      level: 2, createdAt: hoursAgo(50), updatedAt: hoursAgo(2),
      description: 'Customer reports duplicate charge on credit card for order #9823. Bank statement provided.',
      customer: 'Ravi Shankar', email: 'ravi@example.com',
      assignedTo: 'Support Team', escalationTimer: hoursAgo(26),
      history: [
        { action: 'Created', by: 'System', at: hoursAgo(50), note: 'Complaint submitted via portal' },
        { action: 'Assigned', by: 'Admin', at: hoursAgo(48), note: 'Assigned to Support Team' },
        { action: 'Escalated to Level 2', by: 'System', at: hoursAgo(26), note: 'Auto-escalated: no resolution within 24h' }
      ]
    },
    {
      id: 'CMP-D4E5F6', title: 'App crashes on checkout page',
      category: 'Technical', priority: 'Critical', status: 'Critical',
      level: 4, createdAt: hoursAgo(90), updatedAt: hoursAgo(1),
      description: 'Multiple users reporting app crash when adding items to cart on iOS 17.',
      customer: 'Priya Nair', email: 'priya@example.com',
      assignedTo: 'Engineering', escalationTimer: hoursAgo(72),
      history: [
        { action: 'Created', by: 'System', at: hoursAgo(90), note: 'Reported via support chat' },
        { action: 'Escalated to Level 2', by: 'System', at: hoursAgo(66), note: 'Auto-escalated' },
        { action: 'Escalated to Level 3', by: 'System', at: hoursAgo(42), note: 'Auto-escalated' },
        { action: 'Escalated to Level 4', by: 'Admin', at: hoursAgo(18), note: 'Manual escalation by manager' }
      ]
    },
    {
      id: 'CMP-G7H8I9', title: 'Delivery delayed by 2 weeks',
      category: 'Delivery', priority: 'Medium', status: 'In Progress',
      level: 1, createdAt: hoursAgo(20), updatedAt: hoursAgo(4),
      description: 'Order #5541 was supposed to arrive on March 15 but tracking shows no update.',
      customer: 'Arjun Mehta', email: 'arjun@example.com',
      assignedTo: 'Logistics Team', escalationTimer: hoursAgo(20),
      history: [
        { action: 'Created', by: 'System', at: hoursAgo(20), note: 'Submitted via email' },
        { action: 'Assigned', by: 'Admin', at: hoursAgo(18), note: 'Routed to Logistics Team' }
      ]
    },
    {
      id: 'CMP-J1K2L3', title: 'Rude behavior from field agent',
      category: 'Staff Behavior', priority: 'High', status: 'Open',
      level: 1, createdAt: hoursAgo(8), updatedAt: hoursAgo(8),
      description: 'Agent ID #234 was reportedly dismissive and rude during service visit on March 24.',
      customer: 'Sunita Reddy', email: 'sunita@example.com',
      assignedTo: 'HR Team', escalationTimer: hoursAgo(8),
      history: [
        { action: 'Created', by: 'System', at: hoursAgo(8), note: 'Submitted via complaint form' }
      ]
    },
    {
      id: 'CMP-M4N5O6', title: 'Product defect — broken screen',
      category: 'Product Defect', priority: 'High', status: 'Resolved',
      level: 1, createdAt: hoursAgo(72), updatedAt: hoursAgo(5),
      description: 'Screen cracked under normal usage within 3 days of delivery.',
      customer: 'Deepak Kumar', email: 'deepak@example.com',
      assignedTo: 'Quality Team', escalationTimer: null,
      history: [
        { action: 'Created', by: 'System', at: hoursAgo(72), note: 'Online complaint' },
        { action: 'Assigned', by: 'Admin', at: hoursAgo(70), note: 'Sent to Quality Team' },
        { action: 'Resolved', by: 'Quality Team', at: hoursAgo(5), note: 'Replacement shipped. Tracking: TRK99823' }
      ]
    },
    {
      id: 'CMP-P7Q8R9', title: 'Internet down for 3 days',
      category: 'Service Quality', priority: 'Critical', status: 'Escalated',
      level: 3, createdAt: hoursAgo(80), updatedAt: hoursAgo(10),
      description: 'Complete service outage since March 23. No engineer visits scheduled.',
      customer: 'Kavitha Iyer', email: 'kavitha@example.com',
      assignedTo: 'Network Ops', escalationTimer: hoursAgo(32),
      history: [
        { action: 'Created', by: 'System', at: hoursAgo(80), note: 'Phone complaint' },
        { action: 'Escalated to Level 2', by: 'System', at: hoursAgo(56), note: 'Auto-escalated' },
        { action: 'Escalated to Level 3', by: 'System', at: hoursAgo(32), note: 'Auto-escalated' }
      ]
    }
  ],

  getAll() { return [...this.complaints]; },
  getById(id) { return this.complaints.find(c => c.id === id); },
  add(complaint) { this.complaints.unshift({ ...complaint, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), history: [{ action: 'Created', by: 'Customer', at: new Date().toISOString(), note: 'Complaint submitted' }], escalationTimer: new Date().toISOString() }); return this.complaints[0]; },
  update(id, updates) {
    const idx = this.complaints.findIndex(c => c.id === id);
    if (idx !== -1) { this.complaints[idx] = { ...this.complaints[idx], ...updates, updatedAt: new Date().toISOString() }; }
    return this.complaints[idx];
  },
  escalate(id) {
    const c = this.getById(id);
    if (!c || c.level >= 4) return null;
    const newLevel = c.level + 1;
    const note = `Escalated to Level ${newLevel} — ${LEVELS[newLevel].label}`;
    c.level = newLevel;
    c.status = newLevel === 4 ? 'Critical' : 'Escalated';
    c.escalationTimer = new Date().toISOString();
    c.updatedAt = new Date().toISOString();
    c.history.push({ action: `Escalated to Level ${newLevel}`, by: 'System', at: new Date().toISOString(), note });
    return c;
  },
  resolve(id, note) {
    const c = this.getById(id);
    if (!c) return null;
    c.status = 'Resolved';
    c.escalationTimer = null;
    c.updatedAt = new Date().toISOString();
    c.history.push({ action: 'Resolved', by: 'Agent', at: new Date().toISOString(), note: note || 'Complaint resolved.' });
    return c;
  },

  getStats() {
    const all = this.complaints;
    return {
      total: all.length,
      open: all.filter(c => c.status === 'Open').length,
      inProgress: all.filter(c => c.status === 'In Progress').length,
      escalated: all.filter(c => ['Escalated', 'Critical'].includes(c.status)).length,
      resolved: all.filter(c => ['Resolved', 'Closed'].includes(c.status)).length,
      critical: all.filter(c => c.status === 'Critical').length,
      byLevel: [1,2,3,4].map(l => ({ level: l, count: all.filter(c => c.level === l && !['Resolved','Closed'].includes(c.status)).length })),
      byCategory: CATEGORIES.map(cat => ({ name: cat, count: all.filter(c => c.category === cat).length })).filter(x => x.count > 0),
      resolutionRate: all.length ? Math.round((all.filter(c => ['Resolved','Closed'].includes(c.status)).length / all.length) * 100) : 0
    };
  },

  checkEscalations() {
    const now = Date.now();
    const escalated = [];
    this.complaints.forEach(c => {
      if (['Resolved','Closed'].includes(c.status) || c.level >= 4 || !c.escalationTimer) return;
      const elapsed = (now - new Date(c.escalationTimer).getTime()) / 3600000;
      const threshold = LEVELS[c.level].escalateAfterHours;
      if (threshold && elapsed >= threshold) {
        this.escalate(c.id);
        escalated.push(c.id);
      }
    });
    return escalated;
  }
};
