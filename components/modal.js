/* ===== MODAL COMPONENT ===== */

const ModalComponent = {
  showComplaint(id) {
    const c = AppData.getById(id);
    if (!c) return;
    const timer = Utils.timeUntilEscalation(c);
    const isActive = !['Resolved', 'Closed'].includes(c.status);

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box" style="max-width:640px;">
        <!-- Header -->
        <div class="modal-header">
          <div>
            <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent-primary);margin-bottom:4px;">${c.id}</div>
            <div style="font-family:var(--font-display);font-size:17px;font-weight:700;line-height:1.3;">${Utils.escapeHtml(c.title)}</div>
          </div>
          <button onclick="ModalComponent.close()" style="background:none;border:none;cursor:pointer;color:var(--text-muted);font-size:20px;padding:4px;line-height:1;">✕</button>
        </div>

        <!-- Body -->
        <div class="modal-body">

          <!-- Status Row -->
          <div style="display:flex;flex-wrap:wrap;gap:12px;padding:14px;background:var(--bg-secondary);border-radius:var(--radius-md);">
            <div>
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Status</div>
              ${Utils.statusBadge(c.status)}
            </div>
            <div>
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Level</div>
              <div style="display:flex;align-items:center;gap:6px;">
                ${Utils.levelDot(c.level)}
                <span style="font-size:13px;color:${Utils.levelColor(c.level)};font-weight:600;">Level ${c.level} — ${LEVELS[c.level].label}</span>
              </div>
            </div>
            <div>
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Priority</div>
              <span style="font-size:13px;font-weight:600;color:${Utils.priorityColor(c.priority)};">${c.priority}</span>
            </div>
            <div>
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Category</div>
              <span style="font-size:13px;color:var(--text-secondary);">${c.category}</span>
            </div>
          </div>

          <!-- SLA Timer -->
          ${isActive && timer ? `
          <div style="padding:14px;background:var(--bg-secondary);border-radius:var(--radius-md);border-left:3px solid ${timer.overdue ? 'var(--accent-secondary)' : timer.pct > 80 ? 'var(--accent-orange)' : 'var(--accent-primary)'};">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.08em;">SLA Timer — ${c.level < 4 ? 'Escalates to Level '+(c.level+1) : 'Max Level'}</span>
              <span style="font-family:var(--font-mono);font-size:12px;font-weight:600;color:${timer.overdue ? 'var(--accent-secondary)' : timer.pct > 80 ? 'var(--accent-orange)' : 'var(--accent-green)'};">${timer.overdue ? '⚠ OVERDUE' : timer.label + ' remaining'}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${Math.min(100, timer.pct || 100)}%;background:${timer.overdue ? 'var(--accent-secondary)' : timer.pct > 80 ? 'var(--accent-orange)' : 'var(--accent-primary)'}"></div>
            </div>
          </div>` : ''}

          <!-- Customer + Assignment Info -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div>
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Customer</div>
              <div style="font-size:14px;font-weight:600;">${Utils.escapeHtml(c.customer || '—')}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${Utils.escapeHtml(c.email || '—')}</div>
            </div>
            <div>
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Assigned To</div>
              <div style="font-size:14px;font-weight:600;">${Utils.escapeHtml(c.assignedTo || '—')}</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">Created ${Utils.timeAgo(c.createdAt)}</div>
            </div>
          </div>

          <!-- Description -->
          <div>
            <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Description</div>
            <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;background:var(--bg-secondary);padding:14px;border-radius:var(--radius-md);">${Utils.escapeHtml(c.description || 'No description provided.')}</div>
          </div>

          <!-- History Timeline -->
          <div>
            <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:14px;">Activity History</div>
            <div style="display:flex;flex-direction:column;gap:0;">
              ${(c.history || []).map((h, i) => `
                <div style="display:flex;gap:14px;position:relative;">
                  <div style="display:flex;flex-direction:column;align-items:center;flex-shrink:0;">
                    <div style="width:28px;height:28px;border-radius:50%;background:${h.action.includes('Escalated') ? 'rgba(255,140,71,0.15)' : h.action === 'Resolved' ? 'rgba(71,255,160,0.15)' : 'rgba(79,158,255,0.1)'};border:1px solid ${h.action.includes('Escalated') ? 'rgba(255,140,71,0.3)' : h.action === 'Resolved' ? 'rgba(71,255,160,0.3)' : 'var(--border-color)'};display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;">
                      ${h.action.includes('Escalated') ? '▲' : h.action === 'Resolved' ? '✓' : h.action === 'Created' ? '★' : '●'}
                    </div>
                    ${i < (c.history.length - 1) ? '<div style="width:1px;flex:1;background:var(--border-color);margin:4px 0;min-height:16px;"></div>' : ''}
                  </div>
                  <div style="padding-bottom:${i < (c.history.length - 1) ? '16px' : '0'};">
                    <div style="font-size:13px;font-weight:600;color:${h.action.includes('Escalated') ? 'var(--accent-orange)' : h.action === 'Resolved' ? 'var(--accent-green)' : 'var(--text-primary)'};">${h.action}</div>
                    <div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">${h.note}</div>
                    <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);margin-top:4px;">${h.by} · ${Utils.formatDate(h.at)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Add Note -->
          ${isActive ? `
          <div>
            <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Add Note</div>
            <textarea class="form-textarea" id="modal-note" placeholder="Add a note or update..." style="min-height:72px;"></textarea>
          </div>` : ''}
        </div>

        <!-- Footer Actions -->
        <div class="modal-footer">
          <button class="btn btn-ghost" onclick="ModalComponent.close()">Close</button>
          ${isActive ? `
            ${c.level < 4 ? `<button class="btn btn-sm" style="background:rgba(255,140,71,0.1);color:var(--accent-orange);border:1px solid rgba(255,140,71,0.2);" onclick="ModalComponent.escalate('${c.id}')">↑ Escalate to Level ${c.level + 1}</button>` : ''}
            <button class="btn btn-sm" style="background:rgba(71,255,160,0.1);color:var(--accent-green);border:1px solid rgba(71,255,160,0.2);" onclick="ModalComponent.resolve('${c.id}')">✓ Mark Resolved</button>
          ` : ''}
        </div>
      </div>
    `;

    document.getElementById('modal-container').appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) ModalComponent.close(); });
    document.addEventListener('keydown', ModalComponent._escHandler);
  },

  _escHandler(e) {
    if (e.key === 'Escape') ModalComponent.close();
  },

  close() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.remove();
    document.removeEventListener('keydown', ModalComponent._escHandler);
  },

  escalate(id) {
    const noteEl = document.getElementById('modal-note');
    const updated = AppData.escalate(id);
    if (!updated) return;
    if (noteEl && noteEl.value.trim()) {
      updated.history.push({ action: 'Note added', by: 'Agent', at: new Date().toISOString(), note: noteEl.value.trim() });
    }
    Toast.show(`↑ ${id} escalated to Level ${updated.level}`, 'warning');
    SidebarComponent.updateEscalationBadge();
    this.close();
    Router.refresh();
  },

  resolve(id) {
    const noteEl = document.getElementById('modal-note');
    const note = noteEl ? noteEl.value.trim() : '';
    AppData.resolve(id, note || 'Complaint resolved by agent.');
    Toast.show(`✓ Complaint ${id} resolved successfully`, 'success');
    SidebarComponent.updateEscalationBadge();
    this.close();
    Router.refresh();
  }
};
