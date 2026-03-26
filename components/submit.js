/* ===== SUBMIT COMPLAINT COMPONENT ===== */

const SubmitComponent = {
  render() {
    const container = document.getElementById('view-submit');
    container.innerHTML = `
      <div class="animate-fade" style="max-width:680px;">
        <div style="margin-bottom:28px;">
          <h2 style="font-size:24px;font-weight:800;margin-bottom:6px;">Submit New Complaint</h2>
          <p style="color:var(--text-secondary);font-size:14px;">Fill in the details below. Your complaint will be assigned to Level 1 support and auto-escalated if not resolved within the SLA window.</p>
        </div>

        <div class="card" style="display:flex;flex-direction:column;gap:20px;">
          <!-- Customer Info -->
          <div>
            <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent-primary);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:14px;">Customer Information</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input class="form-input" type="text" id="f-name" placeholder="Enter full name" />
              </div>
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input class="form-input" type="email" id="f-email" placeholder="Enter email" />
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Complaint Details -->
          <div>
            <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent-primary);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:14px;">Complaint Details</div>
            <div style="display:flex;flex-direction:column;gap:16px;">
              <div class="form-group">
                <label class="form-label">Complaint Title *</label>
                <input class="form-input" type="text" id="f-title" placeholder="Brief title describing the issue" />
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div class="form-group">
                  <label class="form-label">Category *</label>
                  <select class="form-select" id="f-category">
                    <option value="">Select category</option>
                    ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Priority *</label>
                  <select class="form-select" id="f-priority">
                    <option value="">Select priority</option>
                    ${PRIORITIES.map(p => `<option value="${p}">${p}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Description *</label>
                <textarea class="form-textarea" id="f-desc" placeholder="Provide detailed description of the complaint, including order numbers, dates, or any relevant information..." style="min-height:130px;"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Assigned Team</label>
                <select class="form-select" id="f-team">
                  <option value="Support Team">Support Team</option>
                  <option value="Technical Team">Technical Team</option>
                  <option value="Logistics Team">Logistics Team</option>
                  <option value="HR Team">HR Team</option>
                  <option value="Quality Team">Quality Team</option>
                  <option value="Billing Team">Billing Team</option>
                </select>
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <!-- SLA Info -->
          <div style="background:var(--bg-secondary);border-radius:var(--radius-md);padding:16px;display:flex;gap:16px;flex-wrap:wrap;">
            <div style="flex:1;min-width:140px;">
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Level 1 SLA</div>
              <div style="font-size:13px;color:var(--level-1);font-weight:600;">24 hours</div>
            </div>
            <div style="flex:1;min-width:140px;">
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Level 2 SLA</div>
              <div style="font-size:13px;color:var(--level-2);font-weight:600;">48 hours</div>
            </div>
            <div style="flex:1;min-width:140px;">
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Level 3 SLA</div>
              <div style="font-size:13px;color:var(--level-3);font-weight:600;">72 hours</div>
            </div>
            <div style="flex:1;min-width:140px;">
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">Level 4</div>
              <div style="font-size:13px;color:var(--level-4);font-weight:600;">Executive Review</div>
            </div>
          </div>

          <!-- Actions -->
          <div style="display:flex;gap:12px;justify-content:flex-end;">
            <button class="btn btn-ghost" onclick="Router.navigate('complaints')">Cancel</button>
            <button class="btn btn-primary" id="submit-btn" onclick="SubmitComponent.submit()">
              <span>Submit Complaint</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  validate() {
    const fields = [
      { id: 'f-name', label: 'Full Name' },
      { id: 'f-email', label: 'Email' },
      { id: 'f-title', label: 'Title' },
      { id: 'f-category', label: 'Category' },
      { id: 'f-priority', label: 'Priority' },
      { id: 'f-desc', label: 'Description' }
    ];
    for (const f of fields) {
      const el = document.getElementById(f.id);
      if (!el || !el.value.trim()) {
        Toast.show(`⚠ Please fill in: ${f.label}`, 'warning');
        el && el.focus();
        return false;
      }
    }
    const email = document.getElementById('f-email').value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Toast.show('⚠ Please enter a valid email address', 'warning');
      return false;
    }
    return true;
  },

  submit() {
    if (!this.validate()) return;
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    setTimeout(() => {
      const complaint = AppData.add({
        title: document.getElementById('f-title').value.trim(),
        category: document.getElementById('f-category').value,
        priority: document.getElementById('f-priority').value,
        status: 'Open',
        level: 1,
        description: document.getElementById('f-desc').value.trim(),
        customer: document.getElementById('f-name').value.trim(),
        email: document.getElementById('f-email').value.trim(),
        assignedTo: document.getElementById('f-team').value
      });

      Toast.show(`✓ Complaint ${complaint.id} submitted successfully`, 'success');
      SidebarComponent.updateEscalationBadge();
      Router.navigate('complaints');
    }, 600);
  }
};
