/**
 * EN: 01 - Literal Types y Const Assertions
 * RU: 01 - Литеральные типы и const утверждения
 *
 * EN: Literal types allow you to specify exact values that a type must have.
 *     This is incredibly powerful for creating type-safe APIs that prevent
 *     entire classes of bugs at compile time.
 * RU: Литеральные типы позволяют указать точные значения, которые должен
 *     иметь тип. Это невероятно мощно для создания типобезопасных API,
 *     которые предотвращают целые классы ошибок во время компиляции.
 */

console.log('01 - Literal Types y Const Assertions\n');

// =============================================================================
// EN: 1. String Literal Types
// RU: 1. Строковые литеральные типы
// =============================================================================

// EN: Bad - Using primitive string type
// RU: Плохо - Использование примитивного строкового типа
function setAlignmentBad(align: string) {
    // Any string is accepted, including invalid values
    console.log(`Align: ${align}`);
}

setAlignmentBad('left'); // OK
setAlignmentBad('invalid'); // Also OK but shouldn't be!

// EN: Good - Using string literal types
// RU: Хорошо - Использование строковых литеральных типов
type Alignment = 'left' | 'center' | 'right';

function setAlignment(align: Alignment) {
    console.log(`Align: ${align}`);
}

setAlignment('left'); // OK
// setAlignment('invalid'); // Error: Type '"invalid"' is not assignable

// =============================================================================
// EN: 2. Numeric Literal Types
// RU: 2. Числовые литеральные типы
// =============================================================================

type HttpSuccessCode = 200 | 201 | 204;
type HttpErrorCode = 400 | 401 | 403 | 404 | 500;
type HttpCode = HttpSuccessCode | HttpErrorCode;

function handleResponse(code: HttpCode) {
    if (code === 200) {
        console.log('Success!');
    } else if (code >= 400) {
        console.log('Error!');
    }
}

handleResponse(200); // OK
handleResponse(404); // OK
// handleResponse(999); // Error: Type '999' is not assignable

// =============================================================================
// EN: 3. Boolean Literal Types
// RU: 3. Булевы литеральные типы
// =============================================================================

type Success = true;
type Failure = false;

interface SuccessResult<T> {
    success: Success;
    data: T;
}

interface FailureResult {
    success: Failure;
    error: string;
}

// This creates a discriminated union (we'll see more in next module)
type Result<T> = SuccessResult<T> | FailureResult;

function processResult<T>(result: Result<T>) {
    if (result.success) {
        // TypeScript knows result is SuccessResult here
        console.log('Data:', result.data);
    } else {
        // TypeScript knows result is FailureResult here
        console.log('Error:', result.error);
    }
}

processResult({ success: true, data: { id: 1, name: 'John' } });
processResult({ success: false, error: 'Not found' });

// =============================================================================
// EN: 4. Const Assertions
// RU: 4. Const утверждения
// =============================================================================

console.log('\n4. Const Assertions:');

// EN: Without const assertion
// RU: Без const утверждения
const config1 = {
    apiUrl: 'https://api.example.com',
    timeout: 3000,
    retries: 3,
};
// Type: { apiUrl: string; timeout: number; retries: number }

// EN: With const assertion
// RU: С const утверждением
const config2 = {
    apiUrl: 'https://api.example.com',
    timeout: 3000,
    retries: 3,
} as const;
// Type: {
//   readonly apiUrl: "https://api.example.com";
//   readonly timeout: 3000;
//   readonly retries: 3;
// }

// EN: This makes properties readonly and infers literal types
// RU: Это делает свойства readonly и выводит литеральные типы

// config2.apiUrl = 'other'; // Error: Cannot assign to 'apiUrl'
// config2.timeout = 5000; // Error: Cannot assign to 'timeout'

// =============================================================================
// EN: 5. Const Assertions with Arrays
// RU: 5. Const утверждения с массивами
// =============================================================================

const colors1 = ['red', 'green', 'blue'];
// Type: string[]

const colors2 = ['red', 'green', 'blue'] as const;
// Type: readonly ["red", "green", "blue"]

// EN: Now we can create a type from the array values
// RU: Теперь мы можем создать тип из значений массива
type Color = (typeof colors2)[number];
// Type: "red" | "green" | "blue"

function setColor(color: Color) {
    console.log(`Color: ${color}`);
}

setColor('red'); // OK
// setColor('yellow'); // Error

// =============================================================================
// EN: 6. Practical Example: API Routes
// RU: 6. Практический пример: API маршруты
// =============================================================================

console.log('\n6. Practical Example: API Routes');

const API_ROUTES = {
    users: {
        list: '/api/users',
        detail: '/api/users/:id',
        create: '/api/users',
    },
    posts: {
        list: '/api/posts',
        detail: '/api/posts/:id',
        create: '/api/posts',
    },
} as const;

// EN: Extract all route values
// RU: Извлечь все значения маршрутов
type ApiRoute = typeof API_ROUTES[keyof typeof API_ROUTES][keyof typeof API_ROUTES[keyof typeof API_ROUTES]];

// EN: Type-safe fetch function
// RU: Типобезопасная функция fetch
function fetchApi(route: ApiRoute) {
    console.log(`Fetching: ${route}`);
    // return fetch(route);
}

