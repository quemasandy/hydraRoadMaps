/**
 * VPN Kill Switch Implementation
 */

export class VPNKillSwitch {
    private vpnConnected: boolean = false;
    private blockedApps: Set<string> = new Set();

    setVPNStatus(connected: boolean): void {
        this.vpnConnected = connected;

        if (!connected) {
            console.log('⚠️  VPN disconnected - Kill Switch activated');
            this.blockAllTraffic();
        } else {
            console.log('✅ VPN connected - Traffic allowed');
        }
    }

    private blockAllTraffic(): void {
        console.log('   🚫 Blocking all non-VPN traffic');

        // Simulate firewall rules
        console.log('   iptables -P OUTPUT DROP');
        console.log('   iptables -A OUTPUT -o tun0 -j ACCEPT'); // Allow VPN interface
    }

    addProtectedApp(appName: string): void {
        this.blockedApps.add(appName);
        console.log(`   Protected: ${appName}`);
    }

    allowTraffic(appName: string): boolean {
        if (this.vpnConnected) {
            return true;
        }

        if (this.blockedApps.has(appName)) {
            console.log(`   ❌ ${appName} blocked (VPN down)`);
            return false;
        }

        return true;
    }
}

export function demonstrateKillSwitch(): void {
    console.log('\n=== VPN Kill Switch ===\n');

    const killSwitch = new VPNKillSwitch();

    killSwitch.addProtectedApp('BitTorrent');
    killSwitch.addProtectedApp('Browser');

    console.log('\n1. VPN connected:');
    killSwitch.setVPNStatus(true);

    console.log('\n2. VPN disconnected:');
    killSwitch.setVPNStatus(false);

    console.log('\n3. Traffic attempts:');
    killSwitch.allowTraffic('BitTorrent');
    killSwitch.allowTraffic('SystemUpdate');

    console.log('\nBeneficios:');
    console.log('   ✅ Previene IP leaks');
    console.log('   ✅ Protege identidad');
    console.log('   ✅ Asegura que todo va via VPN');
}

if (require.main === module) {
    demonstrateKillSwitch();
}
