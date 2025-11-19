/*
Ejercicio: protected

Idea clave:
- protected se accede dentro de la clase y de sus subclases.
- Desde fuera (instancias externas) NO se puede acceder.
*/

export class Person {
  protected name: string; // visible en Person y subclases

  constructor(name: string) {
    this.name = name;
  }

  public greet(): string {
    this.name = this.name.toUpperCase() + ' :D'
    return `Hola, soy ${this.name}`; // OK: dentro de la misma clase
  }
}

export class Employee extends Person {
  protected role: string;

  constructor(name: string, role: string) {
    super(name);
    this.role = role;
  }

  public describe(): string {
    this.name = this.name.toLowerCase()
    // Acceso permitido a 'name' porque es protected y estamos en una subclase
    return `${this.name} trabaja como ${this.role}`;
  }
}

export function runProtectedDemo(): void {
  const dev = new Employee('Ada', 'Developer');
  console.log(dev.greet());     // OK: método público que usa protected internamente
  console.log(dev.describe());  // OK: subclase accede a protected

  // Error de compilación si descomentas:
  // dev.name = 'regresion'
  // console.log(dev.name); // Property 'name' is protected...
  // console.log(dev.role); // Property 'name' is protected...
}

// Ejecuta el ejemplo solo cuando este archivo es el punto de entrada.
declare const require: any | undefined;
declare const module: any | undefined;
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  runProtectedDemo();
}

