/**
 * Anomaly-Based IDS
 */

interface TrafficBaseline {
    avgRequestsPerMin: number;
    avgPayloadSize: number;
    commonUserAgents: Set<string>;
}

export class AnomalyIDS {
    private baseline: TrafficBaseline;

    constructor(baseline: TrafficBaseline) {
        this.baseline = baseline;
    }

    detectAnomaly(
        requestsPerMin: number,
        payloadSize: number,
        userAgent: string
    ): { anomaly: boolean; reasons: string[] } {
        const reasons: string[] = [];

        // Detectar spike en requests
        if (requestsPerMin > this.baseline.avgRequestsPerMin * 3) {
            reasons.push(`Request rate anomaly: ${requestsPerMin} req/min (baseline: ${this.baseline.avgRequestsPerMin})`);
        }

        // Detectar payload inusual
        if (payloadSize > this.baseline.avgPayloadSize * 5) {
            reasons.push(`Unusual payload size: ${payloadSize} bytes`);
        }

        // Detectar User-Agent desconocido
        if (!this.baseline.commonUserAgents.has(userAgent)) {
            reasons.push(`Unknown User-Agent: ${userAgent}`);
        }

        return { anomaly: reasons.length > 0, reasons };
    }
}

export function demonstrateAnomalyDetection(): void {
    console.log('\n=== Anomaly-Based IDS ===\n');

    const baseline: TrafficBaseline = {
        avgRequestsPerMin: 100,
        avgPayloadSize: 1024,
        commonUserAgents: new Set(['Mozilla/5.0', 'Chrome/90.0']),
    };

    const ids = new AnomalyIDS(baseline);

    console.log('Baseline:');
    console.log(`   Avg requests/min: ${baseline.avgRequestsPerMin}`);
    console.log(`   Avg payload: ${baseline.avgPayloadSize} bytes\n`);

    const tests = [
        { reqPerMin: 90, payloadSize: 1000, ua: 'Mozilla/5.0' },
        { reqPerMin: 500, payloadSize: 1200, ua: 'Mozilla/5.0' },
        { reqPerMin: 120, payloadSize: 10000, ua: 'Mozilla/5.0' },
        { reqPerMin: 100, payloadSize: 1024, ua: 'Hacker-Tool/1.0' },
    ];

    tests.forEach((test, i) => {
        console.log(`Test ${i + 1}:`);
        const result = ids.detectAnomaly(test.reqPerMin, test.payloadSize, test.ua);

        if (result.anomaly) {
            console.log('   ⚠️  ANOMALY DETECTED:');
            result.reasons.forEach(r => console.log(`      - ${r}`));
        } else {
            console.log('   ✅ Normal traffic');
        }
        console.log('');
    });
}

if (require.main === module) {
    demonstrateAnomalyDetection();
}
