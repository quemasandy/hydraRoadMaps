-- ============================================================================
-- Nivel 1: Fundamentos de SQL
-- Módulo: Queries Básicas - SELECT y WHERE
-- ============================================================================

-- Este archivo cubre:
-- - SELECT básico
-- - WHERE con diferentes operadores
-- - Operadores de comparación y lógicos
-- - LIKE, IN, BETWEEN, IS NULL
-- - ORDER BY, LIMIT, DISTINCT

-- ============================================================================
-- Setup: Crear tablas de ejemplo
-- ============================================================================

-- Tabla de empleados
CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    hire_date DATE NOT NULL,
    salary DECIMAL(10, 2),
    department VARCHAR(50),
    manager_id INTEGER REFERENCES employees(employee_id),
    active BOOLEAN DEFAULT TRUE
);

-- Insertar datos de ejemplo
INSERT INTO employees (first_name, last_name, email, phone, hire_date, salary, department, manager_id, active) VALUES
    ('Juan', 'García', 'juan.garcia@company.com', '+34-600-111-222', '2020-01-15', 45000, 'Engineering', NULL, TRUE),
    ('María', 'López', 'maria.lopez@company.com', '+34-600-222-333', '2020-03-01', 42000, 'Engineering', 1, TRUE),
    ('Carlos', 'Martínez', 'carlos.martinez@company.com', '+34-600-333-444', '2021-06-15', 38000, 'Sales', NULL, TRUE),
    ('Ana', 'Rodríguez', 'ana.rodriguez@company.com', '+34-600-444-555', '2021-08-01', 35000, 'Sales', 3, TRUE),
    ('Pedro', 'Sánchez', 'pedro.sanchez@company.com', '+34-600-555-666', '2022-01-10', 40000, 'Marketing', NULL, TRUE),
    ('Laura', 'Fernández', NULL, '+34-600-666-777', '2022-03-20', 36000, 'Marketing', 5, FALSE),
    ('Diego', 'Gómez', 'diego.gomez@company.com', NULL, '2023-05-15', 50000, 'Engineering', 1, TRUE),
    ('Isabel', 'Ruiz', 'isabel.ruiz@company.com', '+34-600-888-999', '2023-07-01', 32000, 'HR', NULL, TRUE),
    ('Miguel', 'Torres', 'miguel.torres@company.com', '+34-600-999-000', '2023-09-12', 48000, 'Engineering', 1, TRUE),
    ('Carmen', 'Díaz', 'carmen.diaz@company.com', '+34-600-000-111', '2024-01-05', 33000, 'HR', 8, TRUE);

-- ============================================================================
-- 1. SELECT Básico
-- ============================================================================

-- Seleccionar todas las columnas
SELECT * FROM employees;

-- Seleccionar columnas específicas (mejor práctica que SELECT *)
SELECT first_name, last_name, email, department
FROM employees;

-- Alias de columnas (AS es opcional pero recomendado)
SELECT
    first_name AS nombre,
    last_name AS apellido,
    salary AS salario,
    department AS departamento
FROM employees;

-- Expresiones en SELECT
SELECT
    first_name,
    last_name,
    salary,
    salary * 1.10 AS salary_with_raise,
    salary * 12 AS annual_salary
FROM employees;

-- ============================================================================
-- 2. WHERE - Filtrado de Filas
-- ============================================================================

-- Operador de igualdad (=)
SELECT first_name, last_name, department
FROM employees
WHERE department = 'Engineering';

-- Operador de desigualdad (!=, <>)
SELECT first_name, last_name, department
FROM employees
WHERE department != 'Engineering';

-- Operadores de comparación (<, >, <=, >=)
SELECT first_name, last_name, salary
FROM employees
WHERE salary > 40000;

SELECT first_name, last_name, hire_date
FROM employees
WHERE hire_date >= '2023-01-01';

-- ============================================================================
-- 3. Operadores Lógicos (AND, OR, NOT)
-- ============================================================================

-- AND - Ambas condiciones deben ser verdaderas
SELECT first_name, last_name, department, salary
FROM employees
WHERE department = 'Engineering' AND salary > 40000;

-- OR - Al menos una condición debe ser verdadera
SELECT first_name, last_name, department
FROM employees
WHERE department = 'Engineering' OR department = 'Sales';

-- NOT - Niega una condición
SELECT first_name, last_name, department
FROM employees
WHERE NOT department = 'Engineering';

-- Combinación de operadores (usar paréntesis para claridad)
SELECT first_name, last_name, department, salary
FROM employees
WHERE (department = 'Engineering' OR department = 'Sales')
  AND salary > 35000;

-- ============================================================================
-- 4. BETWEEN - Rango de Valores
-- ============================================================================

