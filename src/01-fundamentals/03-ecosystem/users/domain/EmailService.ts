
// Definimos la Interfaz para el servicio de Email (Port).
// Desacoplamos el "qué" (enviar email) del "cómo" (Mailgun, SendGrid, AWS SES).
export interface EmailService {
  // Método simple para enviar bienvenida.
  sendWelcomeEmail(email: string): Promise<void>;
}
