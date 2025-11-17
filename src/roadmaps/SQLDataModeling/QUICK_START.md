# ⚡ Quick Start - SQL & Modelado de Datos

Esta guía te ayudará a empezar tu aprendizaje de SQL y Modelado de Datos en **menos de 1 hora**.

---

## 🎯 Objetivo

Al finalizar esta guía habrás:
- ✅ Instalado PostgreSQL
- ✅ Configurado tu entorno de desarrollo
- ✅ Creado tu primera base de datos
- ✅ Ejecutado tus primeras queries
- ✅ Diseñado tu primer schema
- ✅ Entendido el roadmap completo

---

## 📋 Prerequisitos

- **Conocimientos básicos de programación** (cualquier lenguaje)
- **Línea de comandos básica** (terminal)
- **10-15 GB de espacio libre** (para PostgreSQL y datos de práctica)
- **Cuenta de GitHub** (para guardar tu progreso)

---

## 🚀 Paso 1: Instalación de PostgreSQL (15 min)

### Opción A: Con Docker (Recomendado - Más rápido)

```bash
# 1. Instalar Docker (si no lo tienes)
# https://docs.docker.com/get-docker/

# 2. Crear directorio para tu proyecto
mkdir -p ~/sql-learning
cd ~/sql-learning

# 3. Crear archivo docker-compose.yml
cat > docker-compose.yml <<EOF
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: postgres-learning
    environment:
      POSTGRES_USER: sqluser
      POSTGRES_PASSWORD: sqlpass123
      POSTGRES_DB: learning_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./sql-scripts:/sql-scripts

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: pgadmin-learning
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin123
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
EOF

# 4. Iniciar PostgreSQL
docker-compose up -d

# 5. Verificar que está corriendo
docker ps
```

### Opción B: Instalación Local

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql-15 postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
- Descargar installer desde: https://www.postgresql.org/download/windows/
- Ejecutar installer y seguir instrucciones
- Recordar usuario y contraseña configurados

---

## 🛠️ Paso 2: Instalar Cliente SQL (10 min)

### Opción A: DBeaver (Recomendado - Universal)

1. Descargar desde: https://dbeaver.io/download/
2. Instalar para tu sistema operativo
3. Abrir DBeaver
4. Click en "Nueva Conexión"
5. Seleccionar PostgreSQL
6. Configurar:
   - **Host**: localhost
   - **Port**: 5432
   - **Database**: learning_db
   - **Username**: sqluser (o tu usuario)
   - **Password**: sqlpass123 (o tu contraseña)
7. Click "Test Connection" → "OK"

### Opción B: pgAdmin (PostgreSQL específico)

Si usaste Docker, ya está disponible en: http://localhost:5050
- **Email**: admin@example.com
- **Password**: admin123

### Opción C: psql (Línea de Comandos)

```bash
# Conectarse con Docker
docker exec -it postgres-learning psql -U sqluser -d learning_db

# O conectarse localmente
psql -U sqluser -d learning_db
```

---

## 📊 Paso 3: Tu Primera Base de Datos (10 min)

### Crear Schema de Biblioteca Simple