-- BETWEEN es inclusivo (incluye ambos extremos)
SELECT first_name, last_name, salary
FROM employees
WHERE salary BETWEEN 35000 AND 45000;

-- Equivalente con operadores de comparación
SELECT first_name, last_name, salary
FROM employees
WHERE salary >= 35000 AND salary <= 45000;

-- BETWEEN con fechas
SELECT first_name, last_name, hire_date
FROM employees
WHERE hire_date BETWEEN '2021-01-01' AND '2023-12-31';

-- NOT BETWEEN
SELECT first_name, last_name, salary
FROM employees
WHERE salary NOT BETWEEN 35000 AND 45000;

-- ============================================================================
-- 5. IN - Conjunto de Valores
-- ============================================================================

-- IN - Verificar si un valor está en un conjunto
SELECT first_name, last_name, department
FROM employees
WHERE department IN ('Engineering', 'Sales', 'Marketing');

-- Equivalente con OR (menos legible)
SELECT first_name, last_name, department
FROM employees
WHERE department = 'Engineering'
   OR department = 'Sales'
   OR department = 'Marketing';

-- NOT IN
SELECT first_name, last_name, department
FROM employees
WHERE department NOT IN ('HR', 'Marketing');

-- ============================================================================
-- 6. LIKE - Pattern Matching
-- ============================================================================

-- LIKE con % (cero o más caracteres)
SELECT first_name, last_name, email
FROM employees
WHERE email LIKE '%@company.com';

-- Buscar nombres que empiezan con 'M'
SELECT first_name, last_name
FROM employees
WHERE first_name LIKE 'M%';

-- Buscar nombres que terminan con 'a'
SELECT first_name, last_name
FROM employees
WHERE first_name LIKE '%a';

-- Buscar nombres que contienen 'ar'
SELECT first_name, last_name
FROM employees
WHERE first_name LIKE '%ar%';

-- LIKE con _ (exactamente un carácter)
SELECT first_name, last_name
FROM employees
WHERE first_name LIKE 'M____';  -- Nombres de 5 letras que empiezan con M

-- ILIKE - Case-insensitive LIKE (específico de PostgreSQL)
SELECT first_name, last_name, email
FROM employees
WHERE email ILIKE '%COMPANY%';  -- Encuentra 'company', 'COMPANY', 'Company', etc.

-- NOT LIKE
SELECT first_name, last_name, email
FROM employees
WHERE email NOT LIKE '%@company.com';

-- ============================================================================
-- 7. IS NULL / IS NOT NULL
-- ============================================================================

-- IS NULL - Encontrar valores nulos
SELECT first_name, last_name, email, phone
FROM employees
WHERE email IS NULL;

SELECT first_name, last_name, email, phone
FROM employees
WHERE phone IS NULL;

-- IS NOT NULL - Encontrar valores no nulos
SELECT first_name, last_name, email
FROM employees
WHERE email IS NOT NULL;

-- IMPORTANTE: No usar = NULL, usar IS NULL
-- Incorrecto: WHERE email = NULL
-- Correcto:   WHERE email IS NULL

-- Combinar con otras condiciones
SELECT first_name, last_name, email, active
FROM employees
WHERE email IS NOT NULL AND active = TRUE;

-- ============================================================================
-- 8. ORDER BY - Ordenar Resultados
-- ============================================================================

-- ORDER BY ascendente (por defecto)
SELECT first_name, last_name, salary
FROM employees
ORDER BY salary;

-- ORDER BY ascendente (explícito)
SELECT first_name, last_name, salary
FROM employees
ORDER BY salary ASC;

-- ORDER BY descendente
SELECT first_name, last_name, salary
FROM employees
ORDER BY salary DESC;

-- ORDER BY múltiples columnas
SELECT first_name, last_name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;

-- ORDER BY con alias
SELECT
    first_name,
    last_name,
    salary * 12 AS annual_salary
FROM employees
ORDER BY annual_salary DESC;

-- ORDER BY por posición de columna (no recomendado, menos legible)
SELECT first_name, last_name, salary
FROM employees
ORDER BY 3 DESC;  -- Ordena por la tercera columna (salary)

-- ORDER BY con NULLS FIRST / NULLS LAST (PostgreSQL)
SELECT first_name, last_name, email
FROM employees
ORDER BY email NULLS LAST;

-- ============================================================================
-- 9. LIMIT y OFFSET - Paginación
-- ============================================================================

-- LIMIT - Limitar número de filas
SELECT first_name, last_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 5;

-- LIMIT con OFFSET - Paginación
-- Página 1 (primeros 3 registros)
SELECT first_name, last_name, salary
FROM employees
ORDER BY employee_id
LIMIT 3 OFFSET 0;

