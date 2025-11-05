# Separación de Responsabilidades · Ejercicio

**Objetivo:** dividir el código según quién lo usa, qué hace y qué cambia con el tiempo.

## Escenario
Una API `TodoApp` mezcla controladores HTTP, lógica de negocio y acceso a base de datos en una sola clase. Las pruebas son frágiles y el código es difícil de entender.

## Instrucciones
1. Escribe una clase `TodoApp` que tenga métodos `handleRequest(req)` con lógica de validación, reglas de negocio y persistencia juntos.
2. Analiza qué responsabilidad pertenece a cada capa (transporte, dominio, infraestructura).
3. Refactoriza creando:
   - `TodoController` (recibe request, valida, coordina)
   - `TodoService` (reglas de negocio)
   - `TodoRepository` (persistencia)
4. Muestra cómo un cambio de base de datos ahora solo afecta al repositorio.

```typescript
// Punto de partida acoplado
class TodoApp {
  constructor(private db: any) {}

  async handleRequest(req: { body: { title?: string } }) {
    if (!req.body.title) throw new Error("Título requerido");
    if (req.body.title.length > 100) throw new Error("Título demasiado largo");

    const todo = { id: Date.now(), title: req.body.title, completed: false };
    await this.db.insert(todo);
    return { status: 201, body: todo };
  }
}

// Refactor con separación de responsabilidades
class TodoRepository {
  constructor(private db: any) {}

  create(todo: { id: number; title: string; completed: boolean }) {
    return this.db.insert(todo);
  }
}

class TodoService {
  constructor(private repo: TodoRepository) {}

  async create(title: string) {
    if (!title) throw new Error("Título requerido");
    if (title.length > 100) throw new Error("Título demasiado largo");

    const todo = { id: Date.now(), title, completed: false };
    await this.repo.create(todo);
    return todo;
  }
}

class TodoController {
  constructor(private service: TodoService) {}

  async create(req: { body: { title?: string } }) {
    const todo = await this.service.create(req.body.title ?? "");
    return { status: 201, body: todo };
  }
}
```

## Resultado esperado
- Cada capa responde a una audiencia distinta: transporte, dominio e infraestructura.
- Cambiar de almacenamiento (por ejemplo, memoria a Mongo) implica sustituir `db` en `TodoRepository`.
- Las pruebas pueden aislar servicios y controladores sin tocar la base de datos real.
