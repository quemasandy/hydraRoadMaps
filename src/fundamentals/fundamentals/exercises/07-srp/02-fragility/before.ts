
// ❌ BEFORE: The "Fragile" Class
// A change in one method (formatting) accidentally breaks another (validation)
// because they share internal state or helper methods that are not isolated.

export class UserDashboard {
  private cache: any = {};
  
  // Shared helper that seems innocent
  private normalizeDate(date: Date): string {
    // Developer A changes this to 'DD/MM/YYYY' for the UI display
    // unaware that 'saveSettings' relies on 'YYYY-MM-DD' for the API.
    return date.toLocaleDateString('en-GB'); // Changed from ISO format!
  }

  renderLastLogin(user: any) {
    const dateStr = this.normalizeDate(user.lastLogin);
    console.log(`Last login: ${dateStr}`); // UI looks great!
  }

  async saveSettings(user: any) {
    // 💥 BUG: The API expects ISO format (YYYY-MM-DD), but 'normalizeDate' 
    // was changed to return DD/MM/YYYY for the UI.
    // The backend crashes or saves corrupted data.
    const payload = {
      last_active: this.normalizeDate(new Date()), 
      settings: user.settings
    };
    
    await fetch('/api/settings', { body: JSON.stringify(payload) });
  }
}
