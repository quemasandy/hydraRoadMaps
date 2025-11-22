# 📑 Índice Completo - Integración de AI/LLMs en Node.js Backend

## 🎯 Inicio Rápido
- [README Principal](./README.md) - Roadmap completo de aprendizaje
- [Quick Start Guide](./QUICK_START.md) - Guía de inicio rápido

## 📚 Contenido por Nivel

### Nivel 1: Fundamentos
**Ubicación:** `01-fundamentos/`

#### Conceptos Básicos de AI/LLMs
- `conceptos-ai-llms/README.md` - ¿Qué son los LLMs? Arquitectura, modelos disponibles
- `conceptos-ai-llms/comparacion-modelos.md` - GPT vs Claude vs Gemini

#### Setup y Primeras Integraciones
- `setup/01-environment.ts` - Configuración de entorno Node.js + TypeScript
- `setup/02-api-keys.ts` - Gestión segura de API keys
- `setup/03-sdks.ts` - Instalación y configuración de SDKs

#### Primera Integración
- `primera-integracion/01-openai-basic.ts` - Primera llamada a OpenAI
  - Chat completions básico
  - Manejo de errores
  - Tipado TypeScript

- `primera-integracion/02-anthropic-basic.ts` - Primera llamada a Claude
  - Messages API
  - System prompts
  - Streaming básico

- `primera-integracion/03-google-basic.ts` - Gemini integration
  - Generative AI setup
  - Multi-modal básico

- `primera-integracion/04-comparison.ts` - Comparación de los tres providers
  - Latencia
  - Calidad
  - Costos

---

### Nivel 2: Integraciones Básicas
**Ubicación:** `02-integraciones-basicas/`

#### REST API con AI
- `rest-api/01-express-setup.ts` - Setup Express con TypeScript
- `rest-api/02-chat-endpoint.ts` - Endpoint de chat
  - Request validation
  - Response formatting
  - Error handling

- `rest-api/03-summarize-endpoint.ts` - Endpoint de summarization
- `rest-api/04-classify-endpoint.ts` - Endpoint de clasificación
- `rest-api/05-extract-endpoint.ts` - Extracción de entidades

#### Prompt Engineering
- `prompts/01-basic-prompting.ts` - Prompting básico
  - Estructura de prompts
  - System vs user messages

- `prompts/02-few-shot.ts` - Few-shot learning
  - Examples en prompts
  - Template patterns

- `prompts/03-chain-of-thought.ts` - Chain-of-Thought prompting
  - Reasoning step by step
  - Structured thinking

- `prompts/04-prompt-library.ts` - Biblioteca de prompts reutilizables
  - Template system
  - Variables dinámicas

#### Embeddings y Búsqueda Semántica
- `embeddings/01-generate-embeddings.ts` - Generar embeddings
  - OpenAI text-embedding-3-small
  - Batch processing

- `embeddings/02-vector-db-setup.ts` - Setup Pinecone/Qdrant
  - Crear índice
  - Configuración

- `embeddings/03-semantic-search.ts` - Búsqueda semántica básica
  - Indexar documentos
  - Query y retrieval
  - Similarity scoring

- `embeddings/04-hybrid-search.ts` - Hybrid search (keyword + semantic)

#### Function Calling / Tool Use
- `function-calling/01-openai-functions.ts` - OpenAI function calling
  - Definir functions
  - JSON schema
  - Execution

- `function-calling/02-anthropic-tools.ts` - Anthropic tool use
  - Tool definitions
  - Multi-tool usage

- `function-calling/03-weather-bot.ts` - Weather bot con API calls
  - Real API integration
  - Tool chaining

- `function-calling/04-calculator-agent.ts` - Calculator con funciones
  - Math operations
  - Validation

#### Streaming
- `streaming/01-sse-chat.ts` - Server-Sent Events chat
  - Streaming completions
  - Partial updates

- `streaming/02-websocket-chat.ts` - WebSocket integration
  - Bidirectional communication
  - Real-time updates

---

### Nivel 3: Orquestación y Pipelines
**Ubicación:** `03-orquestacion-pipelines/`

#### LangChain Basics
- `langchain-basics/01-setup.ts` - LangChain setup
  - Installation
  - Configuration

- `langchain-basics/02-simple-chain.ts` - Primera chain
  - LLMChain básica
  - Prompt template

- `langchain-basics/03-sequential-chain.ts` - Sequential chains
  - Multi-step processing
  - Chain composition

- `langchain-basics/04-memory.ts` - Memory systems
  - ConversationBufferMemory
  - Persistent chat history

- `langchain-basics/05-output-parsers.ts` - Output parsers
  - Structured outputs
  - JSON parsing

#### LangChain Agents
- `langchain-agents/01-react-agent.ts` - ReAct agent
  - Reasoning + Acting
  - Tool usage

- `langchain-agents/02-custom-tools.ts` - Custom tools
  - Tool definitions
  - Integration

