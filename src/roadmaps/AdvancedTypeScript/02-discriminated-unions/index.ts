/**
 * EN: 02 - Discriminated Unions (Tagged Unions)
 * RU: 02 - Размеченные объединения
 *
 * EN: Discriminated unions are a pattern that combines literal types,
 *     union types, and type guards to create type-safe state machines.
 *     They're one of the most powerful features for preventing bugs.
 * RU: Размеченные объединения - это паттерн, который объединяет
 *     литеральные типы, типы объединений и защиты типов для создания
 *     типобезопасных конечных автоматов.
 */

console.log('02 - Discriminated Unions (Tagged Unions)\n');

// =============================================================================
// EN: 1. Basic Discriminated Union
// RU: 1. Базовое размеченное объединение
// =============================================================================

console.log('1. Basic Discriminated Union:');

// EN: Define shapes with a discriminant property 'kind'
// RU: Определяем фигуры со свойством-дискриминантом 'kind'
interface Circle {
    kind: 'circle';
    radius: number;
}

interface Rectangle {
    kind: 'rectangle';
    width: number;
    height: number;
}

interface Triangle {
    kind: 'triangle';
    base: number;
    height: number;
}

// EN: Union type
// RU: Тип объединение
type Shape = Circle | Rectangle | Triangle;

// EN: TypeScript uses the discriminant to narrow types
// RU: TypeScript использует дискриминант для сужения типов
function calculateArea(shape: Shape): number {
    switch (shape.kind) {
        case 'circle':
            // TypeScript knows shape is Circle here
            return Math.PI * shape.radius ** 2;
        case 'rectangle':
            // TypeScript knows shape is Rectangle here
            return shape.width * shape.height;
        case 'triangle':
            // TypeScript knows shape is Triangle here
            return (shape.base * shape.height) / 2;
    }
}

const circle: Circle = { kind: 'circle', radius: 5 };
const rectangle: Rectangle = { kind: 'rectangle', width: 10, height: 20 };
const triangle: Triangle = { kind: 'triangle', base: 8, height: 12 };

console.log(`Circle area: ${calculateArea(circle)}`);
console.log(`Rectangle area: ${calculateArea(rectangle)}`);
console.log(`Triangle area: ${calculateArea(triangle)}`);

// =============================================================================
// EN: 2. Exhaustiveness Checking
// RU: 2. Проверка полноты
// =============================================================================

console.log('\n2. Exhaustiveness Checking:');

// EN: Add exhaustiveness checking with never type
// RU: Добавить проверку полноты с типом never
function calculateAreaSafe(shape: Shape): number {
    switch (shape.kind) {
        case 'circle':
            return Math.PI * shape.radius ** 2;
        case 'rectangle':
            return shape.width * shape.height;
        case 'triangle':
            return (shape.base * shape.height) / 2;
        default:
            // EN: If we add a new shape type and forget to handle it,
            //     TypeScript will error here
            // RU: Если мы добавим новый тип фигуры и забудем его обработать,
            //     TypeScript выдаст ошибку здесь
            const _exhaustiveCheck: never = shape;
            throw new Error(`Unhandled shape: ${JSON.stringify(_exhaustiveCheck)}`);
    }
}

// EN: Helper function for exhaustiveness
// RU: Вспомогательная функция для проверки полноты
function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

function calculateAreaWithHelper(shape: Shape): number {
    switch (shape.kind) {
        case 'circle':
            return Math.PI * shape.radius ** 2;
        case 'rectangle':
            return shape.width * shape.height;
        case 'triangle':
            return (shape.base * shape.height) / 2;
        default:
            return assertNever(shape);
    }
}

// =============================================================================
// EN: 3. Result Type Pattern
// RU: 3. Паттерн типа Result
// =============================================================================

console.log('\n3. Result Type Pattern:');

// EN: Success and failure as discriminated union
// RU: Успех и неудача как размеченное объединение
type Success<T> = {
    success: true;
    value: T;
};

