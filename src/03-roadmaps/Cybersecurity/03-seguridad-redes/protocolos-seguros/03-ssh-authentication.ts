/**
 * SSH Key-Based Authentication
 */

import { generateKeyPairSync, createSign, createVerify } from 'crypto';

export class SSHKeyAuth {
    static demonstrateKeyAuth(): void {
        console.log('\n=== SSH Key-Based Authentication ===\n');

        // Generate key pair
        const { publicKey, privateKey } = generateKeyPairSync('rsa', {
            modulusLength: 2048,
        });

        console.log('1. Generate RSA Key Pair:');
        console.log('   ✅ Private key (keep secret)');
        console.log('   ✅ Public key (share with server)\n');

        // Sign message
        const message = 'SSH authentication challenge';
        const sign = createSign('SHA256');
        sign.update(message);
        const signature = sign.sign(privateKey, 'hex');

        console.log('2. Client signs challenge:');
        console.log(`   Signature: ${signature.substring(0, 32)}...\n`);

        // Verify signature
        const verify = createVerify('SHA256');
        verify.update(message);
        const isValid = verify.verify(publicKey, signature, 'hex');

        console.log('3. Server verifies signature:');
        console.log(`   ${isValid ? '✅' : '❌'} Authentication successful\n`);

        console.log('Advantages:');
        console.log('   - No password needed');
        console.log('   - Immune to brute force');
        console.log('   - Can use passphrase for private key');
    }
}

if (require.main === module) {
    SSHKeyAuth.demonstrateKeyAuth();
}
