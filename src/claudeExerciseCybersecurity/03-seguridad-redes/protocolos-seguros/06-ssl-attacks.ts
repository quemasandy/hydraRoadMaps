/**
 * SSL/TLS Attacks (SSL Stripping, Downgrade)
 */

export class SSLAttacksDemo {
    static demonstrateAttacks(): void {
        console.log('\n=== SSL/TLS Attacks ===\n');

        console.log('1. SSL Stripping (MITM):');
        console.log('   User → http://bank.com');
        console.log('   Attacker → https://bank.com (upstream)');
        console.log('   User ← http://bank.com (downgraded)');
        console.log('   ⚠️  User ve HTTP, attacker ve HTTPS\n');

        console.log('   Defensa: HSTS (HTTP Strict Transport Security)');
        console.log('   Strict-Transport-Security: max-age=31536000\n');

        console.log('2. Protocol Downgrade Attack:');
        console.log('   Attacker forces TLS 1.0 (vulnerable)');
        console.log('   Defensa: Disable old TLS versions\n');

        console.log('3. BEAST Attack:');
        console.log('   Exploits CBC mode in TLS 1.0');
        console.log('   Defensa: Use TLS 1.2+ with GCM mode\n');

        console.log('4. POODLE:');
        console.log('   Padding Oracle On Downgraded Legacy Encryption');
        console.log('   Defensa: Disable SSLv3\n');

        console.log('Mitigaciones:');
        console.log('   ✅ TLS 1.3 only');
        console.log('   ✅ HSTS preload list');
        console.log('   ✅ Certificate pinning');
        console.log('   ✅ Perfect Forward Secrecy (PFS)');
    }
}

if (require.main === module) {
    SSLAttacksDemo.demonstrateAttacks();
}
