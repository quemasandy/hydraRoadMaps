# 📑 Índice Completo - SQL & Modelado de Datos

## 🎯 Inicio Rápido
- [README Principal](./README.md) - Roadmap completo de aprendizaje
- [Quick Start Guide](./QUICK_START.md) - Guía de inicio rápido

## 📚 Contenido por Nivel

### Nivel 1: Fundamentos de SQL
**Ubicación:** `01-fundamentos-sql/`

#### Introducción a Bases de Datos Relacionales
- `introduccion-rdbms/README.md` - Conceptos fundamentales de bases de datos relacionales
  - RDBMS vs NoSQL
  - Propiedades ACID
  - Motores de bases de datos
  - Configuración de entorno

#### SQL Básico
- `queries-basicas/01-select-where.sql` - SELECT, FROM, WHERE básico
  - Operadores de comparación
  - Operadores lógicos
  - LIKE, IN, BETWEEN, IS NULL
  - ORDER BY, LIMIT, DISTINCT

- `queries-basicas/02-agregaciones.sql` - Funciones de agregación
  - COUNT, SUM, AVG, MIN, MAX
  - GROUP BY y HAVING
  - Ejercicio: Reportes de ventas

- `queries-basicas/03-joins.sql` - Unión de tablas
  - INNER JOIN
  - LEFT/RIGHT/FULL OUTER JOIN
  - CROSS JOIN y SELF JOIN
  - Ejercicio: Sistema de órdenes multi-tabla

- `queries-basicas/04-subqueries.sql` - Subconsultas
  - Subqueries en WHERE, FROM, SELECT
  - Subconsultas correlacionadas
  - EXISTS y NOT EXISTS
  - Ejercicio: Queries complejas anidadas

#### DDL (Data Definition Language)
- `ddl/01-create-tables.sql` - Creación de estructuras
  - CREATE DATABASE, CREATE TABLE
  - Tipos de datos
  - Constraints (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK)
  - Ejercicio: Schema de blog

- `ddl/02-alter-drop.sql` - Modificación de estructuras
  - ALTER TABLE
  - DROP y TRUNCATE
  - Ejercicio: Evolución de schema

#### DML (Data Manipulation Language)
- `dml/01-insert-update-delete.sql` - Manipulación de datos
  - INSERT, UPDATE, DELETE
  - RETURNING clause
  - Ejercicio: CRUD completo

- `dml/02-transacciones-basicas.sql` - Transacciones
  - BEGIN, COMMIT, ROLLBACK
  - Ejercicio: Transferencia bancaria

---

### Nivel 2: SQL Avanzado y Optimización
**Ubicación:** `02-sql-avanzado/`

#### Funciones y Operadores Avanzados
- `funciones/01-string-functions.sql` - Funciones de texto
  - CONCAT, SUBSTRING, REGEXP
  - UPPER, LOWER, TRIM
  - Ejercicio: Limpieza de datos

- `funciones/02-date-functions.sql` - Funciones de fecha
  - NOW, CURRENT_DATE, DATE_TRUNC
  - EXTRACT, INTERVAL
  - Ejercicio: Reportes temporales

- `funciones/03-case-coalesce.sql` - Condicionales
  - CASE WHEN
  - COALESCE, NULLIF
  - Ejercicio: Categorización dinámica

- `funciones/04-window-functions.sql` - Window Functions
  - ROW_NUMBER, RANK, DENSE_RANK
  - LAG, LEAD
  - PARTITION BY, ORDER BY
  - Ejercicio: Ranking por categorías

#### CTEs (Common Table Expressions)
- `ctes/01-basic-ctes.sql` - CTEs básicos
  - WITH clause
  - Múltiples CTEs
  - Ejercicio: Queries legibles

- `ctes/02-recursive-ctes.sql` - CTEs recursivos
  - Recursive CTEs
  - Jerarquías y árboles
  - Ejercicio: Estructura organizacional

- `ctes/03-materialized-ctes.sql` - CTEs materializados
  - MATERIALIZED keyword
  - Optimización de queries
  - Ejercicio: Reporte complejo optimizado

#### Vistas y Funciones
- `views-functions/01-views.sql` - Vistas
  - CREATE VIEW
  - Updatable views
  - Ejercicio: Sistema de permisos con views

- `views-functions/02-materialized-views.sql` - Vistas materializadas
  - CREATE MATERIALIZED VIEW
  - REFRESH strategies
  - Ejercicio: Dashboard con MVs

