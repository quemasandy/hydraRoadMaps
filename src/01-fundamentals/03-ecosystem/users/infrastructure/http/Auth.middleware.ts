
// Simulamos un Middleware de Express.
// Intercepta la petición ANTES de que llegue al Controller.
export const ensureAuthenticated = (req: any, res: any, next: Function) => {
  // Leemos el token del header Authorization.
  const token = req.headers['authorization'];

  console.log("[Middleware]: Checking authorization header...");

  // Validación simple (hardcoded para el ejemplo).
  if (token === 'valid_token') {
    console.log("[Middleware]: Token valid. Proceeding.");
    // Si es válido, adjuntamos el usuario a la request (contexto).
    req.user = { id: 'user_123' }; 
    // Llamamos a next() para pasar al siguiente middleware o controller.
    next();
  } else {
    // Si es inválido, cortamos el flujo y devolvemos 403 Forbidden.
    console.log("[Middleware]: Invalid token. Access denied.");
    res.status(403).json({ message: "Forbidden" });
  }
};
