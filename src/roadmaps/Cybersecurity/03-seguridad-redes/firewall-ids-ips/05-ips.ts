/**
 * IPS - Intrusion Prevention System
 */

interface IPSRule {
    name: string;
    pattern: RegExp;
    action: 'BLOCK' | 'ALLOW' | 'ALERT';
}

export class IPS {
    private rules: IPSRule[] = [
        { name: 'SQL Injection', pattern: /UNION.*SELECT/i, action: 'BLOCK' },
        { name: 'XSS', pattern: /<script/i, action: 'BLOCK' },
        { name: 'Suspicious Activity', pattern: /admin.*password/i, action: 'ALERT' },
    ];

    private blockedIPs: Set<string> = new Set();

    processRequest(payload: string, srcIP: string): { allowed: boolean; reason?: string } {
        // Check if IP is blocked
        if (this.blockedIPs.has(srcIP)) {
            return { allowed: false, reason: 'IP blocked by IPS' };
        }

        // Check signatures
        for (const rule of this.rules) {
            if (rule.pattern.test(payload)) {
                if (rule.action === 'BLOCK') {
                    this.blockedIPs.add(srcIP);
                    return { allowed: false, reason: `Blocked: ${rule.name}` };
                } else if (rule.action === 'ALERT') {
                    console.warn(`⚠️  ALERT: ${rule.name} from ${srcIP}`);
                }
            }
        }

        return { allowed: true };
    }
}

export function demonstrateIPS(): void {
    console.log('\n=== IPS (Intrusion Prevention System) ===\n');

    console.log('IDS vs IPS:');
    console.log('   IDS: Detecta y alerta (pasivo)');
    console.log('   IPS: Detecta y BLOQUEA (activo)\n');

    const ips = new IPS();

    const requests = [
        { payload: 'normal request', ip: '10.0.0.1' },
        { payload: "' UNION SELECT * FROM users", ip: '10.0.0.2' },
        { payload: 'another normal request', ip: '10.0.0.2' }, // Should be blocked
    ];

    requests.forEach((req, i) => {
        console.log(`Request ${i + 1} from ${req.ip}:`);
        console.log(`   Payload: ${req.payload}`);

        const result = ips.processRequest(req.payload, req.ip);

        if (result.allowed) {
            console.log('   ✅ ALLOWED\n');
        } else {
            console.log(`   ❌ BLOCKED: ${result.reason}\n`);
        }
    });
}

if (require.main === module) {
    demonstrateIPS();
}
