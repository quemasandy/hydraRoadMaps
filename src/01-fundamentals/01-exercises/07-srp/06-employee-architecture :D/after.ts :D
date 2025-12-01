/**
 * Archivo: after.ts
 *
 * Este archivo demuestra la SOLUCIÓN aplicando el Principio de Responsabilidad Única (SRP).
 * Refactorizamos la clase `Employee` monolítica en componentes separados.
 *
 * Cada clase ahora tiene UNA SOLA razón para cambiar, satisfaciendo a un solo actor.
 */

// ---------------------------------------------------------
// Estructura de Datos (Data Structure)
// ---------------------------------------------------------

// Definimos una clase (o interfaz) simple para contener los datos del empleado.
// Esta clase NO contiene lógica de negocio compleja, solo datos.
// Se le conoce a menudo como DTO (Data Transfer Object) o Entidad anémica en este contexto.
export class EmployeeData {
  // Constructor simple para inicializar los datos.
  constructor(
    public id: number,
    public name: string,
    public hoursWorked: number,
    public hourlyRate: number
  ) {
    // Asignación de datos.
  }
}

// ---------------------------------------------------------
// Responsabilidad 1: Cálculo de Nómina
// Actor: CFO
// ---------------------------------------------------------

// Creamos una clase dedicada EXCLUSIVAMENTE al cálculo de pagos.
export class PayCalculator {
  // Método único encargado de la lógica financiera.
  // Recibe los datos del empleado necesarios para el cálculo.
  public calculatePay(employeeData: EmployeeData): number {
    // Lógica de negocio específica del CFO.
    // Solo cambia si cambian las reglas de pago.
    
    console.log(`Calculando pago para ${employeeData.name} (Lógica del CFO aislada)`);
    return employeeData.hoursWorked * employeeData.hourlyRate;
  }
}

// ---------------------------------------------------------
// Responsabilidad 2: Reporte de Horas
// Actor: COO
// ---------------------------------------------------------

// Creamos una clase dedicada EXCLUSIVAMENTE a la generación de reportes.
export class HourReporter {
  // Método único encargado de dar formato al reporte.
  // Recibe los datos del empleado.
  public reportHours(employeeData: EmployeeData): string {
    // Lógica de presentación específica del COO.
    // Solo cambia si cambia el formato del reporte.
    
    console.log(`Generando reporte para ${employeeData.name} (Lógica del COO aislada)`);
    return `Reporte SRP: ${employeeData.name} - ${employeeData.hoursWorked} hrs.`;
  }
}

// ---------------------------------------------------------
// Responsabilidad 3: Persistencia de Datos
// Actor: CTO
// ---------------------------------------------------------

// Creamos una clase dedicada EXCLUSIVAMENTE a guardar/recuperar datos.
// A menudo llamado "Repository" o "DAO" (Data Access Object).
export class EmployeeRepository {
  // Método único encargado de hablar con la base de datos.
  public save(employeeData: EmployeeData): void {
    // Lógica de infraestructura específica del CTO.
    // Solo cambia si cambia la base de datos o el mecanismo de almacenamiento.
    
    console.log(`Guardando a ${employeeData.name} en BD (Lógica del CTO aislada)`);
    // db.execute('INSERT INTO ...');
  }
}

// ---------------------------------------------------------
// Uso del Sistema Refactorizado
// ---------------------------------------------------------

// 1. Creamos los datos del empleado.
const employeeData = new EmployeeData(1, "Andy", 40, 50);

// 2. Instanciamos los servicios especializados (normalmente esto se hace con Inyección de Dependencias).
const payCalculator = new PayCalculator();
const hourReporter = new HourReporter();
const employeeRepository = new EmployeeRepository();

// 3. Cada actor utiliza su propia clase/método.
// Si el CFO pide un cambio en `PayCalculator`, NO tocamos `HourReporter` ni `EmployeeRepository`.

// El sistema de nómina llama a:
const pay = payCalculator.calculatePay(employeeData);

// El sistema de reportes llama a:
const report = hourReporter.reportHours(employeeData);

// El sistema de persistencia llama a:
employeeRepository.save(employeeData);

/**
 * BENEFICIOS:
 * 1. Cohesión: Cada clase hace una sola cosa y la hace bien.
 * 2. Desacoplamiento: Cambiar la lógica de guardado no afecta el cálculo de nómina.
 * 3. Mantenibilidad: Es más fácil entender y testear clases pequeñas.
 * 4. Colaboración: Diferentes equipos pueden trabajar en diferentes archivos sin conflictos de 'merge'.
 */
