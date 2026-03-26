/* ===== ROUTER ===== */

const Router = {
  currentView: 'dashboard',

  routes: {
    dashboard: { viewId: 'view-dashboard', title: 'Dashboard', render: () => DashboardComponent.render() },
    complaints: { viewId: 'view-complaints', title: 'All Complaints', render: () => ComplaintsComponent.render() },
    submit: { viewId: 'view-submit', title: 'Submit Complaint', render: () => SubmitComponent.render() },
    escalation: { viewId: 'view-escalation', title: 'Escalation Monitor', render: () => EscalationComponent.render() }
  },

  navigate(view) {
    if (!this.routes[view]) return;
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    // Show target
    document.getElementById(this.routes[view].viewId).classList.add('active');
    this.currentView = view;
    // Update header
    HeaderComponent.setTitle(this.routes[view].title, view);
    // Update sidebar active
    SidebarComponent.setActive(view);
    // Render
    this.routes[view].render();
  },

  refresh() {
    this.navigate(this.currentView);
  }
};
