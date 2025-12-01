/**
 * Archivo: ConsoleView.ts
 * UBICACIÓN: Capa de Presentación / Vistas
 *
 * Simula una "Vista" que renderiza la respuesta.
 * En una API REST, esto sería el JSON response.
 * En una web MVC, sería el HTML.
 */

export class ConsoleView {
  renderSuccess(data: any): void {
    console.log("\n✅ [VISTA] Respuesta Exitosa:");
    console.log(JSON.stringify(data, null, 2));
  }

  renderError(error: string): void {
    console.log("\n❌ [VISTA] Error:");
    console.log(`   ${error}`);
  }
}
