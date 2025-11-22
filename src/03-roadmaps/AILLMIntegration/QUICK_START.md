# 🚀 Quick Start Guide - Integración de AI/LLMs en Node.js

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

### 1. Node.js y npm
```bash
# Verificar versión (requiere Node.js 20+)
node --version
npm --version

# Instalar desde https://nodejs.org/
```

### 2. TypeScript
```bash
# Instalar TypeScript globalmente
npm install -g typescript

# Verificar instalación
tsc --version
```

### 3. Editor de Código
- **Visual Studio Code** (recomendado)
- Extensiones útiles:
  - TypeScript
  - ESLint
  - Prettier
  - REST Client

## 🔑 Obtener API Keys

### OpenAI
```bash
1. Visita https://platform.openai.com/signup
2. Crea una cuenta
3. Ve a https://platform.openai.com/api-keys
4. Click en "Create new secret key"
5. Copia la key (solo se muestra una vez)
6. Configura billing: https://platform.openai.com/account/billing
```

### Anthropic (Claude)
```bash
1. Visita https://console.anthropic.com/
2. Crea una cuenta
3. Ve a API Keys en el dashboard
4. Click en "Create Key"
5. Copia la key
6. Configura billing si es necesario
```

### Google AI Studio (Gemini)
```bash
1. Visita https://makersuite.google.com/app/apikey
2. Inicia sesión con tu cuenta Google
3. Click en "Create API Key"
4. Selecciona o crea un proyecto de Google Cloud
5. Copia la key
```

## 🎯 Tu Primera Integración con AI

### Paso 1: Crear proyecto
```bash
# Crear directorio
mkdir ai-integration-demo
cd ai-integration-demo

# Inicializar proyecto Node.js
npm init -y

# Inicializar TypeScript
tsc --init
```

### Paso 2: Instalar dependencias
```bash
# Instalar SDKs de AI
npm install openai @anthropic-ai/sdk @google/generative-ai

# Instalar dependencias de desarrollo
npm install -D typescript @types/node tsx dotenv

# Instalar utilidades
npm install zod
```

### Paso 3: Configurar TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Paso 4: Configurar variables de entorno
```bash
# Crear archivo .env
touch .env

# Agregar al .gitignore
echo ".env" >> .gitignore
```

```env
# .env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

### Paso 5: Primera integración con OpenAI
```typescript
// src/openai-example.ts
import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  console.log('🤖 Testing OpenAI integration...\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: 'Explain what is a Large Language Model in one sentence.',
      },
    ],
    temperature: 0.7,
    max_tokens: 100,
  });

  const response = completion.choices[0].message.content;

  console.log('Response:', response);
  console.log('\nTokens used:', completion.usage?.total_tokens);
  console.log('Model:', completion.model);
}

main().catch(console.error);
```

### Paso 6: Ejecutar
```bash
# Agregar script al package.json
# "scripts": {
#   "dev": "tsx src/openai-example.ts"
# }

npm run dev
```

**Salida esperada:**
```
🤖 Testing OpenAI integration...

Response: A Large Language Model (LLM) is an AI system trained on vast amounts of text data that can understand and generate human-like text.

Tokens used: 45
Model: gpt-4o-mini-2024-07-18
```

## 🔥 Ejemplos Adicionales

### Ejemplo con Anthropic Claude
```typescript
// src/anthropic-example.ts
import Anthropic from '@anthropic-ai/sdk';
import 'dotenv/config';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main() {
  console.log('🤖 Testing Anthropic Claude integration...\n');

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 100,
    messages: [
      {
        role: 'user',
        content: 'Explain what is a Large Language Model in one sentence.',
      },
    ],
  });

  const response = message.content[0];

  if (response.type === 'text') {
    console.log('Response:', response.text);
    console.log('\nTokens used:', message.usage.input_tokens + message.usage.output_tokens);
    console.log('Model:', message.model);
  }
}

main().catch(console.error);
```

### Ejemplo con Google Gemini
```typescript
// src/google-example.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

