/* ===== UTILITY FUNCTIONS ===== */

const Utils = {
  formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  },

  timeAgo(iso) {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  },

  timeUntilEscalation(complaint) {
    if (!complaint.escalationTimer || !LEVELS[complaint.level].escalateAfterHours) return null;
    const threshold = LEVELS[complaint.level].escalateAfterHours * 3600000;
    const elapsed = Date.now() - new Date(complaint.escalationTimer).getTime();
    const remaining = threshold - elapsed;
    if (remaining <= 0) return { overdue: true, label: 'Overdue' };
    const hrs = Math.floor(remaining / 3600000);
    const mins = Math.floor((remaining % 3600000) / 60000);
    return { overdue: false, label: `${hrs}h ${mins}m`, ms: remaining, pct: Math.min(100, (elapsed / threshold) * 100) };
  },

  statusBadge(status) {
    const map = {
      'Open': 'open', 'In Progress': 'in-progress', 'Escalated': 'escalated',
      'Critical': 'critical', 'Resolved': 'resolved', 'Closed': 'closed'
    };
    const cls = map[status] || 'open';
    return `<span class="badge badge-${cls}">${status}</span>`;
  },

  levelDot(level) {
    return `<span class="level-dot level-${level}"></span>`;
  },

  priorityColor(priority) {
    const map = { Low: '#8892a4', Medium: '#4f9eff', High: '#ff8c47', Critical: '#ff4f4f' };
    return map[priority] || '#8892a4';
  },

  levelColor(level) {
    const map = { 1: '#47ffa0', 2: '#e8ff47', 3: '#ff8c47', 4: '#ff4f4f' };
    return map[level] || '#8892a4';
  },

  escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  },

  debounce(fn, delay) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  },

  donutChart(canvas, data, colors) {
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2, cy = canvas.height / 2, r = Math.min(cx, cy) - 10;
    const total = data.reduce((s, d) => s + d, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (total === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = '#1e2535';
      ctx.lineWidth = 20;
      ctx.stroke();
      return;
    }
    let start = -Math.PI / 2;
    data.forEach((val, i) => {
      if (!val) return;
      const angle = (val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 20;
      ctx.stroke();
      start += angle + 0.02;
    });
  },

  barChart(container, items) {
    const max = Math.max(...items.map(i => i.value), 1);
    container.innerHTML = items.map(item => `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div style="font-size:11px;color:var(--text-secondary);width:90px;flex-shrink:0;font-family:var(--font-mono);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${item.label}">${item.label}</div>
        <div style="flex:1;background:var(--bg-surface);border-radius:3px;height:6px;overflow:hidden;">
          <div style="width:${(item.value/max)*100}%;background:${item.color||'var(--accent-primary)'};height:100%;border-radius:3px;transition:width 0.8s cubic-bezier(0.4,0,0.2,1);"></div>
        </div>
        <div style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary);width:24px;text-align:right;">${item.value}</div>
      </div>
    `).join('');
  }
};
