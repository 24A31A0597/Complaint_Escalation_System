/* ===== ESCALATION MONITOR COMPONENT ===== */

const EscalationComponent = {
  render() {
    const all = AppData.getAll();
    const active = all.filter(c => !['Resolved', 'Closed'].includes(c.status));
    const escalated = active.filter(c => ['Escalated', 'Critical'].includes(c.status));
    const nearEscalation = active.filter(c => {
      if (c.level >= 4) return false;
      const t = Utils.timeUntilEscalation(c);
      return t && (t.overdue || t.pct >= 75);
    });

    const container = document.getElementById('view-escalation');
    container.innerHTML = `
      <div class="animate-fade">
        <!-- Summary Bar -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:28px;">
          <div class="stat-card" style="border-color:rgba(255,79,79,0.3);">
            <div class="stat-label">Currently Escalated</div>
            <div class="stat-value" style="color:var(--accent-secondary);">${escalated.length}</div>
            <div class="stat-delta">Levels 2–4 active</div>
          </div>
          <div class="stat-card" style="border-color:rgba(255,140,71,0.3);">
            <div class="stat-label">Near Escalation</div>
            <div class="stat-value" style="color:var(--accent-orange);">${nearEscalation.length}</div>
            <div class="stat-delta">≥75% SLA used</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Total Active</div>
            <div class="stat-value" style="color:var(--text-primary);">${active.length}</div>
            <div class="stat-delta">Unresolved complaints</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Level 4 (Critical)</div>
            <div class="stat-value" style="color:var(--level-4);">${active.filter(c => c.level === 4).length}</div>
            <div class="stat-delta">Executive attention needed</div>
          </div>
        </div>

        <!-- Level Flow Visual -->
        <div class="card" style="margin-bottom:28px;">
          <h3 style="font-family:var(--font-mono);font-size:11px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:20px;">Escalation Level Flow</h3>
          <div style="display:flex;align-items:stretch;gap:0;overflow:hidden;border-radius:var(--radius-md);border:1px solid var(--border-color);">
            ${[1,2,3,4].map((l, i) => {
              const count = active.filter(c => c.level === l).length;
              const pct = active.length ? Math.round((count / active.length) * 100) : 0;
              return `
              <div style="flex:1;padding:16px 12px;background:rgba(${l===1?'71,255,160':l===2?'232,255,71':l===3?'255,140,71':'255,79,79'},0.05);border-right:${i<3?'1px solid var(--border-color)':'none'};text-align:center;">
                <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-bottom:8px;">
                  <span class="level-dot level-${l}"></span>
                  <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-secondary);">Level ${l}</span>
                </div>
                <div style="font-family:var(--font-display);font-size:28px;font-weight:800;color:${Utils.levelColor(l)};line-height:1;">${count}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${pct}% of active</div>
                <div style="font-size:10px;color:var(--text-muted);margin-top:6px;font-family:var(--font-mono);">${LEVELS[l].escalateAfterHours ? `SLA: ${LEVELS[l].escalateAfterHours}h` : 'No SLA'}</div>
              </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Critical / Escalated Cards -->
        ${escalated.length > 0 ? `
        <div style="margin-bottom:28px;">
          <h3 style="font-family:var(--font-display);font-size:16px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
            <span style="color:var(--accent-secondary);">⚠</span> Escalated Complaints
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);font-weight:400;">${escalated.length} active</span>
          </h3>
          <div class="escalation-grid">
            ${escalated.map(c => this.renderEscalationCard(c)).join('')}
          </div>
        </div>` : ''}

        <!-- Near Escalation Warning -->
        ${nearEscalation.length > 0 ? `
        <div style="margin-bottom:28px;">
          <h3 style="font-family:var(--font-display);font-size:16px;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:8px;">
            <span style="color:var(--accent-orange);">⏱</span> Approaching Escalation
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);font-weight:400;">${nearEscalation.length} complaints</span>
          </h3>
          <div class="escalation-grid">
            ${nearEscalation.map(c => this.renderEscalationCard(c)).join('')}
          </div>
        </div>` : ''}

        ${escalated.length === 0 && nearEscalation.length === 0 ? `
        <div class="empty-state" style="padding:60px 0;">
          <div class="empty-icon">✓</div>
          <div class="empty-title" style="color:var(--accent-green);">No escalation alerts</div>
          <div class="empty-desc">All complaints are within SLA windows</div>
        </div>` : ''}
      </div>
    `;
  },

  renderEscalationCard(c) {
    const timer = Utils.timeUntilEscalation(c);
    const isCritical = c.status === 'Critical' || c.level === 4;
    const isWarning = c.level === 3;
    return `
      <div class="escalation-card ${isCritical ? 'critical' : isWarning ? 'warning' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
          <div>
            <div style="font-family:var(--font-mono);font-size:11px;color:${Utils.levelColor(c.level)};margin-bottom:4px;">${c.id}</div>
            <div style="font-size:14px;font-weight:600;line-height:1.3;">${Utils.escapeHtml(c.title)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;margin-left:12px;">
            ${Utils.levelDot(c.level)}
            ${Utils.statusBadge(c.status)}
          </div>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:14px;">${c.customer} · ${c.category}</div>

        ${timer ? `
          <div style="background:var(--bg-secondary);border-radius:var(--radius-md);padding:10px 12px;margin-bottom:14px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
              <span style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono);">SLA Usage</span>
              <span style="font-size:11px;color:${timer.overdue ? 'var(--accent-secondary)' : timer.pct > 80 ? 'var(--accent-orange)' : 'var(--text-secondary)'};font-family:var(--font-mono);">${timer.overdue ? 'OVERDUE' : timer.label + ' remaining'}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${Math.min(100, timer.pct || 100)}%;background:${timer.overdue ? 'var(--accent-secondary)' : timer.pct > 80 ? 'var(--accent-orange)' : 'var(--accent-primary)'}"></div>
            </div>
          </div>` : `
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent-secondary);margin-bottom:14px;padding:8px 12px;background:rgba(255,79,79,0.1);border-radius:var(--radius-md);">⚠ Maximum escalation level reached</div>`
        }

        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost btn-sm" style="flex:1;" onclick="ModalComponent.showComplaint('${c.id}')">View Details</button>
          ${c.level < 4 ? `<button class="btn btn-sm" style="flex:1;background:rgba(255,140,71,0.1);color:var(--accent-orange);border:1px solid rgba(255,140,71,0.2);" onclick="EscalationComponent.manualEscalate('${c.id}')">↑ Escalate Now</button>` : ''}
          <button class="btn btn-sm" style="background:rgba(71,255,160,0.1);color:var(--accent-green);border:1px solid rgba(71,255,160,0.2);" onclick="EscalationComponent.resolve('${c.id}')">✓ Resolve</button>
        </div>
      </div>
    `;
  },

  manualEscalate(id) {
    const c = AppData.getById(id);
    if (!c) return;
    const updated = AppData.escalate(id);
    Toast.show(`↑ ${id} escalated to Level ${updated.level}`, 'warning');
    SidebarComponent.updateEscalationBadge();
    this.render();
  },

  resolve(id) {
    const note = prompt('Resolution note (optional):');
    if (note === null) return;
    AppData.resolve(id, note);
    Toast.show(`✓ Complaint ${id} resolved`, 'success');
    SidebarComponent.updateEscalationBadge();
    this.render();
  }
};
