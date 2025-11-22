/**
 * VPN Types and Use Cases
 */

export class VPNTypesDemo {
    static explain(): void {
        console.log('\n=== VPN Types ===\n');

        console.log('1. REMOTE ACCESS VPN:');
        console.log('   - Usuario individual → Red corporativa');
        console.log('   - OpenVPN, IPSec, WireGuard');
        console.log('   - Use case: Trabajo remoto\n');

        console.log('2. SITE-TO-SITE VPN:');
        console.log('   - Oficina A ←→ Oficina B');
        console.log('   - IPSec, GRE tunnels');
        console.log('   - Use case: Conectar oficinas\n');

        console.log('3. SSL/TLS VPN:');
        console.log('   - Browser-based');
        console.log('   - No requiere cliente especial');
        console.log('   - Use case: Acceso web seguro\n');

        console.log('Protocolos:');
        console.log('   ✅ OpenVPN (UDP/TCP)');
        console.log('   ✅ WireGuard (moderno, rápido)');
        console.log('   ✅ IPSec (estándar industria)');
        console.log('   ✅ L2TP/IPSec');
        console.log('   ❌ PPTP (obsoleto, inseguro)');
    }
}

if (require.main === module) {
    VPNTypesDemo.explain();
}
