/**
 * WireGuard - Modern VPN Protocol
 */

export class WireGuardDemo {
    static explainConfig(): void {
        console.log('\n=== WireGuard Configuration ===\n');

        console.log('Server Config (/etc/wireguard/wg0.conf):');
        console.log(`
[Interface]
PrivateKey = <server-private-key>
Address = 10.0.0.1/24
ListenPort = 51820

[Peer]
PublicKey = <client-public-key>
AllowedIPs = 10.0.0.2/32
        `);

        console.log('\nClient Config:');
        console.log(`
[Interface]
PrivateKey = <client-private-key>
Address = 10.0.0.2/24

[Peer]
PublicKey = <server-public-key>
Endpoint = vpn.example.com:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
        `);

        console.log('\nVentajas de WireGuard:');
        console.log('   ✅ Código simple (~4,000 líneas vs OpenVPN ~100,000)');
        console.log('   ✅ Más rápido');
        console.log('   ✅ Criptografía moderna (Curve25519, ChaCha20)');
        console.log('   ✅ Roaming transparente');
        console.log('   ✅ Configuración más simple');
    }
}

if (require.main === module) {
    WireGuardDemo.explainConfig();
}
