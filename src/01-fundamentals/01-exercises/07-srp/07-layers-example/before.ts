/**
 * Archivo: before.ts
 *
 * EJEMPLO: "EL CAOS SIN CAPAS"
 *
 * Imagina que estás construyendo una función para registrar un nuevo usuario.
 * Aquí NO hay capas. Todo está mezclado en un solo lugar.
 *
 * PROBLEMA:
 * - ¿Dónde está la lógica de negocio? Mezclada con SQL y HTTP.
 * - ¿Si quiero cambiar la base de datos? Tengo que tocar este archivo.
 * - ¿Si quiero cambiar la respuesta JSON? Tengo que tocar este archivo.
 * - ¿Si quiero cambiar la validación del email? Tengo que tocar este archivo.
 */

// Simulamos una solicitud HTTP (como en Express o NestJS)
type HttpRequest = { body: any };
type HttpResponse = { status: number, body: any };

export class UserHandler {
  
  // Este método hace TODO. Es el "hombre orquesta".
  handleRegisterUser(req: HttpRequest): HttpResponse {
    console.log("--- INICIO DEL PROCESO MONOLÍTICO ---");

    // 1. VALIDACIÓN (Debería ser Capa de Presentación/Controlador)
    // Verificamos si los datos vienen bien desde "afuera" (el usuario/frontend).
    const { email, password } = req.body;
    if (!email || !email.includes('@')) {
      return { status: 400, body: { error: "Email inválido" } };
    }
    if (!password || password.length < 6) {
      return { status: 400, body: { error: "Password muy corto" } };
    }

    // 2. LÓGICA DE NEGOCIO (Debería ser Capa de Servicio/Dominio)
    // Reglas importantes de nuestra aplicación.
    // "No permitimos usuarios con dominio 'evil.com'".
    if (email.endsWith('@evil.com')) {
      return { status: 403, body: { error: "Dominio prohibido" } };
    }
    // "Encriptamos" el password (simulado).
    const hashedPassword = `encrypted_${password}`;

    // 3. ACCESO A DATOS (Debería ser Capa de Infraestructura/Repositorio)
    // Detalles técnicos de CÓMO guardamos la información (SQL, Mongo, Archivo).
    console.log(`INSERT INTO users (email, password) VALUES ('${email}', '${hashedPassword}')`);
    // Simulamos que la DB nos devuelve un ID.
    const newUserId = Math.floor(Math.random() * 1000);

    // 4. RESPUESTA (Debería ser Capa de Presentación/Controlador)
    // Formateamos lo que devolvemos al mundo exterior.
    console.log("--- FIN DEL PROCESO MONOLÍTICO ---");
    return {
      status: 201,
      body: {
        id: newUserId,
        email: email,
        message: "Usuario creado exitosamente (pero con código desordenado)"
      }
    };
  }
}

// Probamos el código "sucio"
const handler = new UserHandler();
const response = handler.handleRegisterUser({ 
  body: { email: "andy@example.com", password: "supersecretpassword" } 
});
console.log(response);

// 1. Capa de Presentación/Controlador
// 2. Capa de Servicio/Dominio
// 3. Capa de Infraestructura/Repositorio
// 4. Capa de Presentación/Controlador