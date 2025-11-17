/**
 * Attack Surface Analysis (Análisis de Superficie de Ataque)
 *
 * La superficie de ataque es la suma de todos los puntos donde un atacante
 * puede intentar entrar o extraer datos de un sistema.
 *
 * Tipos de superficie de ataque:
 * 1. Red (Network): Puertos, servicios, protocolos
 * 2. Software: APIs, interfaces, inputs
 * 3. Humana: Usuarios, administradores, soporte
 * 4. Física: Acceso a hardware, instalaciones
 *
 * Objetivo: Minimizar la superficie de ataque
 * - Eliminar componentes innecesarios
 * - Restringir acceso
 * - Segmentar sistemas
 * - Aplicar principio de mínimo privilegio
 */

// ============================================================================
// MODELO DE ATTACK SURFACE
// ============================================================================

enum SurfaceType {
    NETWORK = 'NETWORK',
    SOFTWARE = 'SOFTWARE',
    HUMAN = 'HUMAN',
    PHYSICAL = 'PHYSICAL'
}

enum ExposureLevel {
    PUBLIC = 'PUBLIC',              // Internet público
    INTERNAL = 'INTERNAL',          // Red interna
    PRIVILEGED = 'PRIVILEGED',      // Usuarios privilegiados
    ISOLATED = 'ISOLATED'           // Totalmente aislado
}

enum TrustLevel {
    UNTRUSTED = 'UNTRUSTED',        // Input no confiable
    SEMI_TRUSTED = 'SEMI_TRUSTED',  // Usuarios autenticados
    TRUSTED = 'TRUSTED',            // Sistemas internos
    HIGHLY_TRUSTED = 'HIGHLY_TRUSTED' // Sistemas críticos
}

interface AttackSurfaceEntry {
    id: string;
    name: string;
    type: SurfaceType;
    description: string;
    exposure: ExposureLevel;
    trustLevel: TrustLevel;
    dataTypes: string[];            // Tipos de datos procesados
    mitigations: string[];          // Controles de seguridad
    risks: string[];                // Riesgos identificados
}

/**
 * Clase para mapear y analizar la superficie de ataque
 */
class AttackSurfaceMapper {
    private entries: AttackSurfaceEntry[] = [];

    addEntry(entry: AttackSurfaceEntry): void {
        this.entries.push(entry);
    }

    getEntriesByExposure(exposure: ExposureLevel): AttackSurfaceEntry[] {
        return this.entries.filter(e => e.exposure === exposure);
    }

    getEntriesByType(type: SurfaceType): AttackSurfaceEntry[] {
        return this.entries.filter(e => e.type === type);
    }

    // Calcular puntuación de riesgo de una entrada
    calculateRiskScore(entry: AttackSurfaceEntry): number {
        let score = 0;

        // Puntos por exposición
        const exposureScores: Record<ExposureLevel, number> = {
            PUBLIC: 10,
            INTERNAL: 5,
            PRIVILEGED: 3,
            ISOLATED: 1
        };
        score += exposureScores[entry.exposure];

        // Puntos por nivel de confianza (inverso)
        const trustScores: Record<TrustLevel, number> = {
            UNTRUSTED: 10,
            SEMI_TRUSTED: 6,
            TRUSTED: 3,
            HIGHLY_TRUSTED: 1
        };
        score += trustScores[entry.trustLevel];

        // Puntos por datos sensibles
        const sensitiveKeywords = ['password', 'credit', 'ssn', 'personal', 'financial'];
        const hasSensitiveData = entry.dataTypes.some(dataType =>
            sensitiveKeywords.some(keyword =>
                dataType.toLowerCase().includes(keyword)
            )
        );
        if (hasSensitiveData) score += 5;

        // Restar puntos por mitigaciones
        score -= Math.min(entry.mitigations.length, 5);

        // Agregar puntos por riesgos conocidos
        score += entry.risks.length * 2;

        return Math.max(0, score);
    }

