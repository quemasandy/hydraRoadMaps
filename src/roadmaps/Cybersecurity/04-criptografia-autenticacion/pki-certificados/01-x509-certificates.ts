/**
 * X.509 Certificates
 */
export interface X509Certificate {
    version: number;
    serialNumber: string;
    issuer: string;
    subject: string;
    validFrom: Date;
    validTo: Date;
    publicKey: string;
}

export class X509Demo {
    static demonstrate(): void {
        console.log('\n=== X.509 Certificate ===\n');
        const cert: X509Certificate = {
            version: 3,
            serialNumber: '0x1A2B',
            issuer: 'CN=Root CA',
            subject: 'CN=www.example.com',
            validFrom: new Date('2024-01-01'),
            validTo: new Date('2025-01-01'),
            publicKey: 'MIIBIj...',
        };
        console.log('Certificate:', cert);
        console.log('\nExtensions: SAN, Key Usage, Extended Key Usage');
    }
}

if (require.main === module) {
    X509Demo.demonstrate();
}
