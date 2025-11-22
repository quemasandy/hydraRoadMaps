/**
 * DNSSEC & DNS Poisoning
 */

import { createSign, createVerify, generateKeyPairSync } from 'crypto';

export class DNSSECDemo {
    static demonstrateDNSPoisoning(): void {
        console.log('\n=== DNS Poisoning Attack ===\n');

        console.log('❌ Sin DNSSEC:');
        console.log('   Query: example.com → ?');
        console.log('   Attacker intercepts');
        console.log('   Fake Response: 10.0.0.1 (malicious)\n');

        console.log('✅ Con DNSSEC:');
        console.log('   Query: example.com → ?');
        console.log('   Response: 93.184.216.34 + RRSIG (signature)');
        console.log('   Verificación: ✅ Firma válida\n');

        const { publicKey, privateKey } = generateKeyPairSync('rsa', {
            modulusLength: 2048,
        });

        const dnsRecord = 'example.com. IN A 93.184.216.34';
        const sign = createSign('SHA256');
        sign.update(dnsRecord);
        const signature = sign.sign(privateKey, 'hex');

        console.log('RRSIG (Resource Record Signature):');
        console.log(`   ${signature.substring(0, 32)}...\n`);

        const verify = createVerify('SHA256');
        verify.update(dnsRecord);
        const valid = verify.verify(publicKey, signature, 'hex');

        console.log(`Verificación: ${valid ? '✅' : '❌'} Auténtica`);
    }
}

if (require.main === module) {
    DNSSECDemo.demonstrateDNSPoisoning();
}