    // Generar reporte de superficie de ataque
    generateReport(): void {
        console.log('\n╔════════════════════════════════════════════════════╗');
        console.log('║           ATTACK SURFACE ANALYSIS                 ║');
        console.log('╚════════════════════════════════════════════════════╝\n');

        console.log(`Total de puntos de entrada: ${this.entries.length}\n`);

        // Distribución por tipo
        console.log('Distribución por tipo:');
        Object.values(SurfaceType).forEach(type => {
            const count = this.getEntriesByType(type).length;
            console.log(`  ${type}: ${count}`);
        });

        // Distribución por exposición
        console.log('\nDistribución por exposición:');
        Object.values(ExposureLevel).forEach(level => {
            const count = this.getEntriesByExposure(level).length;
            const entries = this.getEntriesByExposure(level);
            const avgRisk = entries.length > 0
                ? entries.reduce((sum, e) => sum + this.calculateRiskScore(e), 0) / entries.length
                : 0;

            console.log(`  ${level}: ${count} (riesgo promedio: ${avgRisk.toFixed(1)})`);
        });

        // Identificar áreas de mayor riesgo
        console.log('\n=== ÁREAS DE MAYOR RIESGO ===\n');

        const sortedByRisk = [...this.entries]
            .map(entry => ({
                entry,
                risk: this.calculateRiskScore(entry)
            }))
            .sort((a, b) => b.risk - a.risk)
            .slice(0, 5);

        sortedByRisk.forEach((item, index) => {
            console.log(`${index + 1}. ${item.entry.name} (Score: ${item.risk})`);
            console.log(`   Tipo: ${item.entry.type}`);
            console.log(`   Exposición: ${item.entry.exposure}`);
            console.log(`   Trust: ${item.entry.trustLevel}`);
            console.log(`   Riesgos: ${item.entry.risks.join(', ')}`);
            console.log(`   Mitigaciones: ${item.entry.mitigations.length}\n`);
        });
    }

    // Recomendaciones para reducir superficie de ataque
    generateRecommendations(): void {
        console.log('\n=== RECOMENDACIONES PARA REDUCIR SUPERFICIE DE ATAQUE ===\n');

        const publicEntries = this.getEntriesByExposure(ExposureLevel.PUBLIC);
        const untrustedEntries = this.entries.filter(
            e => e.trustLevel === TrustLevel.UNTRUSTED
        );

        console.log(`1. Revisar exposición pública (${publicEntries.length} puntos):`);
        publicEntries.forEach(entry => {
            console.log(`   - ${entry.name}: ¿Es necesario que sea público?`);
        });

        console.log(`\n2. Fortalecer inputs no confiables (${untrustedEntries.length} puntos):`);
        untrustedEntries.forEach(entry => {
            const needsMore = entry.mitigations.length < 3;
            if (needsMore) {
                console.log(`   - ${entry.name}: Agregar más validaciones y sanitización`);
            }
        });

        // Identificar componentes sin mitigaciones adecuadas
        const underProtected = this.entries.filter(
            e => e.mitigations.length < 2 && e.exposure !== ExposureLevel.ISOLATED
        );

        if (underProtected.length > 0) {
            console.log(`\n3. Componentes sub-protegidos (${underProtected.length}):`);
            underProtected.forEach(entry => {
                console.log(`   - ${entry.name}: Solo ${entry.mitigations.length} mitigaciones`);
            });
        }
    }
}

// ============================================================================
// EJEMPLO: E-commerce Application
// ============================================================================

