import { BankAccount } from "./domain/BankAccount";
import { TransferService } from "./application/TransferService";
import { InMemoryAccountRepository } from "./infrastructure/InMemoryAccountRepository";
import { ConsoleEmailService } from "./infrastructure/ConsoleEmailService";

/**
 * ARCHIVO PRINCIPAL: MAIN (Composition Root)
 * 
 * Este archivo es el punto de entrada de la aplicación.
 * Su responsabilidad es "CONECTAR LOS CABLES".
 * 
 * Aquí decidimos qué piezas (implementaciones) específicas vamos a usar.
 * ¿Usaremos base de datos en memoria o real? -> Aquí se instancia.
 * ¿Usaremos emails reales o de consola? -> Aquí se instancia.
 */
async function main() {
  console.clear();
  console.log("=============================================================");
  console.log("   🏦  SISTEMA BANCARIO - EJEMPLO DE CAPAS (V3 DETALLADA)   ");
  console.log("=============================================================\n");

  // ===============================================
  // 1. CAPA DE INFRAESTRUCTURA (Setup)
  // ===============================================
  // Instanciamos "las herramientas" que usaremos.
  // Repository: Usaremos la versión en memoria.
  const accountRepo = new InMemoryAccountRepository();
  // Email: Usaremos la versión de consola.
  const emailService = new ConsoleEmailService();

  // DATA SEEDING (Sembrar datos para jugar)
  // Creamos dos cuentas "reales" y las guardamos en nuestro repo en memoria
  // para tener algo con qué trabajar.
  const accountAndy = new BankAccount("acc-andy-001", 1000, "andy@midominio.com"); // Saldo inicial: 1000
  const accountBob = new BankAccount("acc-bob-002", 50, "bob@sudominio.com");      // Saldo inicial: 50
  
  // Las guardamos en el "disco" mock
  accountRepo.seed(accountAndy);
  accountRepo.seed(accountBob);
  
  console.log("--> Estado Inicial cargado: Andy=$1000, Bob=$50\n");

  // ===============================================
  // 2. CAPA DE APLICACIÓN (Inyección)
  // ===============================================
  // Creamos el Servicio de Transferencia.
  // AQUÍ es donde aplicamos INYECCIÓN DE DEPENDENCIAS.
  // Le pasamos las instancias de infraestructura al servicio.
  // El servicio NO SABE que son 'InMemory' o 'Console', solo ve las interfaces.
  const transferService = new TransferService(accountRepo, emailService);


  // ===============================================
  // 3. EJECUCIÓN (Simulando peticiones del usuario)
  // ===============================================

  // --- CASO DE USO A: Transferencia Exitosa ---
  try {
    console.log("▶️  EJECUTANDO: Transferencia de $200 de Andy a Bob...");
    
    // Llamamos al método execute del servicio.
    await transferService.execute("acc-andy-001", "acc-bob-002", 200);
    
    console.log("✅ CASO A COMPLETADO.\n");
  } catch (error: any) {
    console.error("❌ ERROR INESPERADO EN CASO A:", error.message);
  }

  console.log("\n-------------------------------------------------------------\n");

  // --- CASO DE USO B: Intento fallido por Fondos Insuficientes ---
  try {
    console.log("▶️  EJECUTANDO: Transferencia de $50,000 de Andy a Bob (Intento de Fraude)...");
    
    // Andy solo tiene 800 ahora (1000 - 200). Tratar de mandar 50000 debe fallar.
    await transferService.execute("acc-andy-001", "acc-bob-002", 50000);
    
  } catch (error: any) {
    // Aquí esperamos capturar el error de negocio.
    console.log(`\n🛡️  SISTEMA PROTEGIDO. Se capturó el error: "${error.message}"`);
    console.log("   (La transferencia fue abortada, no se tocó el dinero ni se enviaron correos)");
  }

  console.log("\n=============================================================");
  console.log("   🏁  FIN DE LA DEMOSTRACIÓN   ");
  console.log("=============================================================");
}

// Ejecutar la función main y atrapar cualquier error fatal no manejado
main().catch(err => console.error("FATAL ERROR:", err));
