/**
 * Stateful vs Stateless Firewall
 */

interface Connection {
    srcIP: string;
    dstIP: string;
    srcPort: number;
    dstPort: number;
    state: 'NEW' | 'ESTABLISHED' | 'RELATED';
}

export class StatefulFirewall {
    private connections: Map<string, Connection> = new Map();

    trackConnection(conn: Connection): void {
        const key = `${conn.srcIP}:${conn.srcPort}-${conn.dstIP}:${conn.dstPort}`;
        this.connections.set(key, conn);
    }

    isEstablished(srcIP: string, srcPort: number, dstIP: string, dstPort: number): boolean {
        const key = `${srcIP}:${srcPort}-${dstIP}:${dstPort}`;
        const conn = this.connections.get(key);
        return conn?.state === 'ESTABLISHED';
    }
}

export function demonstrateStateful(): void {
    console.log('\n=== Stateful vs Stateless Firewall ===\n');

    console.log('Stateless:');
    console.log('   - Cada paquete evaluado independientemente');
    console.log('   - No tracking de conexiones');
    console.log('   - Más rápido, menos memoria\n');

    console.log('Stateful:');
    console.log('   - Tracking de conexiones');
    console.log('   - Context-aware');
    console.log('   - Más seguro\n');

    const firewall = new StatefulFirewall();

    firewall.trackConnection({
        srcIP: '10.0.0.1',
        dstIP: '192.168.1.1',
        srcPort: 50000,
        dstPort: 80,
        state: 'ESTABLISHED',
    });

    console.log('Connection established: 10.0.0.1:50000 → 192.168.1.1:80');

    const isEstab = firewall.isEstablished('10.0.0.1', 50000, '192.168.1.1', 80);
    console.log(`Return traffic allowed: ${isEstab ? '✅' : '❌'}`);
}

if (require.main === module) {
    demonstrateStateful();
}