- `langchain-agents/03-research-agent.ts` - Research agent
  - Wikipedia + Calculator
  - Multi-tool orchestration

#### Document Processing
- `documents/01-loaders.ts` - Document loaders
  - PDF, CSV, JSON, TXT
  - Web scraping

- `documents/02-splitters.ts` - Text splitters
  - RecursiveCharacterTextSplitter
  - Chunk optimization

- `documents/03-transformers.ts` - Document transformers
  - Metadata extraction
  - Enrichment pipeline

#### Multi-Model Orchestration
- `multi-model/01-router.ts` - Model router
  - Dynamic selection
  - Cost optimization

- `multi-model/02-ensemble.ts` - Ensemble patterns
  - Majority voting
  - Parallel execution

- `multi-model/03-specialized-pipeline.ts` - Pipeline heterogéneo
  - GPT-4 + Claude + Gemini
  - Task-specific routing

---

### Nivel 4: RAG y Conocimiento Empresarial
**Ubicación:** `04-rag-conocimiento/`

#### RAG Básico
- `rag-basico/01-simple-rag.ts` - RAG básico
  - Indexing
  - Retrieval
  - Generation

- `rag-basico/02-indexing-pipeline.ts` - Pipeline de indexación
  - Document ingestion
  - Chunking
  - Embedding + storage

- `rag-basico/03-retrieval-strategies.ts` - Estrategias de retrieval
  - Similarity search
  - MMR
  - Hybrid search

- `rag-basico/04-qa-system.ts` - Q&A system con fuentes
  - Citation
  - Source attribution

#### Advanced RAG
- `rag-avanzado/01-query-transformation.ts` - Query transformation
  - Query rewriting
  - Multi-query
  - HyDE

- `rag-avanzado/02-contextual-compression.ts` - Context compression
  - Relevant extraction
  - Redundancy removal

- `rag-avanzado/03-self-query.ts` - Self-query retrieval
  - Metadata filtering
  - Structured queries

- `rag-avanzado/04-conversational-rag.ts` - Conversational RAG
  - Chat history
  - Follow-up handling

#### Knowledge Bases
- `knowledge-bases/01-doc-management.ts` - Document management
  - Ingestion pipelines
  - Versioning
  - Updates

- `knowledge-bases/02-multi-source.ts` - Multi-source RAG
  - Docs + DBs + APIs
  - Unified retrieval

- `knowledge-bases/03-access-control.ts` - Access control
  - Permissions
  - Security

#### Evaluation
- `evaluation/01-metrics.ts` - RAG metrics
  - Retrieval accuracy
  - Answer quality
  - Latency

- `evaluation/02-testing.ts` - Testing strategies
  - Test datasets
  - A/B testing

- `evaluation/03-optimization.ts` - Optimization
  - Chunk size tuning
  - Caching

---

### Nivel 5: Producción y Escalabilidad
**Ubicación:** `05-produccion-escalabilidad/`

#### Arquitectura
- `arquitectura/01-system-design.ts` - Diseño de sistema
  - Microservices pattern
  - API Gateway

- `arquitectura/02-async-processing.ts` - Async processing
  - BullMQ queues
  - Background jobs

- `arquitectura/03-caching.ts` - Caching strategies
  - Response caching
  - Redis integration

- `arquitectura/04-rate-limiting.ts` - Rate limiting
  - User quotas
  - Throttling

#### Observability
- `observabilidad/01-logging.ts` - Logging system
  - Structured logs
  - Winston/Pino

- `observabilidad/02-metrics.ts` - Metrics
  - Token tracking
  - Cost analytics
  - Prometheus

- `observabilidad/03-tracing.ts` - Distributed tracing
  - OpenTelemetry
  - Request flows

- `observabilidad/04-alerting.ts` - Alerting
  - Error alerts
  - Cost thresholds

#### Cost Optimization
- `cost-optimization/01-analysis.ts` - Cost analysis
  - Usage tracking
  - Attribution

- `cost-optimization/02-strategies.ts` - Optimization strategies
  - Model selection
  - Prompt compression
  - Caching

- `cost-optimization/03-budget-management.ts` - Budget management
  - Per-user budgets
  - Enforcement

#### Security
- `security/01-api-security.ts` - API security
  - Authentication
  - Authorization

- `security/02-data-privacy.ts` - Data privacy
  - PII detection
  - Anonymization

- `security/03-content-moderation.ts` - Content moderation
  - Input/output filtering
  - Moderation API

- `security/04-audit.ts` - Audit system
  - Audit trails
  - Compliance

#### Testing
- `testing/01-unit-tests.ts` - Unit testing
  - Mock LLM responses
  - Jest setup

- `testing/02-integration-tests.ts` - Integration testing
  - E2E flows
  - Real APIs

- `testing/03-cicd.ts` - CI/CD pipeline
  - GitHub Actions
  - Automation

---

### Nivel 6: AI Avanzado y Agentes
**Ubicación:** `06-ai-avanzado-agentes/`

