# 🚀 Quick Start Guide - Diseño de Sistemas e Integración de IA

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

### 1. Node.js y npm
```bash
# Verificar versión (requiere Node.js 20+)
node --version
npm --version

# Instalar desde https://nodejs.org/
```

### 2. Docker Desktop
```bash
# macOS
brew install --cask docker

# Linux
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Windows
# Descargar desde https://www.docker.com/products/docker-desktop

# Verificar instalación
docker --version
docker-compose --version
```

### 3. Git
```bash
# Verificar instalación
git --version

# Configurar
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

## 🎯 Setup Inicial (30 minutos)

### Paso 1: Crear Cuentas Necesarias

#### AWS Account (Free Tier)
```bash
# 1. Ir a https://aws.amazon.com/
# 2. Crear cuenta (requiere tarjeta de crédito)
# 3. Habilitar Free Tier
# 4. IMPORTANTE: Configurar billing alerts

# Instalar AWS CLI
# macOS:
brew install awscli

# Linux:
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verificar
aws --version

# Configurar credenciales
aws configure
# - AWS Access Key ID: [Tu Key]
# - AWS Secret Access Key: [Tu Secret]
# - Default region: us-east-1
# - Default output format: json
```

#### OpenAI Account
```bash
# 1. Ir a https://platform.openai.com/signup
# 2. Crear cuenta
# 3. Agregar método de pago
# 4. Generar API key: https://platform.openai.com/api-keys
# 5. IMPORTANTE: Configurar usage limits ($10-20/mes para empezar)
```

#### Pinecone Account (Vector DB)
```bash
# 1. Ir a https://www.pinecone.io/
# 2. Crear cuenta (Free tier disponible)
# 3. Crear API key
# 4. Anotar environment name
```

### Paso 2: Setup del Proyecto Local

```bash
# Crear directorio de trabajo
mkdir system-design-ai-learning
cd system-design-ai-learning

# Inicializar proyecto Node.js
npm init -y

# Instalar dependencias básicas
npm install express typescript ts-node @types/node @types/express
npm install dotenv axios redis ioredis
npm install winston  # logging
npm install -D nodemon

# Instalar dependencias de IA
npm install openai
npm install @aws-sdk/client-bedrock-runtime
npm install @pinecone-database/pinecone
npm install langchain

# TypeScript config
npx tsc --init

# Crear .env
touch .env
```

### Paso 3: Configurar Variables de Entorno

```bash
# .env
NODE_ENV=development
PORT=3000

# OpenAI
OPENAI_API_KEY=sk-...

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# Pinecone
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=gcp-starter

# Redis (local)
REDIS_URL=redis://localhost:6379

# PostgreSQL (local)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mydb
```

### Paso 4: Setup Local Stack con Docker

```bash
# Crear docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Prometheus para metrics
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus

  # Grafana para dashboards
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana

volumes:
  redis-data:
  postgres-data:
  prometheus-data:
  grafana-data:
EOF

# Iniciar servicios
docker-compose up -d

# Verificar que todo esté corriendo
docker-compose ps
```

## 🎓 Tu Primer Sistema: Simple Load Balancer

### Paso 1: Crear estructura del proyecto

```bash
mkdir -p src/01-fundamentos/building-blocks
cd src/01-fundamentos/building-blocks
```

### Paso 2: Implementar Load Balancer

```typescript
// src/01-fundamentos/building-blocks/01-load-balancer.ts

import express, { Request, Response } from 'express';

// Simular múltiples servers backend
const BACKEND_SERVERS = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
];

let currentServerIndex = 0;

// Load Balancer con Round Robin
class LoadBalancer {
  private servers: string[];
  private currentIndex: number;

  constructor(servers: string[]) {
    this.servers = servers;
    this.currentIndex = 0;
  }

  // Round Robin: distribuye requests equitativamente
  getNextServer(): string {
    const server = this.servers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.servers.length;
    return server;
  }

