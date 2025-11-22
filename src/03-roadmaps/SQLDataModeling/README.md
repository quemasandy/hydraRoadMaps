# 🗄️ Roadmap de Aprendizaje: SQL & Modelado de Datos

## 📚 Tabla de Contenidos
- [Nivel 1: Fundamentos de SQL](#nivel-1-fundamentos-de-sql)
- [Nivel 2: SQL Avanzado y Optimización](#nivel-2-sql-avanzado-y-optimización)
- [Nivel 3: Modelado de Datos y Diseño](#nivel-3-modelado-de-datos-y-diseño)
- [Nivel 4: Performance e Indexación](#nivel-4-performance-e-indexación)
- [Nivel 5: Conceptos Avanzados de Bases de Datos](#nivel-5-conceptos-avanzados-de-bases-de-datos)
- [Nivel 6: Patrones Empresariales y Producción](#nivel-6-patrones-empresariales-y-producción)
- [Recursos y Práctica](#recursos-y-práctica)

---

## Nivel 1: Fundamentos de SQL

### 1.1 Introducción a Bases de Datos Relacionales
**Tiempo estimado: 1-2 semanas**

- [ ] **Conceptos Fundamentales**
  - ¿Qué es una base de datos relacional?
  - RDBMS vs NoSQL: Cuándo usar cada uno
  - ACID properties (Atomicity, Consistency, Isolation, Durability)
  - Tablas, filas, columnas
  - Relaciones entre tablas
  - Claves primarias y foráneas
  - Integridad referencial

- [ ] **Motores de Base de Datos**
  - PostgreSQL (recomendado para aprendizaje)
  - MySQL/MariaDB
  - SQL Server
  - Oracle
  - SQLite para práctica local
  - Diferencias principales entre motores
  - Ejercicio: Instalar PostgreSQL y crear primera base de datos

- [ ] **Herramientas y Entorno**
  - Instalar PostgreSQL/MySQL
  - pgAdmin / MySQL Workbench
  - DBeaver (universal)
  - Extensiones VS Code (SQLTools)
  - Docker para bases de datos
  - Ejercicio: Configurar entorno de desarrollo

### 1.2 SQL Básico - Consultas y Manipulación
**Tiempo estimado: 2-3 semanas**

- [ ] **SELECT - Consultas Básicas**
  - SELECT, FROM, WHERE
  - Operadores de comparación (=, !=, <, >, <=, >=)
  - Operadores lógicos (AND, OR, NOT)
  - BETWEEN, IN, LIKE, IS NULL
  - ORDER BY (ASC, DESC)
  - LIMIT y OFFSET (paginación)
  - DISTINCT
  - Ejercicio: Queries sobre dataset de empleados

- [ ] **Funciones de Agregación**
  - COUNT, SUM, AVG, MIN, MAX
  - GROUP BY
  - HAVING (filtrado post-agregación)
  - Diferencia entre WHERE y HAVING
  - Ejercicio: Reportes de ventas con agregaciones

- [ ] **JOINs - Uniendo Tablas**
  - INNER JOIN
  - LEFT JOIN (LEFT OUTER JOIN)
  - RIGHT JOIN (RIGHT OUTER JOIN)
  - FULL OUTER JOIN
  - CROSS JOIN
  - SELF JOIN
  - Diferencias visuales entre JOINs
  - Ejercicio: Sistema de órdenes con múltiples tablas

- [ ] **Subconsultas (Subqueries)**
  - Subconsultas en WHERE
  - Subconsultas en FROM (derived tables)
  - Subconsultas en SELECT
  - Subconsultas correlacionadas
  - EXISTS y NOT EXISTS
  - IN vs EXISTS (performance)
  - Ejercicio: Queries complejas con subqueries

### 1.3 Data Definition Language (DDL)
**Tiempo estimado: 1-2 semanas**

- [ ] **CREATE - Creación de Estructuras**
  - CREATE DATABASE
  - CREATE TABLE
  - Tipos de datos (INT, VARCHAR, TEXT, DATE, TIMESTAMP, BOOLEAN, DECIMAL, JSON)
  - NOT NULL, DEFAULT, UNIQUE
  - PRIMARY KEY, FOREIGN KEY
  - CHECK constraints
  - Ejercicio: Diseñar esquema de blog

- [ ] **ALTER - Modificación de Estructuras**
  - ALTER TABLE ADD COLUMN
  - ALTER TABLE DROP COLUMN
  - ALTER TABLE MODIFY COLUMN
  - ALTER TABLE RENAME
  - ADD/DROP CONSTRAINTS
  - Ejercicio: Evolucionar esquema existente

- [ ] **DROP y TRUNCATE**
  - DROP TABLE, DROP DATABASE
  - TRUNCATE TABLE
  - Diferencia entre DROP, TRUNCATE, DELETE
  - CASCADE en foreign keys
  - Ejercicio: Limpieza segura de datos

### 1.4 Data Manipulation Language (DML)
**Tiempo estimado: 1-2 semanas**

- [ ] **INSERT - Inserción de Datos**
  - INSERT INTO con valores
  - INSERT INTO desde SELECT
  - INSERT múltiples filas
  - RETURNING clause (PostgreSQL)
  - Manejo de auto-increment/serial
  - Ejercicio: Cargar datos iniciales

- [ ] **UPDATE - Actualización de Datos**
  - UPDATE básico
  - UPDATE con WHERE
  - UPDATE desde JOIN (diferentes sintaxis según motor)
  - UPDATE múltiples columnas
  - Ejercicio: Actualización de precios masiva

- [ ] **DELETE - Eliminación de Datos**
  - DELETE con WHERE
  - DELETE con JOIN
  - Soft delete vs hard delete
  - Ejercicio: Implementar sistema de soft delete

- [ ] **Transacciones Básicas**
  - BEGIN, COMMIT, ROLLBACK
  - ACID en la práctica
  - Isolation levels (básico)
  - Ejercicio: Transferencia bancaria con transacciones

---

## Nivel 2: SQL Avanzado y Optimización

### 2.1 Funciones y Operadores Avanzados
**Tiempo estimado: 2-3 semanas**

- [ ] **Funciones de String**
  - CONCAT, SUBSTRING, LENGTH
  - UPPER, LOWER, TRIM
  - REPLACE, REGEXP
  - Pattern matching avanzado
  - Ejercicio: Limpieza y normalización de datos

- [ ] **Funciones de Fecha y Tiempo**
  - NOW(), CURRENT_DATE, CURRENT_TIMESTAMP
  - DATE_TRUNC, EXTRACT
  - Aritmética de fechas
  - TIME ZONES
  - AGE, INTERVAL
  - Ejercicio: Reportes temporales complejos

- [ ] **Funciones Condicionales**
  - CASE WHEN (simple y searched)
  - COALESCE, NULLIF
  - GREATEST, LEAST
  - Ejercicio: Categorización dinámica de datos

- [ ] **Funciones de Ventana (Window Functions)**
  - ROW_NUMBER, RANK, DENSE_RANK
  - NTILE
  - LAG, LEAD
  - FIRST_VALUE, LAST_VALUE
  - PARTITION BY
  - ORDER BY en window functions
  - Frame clauses (ROWS, RANGE)
  - Ejercicio: Ranking de productos por categoría

### 2.2 Common Table Expressions (CTEs)
**Tiempo estimado: 2 semanas**

- [ ] **CTEs Básicos**
  - WITH clause
  - CTEs simples
  - Múltiples CTEs
  - CTEs vs Subqueries (legibilidad)
  - Ejercicio: Refactorizar queries complejas con CTEs

- [ ] **CTEs Recursivos**
  - RECURSIVE CTEs
  - Base case y recursive step
  - Termination condition
  - Casos de uso: árboles, grafos, jerarquías
  - Ejercicio: Estructura organizacional con recursive CTE

- [ ] **CTEs para Optimización**
  - Materialized vs non-materialized
  - MATERIALIZED keyword (PostgreSQL)
  - Cuándo usar CTEs vs Views
  - Ejercicio: Optimizar reporte complejo

### 2.3 Vistas, Vistas Materializadas y Funciones
**Tiempo estimado: 2-3 semanas**

- [ ] **Views (Vistas)**
  - CREATE VIEW
  - Updatable views
  - WITH CHECK OPTION
  - Seguridad con views
  - Views vs CTEs
  - Ejercicio: Sistema de permisos con views

- [ ] **Materialized Views**
  - CREATE MATERIALIZED VIEW
  - REFRESH MATERIALIZED VIEW
  - CONCURRENTLY refresh
  - Casos de uso: reporting, dashboards
  - Ejercicio: Dashboard con materialized views

- [ ] **Stored Procedures y Functions**
  - CREATE FUNCTION (SQL y PL/pgSQL)
  - CREATE PROCEDURE
  - Parámetros IN, OUT, INOUT
  - RETURNS TABLE
  - Control flow (IF, LOOP, FOR)
  - Error handling (EXCEPTION)
  - Ejercicio: Procedimientos de negocio complejos

- [ ] **Triggers**
  - CREATE TRIGGER
  - BEFORE, AFTER, INSTEAD OF
  - INSERT, UPDATE, DELETE
  - NEW y OLD records
  - Trigger functions
  - Ejercicio: Auditoria automática con triggers

### 2.4 Optimización de Queries
**Tiempo estimado: 2-3 semanas**

- [ ] **EXPLAIN y EXPLAIN ANALYZE**
  - Leer execution plans
  - Sequential Scan vs Index Scan
  - Nested Loop, Hash Join, Merge Join
  - Costs y actual times
  - Identificar cuellos de botella
  - Ejercicio: Analizar y optimizar queries lentas

- [ ] **Query Optimization Techniques**
  - Evitar SELECT *
  - Filtrar lo antes posible (WHERE)
  - JOINs eficientes
  - Evitar funciones en WHERE
  - Usar EXISTS vs IN
  - UNION vs UNION ALL
  - Ejercicio: Optimizar conjunto de queries

- [ ] **Statistics y Vacuuming**
  - ANALYZE para actualizar estadísticas
  - VACUUM (PostgreSQL)
  - Autovacuum configuration
  - Table bloat
  - Ejercicio: Mantenimiento de base de datos

---

## Nivel 3: Modelado de Datos y Diseño

### 3.1 Fundamentos de Modelado
**Tiempo estimado: 2-3 semanas**

- [ ] **Modelo Entidad-Relación (ER)**
  - Entidades, atributos, relaciones
  - Cardinalidad (1:1, 1:N, N:M)
  - Entidades fuertes vs débiles
  - Atributos multivaluados y compuestos
  - Ejercicio: Diagrama ER de sistema de biblioteca

- [ ] **De ER a Modelo Relacional**
  - Transformación de entidades a tablas
  - Transformación de relaciones
  - Manejo de relaciones N:M (tablas junction)
  - Herencia y especialización
  - Ejercicio: Convertir ER a esquema SQL

- [ ] **Normalización - Conceptos Básicos**
  - ¿Qué es la normalización?
  - Anomalías de inserción, actualización, eliminación
  - Dependencias funcionales
  - Primera Forma Normal (1NF)
  - Segunda Forma Normal (2NF)
  - Tercera Forma Normal (3NF)
  - Ejercicio: Normalizar tabla desnormalizada

### 3.2 Normalización Avanzada
**Tiempo estimado: 2-3 semanas**

- [ ] **Formas Normales Avanzadas**
  - Forma Normal de Boyce-Codd (BCNF)
  - Cuarta Forma Normal (4NF)
  - Quinta Forma Normal (5NF)
  - Cuándo detenerse en la normalización
  - Trade-offs de normalización
  - Ejercicio: Normalizar hasta BCNF

- [ ] **Desnormalización Estratégica**
  - Cuándo desnormalizar
  - Performance vs integridad
  - Columnas calculadas
  - Tablas de agregación
  - Cached values
  - Ejercicio: Optimizar con desnormalización controlada

- [ ] **Patrones de Desnormalización**
  - Pre-joined tables
  - Snapshot tables
  - Aggregation tables
  - Duplicate data for performance
  - Ejercicio: Reporting database con desnormalización

### 3.3 Diseño de Esquemas para Casos Reales
**Tiempo estimado: 3-4 semanas**

- [ ] **E-commerce Database Design**
  - Products, categories, attributes
  - Shopping cart (session vs persistent)
  - Orders, order items
  - Payment information
  - Inventory management
  - Ejercicio: Schema completo de e-commerce

- [ ] **Multi-tenant Architecture**
  - Shared schema
  - Shared database, separate schemas
  - Separate databases
  - Row-level security
  - Tenant isolation
  - Ejercicio: Sistema SaaS multi-tenant

- [ ] **Auditoria y Versionado**
  - Audit tables
  - Temporal tables (system-versioned)
  - Change Data Capture (CDC)
  - Event Sourcing con SQL
  - Ejercicio: Sistema de auditoria completo

- [ ] **Jerarquías y Árboles**
  - Adjacency List
  - Nested Set Model
  - Closure Table
  - Materialized Path
  - Trade-offs de cada approach
  - Ejercicio: Estructura organizacional

### 3.4 Modelado Avanzado
**Tiempo estimado: 2-3 semanas**

- [ ] **Polimorfismo en SQL**
  - Single Table Inheritance
  - Class Table Inheritance
  - Concrete Table Inheritance
  - Ejercicio: Sistema de productos con variantes

- [ ] **Flexible Schema Design**
  - EAV (Entity-Attribute-Value)
  - JSON columns para datos flexibles
  - Cuándo usar EAV (y cuándo NO)
  - Hybrid approaches
  - Ejercicio: Sistema de atributos personalizables

- [ ] **Time Series Data**
  - Partitioning por tiempo
  - Time-bucket aggregations
  - Retention policies
  - Compression
  - Ejercicio: Telemetry data storage

---

## Nivel 4: Performance e Indexación

### 4.1 Fundamentos de Indexación
**Tiempo estimado: 2-3 semanas**

- [ ] **Tipos de Índices**
  - B-Tree indexes (default)
  - Hash indexes
  - GiST (Generalized Search Tree)
  - GIN (Generalized Inverted Index)
  - BRIN (Block Range Index)
  - Cuándo usar cada tipo
  - Ejercicio: Benchmark de diferentes índices

- [ ] **Creación y Gestión de Índices**
  - CREATE INDEX
  - Unique indexes
  - Partial indexes
  - Expression indexes
  - Multi-column indexes
  - Orden de columnas en índices
  - Ejercicio: Estrategia de indexación completa

- [ ] **Index Maintenance**
  - REINDEX
  - Monitoring index usage
  - pg_stat_user_indexes
  - Indexes no utilizados
  - Index bloat
  - Ejercicio: Auditoría de índices

### 4.2 Optimización de Performance
**Tiempo estimado: 2-3 semanas**

- [ ] **Query Performance Tuning**
  - Identifying slow queries
  - pg_stat_statements
  - Query profiling
  - Rewriting queries
  - Ejercicio: Optimizar top 10 queries lentas

- [ ] **Connection Pooling**
  - PgBouncer, pgpool-II
  - Connection limits
  - Connection pool sizing
  - Ejercicio: Configurar connection pooling

- [ ] **Caching Strategies**
  - Query result caching
  - Application-level caching
  - Redis como cache de DB
  - Cache invalidation strategies
  - Ejercicio: Implementar caching layer

### 4.3 Particionamiento
**Tiempo estimado: 2-3 semanas**

- [ ] **Table Partitioning**
  - Range partitioning
  - List partitioning
  - Hash partitioning
  - Declarative partitioning (PostgreSQL 10+)
  - Partition pruning
  - Ejercicio: Particionar tabla de logs

- [ ] **Partition Management**
  - Adding/removing partitions
  - Detaching partitions
  - Data lifecycle management
  - Archival strategies
  - Ejercicio: Automatic partition creation

- [ ] **Sharding Concepts**
  - Horizontal sharding
  - Vertical sharding
  - Shard keys
  - Cross-shard queries
  - Ejercicio: Diseño de estrategia de sharding

### 4.4 Monitoreo y Diagnóstico
**Tiempo estimado: 2 semanas**

- [ ] **Database Monitoring**
  - pg_stat_activity
  - pg_stat_database
  - pg_stat_user_tables
  - Long-running queries
  - Lock monitoring
  - Ejercicio: Dashboard de monitoreo

- [ ] **Performance Metrics**
  - Transaction throughput
  - Query latency
  - Connection count
  - Cache hit ratio
  - Disk I/O
  - Ejercicio: Baseline de performance

- [ ] **Alerting y Troubleshooting**
  - Configurar alertas
  - Deadlock detection
  - Slow query logs
  - Error logs analysis
  - Ejercicio: Sistema de alertas proactivo

---

## Nivel 5: Conceptos Avanzados de Bases de Datos

### 5.1 Transacciones Avanzadas
**Tiempo estimado: 2-3 semanas**

- [ ] **Isolation Levels**
  - READ UNCOMMITTED
  - READ COMMITTED (default en PostgreSQL)
  - REPEATABLE READ
  - SERIALIZABLE
  - Phenomena: Dirty reads, Non-repeatable reads, Phantom reads
  - Ejercicio: Demostrar cada isolation level

- [ ] **Locking Mechanisms**
  - Row-level locks
  - Table-level locks
  - Advisory locks
  - FOR UPDATE, FOR SHARE
  - Lock wait timeout
  - Deadlocks
  - Ejercicio: Manejo de concurrencia

- [ ] **MVCC (Multi-Version Concurrency Control)**
  - Cómo funciona MVCC
  - Transaction ID
  - Snapshot isolation
  - Vacuum y dead tuples
  - Ejercicio: Entender MVCC internamente

### 5.2 Tipos de Datos Avanzados
**Tiempo estimado: 2-3 semanas**

- [ ] **JSON y JSONB**
  - JSON vs JSONB (PostgreSQL)
  - Operadores JSON
  - Indexing JSON (GIN indexes)
  - JSON path expressions
  - Cuándo usar JSON en SQL
  - Ejercicio: Schema flexible con JSONB

- [ ] **Arrays**
  - Array types
  - Array operations
  - ANY, ALL operators
  - Array indexing (GIN)
  - Ejercicio: Tags system con arrays

- [ ] **Full-Text Search**
  - tsvector, tsquery
  - Text search configurations
  - Ranking results
  - Phrase search
  - GIN indexes para FTS
  - Ejercicio: Search engine con PostgreSQL

- [ ] **Spatial Data (PostGIS)**
  - Geometry types
  - Spatial queries
  - Spatial indexes
  - Ejercicio: Location-based queries

### 5.3 Replicación y Alta Disponibilidad
**Tiempo estimado: 2-3 semanas**

- [ ] **Replication Fundamentals**
  - Streaming replication (PostgreSQL)
  - Master-slave replication
  - Multi-master replication
  - Logical replication
  - Ejercicio: Configurar replication básica

- [ ] **Backup y Recovery**
  - pg_dump, pg_restore
  - pg_basebackup
  - Point-in-time recovery (PITR)
  - WAL archiving
  - Backup strategies
  - Ejercicio: Implementar backup automatizado

- [ ] **High Availability**
  - Failover mechanisms
  - Load balancing
  - Connection routing
  - Patroni, PgPool-II
  - Ejercicio: Cluster HA con Patroni

### 5.4 Security
**Tiempo estimado: 2 semanas**

- [ ] **Authentication y Authorization**
  - Users y Roles
  - GRANT, REVOKE
  - Row-Level Security (RLS)
  - pg_hba.conf
  - SSL connections
  - Ejercicio: Sistema de permisos granular

- [ ] **SQL Injection Prevention**
  - Prepared statements
  - Parameterized queries
  - Input validation
  - Principle of least privilege
  - Ejercicio: Auditar código vulnerable

- [ ] **Data Encryption**
  - Encryption at rest
  - Encryption in transit
  - pgcrypto extension
  - Ejercicio: Cifrar datos sensibles

---

## Nivel 6: Patrones Empresariales y Producción

### 6.1 Data Warehouse y Analytics
**Tiempo estimado: 3-4 semanas**

- [ ] **Star Schema Design**
  - Fact tables
  - Dimension tables
  - Slowly Changing Dimensions (SCD Type 1, 2, 3)
  - Ejercicio: Data warehouse para ventas

- [ ] **Snowflake Schema**
  - Normalized dimensions
  - Star vs Snowflake trade-offs
  - Ejercicio: Convertir star a snowflake

- [ ] **OLAP vs OLTP**
  - Diferencias arquitectónicas
  - Columnar storage
  - Aggregate tables
  - Ejercicio: Diseñar para OLAP

- [ ] **ETL Processes**
  - Extract, Transform, Load
  - Incremental loads
  - Change Data Capture
  - Data validation
  - Ejercicio: Pipeline ETL completo

### 6.2 Migraciones y Evolución de Schema
**Tiempo estimado: 2-3 semanas**

- [ ] **Schema Migrations**
  - Flyway, Liquibase
  - Migration versioning
  - Rollback strategies
  - Zero-downtime migrations
  - Ejercicio: Sistema de migraciones automatizado

- [ ] **Database Refactoring**
  - Rename column/table
  - Split table
  - Merge tables
  - Extract table
  - Backward compatibility
  - Ejercicio: Refactoring incremental

- [ ] **Blue-Green Database Deployments**
  - Dual-write pattern
  - Read from old, write to both
  - Migration strategies
  - Ejercicio: Migración sin downtime

### 6.3 Polyglot Persistence
**Tiempo estimado: 2-3 semanas**

- [ ] **SQL + NoSQL Integration**
  - Cuándo usar SQL vs NoSQL
  - Foreign Data Wrappers (FDW)
  - Integración con MongoDB
  - Integración con Redis
  - Ejercicio: Hybrid architecture

- [ ] **Event Sourcing con SQL**
  - Event store en PostgreSQL
  - Snapshots
  - Projections
  - Ejercicio: Event-sourced aggregate

- [ ] **CQRS con SQL**
  - Write model vs Read model
  - Synchronization strategies
  - Eventual consistency
  - Ejercicio: CQRS implementation

### 6.4 Testing y CI/CD
**Tiempo estimado: 2-3 semanas**

- [ ] **Database Testing**
  - Unit tests para functions
  - Integration tests
  - Test data management
  - pgTAP (PostgreSQL)
  - Ejercicio: Test suite completo

- [ ] **CI/CD para Databases**
  - Automated migrations en CI
  - Database versioning
  - Test databases
  - Production-like environments
  - Ejercicio: Pipeline CI/CD con DB

- [ ] **Database Seeding**
  - Test data factories
  - Fixture management
  - Anonymization de datos
  - Ejercicio: Sistema de seeds

### 6.5 Observability y Troubleshooting
**Tiempo estimado: 2 semanas**

- [ ] **Logging Strategies**
  - Structured logging
  - Slow query logging
  - Log aggregation
  - Ejercicio: Centralized logging

- [ ] **Metrics y Dashboards**
  - Prometheus + Grafana
  - Key metrics
  - SLA monitoring
  - Ejercicio: Dashboard operacional

- [ ] **Capacity Planning**
  - Growth projection
  - Resource planning
  - Scaling strategies
  - Ejercicio: Plan de crecimiento

### 6.6 Proyecto Final Integrador
**Tiempo estimado: 6-8 semanas**

- [ ] **Sistema Empresarial Completo**

**Arquitectura completa:**
  - Transactional database (OLTP)
  - Analytical database (OLAP)
  - Event store
  - Materialized views para reporting
  - Multi-tenant con RLS
  - Replicación y HA
  - Monitoring completo

**Funcionalidades:**
  - E-commerce platform (products, orders, customers)
  - Inventory management (con concurrencia)
  - Analytics dashboard (star schema)
  - Audit trail completo (temporal tables)
  - Multi-tenant architecture
  - User permissions (RLS)
  - Full-text search
  - Geospatial queries
  - Real-time reporting (materialized views)
  - Data archival (partitioning)

**Requisitos técnicos:**
  - Esquema normalizado (3NF)
  - Desnormalización estratégica para reporting
  - Indexes optimizados
  - Partitioning para datos históricos
  - Functions y triggers para lógica
  - CI/CD con migraciones
  - Tests automatizados
  - Monitoring y alerting
  - Backup y recovery procedures
  - Documentation completa

---

## 📖 Recursos y Práctica

### Libros Recomendados
1. **"Database Design for Mere Mortals"** - Michael J. Hernandez
2. **"SQL Performance Explained"** - Markus Winand
3. **"PostgreSQL: Up and Running"** - Regina Obe, Leo Hsu
4. **"The Art of PostgreSQL"** - Dimitri Fontaine
5. **"Database Internals"** - Alex Petrov
6. **"Designing Data-Intensive Applications"** - Martin Kleppmann
7. **"SQL Antipatterns"** - Bill Karwin
8. **"High Performance MySQL"** - Baron Schwartz

### Recursos Online
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Documentación oficial completa
- [Use The Index, Luke](https://use-the-index-luke.com/) - SQL indexing and tuning
- [Modern SQL](https://modern-sql.com/) - Características SQL modernas
- [PgExercises](https://pgexercises.com/) - Ejercicios interactivos de PostgreSQL
- [SQLBolt](https://sqlbolt.com/) - Tutorial interactivo
- [DB Fiddle](https://www.db-fiddle.com/) - SQL online playground
- [Explain.depesz.com](https://explain.depesz.com/) - EXPLAIN visualizer
- [PostgreSQL Wiki](https://wiki.postgresql.org/) - Wiki comunitario

### Cursos Recomendados
- SQL for Data Science (Coursera)
- The Complete SQL Bootcamp (Udemy)
- PostgreSQL Fundamentals (Pluralsight)
- Database Design and Management (edX)

### Datasets para Práctica
- [Pagila](https://github.com/devrimgunduz/pagila) - DVD rental database
- [Chinook Database](https://github.com/lerocha/chinook-database) - Digital media store
- [AdventureWorks](https://github.com/Microsoft/sql-server-samples) - Microsoft sample
- [Sakila](https://dev.mysql.com/doc/sakila/en/) - MySQL sample
- [Northwind](https://github.com/pthom/northwind_psql) - Classic sample database

### Práctica Recomendada

#### Ejercicios Diarios (30-60 min)
- Resolver 5-10 queries en PgExercises
- Leer y analizar execution plans
- Practicar una función SQL nueva
- Revisar queries de producción

#### Ejercicios Semanales (3-5 horas)
- Diseñar schema para caso real
- Optimizar queries lentas
- Implementar un patrón de diseño
- Estudiar schema de apps open source

#### Proyectos Mensuales (10-20 horas)
- Proyectos integradores al final de cada nivel
- Contribuir a proyectos de DB open source
- Crear biblioteca de queries útiles
- Blog posts sobre aprendizajes

### Sistema de Evaluación

#### Por cada concepto/técnica:
- [ ] Entender el problema que resuelve
- [ ] Conocer las alternativas
- [ ] Implementar desde cero
- [ ] Identificar cuándo usar y cuándo NO usar
- [ ] Conocer trade-offs de performance
- [ ] Hacer al menos 3-5 ejercicios prácticos

#### Criterios de Dominio:
- **Básico**: Puedes escribir queries simples con documentación
- **Intermedio**: Puedes diseñar schemas normalizados
- **Avanzado**: Puedes optimizar performance y diseñar arquitecturas complejas
- **Experto**: Puedes tomar decisiones arquitectónicas y enseñar a otros

---

## 🎯 Plan de Estudio Sugerido

### Opción Intensiva (4-5 meses)
- 20-30 horas/semana
- Enfoque full-time en aprendizaje
- Completar todos los niveles secuencialmente
- Database local + cloud (AWS RDS/Azure/GCP)

### Opción Moderada (8-10 meses)
- 10-15 horas/semana
- Balance con trabajo
- Profundizar en cada tema
- Aplicar en proyectos reales

### Opción Pausada (12-15 meses)
- 5-10 horas/semana
- Aprendizaje sostenible
- Máxima retención y práctica
- Consolidación con lecturas teóricas

---

## 🚀 Consejos para el Éxito

1. **Practica con datos reales** - Usa datasets reales, no solo ejemplos de tutorial
2. **Aprende a leer EXPLAIN** - Es fundamental para optimización
3. **Diseña primero en papel** - ER diagrams antes de código
4. **Normaliza, luego desnormaliza** - Siempre desde una base sólida
5. **Estudia schemas de apps populares** - GitHub, Gitlab, Discourse
6. **Aprende un motor en profundidad** - PostgreSQL recomendado
7. **Monitorea todo** - No optimices sin métricas
8. **Usa transacciones** - Especialmente en multi-step operations
9. **Backup antes de experimentos** - Siempre ten un plan B
10. **Documenta tus decisiones** - Futuro tú te lo agradecerá
11. **Evita over-engineering** - YAGNI aplica también a DB design
12. **Aprende los internals** - Entender cómo funciona por dentro
13. **Test con datos reales** - Performance con 10 rows vs 10M es diferente
14. **Participa en comunidades** - PostgreSQL Slack, Reddit r/PostgreSQL
15. **Enseña lo que aprendes** - Consolida conocimiento enseñando

---

## 📝 Tracking de Progreso

### Formato de Registro

Para cada tema completado, registra:
```
Tema: [Nombre]
Fecha: [DD/MM/YYYY]
Tiempo invertido: [X horas]
Motor DB: [PostgreSQL/MySQL/etc]
Nivel de comprensión: [Básico/Intermedio/Avanzado/Experto]
Ejercicios completados: [X/Y]
Proyecto práctica: [URL GitHub]
Notas: [Insights, dificultades, optimizaciones, queries útiles]
```

### Milestones

- [ ] **Mes 1**: SQL básico - SELECT, JOIN, agregaciones
- [ ] **Mes 2**: DDL, DML, transacciones básicas
- [ ] **Mes 3**: Window functions, CTEs, optimización básica
- [ ] **Mes 4**: Modelado ER, normalización
- [ ] **Mes 5**: Diseño de schemas complejos
- [ ] **Mes 6**: Indexación y performance tuning
- [ ] **Mes 7**: Particionamiento y sharding
- [ ] **Mes 8**: Transacciones avanzadas, replicación
- [ ] **Mes 9**: Security, backup/recovery
- [ ] **Mes 10**: Data warehousing, analytics
- [ ] **Mes 11**: Migraciones, testing, CI/CD
- [ ] **Mes 12**: Proyecto final integrador

---

## 🎓 Próximos Pasos

1. **Instala PostgreSQL** (versión 15+)
2. **Configura entorno** (pgAdmin o DBeaver)
3. **Carga dataset de práctica** (Pagila o Chinook)
4. **Ejecuta tus primeras queries** (SELECT, WHERE, ORDER BY)
5. **Crea tu primera base de datos** (esquema simple)
6. **Únete a comunidades** (PostgreSQL Slack, Discord)
7. **Configura Docker** (para experimentación rápida)
8. **Elige tu plan de estudio** (Intensivo/Moderado/Pausado)
9. **Crea repositorio de aprendizaje** (GitHub con tus queries)
10. **Comienza con Nivel 1** (fundamentos sólidos primero)

---

## 🏆 Certificaciones Recomendadas

### PostgreSQL:
1. **PostgreSQL Certified Associate** - EnterpriseDB
2. **PostgreSQL Certified Professional** - EnterpriseDB

### Microsoft SQL Server:
1. **Microsoft Certified: Azure Database Administrator Associate**

### Oracle:
1. **Oracle Database SQL Certified Associate**

### General:
1. **AWS Certified Database - Specialty**
2. **Google Cloud Professional Data Engineer**

---

## 🔥 Proyectos de Práctica Sugeridos

### Nivel Principiante:
- Sistema de biblioteca (books, authors, loans)
- Blog platform (posts, comments, users)
- Todo App con categorías y tags

### Nivel Intermedio:
- E-commerce (products, orders, inventory)
- Social network básica (users, posts, follows, likes)
- Expense tracker con categorías y presupuestos

### Nivel Avanzado:
- Multi-tenant SaaS application
- Analytics dashboard con star schema
- Event-sourced system con projections
- Real-time notification system

---

## 💡 Diferencias SQL vs NoSQL - Cuándo Usar Cada Uno

### Usa SQL cuando:
✅ Necesitas transacciones ACID fuertes
✅ Datos estructurados y relaciones claras
✅ Queries complejas con JOINs
✅ Reportes y analytics
✅ Integridad referencial crítica
✅ Consistencia fuerte requerida

### Usa NoSQL cuando:
✅ Necesitas escalabilidad horizontal masiva
✅ Datos no estructurados o semi-estructurados
✅ Schema flexible
✅ Alta velocidad de escritura
✅ Eventual consistency aceptable
✅ Datos de tiempo real o streams

### Polyglot Persistence (Lo mejor de ambos):
- SQL para transacciones y reportes
- Redis para caching
- MongoDB para datos flexibles
- ElasticSearch para búsqueda
- Time-series DB para métricas

---

## 📊 Comparación de Motores SQL

| Feature | PostgreSQL | MySQL | SQL Server | Oracle |
|---------|-----------|--------|------------|---------|
| Open Source | ✅ | ✅ | ❌ | ❌ |
| ACID Compliance | ✅ | ✅ | ✅ | ✅ |
| JSON Support | ✅ JSONB | ✅ | ✅ | ✅ |
| Window Functions | ✅ | ✅ (8.0+) | ✅ | ✅ |
| Full-Text Search | ✅ | ✅ | ✅ | ✅ |
| Spatial Data | ✅ PostGIS | ✅ | ✅ | ✅ |
| Replication | ✅ | ✅ | ✅ | ✅ |
| Partitioning | ✅ | ✅ | ✅ | ✅ |
| CTE Recursivos | ✅ | ✅ (8.0+) | ✅ | ✅ |
| Performance | Excelente | Muy bueno | Excelente | Excelente |
| Community | Grande | Grande | Medio | Medio |
| Learning Curve | Media | Baja | Media | Alta |
| Cost | Free | Free | $$$ | $$$$ |

**Recomendación para aprendizaje:** PostgreSQL (feature-rich, open source, excelente documentación)

---

## 🌟 Casos de Estudio Reales

### Estudio 1: De MongoDB a PostgreSQL (Uber)
- **Problema**: Escalabilidad y consistencia con MongoDB
- **Solución**: Migración a PostgreSQL
- **Resultados**: Mejor integridad de datos, queries más eficientes
- **Lección**: SQL puede escalar cuando se diseña correctamente

### Estudio 2: Sharding en Instagram
- **Escala**: Miles de millones de filas
- **Solución**: PostgreSQL con sharding por user_id
- **Técnicas**: Partitioning, replication, caching
- **Lección**: PostgreSQL puede manejar escala masiva

### Estudio 3: Analytics en Segment
- **Problema**: OLAP queries lentas en OLTP database
- **Solución**: Data warehouse separado con star schema
- **Resultados**: Queries 100x más rápidas
- **Lección**: Separar OLTP de OLAP

---

**¡Buena suerte en tu viaje hacia la maestría en SQL & Modelado de Datos!** 🗄️

*Recuerda: Una base de datos bien diseñada es la columna vertebral de cualquier aplicación empresarial. El tiempo invertido en diseño y modelado se paga con creces en mantenibilidad y performance. SQL y NoSQL no son competidores, son herramientas complementarias en tu arsenal de arquitectura de datos.*

**Pro tip**: Antes de escribir cualquier query compleja, dibuja el execution plan en papel. Antes de crear cualquier tabla, dibuja el diagrama ER. El diseño primero, código después.
