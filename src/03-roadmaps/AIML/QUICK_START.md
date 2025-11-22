# 🚀 Quick Start - AI/ML Exercises

## Configuración Inicial (5 minutos)

### 1. Verificar Prerrequisitos

```bash
# Node.js 18+
node --version
# Debe mostrar v18.0.0 o superior

# npm 9+
npm --version
# Debe mostrar 9.0.0 o superior

# TypeScript
tsc --version
# Si no está instalado: npm install -g typescript ts-node
```

### 2. Crear package.json

```bash
cd src/claudeExerciseAIML
```

Crea un archivo `package.json` con este contenido:

```json
{
  "name": "ai-ml-exercises",
  "version": "1.0.0",
  "description": "Ejercicios prácticos de AI/ML con TypeScript",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint exercises/**/*.ts",
    "format": "prettier --write exercises/**/*.ts"
  },
  "dependencies": {
    "mathjs": "^12.0.0",
    "lodash": "^4.17.21",
    "csv-parser": "^3.0.0",
    "d3-array": "^3.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/jest": "^29.5.0",
    "@types/lodash": "^4.14.195",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "eslint": "^8.40.0",
    "prettier": "^2.8.8"
  }
}
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar TypeScript

Crea `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./exercises",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["exercises/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 5. Configurar Jest

Crea `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/exercises'],
  testMatch: ['**/*.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
};
```

---

## Tu Primer Ejercicio (10 minutos)

### Ejercicio 01: Datos y Preprocesamiento

```bash
# Ejecutar el ejercicio
ts-node exercises/01-datos-preprocesamiento/preprocessing.ts

# Ejecutar tests
npm test exercises/01-datos-preprocesamiento
```

### Qué Aprenderás

1. **Normalización Min-Max**: Escalar datos entre 0 y 1
2. **Normalización Z-score**: Centrar datos con media 0 y std 1
3. **One-Hot Encoding**: Convertir categorías a vectores binarios
4. **Train/Test Split**: Dividir datos para entrenamiento y validación

### Ejemplo Rápido

```typescript
import { normalize, trainTestSplit } from './preprocessing';

// Normalizar datos
const data = [1, 2, 3, 4, 5];
const normalized = normalize(data, 'min-max');
console.log(normalized); // [0, 0.25, 0.5, 0.75, 1]

// Dividir en train/test
const [train, test] = trainTestSplit(data, 0.8);
console.log(train.length); // 4
console.log(test.length);  // 1
```

---

## Estructura de Directorios

```
claudeExerciseAIML/
├── README.md                  # Roadmap completo
├── INDICE.md                  # Índice navegable
├── QUICK_START.md             # Esta guía
├── package.json               # Dependencias
├── tsconfig.json              # Config de TypeScript
├── jest.config.js             # Config de tests
└── exercises/
    ├── 01-datos-preprocesamiento/
    │   ├── README.md
    │   ├── preprocessing.ts
    │   └── preprocessing.test.ts
    ├── 02-estadistica-descriptiva/
    │   └── ...
    └── ... (20 ejercicios en total)
```

---

## Comandos Útiles

### Ejecutar un Ejercicio

```bash
# Ejercicio específico
ts-node exercises/01-datos-preprocesamiento/preprocessing.ts

# Con watch mode (recarga automática)
nodemon --exec ts-node exercises/01-datos-preprocesamiento/preprocessing.ts
```

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests de un ejercicio específico
npm test 01-datos-preprocesamiento

# Tests en modo watch
npm run test:watch

# Tests con coverage
npm test -- --coverage
```

### Debugging

```bash
# Con Node inspector
node --inspect-brk -r ts-node/register exercises/01-datos-preprocesamiento/preprocessing.ts

# Luego abre Chrome en: chrome://inspect
```

---

## Flujo de Trabajo Recomendado

### Para Cada Ejercicio

1. **Lee el README.md**
   ```bash
   cat exercises/01-datos-preprocesamiento/README.md
   ```

2. **Entiende el objetivo** - ¿Qué problema resuelve?

3. **Implementa el código** - Escribe en `{ejercicio}.ts`

4. **Ejecuta manualmente** - Verifica la salida
   ```bash
   ts-node exercises/01-datos-preprocesamiento/preprocessing.ts
   ```

5. **Ejecuta los tests** - Asegura corrección
   ```bash
   npm test 01-datos-preprocesamiento
   ```

6. **Experimenta** - Cambia parámetros, prueba casos extremos

7. **Toma notas** - Documenta tus aprendizajes en `notas.md`

---

## Tips para Aprender Efectivamente

### 1. No Copies y Pegues
Escribe el código manualmente. Esto refuerza el aprendizaje.

### 2. Experimenta con Parámetros
```typescript
// Prueba diferentes learning rates
const model = new LinearRegression({ learningRate: 0.01 });
const model2 = new LinearRegression({ learningRate: 0.1 });
```

### 3. Visualiza los Datos
Usa console.log, console.table para entender qué está pasando:
```typescript
console.table(dataset);
console.log('Weights:', model.weights);
```

### 4. Debugging Matemático
```typescript
console.log('Shape:', matrix.length, 'x', matrix[0].length);
console.log('Sum:', array.reduce((a, b) => a + b, 0));
```

### 5. Compara con Librerías
Después de implementar desde cero, compara con:
- TensorFlow.js
- ML.js
- Scikit-learn (Python) para validar resultados

---

## Troubleshooting

### Error: "Cannot find module 'mathjs'"
```bash
npm install mathjs
```

### Error: "ts-node: command not found"
```bash
npm install -g ts-node
# O usa: npx ts-node
```

### Error: "Jest encountered an unexpected token"
Verifica que `jest.config.js` tenga `preset: 'ts-jest'`

### Tests Fallan
```bash
# Ejecuta con más detalle
npm test -- --verbose

# Ejecuta un test específico
npm test -- -t "should normalize data"
```

### Gradientes Explotan (NaN)
- Reduce el learning rate
- Verifica la inicialización de pesos
- Usa gradient clipping

---

## Recursos Adicionales

### Documentación
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [MathJS Documentation](https://mathjs.org/docs/)

### Datasets para Practicar
- [UCI ML Repository](https://archive.ics.uci.edu/ml/index.php)
- [Kaggle Datasets](https://www.kaggle.com/datasets)
- [TensorFlow Datasets](https://www.tensorflow.org/datasets)

### Comunidades
- [r/MachineLearning](https://reddit.com/r/MachineLearning)
- [Papers with Code](https://paperswithcode.com/)
- [Towards Data Science](https://towardsdatascience.com/)

---

## Siguientes Pasos

Una vez completado el setup:

1. ✅ Lee [README.md](./README.md) para el roadmap completo
2. ✅ Usa [INDICE.md](./INDICE.md) para navegar ejercicios
3. ✅ Empieza con **Ejercicio 01** - Datos y Preprocesamiento
4. ✅ Completa ejercicios 01-05 antes de avanzar a algoritmos ML

---

**¡Estás listo para comenzar! 🚀**

```bash
ts-node exercises/01-datos-preprocesamiento/preprocessing.ts
```
