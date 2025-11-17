/**
 * OBSERVABLE PATTERN (RxJS-style)
 * Stream of values over time
 *
 * Big Tech: RxJS, reactive programming, real-time data
 */

class Observable<T> {
  constructor(private subscribe: (observer: Observer<T>) => () => void) {}

  static create<T>(subscribe: (observer: Observer<T>) => () => void): Observable<T> {
    return new Observable(subscribe);
  }

  subscribe(observer: Observer<T>): () => void {
    return this.subscribe(observer);
  }

  map<U>(fn: (value: T) => U): Observable<U> {
    return Observable.create(observer => {
      return this.subscribe({
        next: value => observer.next(fn(value)),
        error: err => observer.error(err),
        complete: () => observer.complete()
      });
    });
  }

  filter(predicate: (value: T) => boolean): Observable<T> {
    return Observable.create(observer => {
      return this.subscribe({
        next: value => { if (predicate(value)) observer.next(value); },
        error: err => observer.error(err),
        complete: () => observer.complete()
      });
    });
  }
}

interface Observer<T> {
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;
}

// Demo
console.log('='.repeat(60));
console.log('OBSERVABLE PATTERN - Payment Stream');
console.log('='.repeat(60));

const paymentStream = Observable.create<number>(observer => {
  let count = 0;
  const interval = setInterval(() => {
    observer.next(++count * 100);
    if (count === 5) {
      observer.complete();
      clearInterval(interval);
    }
  }, 500);

  return () => clearInterval(interval);
});

paymentStream
  .filter(amount => amount > 200)
  .map(amount => `$${amount}`)
  .subscribe({
    next: value => console.log(`Payment: ${value}`),
    error: err => console.error(err),
    complete: () => console.log('Stream complete')
  });

/**
 * PREGUNTAS:
 * 1. ¿Observable vs Promise?
 * 2. ¿Hot vs Cold observables?
 * 3. ¿RxJS operators?
 * 4. ¿Subscription management?
 * 5. ¿Observable marble diagrams?
 * 6. ¿Subject in RxJS?
 * 7. ¿Observable memory leaks?
 * 8. ¿Observable vs AsyncIterator?
 */

export { Observable };
