/**
 * Firewall Rules - Packet Filtering
 */

interface FirewallRule {
    action: 'ALLOW' | 'DENY';
    protocol: 'TCP' | 'UDP' | 'ICMP' | 'ANY';
    srcIP?: string;
    dstIP?: string;
    srcPort?: number;
    dstPort?: number;
}

interface Packet {
    protocol: string;
    srcIP: string;
    dstIP: string;
    srcPort: number;
    dstPort: number;
}

export class Firewall {
    private rules: FirewallRule[] = [];

    addRule(rule: FirewallRule): void {
        this.rules.push(rule);
    }

    checkPacket(packet: Packet): 'ALLOW' | 'DENY' {
        for (const rule of this.rules) {
            if (this.matchesRule(packet, rule)) {
                return rule.action;
            }
        }
        return 'DENY'; // Default deny
    }

    private matchesRule(packet: Packet, rule: FirewallRule): boolean {
        if (rule.protocol !== 'ANY' && packet.protocol !== rule.protocol) return false;
        if (rule.srcIP && packet.srcIP !== rule.srcIP) return false;
        if (rule.dstIP && packet.dstIP !== rule.dstIP) return false;
        if (rule.srcPort && packet.srcPort !== rule.srcPort) return false;
        if (rule.dstPort && packet.dstPort !== rule.dstPort) return false;
        return true;
    }
}

export function demonstrateFirewall(): void {
    console.log('\n=== Firewall Packet Filtering ===\n');

    const firewall = new Firewall();

    // Allow HTTP traffic
    firewall.addRule({ action: 'ALLOW', protocol: 'TCP', dstPort: 80 });

    // Allow HTTPS traffic
    firewall.addRule({ action: 'ALLOW', protocol: 'TCP', dstPort: 443 });

    // Allow SSH from specific IP
    firewall.addRule({ action: 'ALLOW', protocol: 'TCP', dstPort: 22, srcIP: '192.168.1.100' });

    // Deny all other traffic (implícito)

    const packets: Packet[] = [
        { protocol: 'TCP', srcIP: '10.0.0.1', dstIP: '192.168.1.1', srcPort: 50000, dstPort: 80 },
        { protocol: 'TCP', srcIP: '10.0.0.1', dstIP: '192.168.1.1', srcPort: 50001, dstPort: 22 },
        { protocol: 'TCP', srcIP: '192.168.1.100', dstIP: '192.168.1.1', srcPort: 50002, dstPort: 22 },
    ];

    packets.forEach((packet, i) => {
        const result = firewall.checkPacket(packet);
        console.log(`Packet ${i + 1}: ${packet.protocol}:${packet.dstPort} from ${packet.srcIP}`);
        console.log(`   ${result === 'ALLOW' ? '✅' : '❌'} ${result}\n`);
    });
}

if (require.main === module) {
    demonstrateFirewall();
}
