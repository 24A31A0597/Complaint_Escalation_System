/* ===== APP INIT ===== */

const App = {
  escalationInterval: null,

  init() {
    SidebarComponent.render();
    HeaderComponent.render();
    Router.navigate('dashboard');
    this.startEscalationEngine();
  },

  startEscalationEngine() {
    // Check every 30 seconds
    this.escalationInterval = setInterval(() => {
      const escalated = AppData.checkEscalations();
      if (escalated.length > 0) {
        escalated.forEach(id => {
          const c = AppData.getById(id);
          Toast.show(`⚠ Complaint ${id} auto-escalated to Level ${c.level}`, 'warning');
        });
        // If on escalation or complaints view, refresh
        if (['escalation', 'complaints', 'dashboard'].includes(Router.currentView)) {
          Router.refresh();
        }
      }
    }, 30000);

    // Initial check
    AppData.checkEscalations();
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