- `views-functions/03-functions.sql` - Funciones y procedimientos
  - CREATE FUNCTION
  - PL/pgSQL
  - Ejercicio: Lógica de negocio

- `views-functions/04-triggers.sql` - Triggers
  - CREATE TRIGGER
  - BEFORE, AFTER triggers
  - Ejercicio: Auditoria automática

#### Optimización de Queries
- `optimizacion/01-explain.sql` - EXPLAIN y EXPLAIN ANALYZE
  - Leer execution plans
  - Identificar cuellos de botella
  - Ejercicio: Analizar queries lentas

- `optimizacion/02-query-tuning.sql` - Técnicas de optimización
  - Reescritura de queries
  - Evitar anti-patterns
  - Ejercicio: Optimizar queries

- `optimizacion/03-maintenance.sql` - Mantenimiento
  - ANALYZE, VACUUM
  - Table statistics
  - Ejercicio: Rutinas de mantenimiento

---

### Nivel 3: Modelado de Datos y Diseño
**Ubicación:** `03-modelado-datos/`

#### Fundamentos de Modelado
- `modelado-fundamentos/01-er-modeling.md` - Modelo Entidad-Relación
  - Entidades, atributos, relaciones
  - Cardinalidad
  - Ejercicio: Diagrama ER de biblioteca

- `modelado-fundamentos/02-er-to-relational.sql` - De ER a Relacional
  - Transformación de entidades
  - Tablas junction para N:M
  - Ejercicio: Convertir ER a SQL

- `modelado-fundamentos/03-normalizacion-basica.md` - Normalización 1NF-3NF
  - Primera, Segunda, Tercera Forma Normal
  - Dependencias funcionales
  - Ejercicio: Normalizar tabla

#### Normalización Avanzada
- `normalizacion/01-bcnf-4nf-5nf.md` - Formas normales avanzadas
  - BCNF, 4NF, 5NF
  - Trade-offs de normalización
  - Ejercicio: Normalización completa

- `normalizacion/02-desnormalizacion.sql` - Desnormalización estratégica
  - Cuándo desnormalizar
  - Columnas calculadas
  - Ejercicio: Optimización con desnormalización

- `normalizacion/03-patrones-desnormalizacion.sql` - Patrones
  - Pre-joined tables
  - Snapshot tables
  - Ejercicio: Reporting database

#### Diseño de Schemas
- `diseño-schemas/01-ecommerce.sql` - E-commerce schema
  - Products, orders, inventory
  - Shopping cart
  - Ejercicio: Schema completo

- `diseño-schemas/02-multi-tenant.sql` - Multi-tenant
  - Shared schema vs separate schemas
  - Row-level security
  - Ejercicio: SaaS application

- `diseño-schemas/03-auditoria-temporal.sql` - Auditoria y versionado
  - Audit tables
  - Temporal tables
  - Ejercicio: Sistema de auditoria

- `diseño-schemas/04-jerarquias.sql` - Jerarquías y árboles
  - Adjacency List
  - Nested Set, Closure Table
  - Ejercicio: Estructura organizacional

#### Modelado Avanzado
- `modelado-avanzado/01-polimorfismo.sql` - Polimorfismo
  - Single/Class/Concrete Table Inheritance
  - Ejercicio: Sistema de productos con variantes

- `modelado-avanzado/02-flexible-schema.sql` - Schemas flexibles
  - EAV (Entity-Attribute-Value)
  - JSON columns
  - Ejercicio: Atributos personalizables

- `modelado-avanzado/03-time-series.sql` - Time series
  - Partitioning temporal
  - Aggregations
  - Ejercicio: Telemetry storage

---

### Nivel 4: Performance e Indexación
**Ubicación:** `04-performance-indexacion/`

#### Fundamentos de Indexación
- `indexacion/01-tipos-indices.sql` - Tipos de índices
  - B-Tree, Hash, GiST, GIN, BRIN
  - Cuándo usar cada tipo
  - Ejercicio: Benchmark de índices

- `indexacion/02-creacion-indices.sql` - Creación de índices
  - CREATE INDEX
  - Unique, Partial, Expression indexes
  - Multi-column indexes
  - Ejercicio: Estrategia de indexación

- `indexacion/03-index-maintenance.sql` - Mantenimiento
  - REINDEX
  - pg_stat_user_indexes
  - Ejercicio: Auditoría de índices