function mapEcommerceAttackSurface(): AttackSurfaceMapper {
    const mapper = new AttackSurfaceMapper();

    // Red - Superficie de ataque de red
    mapper.addEntry({
        id: 'net-01',
        name: 'HTTPS Web Server (Port 443)',
        type: SurfaceType.NETWORK,
        description: 'Servidor web principal accesible públicamente',
        exposure: ExposureLevel.PUBLIC,
        trustLevel: TrustLevel.UNTRUSTED,
        dataTypes: ['HTTP requests', 'User credentials', 'Payment data'],
        mitigations: [
            'TLS 1.3',
            'WAF',
            'Rate limiting',
            'DDoS protection'
        ],
        risks: [
            'DDoS attacks',
            'SSL/TLS vulnerabilities',
            'HTTP request smuggling'
        ]
    });

    mapper.addEntry({
        id: 'net-02',
        name: 'API Gateway (Port 443)',
        type: SurfaceType.NETWORK,
        description: 'REST API para mobile apps y partners',
        exposure: ExposureLevel.PUBLIC,
        trustLevel: TrustLevel.SEMI_TRUSTED,
        dataTypes: ['API requests', 'Auth tokens', 'Order data'],
        mitigations: [
            'OAuth 2.0',
            'API rate limiting',
            'Input validation',
            'JWT validation'
        ],
        risks: [
            'API abuse',
            'Token theft',
            'Excessive data exposure'
        ]
    });

    mapper.addEntry({
        id: 'net-03',
        name: 'SSH Admin Access (Port 22)',
        type: SurfaceType.NETWORK,
        description: 'Acceso SSH para administradores',
        exposure: ExposureLevel.PRIVILEGED,
        trustLevel: TrustLevel.TRUSTED,
        dataTypes: ['System commands', 'Configuration files'],
        mitigations: [
            'Key-based auth only',
            'IP whitelist',
            'Fail2ban',
            'Audit logging'
        ],
        risks: [
            'Brute force attacks',
            'Credential theft',
            'Unauthorized access'
        ]
    });

    mapper.addEntry({
        id: 'net-04',
        name: 'Database Port (Port 5432)',
        type: SurfaceType.NETWORK,
        description: 'PostgreSQL database',
        exposure: ExposureLevel.INTERNAL,
        trustLevel: TrustLevel.TRUSTED,
        dataTypes: ['Customer data', 'Financial records', 'Passwords'],
        mitigations: [
            'Network segmentation',
            'Encrypted connections',
            'No public access',
            'Strong authentication'
        ],
        risks: [
            'SQL injection (from app)',
            'Credential compromise',
            'Data breach'
        ]
    });

    // Software - Superficie de ataque de software
    mapper.addEntry({
        id: 'sw-01',
        name: 'User Registration Form',
        type: SurfaceType.SOFTWARE,
        description: 'Formulario de registro de usuarios',
        exposure: ExposureLevel.PUBLIC,
        trustLevel: TrustLevel.UNTRUSTED,
        dataTypes: ['Email', 'Password', 'Personal information'],
        mitigations: [
            'Input validation',
            'CAPTCHA',
            'Email verification',
            'Password strength requirements'
        ],
        risks: [
            'Account enumeration',
            'Automated registrations',
            'XSS',
            'SQL injection'
        ]
    });

    mapper.addEntry({
        id: 'sw-02',
        name: 'Search Functionality',
        type: SurfaceType.SOFTWARE,
        description: 'Búsqueda de productos',
        exposure: ExposureLevel.PUBLIC,
        trustLevel: TrustLevel.UNTRUSTED,
        dataTypes: ['Search queries'],
        mitigations: [
            'Parameterized queries',
            'Output encoding',
            'Search query sanitization'
        ],
        risks: [
            'SQL injection',
            'XSS in search results',
            'NoSQL injection'
        ]
    });

    mapper.addEntry({
        id: 'sw-03',
        name: 'Payment Processing API',
        type: SurfaceType.SOFTWARE,
        description: 'Integración con gateway de pago',
        exposure: ExposureLevel.PUBLIC,
        trustLevel: TrustLevel.SEMI_TRUSTED,
        dataTypes: ['Credit card data', 'Billing information'],
        mitigations: [
            'PCI DSS compliance',
            'Tokenization',
            'No storage of CVV',
            'Encrypted transmission'
        ],
        risks: [
            'Payment data theft',
            'Man-in-the-middle',
            'Replay attacks'
        ]
    });

    mapper.addEntry({
        id: 'sw-04',
        name: 'Admin Dashboard',
        type: SurfaceType.SOFTWARE,
        description: 'Panel de administración',
        exposure: ExposureLevel.PRIVILEGED,
        trustLevel: TrustLevel.TRUSTED,
        dataTypes: ['All system data', 'User management', 'Configuration'],
        mitigations: [
            'MFA required',
            'IP restrictions',
            'RBAC',
            'Session timeout'
        ],
        risks: [
            'Privilege escalation',
            'CSRF',
            'Session hijacking'
        ]
    });

    mapper.addEntry({
        id: 'sw-05',
        name: 'File Upload Feature',
        type: SurfaceType.SOFTWARE,
        description: 'Subida de imágenes de productos',
        exposure: ExposureLevel.INTERNAL,
        trustLevel: TrustLevel.SEMI_TRUSTED,
        dataTypes: ['Image files', 'Product data'],
        mitigations: [
            'File type validation',
            'Size limits',
            'Malware scanning',
            'Separate storage domain'
        ],
        risks: [
            'Malware upload',
            'Path traversal',
            'XXE attacks',
            'Storage exhaustion'
        ]
    });

    // Humana - Superficie de ataque humana
    mapper.addEntry({
        id: 'hum-01',
        name: 'Customer Support Email',
        type: SurfaceType.HUMAN,
        description: 'Email de soporte al cliente',
        exposure: ExposureLevel.PUBLIC,
        trustLevel: TrustLevel.UNTRUSTED,
        dataTypes: ['Customer inquiries', 'Account information'],
        mitigations: [
            'Security awareness training',
            'Verification procedures',
            'Email filtering'
        ],
        risks: [
            'Phishing attacks',
            'Social engineering',
            'Impersonation',
            'Information disclosure'
        ]
    });

    mapper.addEntry({
        id: 'hum-02',
        name: 'System Administrators',
        type: SurfaceType.HUMAN,
        description: 'Personal con acceso privilegiado',
        exposure: ExposureLevel.PRIVILEGED,
        trustLevel: TrustLevel.HIGHLY_TRUSTED,
        dataTypes: ['All system access'],
        mitigations: [
            'Background checks',
            'Security training',
            'Least privilege',
            'Audit logging',
            'Separation of duties'
        ],
        risks: [
            'Insider threats',
            'Account compromise',
            'Social engineering'
        ]
    });

    // Física - Superficie de ataque física
    mapper.addEntry({
        id: 'phy-01',
        name: 'Data Center Access',
        type: SurfaceType.PHYSICAL,
        description: 'Acceso físico al data center',
        exposure: ExposureLevel.PRIVILEGED,
        trustLevel: TrustLevel.HIGHLY_TRUSTED,
        dataTypes: ['Physical servers', 'Network equipment'],
        mitigations: [
            'Biometric access',
            'Security cameras',
            '24/7 security',
            'Visitor logs'
        ],
        risks: [
            'Unauthorized physical access',
            'Hardware tampering',
            'Data theft'
        ]
    });

    mapper.addEntry({
        id: 'phy-02',
        name: 'Office Workstations',
        type: SurfaceType.PHYSICAL,
        description: 'Estaciones de trabajo de empleados',
        exposure: ExposureLevel.INTERNAL,
        trustLevel: TrustLevel.TRUSTED,
        dataTypes: ['Business data', 'Source code', 'Credentials'],
        mitigations: [
            'Full disk encryption',
            'Screen lock policies',
            'Physical security',
            'Clean desk policy'
        ],
        risks: [
            'Device theft',
            'Shoulder surfing',
            'USB attacks',
            'Unlocked workstations'
        ]
    });

    return mapper;
}