async function main() {
  console.log('🤖 Testing Google Gemini integration...\n');

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent(
    'Explain what is a Large Language Model in one sentence.'
  );

  const response = result.response;
  const text = response.text();

  console.log('Response:', text);
  console.log('\nModel:', 'gemini-1.5-flash');
}

main().catch(console.error);
```

### Ejemplo con Streaming
```typescript
// src/streaming-example.ts
import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  console.log('🤖 Testing streaming...\n');

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: 'Write a short poem about AI.',
      },
    ],
    stream: true,
  });

  process.stdout.write('Response: ');

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);
  }

  console.log('\n\nStreaming completed!');
}

main().catch(console.error);
```

### Ejemplo con Function Calling
```typescript
// src/function-calling-example.ts
import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Función simulada
function getCurrentWeather(location: string): string {
  return JSON.stringify({
    location,
    temperature: 22,
    condition: 'sunny',
  });
}

async function main() {
  console.log('🤖 Testing function calling...\n');

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: 'What is the weather in San Francisco?',
    },
  ];

  const tools: OpenAI.Chat.ChatCompletionTool[] = [
    {
      type: 'function',
      function: {
        name: 'get_current_weather',
        description: 'Get the current weather in a given location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g. San Francisco, CA',
            },
          },
          required: ['location'],
        },
      },
    },
  ];

  // Primera llamada
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    tools,
    tool_choice: 'auto',
  });

  const responseMessage = response.choices[0].message;
  const toolCalls = responseMessage.tool_calls;

  if (toolCalls) {
    console.log('AI wants to call function:', toolCalls[0].function.name);

    messages.push(responseMessage);

    // Ejecutar función
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      const functionResponse = getCurrentWeather(functionArgs.location);

      messages.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        content: functionResponse,
      });
    }

    // Segunda llamada con resultado de la función
    const secondResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
    });

    console.log('\nFinal response:', secondResponse.choices[0].message.content);
  }
}

main().catch(console.error);
```

## 🛠️ Proyecto de Ejemplo Completo: Simple Chatbot

### Estructura del proyecto
```
chatbot-demo/
├── src/
│   ├── index.ts
│   ├── chat.ts
│   └── types.ts
├── .env
├── .gitignore
├── package.json
└── tsconfig.json
```

### types.ts
```typescript
export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}
```

### chat.ts
```typescript
import OpenAI from 'openai';
import { Message, ChatConfig } from './types';

export class ChatBot {
  private openai: OpenAI;
  private messages: Message[] = [];
  private config: ChatConfig;

  constructor(apiKey: string, config: Partial<ChatConfig> = {}) {
    this.openai = new OpenAI({ apiKey });
    this.config = {
      model: config.model || 'gpt-4o-mini',
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens || 500,
    };
  }

  setSystemPrompt(prompt: string): void {
    this.messages = [
      {
        role: 'system',
        content: prompt,
      },
    ];
  }

  async chat(userMessage: string): Promise<string> {
    // Agregar mensaje del usuario
    this.messages.push({
      role: 'user',
      content: userMessage,
    });

    // Llamar a OpenAI
    const completion = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: this.messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
    });

    const assistantMessage = completion.choices[0].message.content || '';

    // Agregar respuesta del asistente
    this.messages.push({
      role: 'assistant',
      content: assistantMessage,
    });

    return assistantMessage;
  }

  getHistory(): Message[] {
    return this.messages;
  }

  clearHistory(): void {
    const systemMessage = this.messages.find((m) => m.role === 'system');
    this.messages = systemMessage ? [systemMessage] : [];
  }
}
```

### index.ts
```typescript
import { ChatBot } from './chat';
import 'dotenv/config';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const chatbot = new ChatBot(process.env.OPENAI_API_KEY!);

  chatbot.setSystemPrompt(
    'You are a helpful AI assistant. Be concise and friendly.'
  );

  console.log('🤖 Chatbot initialized! Type "exit" to quit.\n');

  const askQuestion = () => {
    rl.question('You: ', async (input) => {
      const userInput = input.trim();

      if (userInput.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        rl.close();
        return;
      }

      if (!userInput) {
        askQuestion();
        return;
      }

      try {
        const response = await chatbot.chat(userInput);
        console.log(`\nAssistant: ${response}\n`);
      } catch (error) {
        console.error('Error:', error);
      }

      askQuestion();
    });
  };

  askQuestion();
}

