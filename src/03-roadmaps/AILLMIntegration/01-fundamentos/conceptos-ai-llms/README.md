# Conceptos Básicos de AI/LLMs

## ¿Qué son los Large Language Models (LLMs)?

Los Large Language Models (LLMs) son modelos de inteligencia artificial entrenados con enormes cantidades de texto que pueden entender y generar lenguaje humano de manera natural y coherente.

### Arquitectura Básica

- **Transformers**: Arquitectura fundamental basada en mecanismos de atención
- **Attention Mechanism**: Permite al modelo enfocarse en partes relevantes del input
- **Tokens**: Unidades básicas de procesamiento (palabras, sub-palabras, o caracteres)
- **Context Window**: Cantidad máxima de tokens que el modelo puede procesar a la vez
- **Parameters**: Número de parámetros entrenables (ej: GPT-4 tiene billones)

### Principales Modelos

#### 1. **OpenAI GPT**
- **GPT-4o**: Modelo más avanzado, multimodal (texto + imágenes)
- **GPT-4o-mini**: Versión más rápida y económica
- **o1-preview**: Modelo especializado en razonamiento complejo
- **Context Window**: 128K tokens
- **Pricing**: ~$5/1M input tokens (gpt-4o-mini)

#### 2. **Anthropic Claude**
- **Claude 3.5 Sonnet**: Balance óptimo entre calidad y velocidad
- **Claude 3.5 Haiku**: Más rápido y económico
- **Claude 3 Opus**: Máxima calidad (pero más lento)
- **Context Window**: 200K tokens
- **Pricing**: ~$3/1M input tokens (Haiku)

#### 3. **Google Gemini**
- **Gemini 1.5 Pro**: Modelo avanzado
- **Gemini 1.5 Flash**: Versión rápida
- **Context Window**: Hasta 2M tokens
- **Pricing**: Tier gratuito generoso

#### 4. **Meta Llama**
- **Llama 3.2**: Modelos open source (1B, 3B, 11B, 90B)
- **Multimodal**: Soporte para imágenes
- **Deployment**: Descargable para uso local
- **Pricing**: Gratuito (hosting propio)

## Conceptos Clave

### Tokens
```
Texto: "Hello, world!"
Tokens: ["Hello", ",", " world", "!"]
Aprox: ~1 token por ~4 caracteres en inglés
```

### Temperature (0.0 - 2.0)
- **0.0**: Determinístico, siempre la misma respuesta
- **0.7**: Balance creatividad/consistencia (default)
- **1.5+**: Muy creativo, impredecible

### Top-p (Nucleus Sampling)
- **0.1**: Solo las palabras más probables
- **0.9**: Mayor variedad (default)
- **1.0**: Todas las opciones posibles

### Max Tokens
- Límite de tokens en la respuesta
- No confundir con context window

## Casos de Uso en Backend

### 1. Clasificación
```typescript
Input: "This product is amazing!"
Output: { sentiment: "positive", confidence: 0.95 }
```

### 2. Extracción de Información
```typescript
Input: "John Doe works at Acme Corp in San Francisco"
Output: {
  name: "John Doe",
  company: "Acme Corp",
  location: "San Francisco"
}
```

### 3. Generación de Contenido
```typescript
Input: "Write a product description for wireless headphones"
Output: "Experience premium sound with our latest..."
```

### 4. Summarization
```typescript
Input: [long document]
Output: "This document discusses..."
```

### 5. Q&A
```typescript
Input: "What is the return policy?"
Context: [company documentation]
Output: "You can return items within 30 days..."
```

### 6. Translation
```typescript
Input: "Hello, how are you?"
Target: "Spanish"
Output: "Hola, ¿cómo estás?"
```

### 7. Code Generation
```typescript
Input: "Create a function to sort an array"
Output: "function sortArray(arr) { return arr.sort(); }"
```

## Consideraciones Importantes

### Hallucinations
- Los LLMs pueden generar información incorrecta con confianza
- **Mitigation**: RAG, fact-checking, source attribution

### Latency
- GPT-4: ~2-5 segundos
- GPT-4o-mini: ~1-2 segundos
- Claude Haiku: ~1-2 segundos

### Costos
```
GPT-4o-mini: ~$0.15 / 1M input tokens
Claude Haiku: ~$0.25 / 1M input tokens
Gemini Flash: Tier gratuito + barato
```

### Rate Limits
- OpenAI Tier 1: ~500 RPM (requests per minute)
- Anthropic: ~50 RPM (default)
- Google: ~60 RPM (free tier)

## Ética y Compliance

### Privacidad
- ❌ **Nunca** envíes PII sin anonimizar
- ✅ Usa data retention controls (OpenAI 0-day retention)
- ✅ Cumple con GDPR/CCPA

### Bias
- Los modelos reflejan biases del training data
- Evalúa outputs en grupos demográficos diversos
- Implementa fairness checks

### Transparencia
- Informa a usuarios cuando usan AI
- Permite opt-out cuando sea posible
- Explica limitaciones

### Seguridad
- Content moderation en inputs/outputs
- Rate limiting para prevenir abuse
- Audit logging de todas las interacciones

## Recursos Adicionales

- [OpenAI Documentation](https://platform.openai.com/docs)
- [Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)
- [Transformer Architecture Paper](https://arxiv.org/abs/1706.03762)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

## Próximos Pasos

1. Obtén API keys de los principales providers
2. Prueba diferentes modelos y compara resultados
3. Experimenta con diferentes parámetros (temperature, top-p)
4. Mide latencia y costos
5. Implementa tu primera integración
