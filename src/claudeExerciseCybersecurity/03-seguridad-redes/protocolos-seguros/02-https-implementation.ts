/**
 * HTTPS vs HTTP - Security Comparison
 */

export class HTTPSDemo {
    static compareProtocols(): void {
        console.log('\n=== HTTP vs HTTPS ===\n');

        console.log('❌ HTTP (Inseguro):');
        console.log('   - Texto plano (sniffable)');
        console.log('   - Sin cifrado');
        console.log('   - Vulnerable a MITM');
        console.log('   - Puerto 80\n');

        console.log('✅ HTTPS (Seguro):');
        console.log('   - TLS/SSL encryption');
        console.log('   - Confidencialidad');
        console.log('   - Integridad');
        console.log('   - Autenticación (certificados)');
        console.log('   - Puerto 443\n');

        console.log('Headers de Seguridad:');
        console.log('   Strict-Transport-Security: max-age=31536000');
        console.log('   Content-Security-Policy: default-src https:');
        console.log('   X-Frame-Options: DENY');
    }
}

if (require.main === module) {
    HTTPSDemo.compareProtocols();
}
