/**
 * MODERN TS: Design Composition
 *
 * En OOP: Factories, Builders.
 * En Modern TS: Factory Functions simples que retornan objetos literales.
 */

type EmailConfig = {
  service: 'gmail' | 'ses';
  retries: number;
};

// Factory Function con valores por defecto
const createEmailService = (config: Partial<EmailConfig> = {}) => {
  // Defaults
  const finalConfig: EmailConfig = {
    service: 'gmail',
    retries: 3,
    ...config, // Override
  };

  return {
    send: (to: string, body: string) => {
      console.log(`Sending via ${finalConfig.service} to ${to}: ${body}`);
    },
  };
};

const mailer = createEmailService({ service: 'ses' });
mailer.send('andy@test.com', 'Hello');
