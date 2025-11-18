/**
 * OpenVPN Conceptual
 */

export class OpenVPNDemo {
    static explainConfig(): void {
        console.log('\n=== OpenVPN Configuration ===\n');

        console.log('Server Config:');
        console.log(`
port 1194
proto udp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh2048.pem
server 10.8.0.0 255.255.255.0
push "redirect-gateway def1"
keepalive 10 120
cipher AES-256-CBC
auth SHA256
        `);

        console.log('\nClient Config:');
        console.log(`
client
dev tun
proto udp
remote vpn.example.com 1194
resolv-retry infinite
ca ca.crt
cert client.crt
key client.key
cipher AES-256-CBC
auth SHA256
        `);

        console.log('\nSecurity Features:');
        console.log('   ✅ TLS authentication');
        console.log('   ✅ AES-256 encryption');
        console.log('   ✅ Certificate-based auth');
        console.log('   ✅ Perfect Forward Secrecy');
    }
}

if (require.main === module) {
    OpenVPNDemo.explainConfig();
}
