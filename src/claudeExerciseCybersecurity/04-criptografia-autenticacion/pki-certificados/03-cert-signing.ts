/**
 * Certificate Signing
 */
import { generateKeyPairSync, createSign } from 'crypto';
export class CertSigningDemo {
    static demonstrate(): void {
        console.log('\n=== Certificate Signing ===\n');
        const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
        const csr = { subject: 'CN=example.com', publicKey };
        console.log('CSR created:', csr.subject);
        const sign = createSign('SHA256');
        sign.update(JSON.stringify(csr));
        const signature = sign.sign(privateKey, 'hex');
        console.log('Signature:', signature.substring(0, 32) + '...');
    }
}
if (require.main === module) { CertSigningDemo.demonstrate(); }