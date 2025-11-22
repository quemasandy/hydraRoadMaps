/**
 * Cookie Theft & Secure Cookies
 */

export interface SecureCookieOptions {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'Strict' | 'Lax' | 'None';
    maxAge?: number;
}

export class SecureCookieManager {
    static generateCookie(name: string, value: string, options: SecureCookieOptions): string {
        let cookie = `${name}=${value}`;

        if (options.httpOnly) cookie += '; HttpOnly';
        if (options.secure) cookie += '; Secure';
        cookie += `; SameSite=${options.sameSite}`;
        if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;

        return cookie;
    }

    static demonstrateSecureCookies(): void {
        console.log('\n=== Secure Cookie Configuration ===\n');

        const insecure = 'sessionId=abc123';
        console.log('❌ Vulnerable:');
        console.log(`   ${insecure}\n`);

        const secure = this.generateCookie('sessionId', 'abc123', {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 3600,
        });

        console.log('✅ Secure:');
        console.log(`   ${secure}\n`);

        console.log('Protecciones:');
        console.log('   - HttpOnly: Previene acceso desde JavaScript (XSS)');
        console.log('   - Secure: Solo HTTPS');
        console.log('   - SameSite: Previene CSRF');
    }
}

if (require.main === module) {
    SecureCookieManager.demonstrateSecureCookies();
}