```sql
-- 1. Conectarse a tu base de datos
-- (ya deberías estar conectado desde el paso anterior)

-- 2. Crear tabla de autores
CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birth_year INTEGER,
    country VARCHAR(50)
);

-- 3. Crear tabla de libros
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author_id INTEGER REFERENCES authors(author_id),
    publication_year INTEGER,
    genre VARCHAR(50),
    pages INTEGER,
    isbn VARCHAR(13) UNIQUE
);

-- 4. Crear tabla de préstamos
CREATE TABLE loans (
    loan_id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(book_id),
    borrower_name VARCHAR(100) NOT NULL,
    loan_date DATE DEFAULT CURRENT_DATE,
    return_date DATE,
    returned BOOLEAN DEFAULT FALSE
);

-- 5. Insertar datos de ejemplo
INSERT INTO authors (name, birth_year, country) VALUES
    ('Gabriel García Márquez', 1927, 'Colombia'),
    ('Isabel Allende', 1942, 'Chile'),
    ('Jorge Luis Borges', 1899, 'Argentina'),
    ('Julio Cortázar', 1914, 'Argentina');

INSERT INTO books (title, author_id, publication_year, genre, pages, isbn) VALUES
    ('Cien años de soledad', 1, 1967, 'Realismo mágico', 471, '9780307474728'),
    ('El amor en los tiempos del cólera', 1, 1985, 'Romance', 368, '9780307389732'),
    ('La casa de los espíritus', 2, 1982, 'Ficción', 448, '9781501117015'),
    ('Ficciones', 3, 1944, 'Cuentos', 174, '9780802130303'),
    ('Rayuela', 4, 1963, 'Novela', 600, '9788437604572');

INSERT INTO loans (book_id, borrower_name, loan_date, return_date, returned) VALUES
    (1, 'María López', '2025-01-01', '2025-01-15', TRUE),
    (2, 'Juan Pérez', '2025-01-10', NULL, FALSE),
    (3, 'Ana García', '2025-01-12', NULL, FALSE),
    (1, 'Carlos Ruiz', '2025-01-20', NULL, FALSE);

-- 6. Verificar que todo funciona
SELECT * FROM authors;
SELECT * FROM books;
SELECT * FROM loans;
```

---

## 🔍 Paso 4: Tus Primeras Queries (10 min)

Ejecuta estas queries para familiarizarte con SQL:

```sql
-- Query 1: Libros con sus autores (JOIN)
SELECT
    b.title,
    a.name AS author,
    b.publication_year,
    b.genre
FROM books b
INNER JOIN authors a ON b.author_id = a.author_id
ORDER BY b.publication_year;

-- Query 2: Autores con más de un libro (Agregación)
SELECT
    a.name,
    COUNT(b.book_id) AS total_books,
    AVG(b.pages) AS avg_pages
FROM authors a
LEFT JOIN books b ON a.author_id = b.author_id
GROUP BY a.author_id, a.name
HAVING COUNT(b.book_id) > 0
ORDER BY total_books DESC;

-- Query 3: Libros actualmente prestados (Subconsulta)
SELECT
    b.title,
    l.borrower_name,
    l.loan_date,
    CURRENT_DATE - l.loan_date AS days_borrowed
FROM books b
INNER JOIN loans l ON b.book_id = l.book_id
WHERE l.returned = FALSE
ORDER BY days_borrowed DESC;

-- Query 4: Libros nunca prestados (NOT EXISTS)
SELECT title, genre
FROM books b
WHERE NOT EXISTS (
    SELECT 1
    FROM loans l
    WHERE l.book_id = b.book_id
);

-- Query 5: Top autores por país (Window Function)
SELECT
    name,
    country,
    total_books,
    RANK() OVER (PARTITION BY country ORDER BY total_books DESC) AS rank_in_country
FROM (
    SELECT
        a.name,
        a.country,
        COUNT(b.book_id) AS total_books
    FROM authors a
    LEFT JOIN books b ON a.author_id = b.author_id
    GROUP BY a.author_id, a.name, a.country
) author_stats
ORDER BY country, rank_in_country;
```

---

## 📈 Paso 5: Tu Primer Diagrama ER (5 min)

Dibuja (en papel o herramienta digital) el diagrama ER del schema que acabas de crear:

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   AUTHORS    │         │    BOOKS     │         │    LOANS     │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ author_id PK │────1:N──│ book_id   PK │────1:N──│ loan_id   PK │
│ name         │         │ title        │         │ book_id   FK │
│ birth_year   │         │ author_id FK │         │ borrower_name│
│ country      │         │ pub_year     │         │ loan_date    │
└──────────────┘         │ genre        │         │ return_date  │
                         │ pages        │         │ returned     │
                         │ isbn         │         └──────────────┘
                         └──────────────┘