#### Optimización de Performance
- `performance/01-query-tuning.sql` - Query performance
  - pg_stat_statements
  - Query profiling
  - Ejercicio: Top 10 queries lentas

- `performance/02-connection-pooling.md` - Connection pooling
  - PgBouncer, pgpool-II
  - Configuration
  - Ejercicio: Setup connection pooling

- `performance/03-caching.md` - Estrategias de caching
  - Query caching
  - Redis integration
  - Ejercicio: Caching layer

#### Particionamiento
- `particionamiento/01-table-partitioning.sql` - Particionamiento
  - Range, List, Hash partitioning
  - Partition pruning
  - Ejercicio: Particionar logs

- `particionamiento/02-partition-management.sql` - Gestión
  - Adding/removing partitions
  - Archival strategies
  - Ejercicio: Automatic partitions

- `particionamiento/03-sharding.md` - Sharding
  - Horizontal/Vertical sharding
  - Shard keys
  - Ejercicio: Estrategia de sharding

#### Monitoreo
- `monitoreo/01-monitoring.sql` - Database monitoring
  - pg_stat_activity
  - pg_stat_database
  - Ejercicio: Dashboard de monitoreo

- `monitoreo/02-metrics.md` - Performance metrics
  - Throughput, latency
  - Cache hit ratio
  - Ejercicio: Performance baseline

- `monitoreo/03-alerting.md` - Alerting
  - Slow query logs
  - Deadlock detection
  - Ejercicio: Sistema de alertas

---

### Nivel 5: Conceptos Avanzados
**Ubicación:** `05-conceptos-avanzados/`

#### Transacciones Avanzadas
- `transacciones/01-isolation-levels.sql` - Niveles de aislamiento
  - READ COMMITTED, REPEATABLE READ, SERIALIZABLE
  - Phenomena
  - Ejercicio: Demostrar isolation levels

- `transacciones/02-locking.sql` - Mecanismos de bloqueo
  - Row/Table locks
  - FOR UPDATE, FOR SHARE
  - Ejercicio: Manejo de concurrencia

- `transacciones/03-mvcc.md` - MVCC
  - Multi-Version Concurrency Control
  - Snapshot isolation
  - Ejercicio: Entender MVCC

#### Tipos de Datos Avanzados
- `tipos-datos/01-json-jsonb.sql` - JSON y JSONB
  - JSON operators
  - GIN indexes para JSON
  - Ejercicio: Schema flexible

- `tipos-datos/02-arrays.sql` - Arrays
  - Array operations
  - Array indexing
  - Ejercicio: Tags system

- `tipos-datos/03-full-text-search.sql` - Full-text search
  - tsvector, tsquery
  - Text search ranking
  - Ejercicio: Search engine

- `tipos-datos/04-spatial-postgis.sql` - Datos espaciales
  - PostGIS basics
  - Spatial queries
  - Ejercicio: Location queries

#### Replicación y HA
- `replicacion/01-streaming-replication.md` - Replicación
  - Streaming replication
  - Logical replication
  - Ejercicio: Setup replication

- `replicacion/02-backup-recovery.md` - Backup y recovery
  - pg_dump, pg_basebackup
  - Point-in-time recovery
  - Ejercicio: Backup automatizado

- `replicacion/03-high-availability.md` - Alta disponibilidad
  - Failover mechanisms
  - Patroni, pgpool-II
  - Ejercicio: Cluster HA

#### Security
- `security/01-authentication.sql` - Autenticación
  - Users, Roles, GRANT/REVOKE
  - Row-Level Security
  - Ejercicio: Sistema de permisos

- `security/02-sql-injection.md` - SQL injection
  - Prepared statements
  - Input validation
  - Ejercicio: Auditar código

- `security/03-encryption.sql` - Encriptación
  - Encryption at rest/in transit
  - pgcrypto
  - Ejercicio: Cifrar datos sensibles

---

### Nivel 6: Patrones Empresariales
**Ubicación:** `06-patrones-empresariales/`

#### Data Warehouse y Analytics
- `data-warehouse/01-star-schema.sql` - Star schema
  - Fact tables, Dimension tables
  - Slowly Changing Dimensions
  - Ejercicio: Data warehouse de ventas

- `data-warehouse/02-snowflake-schema.sql` - Snowflake schema
  - Normalized dimensions
  - Trade-offs
  - Ejercicio: Star to snowflake

