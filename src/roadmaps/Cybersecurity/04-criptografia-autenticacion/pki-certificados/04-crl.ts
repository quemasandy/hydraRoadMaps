/**
 * Certificate Revocation List
 */
export class CRLManager {
    private revoked: Set<string> = new Set();
    revoke(serial: string): void { this.revoked.add(serial); }
    isRevoked(serial: string): boolean { return this.revoked.has(serial); }
    demonstrate(): void {
        console.log('\n=== CRL ===\n');
        this.revoke('0x1234');
        console.log('Revoked 0x1234:', this.isRevoked('0x1234'));
        console.log('\nLimitations: Large size, periodic updates');
    }
}
if (require.main === module) { new CRLManager().demonstrate(); }