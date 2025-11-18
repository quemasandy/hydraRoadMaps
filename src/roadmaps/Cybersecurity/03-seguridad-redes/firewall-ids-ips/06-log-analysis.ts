/**
 * Log Analysis and Correlation
 */

interface LogEntry {
    timestamp: Date;
    srcIP: string;
    action: string;
    details: string;
}

export class LogAnalyzer {
    private logs: LogEntry[] = [];

    addLog(entry: LogEntry): void {
        this.logs.push(entry);
    }

    detectBruteForce(ip: string, timeWindowMs: number, threshold: number): boolean {
        const now = Date.now();
        const recentAttempts = this.logs.filter(
            log =>
                log.srcIP === ip &&
                log.action === 'LOGIN_FAILED' &&
                now - log.timestamp.getTime() < timeWindowMs
        );

        return recentAttempts.length >= threshold;
    }

    detectPortScan(ip: string): boolean {
        const uniquePorts = new Set(
            this.logs
                .filter(log => log.srcIP === ip && log.action === 'PORT_SCAN')
                .map(log => log.details)
        );

        return uniquePorts.size > 10; // More than 10 different ports
    }

    generateReport(): void {
        console.log('\n=== Security Log Analysis ===\n');

        const ipCounts = new Map<string, number>();

        this.logs.forEach(log => {
            ipCounts.set(log.srcIP, (ipCounts.get(log.srcIP) || 0) + 1);
        });

        console.log('Top IPs by activity:');
        Array.from(ipCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .forEach(([ip, count]) => {
                console.log(`   ${ip}: ${count} events`);
            });
    }
}

export function demonstrateLogAnalysis(): void {
    console.log('\n=== Log Analysis & Correlation ===\n');

    const analyzer = new LogAnalyzer();

    // Simulate brute force
    for (let i = 0; i < 5; i++) {
        analyzer.addLog({
            timestamp: new Date(),
            srcIP: '10.0.0.1',
            action: 'LOGIN_FAILED',
            details: 'admin',
        });
    }

    const isBruteForce = analyzer.detectBruteForce('10.0.0.1', 60000, 3);
    console.log(`Brute force detected: ${isBruteForce ? '⚠️  YES' : '✅ NO'}\n`);

    analyzer.generateReport();
}

if (require.main === module) {
    demonstrateLogAnalysis();
}