#### Agentes Autónomos
- `agentes-autonomos/01-react-agent.ts` - ReAct agent
  - Reason + Act loop
  - Tool selection

- `agentes-autonomos/02-plan-execute.ts` - Plan-and-Execute
  - Planning phase
  - Execution phase

- `agentes-autonomos/03-multi-agent.ts` - Multi-agent system
  - Agent collaboration
  - AutoGen integration

- `agentes-autonomos/04-agent-tools.ts` - Advanced tools
  - Code execution
  - Web browsing
  - DB queries

- `agentes-autonomos/05-agent-memory.ts` - Agent memory
  - Short/long-term
  - Memory consolidation

#### Fine-tuning
- `fine-tuning/01-when-to-finetune.ts` - Evaluation framework
  - Use case analysis

- `fine-tuning/02-openai-finetuning.ts` - Fine-tuning OpenAI
  - Data preparation
  - Training process

- `fine-tuning/03-prompt-optimization.ts` - Prompt optimization
  - DSPy framework
  - Auto-optimization

#### Multimodal
- `multimodal/01-vision.ts` - Vision APIs
  - GPT-4 Vision
  - Claude Vision
  - Image understanding

- `multimodal/02-audio.ts` - Audio processing
  - Whisper (STT)
  - TTS integration

- `multimodal/03-multimodal-rag.ts` - Multimodal RAG
  - Image + text retrieval
  - Video understanding

#### Specialized Use Cases
- `specialized/01-code-gen.ts` - Code generation
  - Code completion
  - Code review

- `specialized/02-text-to-sql.ts` - Data analysis
  - SQL generation
  - BI assistant

- `specialized/03-content-gen.ts` - Content generation
  - Blog posts
  - Marketing copy

#### Emerging Tech
- `emerging/01-advanced-reasoning.ts` - Advanced reasoning
  - OpenAI o1 integration
  - Self-verification

- `emerging/02-orchestration-platforms.ts` - AI platforms
  - LangSmith
  - Weights & Biases

- `emerging/03-local-models.ts` - Local models
  - Ollama setup
  - On-premise deployment

---

## 🛠️ Archivos de Configuración

- `package.json.example` - Dependencias y scripts
- `tsconfig.json.example` - TypeScript configuration
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore patterns
- `docker-compose.yml.example` - Docker setup con vector DB

---

## 📊 Progreso Recomendado

### Semanas 1-2: Fundamentos
✅ Entender conceptos de LLMs
✅ Configurar entorno
✅ Primera llamada a APIs
✅ Comparar providers

### Semanas 3-5: Integraciones Básicas
✅ REST API con AI
✅ Prompt engineering
✅ Embeddings y búsqueda
✅ Function calling

### Semanas 6-9: Orquestación
✅ LangChain basics
✅ Agents simples
✅ Document processing
✅ Multi-model orchestration

### Semanas 10-14: RAG
✅ RAG básico
✅ Advanced RAG
✅ Knowledge bases
✅ Evaluation y optimization

### Semanas 15-20: Producción
✅ Arquitectura escalable
✅ Observability
✅ Cost optimization
✅ Security
✅ Testing y CI/CD

### Semanas 21-30: AI Avanzado
✅ Agentes autónomos
✅ Fine-tuning
✅ Multimodal
✅ Specialized use cases
✅ Proyecto final

---

## 🎯 Proyecto Final Sugerido

**Plataforma de AI Empresarial**

Implementa:
- ✅ Chat conversacional con RAG
- ✅ Multi-LLM orchestration
- ✅ Document Q&A system
- ✅ Code review assistant
- ✅ Data analysis agent
- ✅ Content generation
- ✅ Function calling para integraciones
- ✅ Streaming responses
- ✅ Admin dashboard
- ✅ Cost tracking
- ✅ Security y compliance
- ✅ CI/CD completo
- ✅ Monitoring y alertas

---

## 📖 Próximos Pasos

1. Empieza con [QUICK_START.md](./QUICK_START.md)
2. Sigue el [README principal](./README.md) nivel por nivel
3. Obtén API keys de OpenAI, Anthropic, Google
4. Configura billing alerts
5. Implementa ejercicios de cada carpeta
6. Construye proyectos incrementales
7. Comparte tu progreso en GitHub

---

## 💡 Recursos Adicionales

### APIs y SDKs
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Anthropic API Docs](https://docs.anthropic.com/claude/reference/)
- [Google AI Studio](https://ai.google.dev/)
- [LangChain Docs](https://js.langchain.com/docs/)

### Herramientas
- [Ollama](https://ollama.ai/) - Local LLMs
- [Pinecone](https://www.pinecone.io/) - Vector database
- [Qdrant](https://qdrant.tech/) - Vector search
- [LangSmith](https://smith.langchain.com/) - Monitoring

### Comunidades
- [LangChain Discord](https://discord.gg/langchain)
- [OpenAI Developer Forum](https://community.openai.com/)
- [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/)

---

**¡Buena suerte en tu aprendizaje de AI/LLM Integration con Node.js!** 🚀