/**
 * Comparación: Before y After reducción de superficie
 */
function demonstrateReduction(): void {
    console.log('\n=== REDUCCIÓN DE SUPERFICIE DE ATAQUE ===\n');

    console.log('BEFORE (Superficie grande):');
    console.log('  ❌ 15 puertos abiertos públicamente');
    console.log('  ❌ FTP, Telnet, HTTP sin cifrar');
    console.log('  ❌ Panel de admin en /admin (público)');
    console.log('  ❌ Mensajes de error detallados');
    console.log('  ❌ Múltiples versiones de API sin deprecar');
    console.log('  ❌ Debug endpoints en producción\n');

    console.log('AFTER (Superficie reducida):');
    console.log('  ✅ Solo puertos 443 y 22 (con restricciones)');
    console.log('  ✅ Solo HTTPS y SSH');
    console.log('  ✅ Admin panel en subdominio separado + VPN');
    console.log('  ✅ Mensajes de error genéricos');
    console.log('  ✅ Una versión activa de API, deprecación planificada');
    console.log('  ✅ Debug endpoints eliminados\n');

    console.log('Resultado: 60% de reducción en superficie de ataque');
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateAttackSurface(): void {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║          ATTACK SURFACE ANALYSIS                  ║');
    console.log('╚════════════════════════════════════════════════════╝');

    const mapper = mapEcommerceAttackSurface();

    // Generar reporte
    mapper.generateReport();

    // Generar recomendaciones
    mapper.generateRecommendations();

    // Demostrar reducción
    demonstrateReduction();

    console.log('\n=== PRINCIPIOS CLAVE ===\n');

    console.log('1. Minimizar exposición:');
    console.log('   - Cerrar puertos innecesarios');
    console.log('   - Deshabilitar servicios no usados');
    console.log('   - Usar VPN para acceso administrativo\n');

    console.log('2. Segmentación:');
    console.log('   - Separar red pública de interna');
    console.log('   - Aislar componentes críticos');
    console.log('   - DMZ para servicios públicos\n');

    console.log('3. Defensa en profundidad:');
    console.log('   - Múltiples capas de seguridad');
    console.log('   - No confiar en un solo control');
    console.log('   - Asumir que cada capa puede fallar\n');

    console.log('4. Monitoreo continuo:');
    console.log('   - La superficie de ataque cambia');
    console.log('   - Nuevos endpoints se agregan');
    console.log('   - Revisar regularmente');
}

// Ejecutar demostración
if (require.main === module) {
    demonstrateAttackSurface();
}

export {
    SurfaceType,
    ExposureLevel,
    TrustLevel,
    AttackSurfaceEntry,
    AttackSurfaceMapper
};