main().catch(console.error);
```

### Ejecutar el chatbot
```bash
npm run dev
```

## 💡 Tips Iniciales

### 1. Monitorea el uso de tokens
```typescript
const completion = await openai.chat.completions.create({...});
console.log('Tokens:', completion.usage);
```

### 2. Maneja errores apropiadamente
```typescript
try {
  const response = await openai.chat.completions.create({...});
} catch (error) {
  if (error instanceof OpenAI.APIError) {
    console.error('Status:', error.status);
    console.error('Message:', error.message);
  }
}
```

### 3. Usa variables de entorno
```typescript
// ❌ Nunca hardcodees las keys
const openai = new OpenAI({ apiKey: 'sk-...' });

// ✅ Usa variables de entorno
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

### 4. Configura timeouts
```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 segundos
  maxRetries: 2,
});
```

### 5. Configura billing alerts

**OpenAI:**
1. Ve a https://platform.openai.com/account/billing/limits
2. Configura hard limit (ej: $10/mes)
3. Configura email alerts

**Anthropic:**
1. Ve a https://console.anthropic.com/settings/limits
2. Configura usage limits

## 🐛 Troubleshooting Común

### Error: "Invalid API Key"
```bash
# Verifica que la key esté correctamente en .env
cat .env | grep API_KEY

# Verifica que dotenv esté cargando
console.log(process.env.OPENAI_API_KEY); // No debería ser undefined
```

### Error: "Rate limit exceeded"
```typescript
// Implementa retry con exponential backoff
import { setTimeout } from 'timers/promises';

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      console.log(`Retrying in ${delay}ms...`);
      await setTimeout(delay);
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Error: Module not found
```bash
# Verifica que las dependencias estén instaladas
npm install

# Verifica package.json
npm list openai @anthropic-ai/sdk
```

### Error: TypeScript compilation
```bash
# Limpia y recompila
rm -rf dist
npm run build

# O usa tsx para desarrollo
npm install -D tsx
npx tsx src/index.ts
```

## 📖 Recursos Adicionales

- [OpenAI Documentation](https://platform.openai.com/docs)
- [Anthropic Docs](https://docs.anthropic.com)
- [Google AI Studio](https://ai.google.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ✅ Checklist Inicial

- [ ] Node.js 20+ instalado
- [ ] TypeScript configurado
- [ ] API keys obtenidas (OpenAI, Anthropic, Google)
- [ ] Billing configurado y alerts activas
- [ ] Primera llamada a OpenAI exitosa
- [ ] Primera llamada a Claude exitosa
- [ ] Streaming funcionando
- [ ] Function calling probado
- [ ] Chatbot básico funcionando
- [ ] Manejo de errores implementado

---

**¡Estás listo para comenzar tu viaje en AI/LLM Integration!** 🚀

Empieza con el [README principal](./README.md) y sigue el roadmap nivel por nivel.

## 🎯 Próximos Pasos

1. Lee el [README completo](./README.md)
2. Revisa el [INDICE](./INDICE.md) para ver todos los temas
3. Experimenta con diferentes prompts
4. Compara diferentes modelos (GPT vs Claude vs Gemini)
5. Mide tokens y costos
6. Implementa los ejemplos del Nivel 2

**Pro tip**: Usa `gpt-4o-mini` y `claude-3-5-haiku` durante desarrollo para minimizar costos. Reserva `gpt-4o` y `claude-3-5-sonnet` para casos de uso que realmente requieran máxima calidad.
