/**
 * Credential Stuffing Attack & Defense
 *
 * Conceptos: Uso de credenciales filtradas de otros servicios
 * Defensa: Detección de patrones, lista de contraseñas comprometidas
 */

import { createHash } from 'crypto';

// Simulación de base de datos de contraseñas comprometidas (Have I Been Pwned)
const compromisedPasswords = new Set([
    createHash('sha1').update('password123').digest('hex'),
    createHash('sha1').update('123456').digest('hex'),
    createHash('sha1').update('qwerty').digest('hex'),
]);

export class PasswordBreachChecker {
    isCompromised(password: string): boolean {
        const hash = createHash('sha1').update(password).digest('hex');
        return compromisedPasswords.has(hash);
    }

    checkAndWarn(password: string): { safe: boolean; message: string } {
        if (this.isCompromised(password)) {
            return {
                safe: false,
                message: 'Esta contraseña ha sido comprometida en brechas de seguridad',
            };
        }
        return { safe: true, message: 'Contraseña no encontrada en brechas' };
    }
}

export class DeviceFingerprintDetector {
    private knownDevices: Map<string, Set<string>> = new Map();

    recordLogin(username: string, fingerprint: string): void {
        if (!this.knownDevices.has(username)) {
            this.knownDevices.set(username, new Set());
        }
        this.knownDevices.get(username)!.add(fingerprint);
    }

    isNewDevice(username: string, fingerprint: string): boolean {
        const devices = this.knownDevices.get(username);
        return !devices || !devices.has(fingerprint);
    }
}

export function demonstrateCredentialStuffing(): void {
    console.log('\n=== Credential Stuffing Attack ===\n');

    const checker = new PasswordBreachChecker();
    const passwords = ['password123', 'MyS3cur3P@ssw0rd!'];

    passwords.forEach(pwd => {
        const result = checker.checkAndWarn(pwd);
        const status = result.safe ? '✅' : '❌';
        console.log(`Password: ${pwd}`);
        console.log(`${status} ${result.message}\n`);
    });

    console.log('=== Device Fingerprinting ===\n');
    const detector = new DeviceFingerprintDetector();

    detector.recordLogin('user1', 'device-123');
    console.log('Login desde device-123: ✅ Conocido');

    const isNew = detector.isNewDevice('user1', 'device-456');
    console.log(`Login desde device-456: ${isNew ? '⚠️  Nuevo dispositivo' : '✅ Conocido'}`);
}

if (require.main === module) {
    demonstrateCredentialStuffing();
}
