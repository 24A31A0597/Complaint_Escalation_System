/* ===== DASHBOARD COMPONENT ===== */

const DashboardComponent = {
  render() {
    const stats = AppData.getStats();
    const recent = AppData.getAll().slice(0, 5);
    const container = document.getElementById('view-dashboard');

    container.innerHTML = `
      <div class="animate-fade">
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Complaints</div>
            <div class="stat-value" style="color:var(--text-primary)">${stats.total}</div>
            <div class="stat-delta">All time</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Open</div>
            <div class="stat-value" style="color:var(--accent-blue)">${stats.open}</div>
            <div class="stat-delta">Awaiting action</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Escalated</div>
            <div class="stat-value" style="color:var(--accent-orange)">${stats.escalated}</div>
            <div class="stat-delta">Needs urgent attention</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Critical</div>
            <div class="stat-value" style="color:var(--accent-secondary)">${stats.critical}</div>
            <div class="stat-delta">Level 4 escalations</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Resolved</div>
            <div class="stat-value" style="color:var(--accent-green)">${stats.resolved}</div>
            <div class="stat-delta">Closed successfully</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Resolution Rate</div>
            <div class="stat-value" style="color:var(--accent-primary)">${stats.resolutionRate}%</div>
            <div class="stat-delta">Overall performance</div>
          </div>
        </div>

        <!-- Level Progress -->
        <div class="card" style="margin-bottom:24px;">
          <h3 style="font-size:13px;color:var(--text-secondary);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:20px;">Active Complaints by Escalation Level</h3>
          <div style="display:grid;gap:16px;">
            ${stats.byLevel.map(l => `
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span class="level-dot level-${l.level}"></span>
                    <span style="font-size:13px;color:var(--text-secondary);">${LEVELS[l.level].label}</span>
                  </div>
                  <span style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary);">${l.count}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${stats.total ? (l.count/stats.total)*100 : 0}%;background:${Utils.levelColor(l.level)};"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Charts Row -->
        <div class="charts-row" style="margin-bottom:24px;">
          <div class="chart-card">
            <h3>Status Distribution</h3>
            <div style="display:flex;align-items:center;gap:24px;">
              <canvas id="status-donut" width="120" height="120" style="flex-shrink:0;"></canvas>
              <div id="status-legend" style="flex:1;"></div>
            </div>
          </div>
          <div class="chart-card">
            <h3>Complaints by Category</h3>
            <div id="category-bars"></div>
          </div>
        </div>

        <!-- Recent Complaints -->
        <div class="table-wrapper">
          <div class="table-toolbar">
            <h3 style="font-family:var(--font-display);font-size:15px;">Recent Complaints</h3>
            <button class="btn btn-ghost btn-sm" onclick="Router.navigate('complaints')">View All →</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Level</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              ${recent.length === 0 ? `<tr><td colspan="6"><div class="empty-state"><div class="empty-title">No complaints yet</div></div></td></tr>` :
                recent.map(c => `
                  <tr style="cursor:pointer;" onclick="ModalComponent.showComplaint('${c.id}')">
                    <td><span class="text-mono" style="font-size:12px;color:var(--accent-primary);">${c.id}</span></td>
                    <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${Utils.escapeHtml(c.title)}">${Utils.escapeHtml(c.title)}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:6px;">
                        ${Utils.levelDot(c.level)}
                        <span style="font-size:12px;color:var(--text-secondary);">L${c.level}</span>
                      </div>
                    </td>
                    <td>${Utils.statusBadge(c.status)}</td>
                    <td><span style="font-size:12px;color:${Utils.priorityColor(c.priority)};">${c.priority}</span></td>
                    <td><span style="font-size:12px;color:var(--text-muted);">${Utils.timeAgo(c.updatedAt)}</span></td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.renderCharts(stats);
  },

  renderCharts(stats) {
    // Status donut
    const canvas = document.getElementById('status-donut');
    if (canvas) {
      const statusData = [stats.open, stats.inProgress, stats.escalated, stats.critical, stats.resolved];
      const statusColors = ['#4f9eff', '#e8ff47', '#ff8c47', '#ff4f4f', '#47ffa0'];
      const statusLabels = ['Open', 'In Progress', 'Escalated', 'Critical', 'Resolved'];
      Utils.donutChart(canvas, statusData, statusColors);

      // Legend
      const legend = document.getElementById('status-legend');
      if (legend) {
        legend.innerHTML = statusLabels.map((label, i) => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="width:8px;height:8px;border-radius:50%;background:${statusColors[i]};flex-shrink:0;display:inline-block;"></span>
            <span style="font-size:12px;color:var(--text-secondary);">${label}</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);margin-left:auto;">${statusData[i]}</span>
          </div>
        `).join('');
      }
    }

    // Category bars
    const catBars = document.getElementById('category-bars');
    if (catBars && stats.byCategory.length > 0) {
      Utils.barChart(catBars, stats.byCategory.map(c => ({
        label: c.name, value: c.count, color: 'var(--accent-primary)'
      })));
    } else if (catBars) {
      catBars.innerHTML = '<div style="text-align:center;color:var(--text-muted);font-size:13px;padding:40px 0;">No data</div>';
    }
  }
};
