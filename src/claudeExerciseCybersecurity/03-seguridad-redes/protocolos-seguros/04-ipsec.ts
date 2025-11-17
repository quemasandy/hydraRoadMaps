/**
 * IPSec Conceptual Overview
 */

export class IPSecDemo {
    static explain(): void {
        console.log('\n=== IPSec (Internet Protocol Security) ===\n');

        console.log('Modos:');
        console.log('   1. Transport Mode: Solo payload cifrado');
        console.log('   2. Tunnel Mode: Todo el paquete IP cifrado\n');

        console.log('Protocolos:');
        console.log('   - AH (Authentication Header): Autenticación');
        console.log('   - ESP (Encapsulating Security Payload): Cifrado\n');

        console.log('Key Exchange:');
        console.log('   IKE (Internet Key Exchange) - Diffie-Hellman\n');

        console.log('Casos de uso:');
        console.log('   ✅ VPN site-to-site');
        console.log('   ✅ VPN remote access');
        console.log('   ✅ Seguridad capa de red');
    }
}

if (require.main === module) {
    IPSecDemo.explain();
}
