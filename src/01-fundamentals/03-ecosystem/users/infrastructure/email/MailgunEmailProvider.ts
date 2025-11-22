
// Importamos la interfaz del servicio de email.
import { EmailService } from "../../domain/EmailService";

// Implementación concreta usando Mailgun.
export class MailgunEmailProvider implements EmailService {
  // Implementamos el método requerido por la interfaz.
  async sendWelcomeEmail(email: string): Promise<void> {
    // Aquí iría la llamada real a la API de Mailgun (usando fetch o axios).
    console.log(`[MailgunEmailProvider]: Sending POST request to https://api.mailgun.net/v3/...`);
    console.log(`[MailgunEmailProvider]: To: ${email}`);
    console.log(`[MailgunEmailProvider]: Subject: Welcome!`);
    console.log(`[MailgunEmailProvider]: Email sent successfully.`);
  }
}
