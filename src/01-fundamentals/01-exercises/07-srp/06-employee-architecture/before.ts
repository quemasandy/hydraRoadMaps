/**
 * Archivo: before.ts
 *
 * Este archivo demuestra una VIOLACIÓN del Principio de Responsabilidad Única (SRP).
 * Tenemos una clase `Employee` que intenta hacer demasiado.
 *
 * Según Robert C. Martin (Uncle Bob), esta clase viola el SRP porque tiene
 * 3 razones diferentes para cambiar, asociadas a 3 actores distintos.
 */

// Definimos la clase Employee que agrupa lógica de negocio, reportes y persistencia.
// Esta clase es un "Dios" en miniatura porque sabe demasiado.
export class Employee {
  
  // Propiedades básicas del empleado.
  // Estas propiedades son usadas por los diferentes métodos de la clase.
  constructor(
    public id: number,
    public name: string,
    public hoursWorked: number,
    public hourlyRate: number
  ) {
    // Inicialización de las propiedades en el constructor.
  }

  /**
   * ---------------------------------------------------------
   * Responsabilidad 1: Cálculo de Nómina
   * Actor: CFO (Chief Financial Officer)
   * Razón para cambiar: Cambios en las políticas de pago.
   * ---------------------------------------------------------
   */
  // Este método calcula cuánto se le debe pagar al empleado.
  public calculatePay(): number {
    // Lógica de negocio financiera.
    // Si el CFO decide cambiar la fórmula (ej. agregar bonos, cambiar impuestos),
    // este código debe modificarse.
    
    // Cálculo simple: horas trabajadas por tarifa por hora.
    const regularPay = this.hoursWorked * this.hourlyRate;
    
    // Supongamos que hay una lógica de horas extra aquí.
    // Esto acopla la clase a las reglas de negocio financieras.
    console.log(`Calculando pago para ${this.name} (Lógica del CFO)`);
    return regularPay;
  }

  /**
   * ---------------------------------------------------------
   * Responsabilidad 2: Reporte de Horas
   * Actor: COO (Chief Operating Officer)
   * Razón para cambiar: Cambios en el formato de los reportes.
   * ---------------------------------------------------------
   */
  // Este método genera un string con el reporte de horas para auditoría.
  public reportHours(): string {
    // Lógica de presentación/reporte.
    // Si el COO necesita un formato diferente (ej. XML en lugar de texto, o más detalles),
    // este código debe modificarse.
    
    // Formateo del reporte.
    const report = `Reporte de Horas: ${this.name} trabajó ${this.hoursWorked} horas.`;
    
    // Esto acopla la clase a las necesidades de operaciones y recursos humanos.
    console.log(`Generando reporte para ${this.name} (Lógica del COO)`);
    return report;
  }

  /**
   * ---------------------------------------------------------
   * Responsabilidad 3: Persistencia de Datos
   * Actor: CTO (Chief Technology Officer) / DB Admin
   * Razón para cambiar: Cambios en la base de datos o infraestructura.
   * ---------------------------------------------------------
   */
  // Este método guarda el empleado en la base de datos.
  public save(): void {
    // Lógica de infraestructura/persistencia.
    // Si el CTO decide cambiar de MySQL a MongoDB, o cambiar la estructura de la tabla,
    // este código debe modificarse.
    
    // Simulación de guardado en base de datos.
    console.log(`Guardando a ${this.name} en la Base de Datos (Lógica del CTO)`);
    // db.execute('INSERT INTO employees ...');
  }
}

// Ejemplo de uso:
// Creamos una instancia de Employee.
const employee = new Employee(1, "Andy", 40, 50);

// El sistema usa el mismo objeto para tres propósitos completamente diferentes.
employee.calculatePay(); // Usado por el sistema de nómina
employee.reportHours();  // Usado por el sistema de reportes
employee.save();         // Usado por el sistema de persistencia

/**
 * PROBLEMA:
 * Si cambiamos `calculatePay` y cometemos un error sintáctico o lógico que afecta
 * a la clase entera, podríamos romper `reportHours` o `save` inadvertidamente.
 * El COO podría quejarse de que los reportes fallan por un cambio que pidió el CFO.
 * Esto es ALTO ACOPLAMIENTO (High Coupling) y BAJA COHESIÓN (Low Cohesion).
 */
