# 📑 Índice de Ejercicios de Observabilidad y Trazabilidad

## Navegación Rápida por Nivel

- [Nivel 1: Fundamentos de Observabilidad](#nivel-1-fundamentos-de-observabilidad)
- [Nivel 2: Distributed Tracing](#nivel-2-distributed-tracing)
- [Nivel 3: Herramientas de Observabilidad](#nivel-3-herramientas-de-observabilidad)
- [Nivel 4: Observabilidad en Serverless](#nivel-4-observabilidad-en-serverless)
- [Nivel 5: Debugging y Troubleshooting](#nivel-5-debugging-y-troubleshooting)
- [Nivel 6: SRE y Producción](#nivel-6-sre-y-producción)

---

## Nivel 1: Fundamentos de Observabilidad

### 📂 Conceptos Básicos
`01-fundamentos-observabilidad/conceptos-basicos/`

**Archivos:**
- `01-three-pillars.ts` - Los 3 pilares: Logs, Metrics, Traces
- `02-telemetry-data.ts` - Datos de telemetría
- `03-observability-vs-monitoring.ts` - Observabilidad vs Monitoreo
- `04-cardinality.ts` - Cardinalidad y dimensionalidad
- `05-signal-to-noise.ts` - Reducir ruido en datos de observabilidad

**Conceptos clave:**
- Los tres pilares de la observabilidad
- Diferencia entre monitoreo y observabilidad
- Importancia de la cardinalidad en métricas
- Signal-to-noise ratio

---

### 📂 Logs Estructurados
`01-fundamentos-observabilidad/logs-estructurados/`

**Archivos:**
- `01-structured-logging.ts` - Logging estructurado vs no estructurado
- `02-log-levels.ts` - Niveles de log (DEBUG, INFO, WARN, ERROR)
- `03-context-enrichment.ts` - Enriquecimiento de contexto
- `04-json-logging.ts` - JSON logging format
- `05-sampling.ts` - Log sampling strategies

**Conceptos clave:**
- Structured logging con JSON
- Niveles de log apropiados
- Context propagation en logs
- Sampling para reducir volumen

---

### 📂 Métricas Básicas
`01-fundamentos-observabilidad/metricas-basicas/`

**Archivos:**
- `01-metric-types.ts` - Counter, Gauge, Histogram, Summary
- `02-red-method.ts` - RED (Rate, Errors, Duration)
- `03-use-method.ts` - USE (Utilization, Saturation, Errors)
- `04-golden-signals.ts` - Google's 4 Golden Signals
- `05-custom-metrics.ts` - Métricas custom de negocio

**Conceptos clave:**
- Tipos de métricas
- Frameworks RED y USE
- Golden Signals: Latency, Traffic, Errors, Saturation
- Business metrics

---

## Nivel 2: Distributed Tracing

### 📂 Conceptos de Tracing
`02-distributed-tracing/conceptos-tracing/`

**Archivos:**
- `01-spans-traces.ts` - Spans y Traces
- `02-trace-context.ts` - Trace Context Propagation
- `03-parent-child-spans.ts` - Parent-child relationships
- `04-trace-sampling.ts` - Sampling strategies (head-based, tail-based)
- `05-baggage.ts` - Baggage for cross-cutting concerns

**Conceptos clave:**
- Anatomía de un trace (spans)
- Context propagation entre servicios
- Sampling strategies
- Baggage vs span attributes

---

### 📂 OpenTelemetry Básico
`02-distributed-tracing/opentelemetry-basics/`

**Archivos:**
- `01-otel-architecture.ts` - Arquitectura OpenTelemetry
- `02-otel-sdk-setup.ts` - SDK setup en Node.js/TypeScript
- `03-otel-exporters.ts` - Exporters (Jaeger, Zipkin, OTLP)
- `04-otel-context.ts` - Context API
- `05-otel-resources.ts` - Resource attributes

**Conceptos clave:**
- OpenTelemetry como estándar vendor-neutral
- SDK vs API
- Exporters y backends
- Resource semantic conventions

---

### 📂 Instrumentación Manual
`02-distributed-tracing/instrumentacion-manual/`

**Archivos:**
- `01-manual-spans.ts` - Crear spans manualmente
- `02-span-attributes.ts` - Añadir attributes a spans
- `03-span-events.ts` - Span events
- `04-span-status.ts` - Span status (OK, ERROR)
- `05-custom-propagators.ts` - Custom context propagators

**Conceptos clave:**
- Manual instrumentation API
- Span lifecycle
- Semantic conventions
- Custom attributes

---

### 📂 Instrumentación Automática
`02-distributed-tracing/instrumentacion-automatica/`

**Archivos:**
- `01-auto-instrumentation.ts` - Auto-instrumentation setup
- `02-http-tracing.ts` - HTTP request tracing automático
- `03-database-tracing.ts` - Database query tracing
- `04-aws-sdk-tracing.ts` - AWS SDK auto-instrumentation
- `05-custom-instrumentations.ts` - Crear instrumentaciones custom

**Conceptos clave:**
- Auto-instrumentation libraries
- Monkey-patching vs hooks
- Supported libraries
- Performance overhead

---

## Nivel 3: Herramientas de Observabilidad

### 📂 AWS X-Ray
`03-herramientas-observabilidad/aws-xray/`

**Archivos:**
- `01-xray-setup.ts` - X-Ray SDK setup
- `02-xray-lambda.ts` - X-Ray en Lambda functions
- `03-xray-subsegments.ts` - Subsegments para llamadas externas
- `04-xray-annotations.ts` - Annotations y metadata
- `05-xray-service-map.ts` - Service Map y análisis

**Conceptos clave:**
- X-Ray daemon
- Segments y subsegments
- Annotations para búsqueda
- Service graph visualization

---

### 📂 Datadog
`03-herramientas-observabilidad/datadog/`

**Archivos:**
- `01-datadog-apm.ts` - Datadog APM setup
- `02-datadog-custom-metrics.ts` - Custom metrics con DogStatsD
- `03-datadog-logs.ts` - Log aggregation
- `04-datadog-traces.ts` - Distributed tracing
- `05-datadog-dashboards.ts` - Dashboards y monitors

**Conceptos clave:**
- Datadog Agent
- APM tracing
- Custom metrics
- Unified telemetry

---

### 📂 CloudWatch
`03-herramientas-observabilidad/cloudwatch/`

**Archivos:**
- `01-cloudwatch-logs.ts` - CloudWatch Logs
- `02-log-insights.ts` - CloudWatch Logs Insights queries
- `03-cloudwatch-metrics.ts` - CloudWatch Metrics
- `04-cloudwatch-alarms.ts` - CloudWatch Alarms
- `05-embedded-metrics.ts` - Embedded Metric Format (EMF)

**Conceptos clave:**
- Log groups y streams
- Logs Insights query language
- Custom metrics
- EMF para métricas desde logs

---

### 📂 Prometheus y Grafana
`03-herramientas-observabilidad/prometheus-grafana/`

**Archivos:**
- `01-prometheus-metrics.ts` - Exponer métricas Prometheus
- `02-prometheus-queries.ts` - PromQL queries
- `03-grafana-dashboards.ts` - Dashboards en Grafana
- `04-alertmanager.ts` - Alerting con AlertManager
- `05-service-discovery.ts` - Service discovery

**Conceptos clave:**
- Pull vs push model
- PromQL
- Grafana visualizations
- Alert routing

---

## Nivel 4: Observabilidad en Serverless

### 📂 Lambda Tracing
`04-observabilidad-serverless/lambda-tracing/`

**Archivos:**
- `01-lambda-logs.ts` - Structured logging en Lambda
- `02-lambda-cold-start.ts` - Detectar y medir cold starts
- `03-lambda-custom-metrics.ts` - Custom metrics desde Lambda
- `04-lambda-xray.ts` - X-Ray tracing en Lambda
- `05-lambda-otel.ts` - OpenTelemetry en Lambda

**Conceptos clave:**
- Lambda execution context
- Cold start vs warm start metrics
- Lambda Insights
- Layer para tracing

---

### 📂 API Gateway Metrics
`04-observabilidad-serverless/api-gateway-metrics/`

**Archivos:**
- `01-apigw-access-logs.ts` - API Gateway access logs
- `02-apigw-execution-logs.ts` - Execution logs
- `03-apigw-metrics.ts` - CloudWatch metrics default
- `04-apigw-tracing.ts` - X-Ray tracing habilitado
- `05-apigw-custom-domain-monitoring.ts` - Monitoreo de custom domains

**Conceptos clave:**
- Access logs format
- Execution logs para debugging
- 4xx/5xx error tracking
- Latency metrics

---

### 📂 Correlación de IDs
`04-observabilidad-serverless/correlacion-ids/`

**Archivos:**
- `01-correlation-id.ts` - Generar y propagar correlation IDs
- `02-request-tracing.ts` - End-to-end request tracing
- `03-multi-service-correlation.ts` - Correlación multi-servicio
- `04-correlation-in-logs.ts` - Correlation IDs en logs
- `05-distributed-context.ts` - Distributed context propagation

**Conceptos clave:**
- Correlation ID pattern
- Propagación via headers
- Thread-local storage
- W3C Trace Context

---

## Nivel 5: Debugging y Troubleshooting

### 📂 Log Aggregation
`05-debugging-troubleshooting/log-aggregation/`

**Archivos:**
- `01-centralized-logging.ts` - Logging centralizado
- `02-log-parsing.ts` - Parsing de logs estructurados
- `03-log-queries.ts` - Queries complejas en logs
- `04-log-retention.ts` - Retention policies
- `05-log-shipping.ts` - Shipping logs a múltiples destinos

**Conceptos clave:**
- Centralized logging architecture
- Log shippers (Fluentd, Logstash)
- Query optimization
- Cost optimization

---

### 📂 Error Tracking
`05-debugging-troubleshooting/error-tracking/`

**Archivos:**
- `01-error-grouping.ts` - Agrupar errores similares
- `02-error-context.ts` - Capturar contexto de errores
- `03-error-notifications.ts` - Notificaciones de errores críticos
- `04-error-trends.ts` - Análisis de tendencias de errores
- `05-sentry-integration.ts` - Integración con Sentry

**Conceptos clave:**
- Error fingerprinting
- Stacktrace analysis
- Error severity levels
- Error budgets

---

### 📂 Alerting
`05-debugging-troubleshooting/alerting/`

**Archivos:**
- `01-alerting-best-practices.ts` - Best practices para alertas
- `02-alert-thresholds.ts` - Definir umbrales apropiados
- `03-alert-routing.ts` - Routing de alertas
- `04-alert-fatigue.ts` - Reducir alert fatigue
- `05-runbooks.ts` - Runbooks para respuesta a alertas

**Conceptos clave:**
- Actionable alerts
- Alert severity
- Escalation policies
- Runbook automation

---

### 📂 Incident Investigation
`05-debugging-troubleshooting/incident-investigation/`

**Archivos:**
- `01-incident-detection.ts` - Detectar incidentes
- `02-root-cause-analysis.ts` - RCA (Root Cause Analysis)
- `03-trace-analysis.ts` - Analizar traces para debugging
- `04-metric-correlation.ts` - Correlacionar métricas
- `05-postmortem.ts` - Escribir postmortems

**Conceptos clave:**
- MTTR (Mean Time To Recovery)
- Correlation analysis
- Trace sampling strategies
- Blameless postmortems

---

## Nivel 6: SRE y Producción

### 📂 SLO, SLI, SLA
`06-produccion-sre/slo-sli-sla/`

**Archivos:**
- `01-sli-definition.ts` - Definir SLIs (Service Level Indicators)
- `02-slo-setting.ts` - Establecer SLOs (Service Level Objectives)
- `03-sla-contracts.ts` - SLAs (Service Level Agreements)
- `04-slo-monitoring.ts` - Monitorear cumplimiento de SLOs
- `05-slo-alerting.ts` - Alertas basadas en SLOs

**Conceptos clave:**
- SLI selection
- SLO targets (99.9%, 99.99%)
- Error budgets
- Burn rate

---

### 📂 Error Budgets
`06-produccion-sre/error-budgets/`

**Archivos:**
- `01-error-budget-calculation.ts` - Calcular error budget
- `02-error-budget-tracking.ts` - Tracking de error budget
- `03-error-budget-policy.ts` - Error budget policy
- `04-deployment-decisions.ts` - Decisiones basadas en error budget
- `05-error-budget-alerts.ts` - Alertas de error budget exhausted

**Conceptos clave:**
- Error budget concept
- Balancing reliability vs velocity
- Policy enforcement
- Incident retrospectives

---

### 📂 Dashboards
`06-produccion-sre/dashboards/`

**Archivos:**
- `01-golden-signals-dashboard.ts` - Dashboard de Golden Signals
- `02-service-dashboard.ts` - Dashboard por servicio
- `03-business-metrics-dashboard.ts` - Business metrics dashboard
- `04-realtime-dashboard.ts` - Real-time dashboards
- `05-executive-dashboard.ts` - Executive-level dashboards

**Conceptos clave:**
- Dashboard hierarchy
- Key metrics selection
- Visualization best practices
- Dashboard as code

---

### 📂 On-Call Best Practices
`06-produccion-sre/on-call-best-practices/`

**Archivos:**
- `01-on-call-rotation.ts` - On-call rotation strategies
- `02-incident-response.ts` - Incident response workflow
- `03-escalation-policies.ts` - Escalation policies
- `04-on-call-tools.ts` - Herramientas para on-call (PagerDuty, OpsGenie)
- `05-reducing-toil.ts` - Reducir toil y trabajo manual

**Conceptos clave:**
- On-call rotation
- Incident severity levels
- Escalation paths
- Toil reduction

---

## 📊 Progreso Recomendado

### Semanas 1-3: Fundamentos
- [ ] Conceptos Básicos - Logs, Metrics, Traces
- [ ] Logs Estructurados - JSON logging
- [ ] Métricas Básicas - RED, USE, Golden Signals

### Semanas 4-7: Distributed Tracing
- [ ] Conceptos de Tracing - Spans, Context
- [ ] OpenTelemetry Basics
- [ ] Instrumentación Manual y Automática

### Semanas 8-11: Herramientas
- [ ] AWS X-Ray
- [ ] Datadog o New Relic
- [ ] CloudWatch
- [ ] Prometheus & Grafana

### Semanas 12-15: Serverless
- [ ] Lambda Tracing
- [ ] API Gateway Metrics
- [ ] Correlación de IDs

### Semanas 16-19: Debugging
- [ ] Log Aggregation
- [ ] Error Tracking
- [ ] Alerting
- [ ] Incident Investigation

### Semanas 20-24: SRE
- [ ] SLO, SLI, SLA
- [ ] Error Budgets
- [ ] Dashboards
- [ ] On-Call Best Practices

---

## 🎯 Hitos de Aprendizaje

**Después del Nivel 1:** Comprendes los 3 pilares de observabilidad
**Después del Nivel 2:** Puedes implementar distributed tracing con OpenTelemetry
**Después del Nivel 3:** Dominas las principales herramientas de observabilidad
**Después del Nivel 4:** Sabes instrumentar aplicaciones serverless
**Después del Nivel 5:** Puedes debuggear sistemas distribuidos eficientemente
**Después del Nivel 6:** Estás listo para ser on-call y liderar SRE practices

---

## 💡 Valor para tu Carrera

### Para Ingenieros Mid-Level:
- Dejas de "adivinar" dónde está el error
- Reduces MTTR (Mean Time To Recovery) significativamente
- Te vuelves más autónomo en debugging

### Para Senior Engineers:
- Diseñas sistemas observables desde el inicio
- Implementas SLOs y error budgets
- Reduces toil para tu equipo

### Para Arquitectos:
- Diseñas arquitecturas con observabilidad nativa
- Reduces costos de operación
- Mejoras disponibilidad del sistema

### Impacto Real:
- **Menos estrés en guardias:** Sabes exactamente qué falló y dónde
- **Debugging 10x más rápido:** Traces muestran el flujo completo
- **Prevención proactiva:** Alertas antes de que usuarios reporten
- **Decisiones basadas en datos:** Métricas reales, no intuición

---

**¡Usa este índice para navegar rápidamente entre ejercicios!** 🔍