```

**Relaciones:**
- Un autor puede tener muchos libros (1:N)
- Un libro puede tener muchos préstamos (1:N)

---

## 🎯 Paso 6: Entender el Roadmap (5 min)

Abre el [README.md](./README.md) y revisa:

### Nivel 1: Fundamentos de SQL (2-3 semanas)
✅ Ya hiciste tu primer SELECT, JOIN, INSERT
- Próximo: Profundizar en tipos de JOINs, subconsultas

### Nivel 2: SQL Avanzado (4-6 semanas)
- Window functions (ya probaste ROW_NUMBER, RANK)
- CTEs (Common Table Expressions)
- Views y Funciones

### Nivel 3: Modelado de Datos (6-8 semanas)
✅ Ya hiciste un diagrama ER básico
- Próximo: Normalización, diseño de schemas complejos

### Nivel 4: Performance (4-6 semanas)
- Indexación
- Optimización de queries
- Particionamiento

### Nivel 5: Conceptos Avanzados (4-6 semanas)
- Transacciones avanzadas
- Replicación
- Security

### Nivel 6: Patrones Empresariales (6-8 semanas)
- Data warehousing
- Migraciones
- CI/CD

**Tiempo total estimado:** 4-12 meses (dependiendo de tu dedicación)

---

## 📚 Paso 7: Recursos Esenciales

### Para aprender ahora (empieza aquí):
1. **[PgExercises](https://pgexercises.com/)** - Ejercicios interactivos
2. **[SQLBolt](https://sqlbolt.com/)** - Tutorial paso a paso
3. **[PostgreSQL Tutorial](https://www.postgresqltutorial.com/)** - Guía completa

### Para consulta rápida:
- **[PostgreSQL Docs](https://www.postgresql.org/docs/15/index.html)** - Documentación oficial
- **[SQL Cheat Sheet](https://www.sqltutorial.org/sql-cheat-sheet/)** - Referencia rápida

### Para práctica:
- **[DB Fiddle](https://www.db-fiddle.com/)** - SQL online playground
- **Datasets**: Pagila, Chinook, Northwind (buscar en GitHub)

---

## 🎮 Desafíos para Esta Semana

Ahora que tienes el ambiente configurado, intenta estos desafíos:

### Día 1-2: Queries Básicas
- [ ] Crear 5 queries SELECT con diferentes WHERE conditions
- [ ] Practicar ORDER BY, LIMIT, DISTINCT
- [ ] Usar operadores LIKE, IN, BETWEEN

### Día 3-4: JOINs
- [ ] Hacer INNER JOIN entre 3 tablas
- [ ] Comparar LEFT JOIN vs INNER JOIN
- [ ] Intentar un SELF JOIN

### Día 5-6: Agregaciones
- [ ] Usar COUNT, SUM, AVG, MIN, MAX
- [ ] Practicar GROUP BY con múltiples columnas
- [ ] Usar HAVING para filtrar agregaciones

### Día 7: Proyecto Mini
- [ ] Diseñar tu propio schema (puede ser de algo que te interese)
- [ ] Crear tablas con relaciones
- [ ] Insertar datos de ejemplo
- [ ] Hacer 10 queries útiles sobre esos datos

---

## 💡 Tips para tu Aprendizaje

### ✅ Haz esto:
1. **Practica todos los días** - Aunque sean 15 minutos
2. **Dibuja antes de codear** - Siempre diseña tu schema en papel primero
3. **Lee execution plans** - Usa EXPLAIN en queries complejas
4. **Guarda tus queries** - Crea un repositorio GitHub con tus ejercicios
5. **Explica en voz alta** - Enseñar a otros consolida tu conocimiento

### ❌ Evita esto:
1. No saltes niveles - Los fundamentos son críticos
2. No copies sin entender - Escribe cada query tú mismo
3. No ignores los errores - Léelos y entiéndelos
4. No optimices prematuramente - Primero que funcione, luego optimiza
5. No uses SELECT * en producción - Sé específico con las columnas

---

## 🏆 Hitos de Progreso

### Semana 1: ✅ Completada si puedes:
- Crear tablas con relaciones
- Hacer queries con JOIN
- Usar agregaciones básicas

### Mes 1: ✅ Completado si puedes:
- Diseñar schemas normalizados
- Usar window functions
- Escribir CTEs
- Crear views y funciones simples

### Mes 3: ✅ Completado si puedes:
- Diseñar schemas complejos multi-tabla
- Optimizar queries con EXPLAIN
- Crear índices estratégicos
- Entender trade-offs de normalización

### Mes 6: ✅ Completado si puedes:
- Diseñar arquitecturas de datos completas
- Implementar replicación
- Crear pipelines ETL
- Hacer migraciones sin downtime

---

## 🔄 Próximos Pasos

Ahora que completaste el Quick Start:

1. **Bookmark estos recursos:**
   - [README.md](./README.md) - Roadmap completo
   - [INDICE.md](./INDICE.md) - Índice detallado
   - [PostgreSQL Docs](https://www.postgresql.org/docs/)

2. **Únete a comunidades:**
   - [r/PostgreSQL](https://www.reddit.com/r/PostgreSQL/)
   - [PostgreSQL Slack](https://postgres-slack.herokuapp.com/)
   - [Stack Overflow - PostgreSQL](https://stackoverflow.com/questions/tagged/postgresql)

3. **Configura tu workflow:**
   - Crea repositorio GitHub: `sql-learning`
   - Commit diario con tus ejercicios
   - Documenta lo que aprendes (README.md con notas)

4. **Planifica tu estudio:**
   - Elige: Intensivo (20h/sem) / Moderado (10h/sem) / Pausado (5h/sem)
   - Bloquea tiempo en tu calendario
   - Define tu meta (ej: "Dominar SQL en 6 meses")

5. **Empieza Nivel 1:**
   - Ve a `01-fundamentos-sql/` (cuando esté disponible)
   - O continúa con PgExercises
   - Sigue el roadmap secuencialmente

---

## ❓ Troubleshooting

### No puedo conectarme a PostgreSQL
```bash
# Verificar que PostgreSQL está corriendo (Docker)
docker ps

