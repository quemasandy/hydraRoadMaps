
// ✅ AFTER: Isolated Responsibilities
// UI formatting and API data preparation are completely separate concerns.
// Changing the UI format NEVER affects the Data format.

// 1. Pure Logic / Data Handling (Stable)
class UserSettingsRepository {
  async saveLastActive(date: Date) {
    // This class ONLY cares about API contracts.
    // It will always use ISO string, regardless of what the UI does.
    const payload = {
      last_active: date.toISOString(), // Hardened contract
    };
    await fetch('/api/settings', { body: JSON.stringify(payload) });
  }
}

// 2. Presentation Logic (Volatile)
class UserDashboardPresenter {
  // This class ONLY cares about what the user sees.
  // You can change this to 'MM/DD/YYYY' or 'Just now' and it won't break the API.
  formatLastLogin(date: Date): string {
    return new Intl.DateTimeFormat('en-GB').format(date);
  }
}

// Usage
export class UserDashboard {
  constructor(
    private repo: UserSettingsRepository,
    private presenter: UserDashboardPresenter
  ) {}

  render(user: any) {
    console.log(this.presenter.formatLastLogin(user.lastLogin));
  }

  async onLogout() {
    await this.repo.saveLastActive(new Date());
  }
}
