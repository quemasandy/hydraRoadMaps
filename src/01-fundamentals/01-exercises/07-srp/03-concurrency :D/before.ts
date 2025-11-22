
// ❌ BEFORE: The "Merge Conflict Magnet"
// In a real team, 5 developers might be working on different features.
// If they all have to touch this ONE file to add their config or logic,
// you will have merge conflicts every single day.

export class GlobalAppConfig {
  // Developer A is working on "Dark Mode"
  getThemeSettings() {
    return { mode: 'dark', primaryColor: 'blue' };
  }

  // Developer B is working on "Payment Integration"
  getStripeKeys() {
    return { publicKey: 'pk_test_...' };
  }

  // Developer C is working on "User Profile"
  getDefaultAvatar() {
    return 'https://cdn.example.com/default.png';
  }

  // Developer D is working on "Feature Flags"
  getFeatureFlags() {
    return { newDashboard: true, betaSearch: false };
  }

  // ... imagine 50 more methods here.
  // Every time anyone merges, they have to resolve conflicts in this file.
}