# Ver logs si hay error
docker logs postgres-learning

# Reiniciar contenedor
docker-compose restart
```

### Olvidé mi contraseña
```bash
# Con Docker, puedes cambiarla en docker-compose.yml
# Luego:
docker-compose down
docker-compose up -d
```

### Error de permisos
```sql
-- Dar permisos al usuario
GRANT ALL PRIVILEGES ON DATABASE learning_db TO sqluser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO sqluser;
```

### Query muy lenta
```sql
-- Analizar query
EXPLAIN ANALYZE SELECT ...;

-- Ver queries activas
SELECT * FROM pg_stat_activity;
```

---

## 🎉 ¡Felicitaciones!

Has completado el Quick Start. Ahora tienes:
- ✅ PostgreSQL instalado y corriendo
- ✅ Cliente SQL configurado
- ✅ Primera base de datos creada
- ✅ Primeras queries ejecutadas
- ✅ Entendimiento del roadmap completo

**Siguiente paso:** Profundiza en el [Nivel 1: Fundamentos de SQL](./README.md#nivel-1-fundamentos-de-sql)

---

## 📞 ¿Necesitas Ayuda?

- **Problemas técnicos:** Stack Overflow con tag `postgresql`
- **Conceptos SQL:** r/PostgreSQL o PostgreSQL Slack
- **Roadmap:** Revisa [README.md](./README.md) para más detalles
- **Ejemplos:** Busca "postgresql examples" en GitHub

---

**¡Bienvenido al mundo de SQL y Modelado de Datos!** 🗄️

*Recuerda: La práctica constante es más importante que las horas intensas. 30 minutos diarios son mejor que 5 horas un solo día a la semana.*

**Pro tip final:** Antes de avanzar al siguiente nivel, asegúrate de poder hacer todas las queries de este Quick Start **sin mirar la documentación**. La fluidez con SQL básico es la base de todo lo demás.