  // Health check (simplificado)
  async checkHealth(server: string): Promise<boolean> {
    try {
      const response = await fetch(`${server}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Load Balancer Server
const app = express();
const lb = new LoadBalancer(BACKEND_SERVERS);

app.get('*', async (req: Request, res: Response) => {
  const server = lb.getNextServer();
  console.log(`Routing request to: ${server}`);

  try {
    const response = await fetch(`${server}${req.path}`);
    const data = await response.text();
    res.send(`Response from ${server}: ${data}`);
  } catch (error) {
    res.status(503).send('Service Unavailable');
  }
});

app.listen(3000, () => {
  console.log('Load Balancer running on port 3000');
});
```

### Paso 3: Crear Backend Servers

```typescript
// src/01-fundamentos/building-blocks/backend-server.ts

import express from 'express';

function createBackendServer(port: number) {
  const app = express();

  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', server: `Server-${port}` });
  });

  app.get('*', (req, res) => {
    res.json({
      message: 'Hello from backend',
      server: `Server-${port}`,
      timestamp: new Date().toISOString(),
    });
  });

  app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
}

// Crear 3 servers
createBackendServer(3001);
createBackendServer(3002);
createBackendServer(3003);
```

### Paso 4: Probar el Load Balancer

```bash
# Terminal 1: Iniciar backend servers
ts-node src/01-fundamentos/building-blocks/backend-server.ts

# Terminal 2: Iniciar load balancer
ts-node src/01-fundamentos/building-blocks/01-load-balancer.ts

# Terminal 3: Hacer requests
curl http://localhost:3000/api/test
curl http://localhost:3000/api/test
curl http://localhost:3000/api/test
# Verás que cada request va a un server diferente (Round Robin)
```

## 🤖 Tu Primera Integración con LLM

### Paso 1: Crear cliente OpenAI simple

```typescript
// src/04-llm-integration/openai/01-basics/chat-completion.ts

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function simpleChat(userMessage: string) {
  console.log('User:', userMessage);

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that explains system design concepts.',
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  const assistantMessage = response.choices[0].message.content;
  console.log('Assistant:', assistantMessage);

  // Información útil
  console.log('\n--- Metadata ---');
  console.log('Model:', response.model);
  console.log('Tokens used:', response.usage);
  console.log('Cost estimate:', estimateCost(response.usage!));

  return assistantMessage;
}

function estimateCost(usage: { prompt_tokens: number; completion_tokens: number }) {
  // GPT-3.5-turbo pricing (aproximado)
  const PRICE_PER_1K_INPUT = 0.0005;
  const PRICE_PER_1K_OUTPUT = 0.0015;

  const inputCost = (usage.prompt_tokens / 1000) * PRICE_PER_1K_INPUT;
  const outputCost = (usage.completion_tokens / 1000) * PRICE_PER_1K_OUTPUT;

  return `$${(inputCost + outputCost).toFixed(6)}`;
}

// Ejemplo de uso
async function main() {
  await simpleChat('What is a load balancer and when should I use it?');

  console.log('\n---\n');

  await simpleChat('Explain the CAP theorem in simple terms.');
}

main();
```

### Paso 2: Probar

```bash
# Asegúrate de tener OPENAI_API_KEY en .env
ts-node src/04-llm-integration/openai/01-basics/chat-completion.ts
```

## 🎯 Tu Primer Sistema RAG (Retrieval Augmented Generation)

### Paso 1: Setup Pinecone

```typescript
// src/04-llm-integration/vector-db/03-rag/rag-simple.ts

import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const INDEX_NAME = 'quickstart-rag';

// 1. Crear embeddings
async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

// 2. Indexar documentos
async function indexDocuments(documents: { id: string; text: string }[]) {
  const index = pinecone.index(INDEX_NAME);

  for (const doc of documents) {
    const embedding = await createEmbedding(doc.text);

    await index.upsert([
      {
        id: doc.id,
        values: embedding,
        metadata: { text: doc.text },
      },
    ]);
  }

  console.log(`Indexed ${documents.length} documents`);
}

// 3. Buscar documentos relevantes
async function searchRelevantDocs(query: string, topK = 3) {
  const index = pinecone.index(INDEX_NAME);
  const queryEmbedding = await createEmbedding(query);

  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });

  return results.matches?.map(match => ({
    score: match.score,
    text: match.metadata?.text as string,
  })) || [];
}

// 4. RAG: Retrieval + Generation
async function ragQuery(userQuestion: string) {
  console.log('Question:', userQuestion);

  // Retrieve: buscar documentos relevantes
  const relevantDocs = await searchRelevantDocs(userQuestion);

  // Augment: construir contexto
  const context = relevantDocs
    .map((doc, i) => `[${i + 1}] ${doc.text}`)
    .join('\n\n');

  console.log('\n--- Retrieved Context ---');
  console.log(context);

  // Generate: generar respuesta con contexto
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Answer questions based on the provided context. If the context doesn\'t contain relevant information, say so.',
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion: ${userQuestion}`,
      },
    ],
    temperature: 0.3,
  });

  const answer = response.choices[0].message.content;
  console.log('\n--- Answer ---');
  console.log(answer);

  return answer;
}

// Ejemplo de uso
async function main() {
  // Crear índice (solo primera vez)
  // await pinecone.createIndex({
  //   name: INDEX_NAME,
  //   dimension: 1536, // text-embedding-3-small dimension
  //   metric: 'cosine',
  //   spec: {
  //     serverless: {
  //       cloud: 'aws',
  //       region: 'us-east-1',
  //     },
  //   },
  // });

  // Indexar documentos de ejemplo
  const docs = [
    {
      id: 'doc1',
      text: 'A load balancer distributes network traffic across multiple servers to ensure no single server becomes overwhelmed.',
    },
    {
      id: 'doc2',
      text: 'The CAP theorem states that a distributed system can only guarantee two of three properties: Consistency, Availability, and Partition tolerance.',
    },
    {
      id: 'doc3',
      text: 'Caching is a technique to store frequently accessed data in a faster storage layer (like Redis) to reduce database load.',
    },
  ];

  await indexDocuments(docs);

  // Hacer queries
  await ragQuery('What is a load balancer?');
  console.log('\n---\n');
  await ragQuery('Explain CAP theorem');
}

