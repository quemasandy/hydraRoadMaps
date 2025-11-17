/**
 * MVVM PATTERN (Model-View-ViewModel)
 * ViewModel expone datos y comandos, View se bind automáticamente.
 * Popular en frameworks reactivos (Vue, Angular, React con hooks).
 *
 * Big Tech: WPF, Angular, Vue.js, SwiftUI
 */

// Simple Observable implementation
class Observable<T> {
  private value: T;
  private listeners: Array<(value: T) => void> = [];

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this.listeners.forEach(listener => listener(newValue));
    }
  }

  subscribe(listener: (value: T) => void): () => void {
    this.listeners.push(listener);
    listener(this.value); // Initial call
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

// MODEL
interface Subscription {
  id: string;
  plan: string;
  price: number;
  status: 'active' | 'cancelled';
}

class SubscriptionModel {
  private subscriptions: Subscription[] = [
    { id: '1', plan: 'Basic', price: 9.99, status: 'active' },
    { id: '2', plan: 'Pro', price: 29.99, status: 'active' }
  ];

  getAll(): Subscription[] {
    return [...this.subscriptions];
  }

  cancel(id: string): boolean {
    const sub = this.subscriptions.find(s => s.id === id);
    if (sub) {
      sub.status = 'cancelled';
      return true;
    }
    return false;
  }
}

// VIEWMODEL (exposes observable state and commands)
class SubscriptionViewModel {
  // Observable properties (data-binding)
  subscriptions = new Observable<Subscription[]>([]);
  isLoading = new Observable<boolean>(false);
  totalCost = new Observable<number>(0);
  activeCount = new Observable<number>(0);

  constructor(private model: SubscriptionModel) {
    this.loadSubscriptions();
  }

  // Commands (actions)
  loadSubscriptions(): void {
    this.isLoading.set(true);

    // Simulate async load
    setTimeout(() => {
      const subs = this.model.getAll();
      this.subscriptions.set(subs);
      this.updateComputedProperties(subs);
      this.isLoading.set(false);
    }, 500);
  }

  cancelSubscription(id: string): void {
    console.log(`[ViewModel] Cancelling subscription ${id}...`);

    const success = this.model.cancel(id);
    if (success) {
      this.loadSubscriptions(); // Reload to update view
    }
  }

  private updateComputedProperties(subs: Subscription[]): void {
    const active = subs.filter(s => s.status === 'active');
    const total = active.reduce((sum, s) => sum + s.price, 0);

    this.totalCost.set(total);
    this.activeCount.set(active.length);
  }
}

// VIEW (binds to ViewModel)
class SubscriptionView {
  constructor(private viewModel: SubscriptionViewModel) {
    this.bindToViewModel();
  }

  private bindToViewModel(): void {
    // Data binding: View subscribes to ViewModel observables
    this.viewModel.subscriptions.subscribe(subs => {
      this.renderSubscriptions(subs);
    });

    this.viewModel.isLoading.subscribe(loading => {
      if (loading) {
        console.log('⏳ Loading...');
      }
    });

    this.viewModel.totalCost.subscribe(total => {
      console.log(`\n💰 Total Monthly Cost: $${total.toFixed(2)}`);
    });

    this.viewModel.activeCount.subscribe(count => {
      console.log(`📊 Active Subscriptions: ${count}\n`);
    });
  }

  private renderSubscriptions(subscriptions: Subscription[]): void {
    console.log('\n--- Subscriptions ---');
    subscriptions.forEach(sub => {
      const statusIcon = sub.status === 'active' ? '✓' : '✗';
      console.log(`${statusIcon} ${sub.plan} - $${sub.price}/mo [${sub.status}]`);
    });
    console.log('---');
  }

  // User actions trigger ViewModel commands
  onCancelClick(id: string): void {
    this.viewModel.cancelSubscription(id);
  }
}

// Demo
console.log('='.repeat(60));
console.log('MVVM PATTERN - Subscription Management');
console.log('='.repeat(60));

const model = new SubscriptionModel();
const viewModel = new SubscriptionViewModel(model);
const view = new SubscriptionView(viewModel);

// Simulate user interaction
setTimeout(() => {
  console.log('\n\n[User Action] Cancel Pro subscription');
  view.onCancelClick('2');
}, 1000);

/**
 * PREGUNTAS:
 * 1. ¿MVVM vs MVC vs MVP?
 * 2. ¿Data binding: one-way vs two-way?
 * 3. ¿MVVM en Vue.js, Angular, React?
 * 4. ¿Testing ViewModels?
 * 5. ¿Computed properties en MVVM?
 * 6. ¿MVVM + reactive programming (RxJS)?
 * 7. ¿Memory leaks con data binding?
 * 8. ¿MVVM en SwiftUI/Jetpack Compose?
 */

export { SubscriptionViewModel, Observable };
