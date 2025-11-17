/*
Ejercicio: private

Idea clave:
- private restringe el acceso a la misma clase.
- Úsalo para ocultar detalles internos; expón métodos públicos para interactuar.
*/

export class SecretBox {
  private secret: string; // NO accesible fuera de la clase

  constructor(secret: string) {
    this.secret = secret;
  }

  public reveal(): string {
    return this.secret;
  }

  // private helper(): void { /* ... */ }
}

// export class SubSecretBox extends SecretBox {
//   public reveal(): string {
//     return this.secret
//   }
// }

export function runPrivateDemo(): void {
  const box = new SecretBox('clave-123');
  // const subBox = new SubSecretBox('secret-321')
  console.log('Revelado vía método público:', box.reveal()); // OK

  // Errores de compilación si descomentas:
  // box.secret = 'hack';     // Property 'secret' is private...
  // console.log(box.secret); // Property 'secret' is private...
  // console.log(subBox.reveal())
}

// Ejecuta el ejemplo solo cuando este archivo es el punto de entrada.
declare const require: any | undefined;
declare const module: any | undefined;
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  runPrivateDemo();
}

