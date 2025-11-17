/**
 * IDS Signature-Based Detection
 */

interface Signature {
    name: string;
    pattern: RegExp;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class SignatureIDS {
    private signatures: Signature[] = [
        { name: 'SQL Injection', pattern: /(\bUNION\b.*\bSELECT\b|--|\bOR\b.*=)/i, severity: 'HIGH' },
        { name: 'XSS Attack', pattern: /<script|javascript:/i, severity: 'HIGH' },
        { name: 'Directory Traversal', pattern: /\.\.[\/\\]/i, severity: 'MEDIUM' },
        { name: 'Command Injection', pattern: /;.*\b(cat|ls|rm|wget|curl)\b/i, severity: 'CRITICAL' },
    ];

    detectThreats(payload: string): { detected: boolean; threats: string[] } {
        const threats: string[] = [];

        for (const sig of this.signatures) {
            if (sig.pattern.test(payload)) {
                threats.push(`${sig.name} (${sig.severity})`);
            }
        }

        return { detected: threats.length > 0, threats };
    }
}

export function demonstrateIDS(): void {
    console.log('\n=== Signature-Based IDS ===\n');

    const ids = new SignatureIDS();

    const payloads = [
        "SELECT * FROM users",
        "admin' OR '1'='1",
        "<script>alert('xss')</script>",
        "../../../../etc/passwd",
        "normal request",
    ];

    payloads.forEach(payload => {
        const result = ids.detectThreats(payload);
        console.log(`Payload: ${payload}`);

        if (result.detected) {
            console.log('   ⚠️  THREATS DETECTED:');
            result.threats.forEach(t => console.log(`      - ${t}`));
        } else {
            console.log('   ✅ Clean');
        }
        console.log('');
    });
}

if (require.main === module) {
    demonstrateIDS();
}
