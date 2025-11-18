/**
 * Split Tunneling
 */

interface RoutingRule {
    destination: string;
    viaVPN: boolean;
}

export class SplitTunnelManager {
    private rules: RoutingRule[] = [];

    addRule(destination: string, viaVPN: boolean): void {
        this.rules.push({ destination, viaVPN });
    }

    shouldRouteViaVPN(destination: string): boolean {
        const rule = this.rules.find(r => destination.includes(r.destination));
        return rule ? rule.viaVPN : false;
    }

    demonstrateConfig(): void {
        console.log('\n=== Split Tunneling ===\n');

        console.log('Full Tunnel (todo via VPN):');
        console.log('   ✅ Más seguro');
        console.log('   ❌ Más lento');
        console.log('   ❌ Más carga en VPN server\n');

        console.log('Split Tunnel (selectivo):');
        console.log('   ✅ Mejor rendimiento');
        console.log('   ✅ Menor carga');
        console.log('   ⚠️  Requiere configuración cuidadosa\n');

        // Configure rules
        this.addRule('corporate.com', true);  // Via VPN
        this.addRule('youtube.com', false);   // Direct
        this.addRule('internal.corp', true);  // Via VPN

        console.log('Routing decisions:');
        const destinations = [
            'mail.corporate.com',
            'youtube.com',
            'google.com',
            'internal.corp',
        ];

        destinations.forEach(dest => {
            const viaVPN = this.shouldRouteViaVPN(dest);
            console.log(`   ${dest}: ${viaVPN ? '🔒 VPN' : '🌐 Direct'}`);
        });
    }
}

if (require.main === module) {
    const manager = new SplitTunnelManager();
    manager.demonstrateConfig();
}
