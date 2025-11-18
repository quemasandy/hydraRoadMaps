/**
 * Session Hijacking & Secure Sessions
 */

import { randomBytes, createHash } from 'crypto';

export class SessionManager {
    private sessions: Map<string, { userId: number; createdAt: Date; ipAddress: string }> = new Map();

    createSession(userId: number, ipAddress: string): string {
        const sessionId = randomBytes(32).toString('hex');
        this.sessions.set(sessionId, { userId, createdAt: new Date(), ipAddress });
        return sessionId;
    }

    validateSession(sessionId: string, currentIP: string): boolean {
        const session = this.sessions.get(sessionId);
        if (!session) return false;

        // Validar IP (prevenir session hijacking)
        if (session.ipAddress !== currentIP) {
            console.warn('⚠️  IP mismatch - posible session hijacking');
            return false;
        }

        return true;
    }

    rotateSession(oldSessionId: string): string | null {
        const session = this.sessions.get(oldSessionId);
        if (!session) return null;

        this.sessions.delete(oldSessionId);
        const newSessionId = this.createSession(session.userId, session.ipAddress);
        return newSessionId;
    }
}

export function demonstrateSessionHijacking(): void {
    console.log('\n=== Session Hijacking Prevention ===\n');

    const manager = new SessionManager();
    const sessionId = manager.createSession(1, '192.168.1.1');

    console.log('1. Session válida desde IP original:');
    const valid1 = manager.validateSession(sessionId, '192.168.1.1');
    console.log(`   ${valid1 ? '✅' : '❌'} Válida\n`);

    console.log('2. Intento desde IP diferente (hijacking):');
    const valid2 = manager.validateSession(sessionId, '10.0.0.1');
    console.log(`   ${valid2 ? '✅' : '❌'} Bloqueada\n`);

    console.log('3. Session rotation:');
    const newSessionId = manager.rotateSession(sessionId);
    console.log(`   Nueva session: ${newSessionId?.substring(0, 16)}...`);
}

if (require.main === module) {
    demonstrateSessionHijacking();
}
