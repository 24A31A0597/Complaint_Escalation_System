/* ===== SIDEBAR COMPONENT ===== */

const SidebarComponent = {
  navItems: [
    { id: 'dashboard', icon: '◈', label: 'Dashboard' },
    { id: 'complaints', icon: '≡', label: 'All Complaints' },
    { id: 'submit', icon: '+', label: 'Submit Complaint' },
    { id: 'escalation', icon: '▲', label: 'Escalation Monitor' }
  ],

  render() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = `
      <div class="sidebar-brand">
        <div class="brand-icon">⚡</div>
        <div>
          <div class="brand-name">ComplaintIQ</div>
          <div class="brand-sub">Escalation Tracker</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${this.navItems.map(item => `
          <a class="nav-item" data-view="${item.id}" href="#">
            <span class="nav-icon">${item.icon}</span>
            <span class="nav-label">${item.label}</span>
            ${item.id === 'escalation' ? '<span class="nav-badge" id="escalation-count"></span>' : ''}
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-footer-text">v1.0.0 &nbsp;·&nbsp; 2025</div>
      </div>
    `;

    // Nav click handlers
    sidebar.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        Router.navigate(link.dataset.view);
      });
    });

    this.updateEscalationBadge();
    this.injectStyles();
  },

  setActive(view) {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.view === view);
    });
    this.updateEscalationBadge();
  },

  updateEscalationBadge() {
    const badge = document.getElementById('escalation-count');
    if (!badge) return;
    const count = AppData.getAll().filter(c => ['Escalated', 'Critical'].includes(c.status)).length;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  },

  injectStyles() {
    if (document.getElementById('sidebar-styles')) return;
    const style = document.createElement('style');
    style.id = 'sidebar-styles';
    style.textContent = `
      .sidebar-brand {
        display: flex; align-items: center; gap: 12px;
        padding: 24px 20px 20px; border-bottom: 1px solid var(--border-color);
      }
      .brand-icon { font-size: 22px; color: var(--accent-primary); line-height: 1; }
      .brand-name { font-family: var(--font-display); font-size: 16px; font-weight: 800; color: var(--text-primary); }
      .brand-sub { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.05em; margin-top: 2px; }
      .sidebar-nav { padding: 16px 12px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
      .nav-item {
        display: flex; align-items: center; gap: 12px;
        padding: 10px 12px; border-radius: var(--radius-md);
        text-decoration: none; color: var(--text-secondary);
        font-size: 14px; font-weight: 500; transition: var(--transition);
        position: relative;
      }
      .nav-item:hover { background: var(--bg-surface); color: var(--text-primary); }
      .nav-item.active { background: rgba(232,255,71,0.08); color: var(--accent-primary); }
      .nav-item.active .nav-icon { color: var(--accent-primary); }
      .nav-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
      .nav-badge {
        margin-left: auto; background: var(--accent-secondary); color: white;
        font-family: var(--font-mono); font-size: 10px; font-weight: 700;
        padding: 1px 6px; border-radius: 100px; animation: pulse 2s ease infinite;
      }
      .sidebar-footer {
        padding: 16px 20px; border-top: 1px solid var(--border-color);
      }
      .sidebar-footer-text { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }
    `;
    document.head.appendChild(style);
  }
};