main();
```

## ✅ Checklist de Setup Inicial

- [ ] Node.js 20+ instalado
- [ ] Docker Desktop instalado y corriendo
- [ ] Git configurado
- [ ] Cuenta AWS creada
- [ ] Cuenta OpenAI creada y API key generada
- [ ] Cuenta Pinecone creada
- [ ] Billing alerts configuradas (AWS y OpenAI)
- [ ] Proyecto local inicializado
- [ ] .env configurado con todas las keys
- [ ] Docker compose services corriendo
- [ ] Load balancer funcionando
- [ ] Primera llamada a OpenAI exitosa
- [ ] RAG básico funcionando

## 📚 Siguientes Pasos

### Semana 1: Fundamentos
1. Lee `01-fundamentos/conceptos-basicos/README.md`
2. Implementa todos los building blocks:
   - Load balancer ✅
   - Redis cache
   - Message queue simple
   - Circuit breaker
3. Diseña tu primer sistema en whiteboard
4. Calcula capacity planning para 1M usuarios

### Semana 2-3: Scaling
1. Setup PostgreSQL replication
2. Implementa sharding strategy
3. Crea API con rate limiting
4. Setup monitoring con Prometheus + Grafana

### Semana 4: LLM Basics
1. Experimenta con diferentes modelos (GPT-4, Claude)
2. Practica prompt engineering
3. Implementa conversation memory
4. Calcula costos de diferentes scenarios

## 💡 Tips para Empezar

### 1. Billing Alerts (CRÍTICO)

```bash
# AWS Budget Alert
# 1. AWS Console → Billing → Budgets → Create Budget
# 2. Set alerts: $5, $10, $25, $50

# OpenAI Usage Limits
# 1. Platform → Settings → Limits
# 2. Set hard limit: $20/month (para empezar)
```

### 2. Cost Optimization desde el Inicio

```typescript
// Siempre usa el modelo más barato que funcione
// GPT-3.5-turbo (más barato) para la mayoría de casos
// GPT-4 solo cuando realmente se necesita

const MODEL_COSTS = {
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }, // per 1K tokens
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4': { input: 0.03, output: 0.06 },
};

// Implementa caching desde el inicio
// Una cache hit puede ahorrarte $0.01+ por request
```

### 3. Local Development

```bash
# Usa servicios locales cuando sea posible
# - PostgreSQL local (no RDS)
# - Redis local (no ElastiCache)
# - LocalStack para simular AWS services

docker-compose up redis postgres
```

### 4. Incremental Learning

```bash
# No intentes aprenderlo todo a la vez
# Orden recomendado:

# Semana 1-2: System Design basics
# Semana 3-4: Database y caching
# Semana 5-6: Microservices
# Semana 7-8: LLM integration
# Semana 9+: Advanced topics
```

## 🐛 Troubleshooting Común

### Error: "OpenAI API key invalid"
```bash
# Verifica .env
cat .env | grep OPENAI_API_KEY

# Regenera key si es necesario
# https://platform.openai.com/api-keys
```

### Error: "Cannot connect to Redis"
```bash
# Verifica que Docker está corriendo
docker ps

# Reinicia servicios
docker-compose restart redis
```

### Error: "Rate limit exceeded" (OpenAI)
```bash
# Implementa retry logic
# Reduce requests per minute
# Usa modelos más baratos
```

### Error: High costs
```bash
# Revisa usage
# OpenAI: https://platform.openai.com/usage
# AWS: Billing dashboard

# Implementa:
# - Caching agresivo
# - Token limits
# - Rate limiting
# - Use cheaper models
```

## 📖 Recursos Adicionales

### Documentación
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [AWS Bedrock Docs](https://docs.aws.amazon.com/bedrock/)
- [Pinecone Docs](https://docs.pinecone.io/)
- [LangChain.js Docs](https://js.langchain.com/docs/)

### Comunidades
- [r/MachineLearning](https://reddit.com/r/MachineLearning)
- [LangChain Discord](https://discord.gg/langchain)
- [AI Builders Discord](https://discord.gg/ai)

### Learning Resources
- [ByteByteGo YouTube](https://www.youtube.com/@ByteByteGo)
- [System Design Primer](https://github.com/donnemartin/system-design-primer)
- [OpenAI Cookbook](https://github.com/openai/openai-cookbook)

---

**¡Estás listo para comenzar tu viaje en System Design e IA!** 🚀

Empieza con el [README principal](./README.md) y sigue el roadmap paso a paso.

**Pro tip**: No te preocupes por entender todo perfectamente desde el inicio. La clave es practicar constantemente y construir proyectos reales.

**Recuerda**: Configura billing alerts AHORA. Es el paso más importante.
