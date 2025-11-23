# 🏛️ Clean Architecture: Gestor de Tareas (Ejemplo Didáctico)

Este proyecto es una demostración práctica y minimalista de **Clean Architecture** (Arquitectura Limpia). 

El objetivo no es construir una aplicación compleja, sino mostrar **cómo organizar el código** para que sea resistente al cambio, fácil de probar e independiente de tecnologías externas (como bases de datos o frameworks).

---

## 🗺️ Mapa del Proyecto

La estructura de carpetas refleja fielmente los "Círculos Concéntricos" de Clean Architecture:

```
src/01-fundamentals/04-clean-architecture/
├── domain/                 # 🟡 Círculo Amarillo (Enterprise Business Rules)
├── application/            # 🟠 Círculo Naranja (Application Business Rules)
├── infrastructure/         # 🟢 Círculo Verde (Interface Adapters)
└── main.ts                 # 🔵 Círculo Azul (Frameworks & Drivers)
```

---

## 🧩 Explicación de Componentes

### 1. 🟡 Domain (El Núcleo)
**Ruta:** `domain/`
Aquí viven las reglas de negocio que **nunca deberían cambiar** por culpa de herramientas externas.

*   **`entities/Task.ts`**: Define qué es una "Tarea" para la empresa. Contiene validaciones puras (ej: "el título debe tener 3 caracteres").
    *   *Por qué es Clean:* No tiene decoradores de base de datos, ni hereda de nada. Es TypeScript puro.
*   **`repositories/TaskRepository.ts`**: Es un **Contrato (Interface)**. Dice *qué* necesitamos hacer (guardar), pero no *cómo*.
    *   *Por qué es Clean:* Permite que el Dominio pida guardar datos sin saber si se guardarán en memoria, SQL o un archivo de texto.

### 2. 🟠 Application (La Orquestación)
**Ruta:** `application/`
Aquí están los **Casos de Uso**. Son las acciones que puede realizar el usuario.

*   **`use-cases/CreateTask.ts`**: Contiene la lógica de "Crear una Tarea".
    1.  Recibe datos.
    2.  Crea la Entidad `Task` (validando reglas).
    3.  Llama al `TaskRepository` para guardar.
    *   *Por qué es Clean:* Depende de la *Interface* `TaskRepository`, no de una clase concreta. Esto cumple el **Principio de Inversión de Dependencias**.

### 3. 🟢 Infrastructure (Los Detalles)
**Ruta:** `infrastructure/`
Aquí es donde el mundo real toca nuestra aplicación. Son las implementaciones concretas.

*   **`repositories/InMemoryTaskRepository.ts`**: Guarda tareas en un Array (RAM).
*   **`repositories/FileTaskRepository.ts`**: Guarda tareas en un archivo `db.txt`.
    *   *Por qué es Clean:* Estas clases son "plugins". Podemos crear 10 implementaciones diferentes (MySQL, Mongo, Firebase) y el resto de la aplicación no se enterará.

### 4. 🔵 Main (El Punto de Entrada)
**Ruta:** `main.ts`
Es el **Composition Root**. El único lugar "sucio" que conoce todas las piezas y las ensambla.

*   Aquí decidimos qué base de datos usar.
*   Aquí inyectamos las dependencias.

---

## 🏆 ¿Por qué es un buen ejemplo?

La prueba de fuego de una buena arquitectura es la **Intercambiabilidad**.

En este proyecto, puedes abrir `main.ts` y cambiar una sola línea:

```typescript
// const repository = new InMemoryTaskRepository();
const repository = new FileTaskRepository();
```

Al hacer esto, **toda la aplicación cambia su mecanismo de persistencia**, pero:
1.  ❌ No tocaste el **Dominio**.
2.  ❌ No tocaste el **Caso de Uso**.
3.  ✅ El sistema sigue funcionando exactamente igual.

Esto demuestra que tu lógica de negocio está **protegida** y **desacoplada** de los detalles técnicos. Eso es Clean Architecture.

---

## 🚀 Cómo ejecutarlo

Necesitas tener `ts-node` instalado o usar `npx`:

```bash
# Ejecutar la aplicación
npx ts-node src/01-fundamentals/04-clean-architecture/main.ts
```
