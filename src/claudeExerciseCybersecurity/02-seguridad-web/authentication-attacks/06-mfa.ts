/**
 * Multi-Factor Authentication (TOTP)
 */

import { createHmac } from 'crypto';

export class TOTPGenerator {
    private readonly timeStep = 30; // 30 seconds

    generate(secret: string, time?: number): string {
        const counter = Math.floor((time || Date.now()) / 1000 / this.timeStep);
        const buffer = Buffer.alloc(8);
        buffer.writeBigInt64BE(BigInt(counter));

        const hmac = createHmac('sha1', secret);
        hmac.update(buffer);
        const hash = hmac.digest();

        const offset = hash[hash.length - 1] & 0xf;
        const binary =
            ((hash[offset] & 0x7f) << 24) |
            ((hash[offset + 1] & 0xff) << 16) |
            ((hash[offset + 2] & 0xff) << 8) |
            (hash[offset + 3] & 0xff);

        const otp = binary % 1000000;
        return otp.toString().padStart(6, '0');
    }

    verify(secret: string, token: string, window = 1): boolean {
        const now = Date.now();

        for (let i = -window; i <= window; i++) {
            const time = now + i * this.timeStep * 1000;
            const expected = this.generate(secret, time);

            if (expected === token) {
                return true;
            }
        }

        return false;
    }
}

export function demonstrateMFA(): void {
    console.log('\n=== Multi-Factor Authentication (TOTP) ===\n');

    const totp = new TOTPGenerator();
    const secret = 'JBSWY3DPEHPK3PXP'; // Base32 secret

    console.log('1. Generar código TOTP:');
    const code = totp.generate(secret);
    console.log(`   Código: ${code}\n`);

    console.log('2. Verificar código correcto:');
    const valid = totp.verify(secret, code);
    console.log(`   ${valid ? '✅' : '❌'} Válido\n`);

    console.log('3. Verificar código incorrecto:');
    const invalid = totp.verify(secret, '000000');
    console.log(`   ${invalid ? '✅' : '❌'} Inválido\n`);

    console.log('Beneficios MFA:');
    console.log('   - Protección contra contraseñas comprometidas');
    console.log('   - Segundo factor: algo que tienes (teléfono)');
    console.log('   - Códigos rotan cada 30 segundos');
}

if (require.main === module) {
    demonstrateMFA();
}
