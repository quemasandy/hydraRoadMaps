/**
 * Password Policies & Hashing (bcrypt)
 */

import { createHash, randomBytes, pbkdf2Sync } from 'crypto';

export class PasswordValidator {
    static validate(password: string): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (password.length < 12) {
            errors.push('Mínimo 12 caracteres');
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('Al menos una mayúscula');
        }

        if (!/[a-z]/.test(password)) {
            errors.push('Al menos una minúscula');
        }

        if (!/[0-9]/.test(password)) {
            errors.push('Al menos un número');
        }

        if (!/[!@#$%^&*]/.test(password)) {
            errors.push('Al menos un carácter especial');
        }

        return { valid: errors.length === 0, errors };
    }

    static estimateStrength(password: string): 'Débil' | 'Media' | 'Fuerte' {
        let score = 0;

        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*]/.test(password)) score++;

        if (score >= 5) return 'Fuerte';
        if (score >= 3) return 'Media';
        return 'Débil';
    }
}

export class SecurePasswordHasher {
    static hash(password: string): { hash: string; salt: string } {
        const salt = randomBytes(16).toString('hex');
        const hash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
        return { hash, salt };
    }

    static verify(password: string, hash: string, salt: string): boolean {
        const testHash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
        return hash === testHash;
    }
}

export function demonstratePasswordPolicies(): void {
    console.log('\n=== Password Policies ===\n');

    const passwords = [
        'weak',
        'Password123',
        'MyS3cur3P@ssw0rd!2024',
    ];

    passwords.forEach(pwd => {
        console.log(`Password: ${pwd}`);

        const validation = PasswordValidator.validate(pwd);
        if (validation.valid) {
            console.log('   ✅ Válida');
        } else {
            console.log('   ❌ Errores:');
            validation.errors.forEach(err => console.log(`      - ${err}`));
        }

        const strength = PasswordValidator.estimateStrength(pwd);
        console.log(`   Fortaleza: ${strength}\n`);
    });

    console.log('=== Secure Hashing ===\n');

    const { hash, salt } = SecurePasswordHasher.hash('MyPassword123!');
    console.log(`Hash: ${hash.substring(0, 32)}...`);
    console.log(`Salt: ${salt}\n`);

    const valid = SecurePasswordHasher.verify('MyPassword123!', hash, salt);
    console.log(`Verificación: ${valid ? '✅' : '❌'}`);
}

if (require.main === module) {
    demonstratePasswordPolicies();
}