type Failure<E = Error> = {
    success: false;
    error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// EN: Helper constructors
// RU: Вспомогательные конструкторы
function success<T>(value: T): Success<T> {
    return { success: true, value };
}

function failure<E = Error>(error: E): Failure<E> {
    return { success: false, error };
}

// EN: Example: Parse user input
// RU: Пример: Парсинг пользовательского ввода
function parseAge(input: string): Result<number> {
    const age = parseInt(input, 10);

    if (isNaN(age)) {
        return failure(new Error(`Invalid age: ${input}`));
    }

    if (age < 0 || age > 150) {
        return failure(new Error(`Age out of range: ${age}`));
    }

    return success(age);
}

// EN: Usage with type narrowing
// RU: Использование с сужением типов
function processAge(input: string) {
    const result = parseAge(input);

    if (result.success) {
        console.log(`Valid age: ${result.value}`);
    } else {
        console.error(`Error: ${result.error.message}`);
    }
}

processAge('25');
processAge('invalid');
processAge('200');

// =============================================================================
// EN: 4. State Machine Example
// RU: 4. Пример конечного автомата
// =============================================================================

console.log('\n4. State Machine Example:');

// EN: Define states for a connection
// RU: Определяем состояния для подключения
type ConnectionState =
    | { status: 'disconnected' }
    | { status: 'connecting'; startedAt: Date }
    | { status: 'connected'; connectedAt: Date; sessionId: string }
    | { status: 'error'; error: Error; lastAttempt: Date };

// EN: State machine transitions
// RU: Переходы конечного автомата
function connect(state: ConnectionState): ConnectionState {
    switch (state.status) {
        case 'disconnected':
            return { status: 'connecting', startedAt: new Date() };
        case 'connecting':
            // Simulate successful connection
            return {
                status: 'connected',
                connectedAt: new Date(),
                sessionId: Math.random().toString(36),
            };
        case 'connected':
            console.log('Already connected');
            return state;
        case 'error':
            console.log('Retrying after error');
            return { status: 'connecting', startedAt: new Date() };
        default:
            return assertNever(state);
    }
}

function getConnectionInfo(state: ConnectionState): string {
    switch (state.status) {
        case 'disconnected':
            return 'Not connected';
        case 'connecting':
            return `Connecting since ${state.startedAt.toISOString()}`;
        case 'connected':
            return `Connected with session ${state.sessionId}`;
        case 'error':
            return `Error: ${state.error.message}`;
        default:
            return assertNever(state);
    }
}

let connectionState: ConnectionState = { status: 'disconnected' };
console.log(getConnectionInfo(connectionState));

connectionState = connect(connectionState);
console.log(getConnectionInfo(connectionState));

connectionState = connect(connectionState);
console.log(getConnectionInfo(connectionState));

// =============================================================================
// EN: 5. Loading State Pattern
// RU: 5. Паттерн состояния загрузки
// =============================================================================

console.log('\n5. Loading State Pattern:');

type LoadingState<T, E = Error> =
    | { status: 'idle' }
    | { status: 'loading'; progress?: number }
    | { status: 'success'; data: T }
    | { status: 'error'; error: E };

interface User {
    id: number;
    name: string;
    email: string;
}

// EN: Simulate API call
// RU: Симуляция API запроса
async function fetchUser(id: number): Promise<LoadingState<User>> {
    const state: LoadingState<User> = { status: 'loading' };
    console.log('Loading user...');

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (id === 999) {
        return { status: 'error', error: new Error('User not found') };
    }

    return {
        status: 'success',
        data: { id, name: 'John Doe', email: 'john@example.com' },
    };
}

// EN: Render based on state
// RU: Рендеринг на основе состояния
function renderUser(state: LoadingState<User>): string {
    switch (state.status) {
        case 'idle':
            return 'Click to load user';
        case 'loading':
            return `Loading${state.progress ? ` ${state.progress}%` : '...'}`;
        case 'success':
            return `User: ${state.data.name} (${state.data.email})`;
        case 'error':
            return `Error: ${state.error.message}`;
        default:
            return assertNever(state);
    }
}

// Usage
(async () => {
    const userState1 = await fetchUser(1);
    console.log(renderUser(userState1));

    const userState2 = await fetchUser(999);
    console.log(renderUser(userState2));
})();

// =============================================================================
// EN: 6. Payment Method Example
// RU: 6. Пример метода оплаты
// =============================================================================

console.log('\n6. Payment Method Example:');

// EN: Different payment methods with different required data
// RU: Различные методы оплаты с различными требуемыми данными
type PaymentMethod =
    | {
          type: 'credit_card';
          cardNumber: string;
          cvv: string;
          expiryDate: string;
      }
    | {
          type: 'paypal';
          email: string;
      }
    | {
          type: 'bank_transfer';
          accountNumber: string;
          routingNumber: string;
      }
    | {
          type: 'crypto';
          walletAddress: string;
          currency: 'BTC' | 'ETH' | 'USDT';
      };

function processPayment(method: PaymentMethod, amount: number): Result<string> {
    console.log(`Processing $${amount} payment...`);

    switch (method.type) {
        case 'credit_card':
            // EN: TypeScript knows all credit card fields are available
            // RU: TypeScript знает, что все поля кредитной карты доступны
            console.log(`Card ending in ${method.cardNumber.slice(-4)}`);
            return success('Payment processed via credit card');

        case 'paypal':
            console.log(`PayPal account: ${method.email}`);
            return success('Payment processed via PayPal');

        case 'bank_transfer':
            console.log(`Bank account: ${method.accountNumber}`);
            return success('Payment processed via bank transfer');

        case 'crypto':
            console.log(`Crypto wallet: ${method.walletAddress} (${method.currency})`);
            return success('Payment processed via cryptocurrency');

        default:
            return assertNever(method);
    }
}

const creditCardPayment: PaymentMethod = {
    type: 'credit_card',
    cardNumber: '4111111111111111',
    cvv: '123',
    expiryDate: '12/25',
};

const paypalPayment: PaymentMethod = {
    type: 'paypal',
    email: 'user@example.com',
};

processPayment(creditCardPayment, 100);
processPayment(paypalPayment, 50);

// =============================================================================
// EN: 7. Event System Example
// RU: 7. Пример системы событий
// =============================================================================

console.log('\n7. Event System Example:');

type AppEvent =
    | { type: 'user_login'; userId: string; timestamp: Date }
    | { type: 'user_logout'; userId: string; timestamp: Date }
    | { type: 'page_view'; path: string; timestamp: Date }
    | { type: 'button_click'; buttonId: string; timestamp: Date }
    | { type: 'error'; message: string; stack?: string; timestamp: Date };

function logEvent(event: AppEvent): void {
    const time = event.timestamp.toISOString();

    switch (event.type) {
        case 'user_login':
            console.log(`[${time}] User ${event.userId} logged in`);
            break;
        case 'user_logout':
            console.log(`[${time}] User ${event.userId} logged out`);
            break;
        case 'page_view':
            console.log(`[${time}] Page viewed: ${event.path}`);
            break;
        case 'button_click':
            console.log(`[${time}] Button clicked: ${event.buttonId}`);
            break;
        case 'error':
            console.error(`[${time}] Error: ${event.message}`);
            if (event.stack) {
                console.error(event.stack);
            }
            break;
        default:
            assertNever(event);
    }
}

// EN: Emit events
// RU: Генерация событий
logEvent({ type: 'user_login', userId: '123', timestamp: new Date() });
logEvent({ type: 'page_view', path: '/dashboard', timestamp: new Date() });
logEvent({
    type: 'error',
    message: 'Network timeout',
    timestamp: new Date(),
});

// =============================================================================
// EN: 8. Exercise: Order Status
// RU: 8. Упражнение: Статус заказа
// =============================================================================

console.log('\n8. Exercise: Order Status');

type OrderStatus =
    | { status: 'pending'; createdAt: Date }
    | { status: 'processing'; startedAt: Date; estimatedCompletion: Date }
    | { status: 'shipped'; shippedAt: Date; trackingNumber: string; carrier: string }
    | { status: 'delivered'; deliveredAt: Date; signature?: string }
    | { status: 'cancelled'; cancelledAt: Date; reason: string; refundAmount: number };

function getOrderStatusMessage(order: OrderStatus): string {
    switch (order.status) {
        case 'pending':
            return `Order created at ${order.createdAt.toLocaleString()}`;
        case 'processing':
            return `Processing... Estimated completion: ${order.estimatedCompletion.toLocaleString()}`;
        case 'shipped':
            return `Shipped via ${order.carrier}. Tracking: ${order.trackingNumber}`;
        case 'delivered':
            return `Delivered at ${order.deliveredAt.toLocaleString()}${
                order.signature ? ` (Signed by: ${order.signature})` : ''
            }`;
        case 'cancelled':
            return `Cancelled: ${order.reason}. Refund: $${order.refundAmount}`;
        default:
            return assertNever(order);
    }
}

const order1: OrderStatus = { status: 'pending', createdAt: new Date() };
const order2: OrderStatus = {
    status: 'shipped',
    shippedAt: new Date(),
    trackingNumber: 'TRK123456',
    carrier: 'FedEx',
};

console.log(getOrderStatusMessage(order1));
console.log(getOrderStatusMessage(order2));

// =============================================================================
// EN: 9. Key Takeaways
// RU: 9. Ключевые выводы
// =============================================================================

console.log('\n9. Key Takeaways:');
console.log('✅ Discriminated unions use a common property (discriminant) to narrow types');
console.log('✅ The never type enables exhaustiveness checking at compile time');
console.log('✅ Perfect for state machines and status tracking');
console.log('✅ Result/Either types improve error handling without exceptions');
console.log('✅ Loading states become type-safe and impossible to misuse');
console.log('✅ Event systems benefit from discriminated unions for type safety');

/*
 * EN: Next Steps:
 * - Practice creating state machines for real-world scenarios
 * - Implement Result type in your error handling
 * - Refactor enums to discriminated unions
 * - Explore how this enables pattern matching-like behavior
 * - Learn about custom type guards to work with discriminated unions
 *
 * RU: Следующие шаги:
 * - Практиковать создание конечных автоматов для реальных сценариев
 * - Реализовать тип Result в обработке ошибок
 * - Рефакторинг перечислений в размеченные объединения
 * - Изучить, как это позволяет использовать поведение, похожее на сопоставление с образцом
 * - Изучить пользовательские защиты типов для работы с размеченными объединениями
 */