-- Página 2 (siguientes 3 registros)
SELECT first_name, last_name, salary
FROM employees
ORDER BY employee_id
LIMIT 3 OFFSET 3;

-- Página 3 (siguientes 3 registros)
SELECT first_name, last_name, salary
FROM employees
ORDER BY employee_id
LIMIT 3 OFFSET 6;

-- Sintaxis alternativa (específica de PostgreSQL)
SELECT first_name, last_name, salary
FROM employees
ORDER BY salary DESC
FETCH FIRST 5 ROWS ONLY;

-- ============================================================================
-- 10. DISTINCT - Valores Únicos
-- ============================================================================

-- DISTINCT en una columna
SELECT DISTINCT department
FROM employees;

-- DISTINCT en múltiples columnas (combinaciones únicas)
SELECT DISTINCT department, active
FROM employees;

-- Contar valores únicos
SELECT COUNT(DISTINCT department) AS unique_departments
FROM employees;

-- DISTINCT con ORDER BY
SELECT DISTINCT department
FROM employees
ORDER BY department;

-- ============================================================================
-- EJERCICIOS PRÁCTICOS
-- ============================================================================

-- Ejercicio 1: Seleccionar empleados del departamento 'Engineering' con salario > 40000
-- TU SOLUCIÓN AQUÍ:


-- Ejercicio 2: Encontrar empleados contratados en 2023
-- TU SOLUCIÓN AQUÍ:


-- Ejercicio 3: Listar empleados cuyo email no sea nulo y estén activos
-- TU SOLUCIÓN AQUÍ:


-- Ejercicio 4: Encontrar los 3 empleados con mayor salario
-- TU SOLUCIÓN AQUÍ:


-- Ejercicio 5: Listar todos los departamentos únicos ordenados alfabéticamente
-- TU SOLUCIÓN AQUÍ:


-- Ejercicio 6: Empleados cuyo nombre contiene 'ar' o 'an'
-- TU SOLUCIÓN AQUÍ:


-- Ejercicio 7: Empleados con salario entre 35000 y 45000, ordenados por departamento
-- TU SOLUCIÓN AQUÍ:


-- Ejercicio 8: Segunda página de empleados (3 por página) ordenados por hire_date
-- TU SOLUCIÓN AQUÍ:


-- ============================================================================
-- SOLUCIONES A LOS EJERCICIOS
-- ============================================================================

-- Solución 1:
-- SELECT first_name, last_name, salary
-- FROM employees
-- WHERE department = 'Engineering' AND salary > 40000;

-- Solución 2:
-- SELECT first_name, last_name, hire_date
-- FROM employees
-- WHERE hire_date BETWEEN '2023-01-01' AND '2023-12-31';

-- Solución 3:
-- SELECT first_name, last_name, email
-- FROM employees
-- WHERE email IS NOT NULL AND active = TRUE;

-- Solución 4:
-- SELECT first_name, last_name, salary
-- FROM employees
-- ORDER BY salary DESC
-- LIMIT 3;

-- Solución 5:
-- SELECT DISTINCT department
-- FROM employees
-- ORDER BY department;

-- Solución 6:
-- SELECT first_name, last_name
-- FROM employees
-- WHERE first_name LIKE '%ar%' OR first_name LIKE '%an%';

-- Solución 7:
-- SELECT first_name, last_name, department, salary
-- FROM employees
-- WHERE salary BETWEEN 35000 AND 45000
-- ORDER BY department;

-- Solución 8:
-- SELECT first_name, last_name, hire_date
-- FROM employees
-- ORDER BY hire_date
-- LIMIT 3 OFFSET 3;

-- ============================================================================
-- BUENAS PRÁCTICAS
-- ============================================================================

-- 1. Evita SELECT * en producción
--    - Especifica solo las columnas necesarias
--    - Mejora performance y claridad

-- 2. Usa alias descriptivos
--    - Facilita lectura del código

-- 3. Siempre usa ORDER BY si el orden importa
--    - SQL no garantiza orden sin ORDER BY

-- 4. Formatea tus queries para legibilidad
--    - Indentación consistente
--    - Una línea por cláusula principal

-- 5. Usa paréntesis en condiciones complejas
--    - Evita ambiguedad con AND/OR

-- 6. Usa IS NULL en lugar de = NULL
--    - = NULL siempre retorna NULL (falso)

-- ============================================================================
-- RECURSOS ADICIONALES
-- ============================================================================

-- - PostgreSQL SELECT: https://www.postgresql.org/docs/current/sql-select.html
-- - PgExercises: https://pgexercises.com/
-- - Practice: https://sqlbolt.com/