- `data-warehouse/03-olap-vs-oltp.md` - OLAP vs OLTP
  - Diferencias arquitectónicas
  - Columnar storage
  - Ejercicio: Diseño OLAP

- `data-warehouse/04-etl.md` - ETL processes
  - Extract, Transform, Load
  - Change Data Capture
  - Ejercicio: Pipeline ETL

#### Migraciones
- `migraciones/01-schema-migrations.md` - Schema migrations
  - Flyway, Liquibase
  - Versioning
  - Ejercicio: Migraciones automatizadas

- `migraciones/02-database-refactoring.md` - Database refactoring
  - Refactoring patterns
  - Backward compatibility
  - Ejercicio: Refactoring incremental

- `migraciones/03-zero-downtime.md` - Zero-downtime deployments
  - Blue-green deployments
  - Dual-write pattern
  - Ejercicio: Migración sin downtime

#### Polyglot Persistence
- `polyglot/01-sql-nosql-integration.md` - SQL + NoSQL
  - Foreign Data Wrappers
  - Integración con MongoDB/Redis
  - Ejercicio: Hybrid architecture

- `polyglot/02-event-sourcing.sql` - Event sourcing
  - Event store en PostgreSQL
  - Snapshots y projections
  - Ejercicio: Event-sourced aggregate

- `polyglot/03-cqrs.sql` - CQRS
  - Write vs Read model
  - Synchronization
  - Ejercicio: CQRS implementation

#### Testing y CI/CD
- `testing/01-database-testing.sql` - Database testing
  - Unit tests para functions
  - pgTAP
  - Ejercicio: Test suite

- `testing/02-cicd-databases.md` - CI/CD para databases
  - Automated migrations
  - Test databases
  - Ejercicio: Pipeline CI/CD

- `testing/03-seeding.sql` - Database seeding
  - Test data factories
  - Anonymization
  - Ejercicio: Sistema de seeds

#### Observability
- `observability/01-logging.md` - Logging
  - Structured logging
  - Log aggregation
  - Ejercicio: Centralized logging

- `observability/02-metrics-dashboards.md` - Métricas
  - Prometheus + Grafana
  - SLA monitoring
  - Ejercicio: Dashboard operacional

- `observability/03-capacity-planning.md` - Capacity planning
  - Growth projection
  - Scaling strategies
  - Ejercicio: Plan de crecimiento

---

## 🛠️ Archivos de Configuración

- `docker-compose.yml.example` - Setup de PostgreSQL con Docker
- `.env.example` - Variables de entorno
- `package.json.example` - Scripts útiles para migraciones
- `.gitignore` - Archivos a ignorar

---

## 📊 Progreso Recomendado

### Semanas 1-2: Fundamentos
✅ Entender conceptos RDBMS
✅ SELECT, WHERE, JOIN básicos
✅ Crear primeras tablas

### Semanas 3-4: SQL Básico
✅ Agregaciones y GROUP BY
✅ Subconsultas
✅ Transacciones básicas

### Semanas 5-7: SQL Avanzado
✅ Window functions
✅ CTEs y recursivos
✅ Vistas y funciones

### Semanas 8-10: Modelado
✅ Normalización completa
✅ Diseño de schemas complejos
✅ Patrones de modelado

### Semanas 11-14: Performance
✅ Indexación estratégica
✅ Query optimization
✅ Particionamiento

### Semanas 15-20: Producción
✅ Replicación y HA
✅ Security best practices
✅ Migraciones y CI/CD
✅ Proyecto final

---

## 🎯 Proyecto Final Sugerido

**Sistema Empresarial E-commerce Completo**

Implementa:
- ✅ Schema normalizado (3NF) para transacciones
- ✅ Star schema para analytics
- ✅ Multi-tenant con RLS
- ✅ Audit trail completo
- ✅ Full-text search
- ✅ Geospatial queries
- ✅ Event sourcing
- ✅ Materialized views para reporting
- ✅ Partitioning para datos históricos
- ✅ Replicación para HA
- ✅ Monitoring y alerting
- ✅ CI/CD con migraciones automatizadas

---

## 📖 Próximos Pasos

1. Empieza con [QUICK_START.md](./QUICK_START.md)
2. Sigue el [README principal](./README.md) nivel por nivel
3. Completa ejercicios de cada carpeta
4. Construye proyectos incrementales
5. Comparte tu progreso en GitHub

---

**¡Buena suerte en tu aprendizaje de SQL & Modelado de Datos!** 🗄️
