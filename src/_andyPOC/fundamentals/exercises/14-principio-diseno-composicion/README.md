# Principio de diseño por composición · Ejercicio

**Objetivo:** preferir composición sobre herencia para extender capacidades en tiempo de ejecución.

## Escenario
Un editor de texto necesita habilitar o deshabilitar funciones (autoguardado, corrección ortográfica, exportar a PDF). Con herencia tendrías que crear clases como `AutoSaveSpellCheckPdfEditor`.

## Instrucciones
1. Define una interfaz `EditorFeature` con método `apply(text: string): string`.
2. Implementa funciones concretas: `AutoSaveFeature`, `SpellCheckFeature`, `PdfExportFeature`.
3. Crea una clase `TextEditor` que mantenga una lista de features y las ejecute en orden.
4. Demuestra cómo crear instancias con combinaciones distintas sin heredar nuevas clases.

```typescript
interface EditorFeature {
  apply(text: string): string;
}

class AutoSaveFeature implements EditorFeature {
  apply(text: string) {
    console.log("Guardando automáticamente...");
    return text;
  }
}

class SpellCheckFeature implements EditorFeature {
  apply(text: string) {
    console.log("Chequeando ortografía...");
    return text;
  }
}

class PdfExportFeature implements EditorFeature {
  apply(text: string) {
    console.log("Exportando a PDF...");
    return text;
  }
}

class TextEditor {
  constructor(private features: EditorFeature[]) {}

  edit(text: string) {
    return this.features.reduce((acc, feature) => feature.apply(acc), text);
  }
}

const basicEditor = new TextEditor([new AutoSaveFeature()]);
const fullEditor = new TextEditor([
  new AutoSaveFeature(),
  new SpellCheckFeature(),
  new PdfExportFeature(),
]);

basicEditor.edit("Hola");
fullEditor.edit("Hola");
```

## Resultado esperado
- No necesitas herencias combinatorias para cada variante de editor.
- Puedes añadir nuevas features creando objetos y agregándolos a la lista.
- Refuerza la idea de que la composición permite cambios dinámicos y locales.
