# Acoplamiento y Cohesión · Ejercicio

**Objetivo:** equilibrar módulos con responsabilidades claras (alta cohesión) y dependencias mínimas (bajo acoplamiento).

## Escenario
Un módulo `UserModule` maneja autenticación, perfil y facturación. Cambios en pagos rompen los tests de login porque todo está mezclado.

## Instrucciones
1. Reproduce el problema creando una clase `UserModule` con métodos `login`, `updateProfile`, `chargeSubscription` que comparten variables internas.
2. Identifica el acoplamiento: el método de pagos conoce detalles de autenticación y perfil.
3. Refactoriza separando en clases cohesivas: `AuthService`, `ProfileService`, `BillingService`.
4. Crea un `UserFacade` que las coordine manteniendo dependencias explícitas.
5. Explica cómo cada pieza queda aislada frente a cambios ajenos.

```typescript
class UserModule {
  constructor(private db: any) {}

  async login(email: string, password: string) {
    const user = await this.db.findUser(email);
    if (!user || user.password !== password) throw new Error("Credenciales inválidas");
    user.lastLogin = new Date();
    await this.db.save(user);
    return user;
  }

  async updateProfile(userId: string, profile: any) {
    const user = await this.db.findById(userId);
    Object.assign(user.profile, profile);
    await this.db.save(user);
  }

  async chargeSubscription(userId: string) {
    const user = await this.db.findById(userId);
    if (!user.paymentToken) throw new Error("Sin método de pago");
    // lógica de cobro mezclada con user
  }
}

// Refactor con cohesión elevada y bajo acoplamiento
class AuthService {
  constructor(private userRepo: any) {}

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user || !user.verifyPassword(password)) throw new Error("Credenciales inválidas");
    return user;
  }
}

class ProfileService {
  constructor(private userRepo: any) {}

  async update(userId: string, profile: any) {
    const user = await this.userRepo.findById(userId);
    Object.assign(user.profile, profile);
    await this.userRepo.save(user);
  }
}

class BillingService {
  constructor(private payments: any, private userRepo: any) {}

  async charge(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user.paymentToken) throw new Error("Sin método de pago");
    await this.payments.charge(user.paymentToken);
  }
}

class UserFacade {
  constructor(
    private auth: AuthService,
    private profile: ProfileService,
    private billing: BillingService
  ) {}

  login(email: string, password: string) {
    return this.auth.login(email, password);
  }

  updateProfile(userId: string, profile: any) {
    return this.profile.update(userId, profile);
  }

  chargeSubscription(userId: string) {
    return this.billing.charge(userId);
  }
}
```

## Resultado esperado
- Cada servicio tiene una responsabilidad enfocada (alta cohesión).
- Las dependencias se expresan a través de constructores; nadie accede a detalles innecesarios (bajo acoplamiento).
- El `UserFacade` coordina sin convertirse en un nuevo monolito.
