/* ===== HEADER COMPONENT ===== */

const HeaderComponent = {
  render() {
    const header = document.getElementById('page-header');
    header.innerHTML = `
      <div class="header-inner">
        <div class="header-left">
          <div class="header-title-wrap">
            <span class="header-breadcrumb">ComplaintIQ</span>
            <span class="header-sep">›</span>
            <span class="header-page-title" id="header-title">Dashboard</span>
          </div>
        </div>
        <div class="header-right">
          <div class="header-time" id="header-time"></div>
          <button class="btn btn-primary btn-sm" onclick="Router.navigate('submit')">
            <span>+</span> New Complaint
          </button>
        </div>
      </div>
    `;
    this.startClock();
    this.injectStyles();
  },

  setTitle(title, view) {
    const el = document.getElementById('header-title');
    if (el) el.textContent = title;
  },

  startClock() {
    const update = () => {
      const el = document.getElementById('header-time');
      if (el) {
        const now = new Date();
        el.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    };
    update();
    setInterval(update, 1000);
  },

  injectStyles() {
    if (document.getElementById('header-styles')) return;
    const style = document.createElement('style');
    style.id = 'header-styles';
    style.textContent = `
      .header-inner {
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
      }
      .header-left, .header-right { display: flex; align-items: center; gap: 16px; }
      .header-title-wrap { display: flex; align-items: center; gap: 8px; }
      .header-breadcrumb { font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); }
      .header-sep { color: var(--text-muted); font-size: 14px; }
      .header-page-title { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text-primary); }
      .header-time { font-family: var(--font-mono); font-size: 13px; color: var(--text-secondary); background: var(--bg-secondary); padding: 6px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); }
    `;
    document.head.appendChild(style);
  }
};
