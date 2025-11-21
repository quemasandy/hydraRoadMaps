
// ✅ AFTER: Distributed Configuration
// Each feature has its own config file/class.
// Developer A touches ThemeConfig.ts.
// Developer B touches PaymentConfig.ts.
// They NEVER conflict because they are editing different files.

// File: src/features/theme/ThemeConfig.ts
export class ThemeConfig {
  getSettings() {
    return { mode: 'dark', primaryColor: 'blue' };
  }
}

// File: src/features/payment/PaymentConfig.ts
export class PaymentConfig {
  getKeys() {
    return { publicKey: 'pk_test_...' };
  }
}

// File: src/features/user/UserConfig.ts
export class UserConfig {
  getDefaultAvatar() {
    return 'https://cdn.example.com/default.png';
  }
}

// The main app just aggregates them (Open/Closed Principle)
// You rarely need to touch this file once it's set up.
export class AppConfig {
  constructor(
    public theme: ThemeConfig,
    public payment: PaymentConfig,
    public user: UserConfig
  ) {}
}