fetchApi(API_ROUTES.users.list); // OK
fetchApi(API_ROUTES.posts.detail); // OK
// fetchApi('/api/invalid'); // Error

// =============================================================================
// EN: 7. Practical Example: Configuration with Literal Types
// RU: 7. Практический пример: Конфигурация с литеральными типами
// =============================================================================

console.log('\n7. Configuration Example:');

type Environment = 'development' | 'staging' | 'production';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Config {
    environment: Environment;
    logLevel: LogLevel;
    features: {
        readonly beta: boolean;
        readonly analytics: boolean;
    };
}

const devConfig: Config = {
    environment: 'development',
    logLevel: 'debug',
    features: {
        beta: true,
        analytics: false,
    },
};

const prodConfig: Config = {
    environment: 'production',
    logLevel: 'error',
    features: {
        beta: false,
        analytics: true,
    },
};

function initApp(config: Config) {
    console.log(`Starting app in ${config.environment} mode`);
    console.log(`Log level: ${config.logLevel}`);

    if (config.features.beta) {
        console.log('Beta features enabled');
    }
}

initApp(devConfig);
initApp(prodConfig);

// =============================================================================
// EN: 8. Exercise: Payment Methods
// RU: 8. Упражнение: Методы оплаты
// =============================================================================

console.log('\n8. Exercise: Payment Methods');

// EN: Define payment method types
// RU: Определить типы методов оплаты
type CreditCard = 'visa' | 'mastercard' | 'amex';
type DigitalWallet = 'paypal' | 'applepay' | 'googlepay';
type BankTransfer = 'ach' | 'wire';
type PaymentMethod = CreditCard | DigitalWallet | BankTransfer;

// EN: Payment configuration
// RU: Конфигурация платежей
const PAYMENT_CONFIG = {
    creditCard: {
        visa: { fee: 2.9, maxAmount: 10000 },
        mastercard: { fee: 2.9, maxAmount: 10000 },
        amex: { fee: 3.5, maxAmount: 5000 },
    },
    digitalWallet: {
        paypal: { fee: 3.0, maxAmount: 15000 },
        applepay: { fee: 2.5, maxAmount: 20000 },
        googlepay: { fee: 2.5, maxAmount: 20000 },
    },
    bankTransfer: {
        ach: { fee: 0.8, maxAmount: 50000 },
        wire: { fee: 25, maxAmount: 100000 },
    },
} as const;

function processPayment(method: PaymentMethod, amount: number) {
    console.log(`Processing payment of $${amount} via ${method}`);

    // EN: This would need proper type narrowing in real code
    // RU: Это потребует правильного сужения типов в реальном коде
    // For now, we'll just demonstrate the types work correctly
}

processPayment('visa', 100);
processPayment('paypal', 50);
processPayment('ach', 1000);
// processPayment('bitcoin', 100); // Error: Type '"bitcoin"' is not assignable

// =============================================================================
// EN: 9. Exercise: Theme System
// RU: 9. Упражнение: Система тем
// =============================================================================

console.log('\n9. Exercise: Theme System');

const THEMES = {
    light: {
        primary: '#007bff',
        secondary: '#6c757d',
        background: '#ffffff',
        text: '#212529',
    },
    dark: {
        primary: '#0d6efd',
        secondary: '#6c757d',
        background: '#212529',
        text: '#ffffff',
    },
    highContrast: {
        primary: '#0000ff',
        secondary: '#000000',
        background: '#ffffff',
        text: '#000000',
    },
} as const;

type ThemeName = keyof typeof THEMES;
type Theme = typeof THEMES[ThemeName];

function applyTheme(themeName: ThemeName) {
    const theme = THEMES[themeName];
    console.log(`Applying ${themeName} theme:`);
    console.log(`- Primary: ${theme.primary}`);
    console.log(`- Background: ${theme.background}`);
    console.log(`- Text: ${theme.text}`);
}

applyTheme('light');
applyTheme('dark');
// applyTheme('blue'); // Error

// =============================================================================
// EN: 10. Key Takeaways
// RU: 10. Ключевые выводы
// =============================================================================

console.log('\n10. Key Takeaways:');
console.log('✅ Use literal types instead of primitives when possible');
console.log('✅ Const assertions make objects readonly and infer literals');
console.log('✅ Extract types from const objects with typeof and keyof');
console.log('✅ Literal types prevent entire classes of bugs at compile time');
console.log('✅ Configuration objects benefit greatly from const assertions');
console.log('✅ API routes, themes, and enums are perfect use cases');

/*
 * EN: Next Steps:
 * - Practice creating type-safe configurations
 * - Refactor existing code to use literal types
 * - Explore how literal types enable discriminated unions (next module)
 * - Read about template literal types for advanced string manipulation
 *
 * RU: Следующие шаги:
 * - Практиковаться в создании типобезопасных конфигураций
 * - Рефакторинг существующего кода для использования литеральных типов
 * - Изучить, как литеральные типы позволяют использовать размеченные объединения
 * - Читать о литеральных типах шаблонов для продвинутой манипуляции строками
 */
