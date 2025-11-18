/**
 * Tor & Anonymity Networks
 */

export class TorDemo {
    static explainOnionRouting(): void {
        console.log('\n=== Tor (The Onion Router) ===\n');

        console.log('Onion Routing:');
        console.log('   User → [Guard] → [Middle] → [Exit] → Destination');
        console.log('   |_______|   |________|   |______|');
        console.log('     Layer 3     Layer 2    Layer 1\n');

        console.log('Cada relay solo conoce:');
        console.log('   - Guard: Tu IP, pero no destino');
        console.log('   - Middle: Ni origen ni destino');
        console.log('   - Exit: Destino, pero no tu IP\n');

        console.log('Características:');
        console.log('   ✅ Anonimato fuerte');
        console.log('   ✅ Múltiples capas de cifrado');
        console.log('   ✅ Censorship resistance');
        console.log('   ❌ Lento (múltiples saltos)');
        console.log('   ⚠️  Exit node puede ver tráfico sin cifrar\n');

        console.log('Hidden Services (.onion):');
        console.log('   - No revelan IP del servidor');
        console.log('   - Punto de encuentro en red Tor');
        console.log('   - Anonimato bidireccional\n');

        console.log('Tor vs VPN:');
        console.log('   VPN:  User → [VPN] → Destination');
        console.log('   Tor:  User → [Guard] → [Middle] → [Exit] → Destination');
        console.log('\n   VPN: Más rápido, confías en proveedor');
        console.log('   Tor: Más anónimo, más lento');
    }

    static demonstrateLayers(): void {
        console.log('\n=== Onion Encryption Layers ===\n');

        const message = 'HTTP GET /page.html';

        console.log(`Original message: "${message}"\n`);

        console.log('Encryption layers:');
        console.log('   Layer 1 (Exit key):    encrypt(message, exit_key)');
        console.log('   Layer 2 (Middle key):  encrypt(layer1, middle_key)');
        console.log('   Layer 3 (Guard key):   encrypt(layer2, guard_key)\n');

        console.log('Decryption en cada hop:');
        console.log('   Guard:  Remove layer 3 → Forward to Middle');
        console.log('   Middle: Remove layer 2 → Forward to Exit');
        console.log('   Exit:   Remove layer 1 → Send to destination');
    }
}

if (require.main === module) {
    TorDemo.explainOnionRouting();
    TorDemo.demonstrateLayers();
}
