/**
 * STRIDE Threat Modeling
 *
 * STRIDE es un modelo de amenazas desarrollado por Microsoft que categoriza
 * amenazas de seguridad en 6 tipos:
 *
 * S - Spoofing (Suplantación de identidad)
 * T - Tampering (Alteración de datos)
 * R - Repudiation (Repudio)
 * I - Information Disclosure (Divulgación de información)
 * D - Denial of Service (Denegación de servicio)
 * E - Elevation of Privilege (Escalada de privilegios)
 *
 * Cada componente del sistema debe analizarse contra estos 6 tipos de amenazas.
 */

// ============================================================================
// EJEMPLO: Sistema de Banca Online
// ============================================================================

enum ThreatCategory {
    SPOOFING = 'SPOOFING',
    TAMPERING = 'TAMPERING',
    REPUDIATION = 'REPUDIATION',
    INFORMATION_DISCLOSURE = 'INFORMATION_DISCLOSURE',
    DENIAL_OF_SERVICE = 'DENIAL_OF_SERVICE',
    ELEVATION_OF_PRIVILEGE = 'ELEVATION_OF_PRIVILEGE'
}

enum Severity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

interface Threat {
    category: ThreatCategory;
    description: string;
    severity: Severity;
    component: string;
    mitigation: string;
    example?: string;
}

interface SystemComponent {
    name: string;
    description: string;
    trustBoundary: boolean;
    dataFlow: string[];
}

/**
 * Clase para análisis STRIDE de un sistema
 */
class STRIDEAnalysis {
    private components: SystemComponent[] = [];
    private threats: Threat[] = [];

    addComponent(component: SystemComponent): void {
        this.components.push(component);
    }

    // Analizar un componente contra todos los tipos de STRIDE
    analyzeComponent(componentName: string): Threat[] {
        const component = this.components.find(c => c.name === componentName);

        if (!component) {
            throw new Error(`Component ${componentName} not found`);
        }

        const threats: Threat[] = [];

        // S - Spoofing
        threats.push({
            category: ThreatCategory.SPOOFING,
            component: componentName,
            description: `Un atacante podría suplantar la identidad de un usuario legítimo`,
            severity: Severity.CRITICAL,
            mitigation: 'Implementar autenticación multifactor (MFA)',
            example: 'Phishing para robar credenciales'
        });

        // T - Tampering
        if (component.dataFlow.length > 0) {
            threats.push({
                category: ThreatCategory.TAMPERING,
                component: componentName,
                description: `Datos en tránsito podrían ser modificados`,
                severity: Severity.HIGH,
                mitigation: 'Usar TLS/SSL para cifrado en tránsito, HMAC para integridad',
                example: 'Man-in-the-Middle alterando montos de transferencia'
            });
        }

        // R - Repudiation
        threats.push({
            category: ThreatCategory.REPUDIATION,
            component: componentName,
            description: `Usuario podría negar haber realizado una transacción`,
            severity: Severity.MEDIUM,
            mitigation: 'Implementar logging de auditoría con firmas digitales',
            example: 'Usuario afirma no haber autorizado una transferencia'
        });

        // I - Information Disclosure
        threats.push({
            category: ThreatCategory.INFORMATION_DISCLOSURE,
            component: componentName,
            description: `Información sensible podría ser expuesta`,
            severity: Severity.CRITICAL,
            mitigation: 'Cifrado de datos en reposo, minimizar datos en logs',
            example: 'SQL injection revelando números de cuenta'
        });

        // D - Denial of Service
        threats.push({
            category: ThreatCategory.DENIAL_OF_SERVICE,
            component: componentName,
            description: `Sistema podría ser inaccesible por sobrecarga`,
            severity: Severity.HIGH,
            mitigation: 'Rate limiting, WAF, DDoS protection',
            example: 'Ataque DDoS haciendo el sitio inaccesible'
        });

        // E - Elevation of Privilege
        if (component.trustBoundary) {
            threats.push({
                category: ThreatCategory.ELEVATION_OF_PRIVILEGE,
                component: componentName,
                description: `Atacante podría obtener privilegios de administrador`,
                severity: Severity.CRITICAL,
                mitigation: 'Principio de mínimo privilegio, validación robusta de permisos',
                example: 'SQL injection para bypasear autenticación de admin'
            });
        }

        this.threats.push(...threats);

        return threats;
    }

    // Generar reporte de amenazas por severidad
    getThreatReport(): {
        total: number;
        bySeverity: Record<Severity, number>;
        byCategory: Record<ThreatCategory, number>;
        threats: Threat[];
    } {
        const bySeverity: Record<Severity, number> = {
            LOW: 0,
            MEDIUM: 0,
            HIGH: 0,
            CRITICAL: 0
        };

        const byCategory: Record<ThreatCategory, number> = {
            SPOOFING: 0,
            TAMPERING: 0,
            REPUDIATION: 0,
            INFORMATION_DISCLOSURE: 0,
            DENIAL_OF_SERVICE: 0,
            ELEVATION_OF_PRIVILEGE: 0
        };

        this.threats.forEach(threat => {
            bySeverity[threat.severity]++;
            byCategory[threat.category]++;
        });

        return {
            total: this.threats.length,
            bySeverity,
            byCategory,
            threats: this.threats
        };
    }

    // Priorizar amenazas por severidad
    getPrioritizedThreats(): Threat[] {
        const severityOrder = {
            CRITICAL: 4,
            HIGH: 3,
            MEDIUM: 2,
            LOW: 1
        };

        return [...this.threats].sort(
            (a, b) => severityOrder[b.severity] - severityOrder[a.severity]
        );
    }
}

/**
 * Ejemplo: Aplicar STRIDE a un sistema de banca online
 */
class BankingSystemSTRIDE {
    private analysis: STRIDEAnalysis;

    constructor() {
        this.analysis = new STRIDEAnalysis();
        this.defineSystemArchitecture();
    }

    private defineSystemArchitecture(): void {
        // Definir componentes del sistema

        this.analysis.addComponent({
            name: 'Web Application',
            description: 'Frontend de la aplicación bancaria',
            trustBoundary: true,
            dataFlow: ['API Server', 'Browser']
        });

        this.analysis.addComponent({
            name: 'API Server',
            description: 'Backend REST API',
            trustBoundary: true,
            dataFlow: ['Database', 'Web Application', 'Payment Gateway']
        });

        this.analysis.addComponent({
            name: 'Database',
            description: 'Base de datos de usuarios y transacciones',
            trustBoundary: true,
            dataFlow: ['API Server']
        });

        this.analysis.addComponent({
            name: 'Payment Gateway',
            description: 'Procesador de pagos externo',
            trustBoundary: true,
            dataFlow: ['API Server', 'External Bank']
        });

        this.analysis.addComponent({
            name: 'Authentication Service',
            description: 'Servicio de autenticación y autorización',
            trustBoundary: true,
            dataFlow: ['API Server', 'User Directory']
        });
    }

    performAnalysis(): void {
        console.log('\n=== STRIDE THREAT MODEL ANALYSIS ===\n');
        console.log('Sistema: Banca Online\n');

        // Analizar cada componente
        const components = [
            'Web Application',
            'API Server',
            'Database',
            'Payment Gateway',
            'Authentication Service'
        ];

        components.forEach(component => {
            console.log(`\n--- Analizando: ${component} ---\n`);

            const threats = this.analysis.analyzeComponent(component);

            threats.forEach(threat => {
                console.log(`[${threat.category}] ${threat.severity}`);
                console.log(`  Amenaza: ${threat.description}`);
                console.log(`  Mitigación: ${threat.mitigation}`);
                if (threat.example) {
                    console.log(`  Ejemplo: ${threat.example}`);
                }
                console.log();
            });
        });
    }

    generateReport(): void {
        const report = this.analysis.getThreatReport();

        console.log('\n=== REPORTE DE AMENAZAS ===\n');

        console.log(`Total de amenazas identificadas: ${report.total}\n`);

        console.log('Por Severidad:');
        Object.entries(report.bySeverity).forEach(([severity, count]) => {
            console.log(`  ${severity}: ${count}`);
        });

        console.log('\nPor Categoría STRIDE:');
        Object.entries(report.byCategory).forEach(([category, count]) => {
            console.log(`  ${category}: ${count}`);
        });

        console.log('\n=== TOP 5 AMENAZAS PRIORITARIAS ===\n');

        const prioritized = this.analysis.getPrioritizedThreats().slice(0, 5);

        prioritized.forEach((threat, index) => {
            console.log(`${index + 1}. [${threat.severity}] ${threat.category}`);
            console.log(`   Componente: ${threat.component}`);
            console.log(`   Amenaza: ${threat.description}`);
            console.log(`   Mitigación: ${threat.mitigation}\n`);
        });
    }
}

/**
 * Template para documentar análisis STRIDE
 */
interface STRIDETemplate {
    component: string;
    threats: {
        spoofing?: string;
        tampering?: string;
        repudiation?: string;
        informationDisclosure?: string;
        denialOfService?: string;
        elevationOfPrivilege?: string;
    };
}

class STRIDEDocumentationTemplate {
    static generateTemplate(componentName: string): STRIDETemplate {
        return {
            component: componentName,
            threats: {
                spoofing: 'Analizar: ¿Puede alguien suplantar identidad aquí?',
                tampering: 'Analizar: ¿Pueden los datos ser alterados?',
                repudiation: 'Analizar: ¿Pueden negarse acciones realizadas?',
                informationDisclosure: 'Analizar: ¿Puede exponerse información sensible?',
                denialOfService: 'Analizar: ¿Puede el servicio ser interrumpido?',
                elevationOfPrivilege: 'Analizar: ¿Pueden escalarse privilegios?'
            }
        };
    }

    static printTemplate(componentName: string): void {
        const template = this.generateTemplate(componentName);

        console.log(`\n=== STRIDE Analysis Template: ${componentName} ===\n`);

        console.log('[S] Spoofing:');
        console.log(`    ${template.threats.spoofing}\n`);

        console.log('[T] Tampering:');
        console.log(`    ${template.threats.tampering}\n`);

        console.log('[R] Repudiation:');
        console.log(`    ${template.threats.repudiation}\n`);

        console.log('[I] Information Disclosure:');
        console.log(`    ${template.threats.informationDisclosure}\n`);

        console.log('[D] Denial of Service:');
        console.log(`    ${template.threats.denialOfService}\n`);

        console.log('[E] Elevation of Privilege:');
        console.log(`    ${template.threats.elevationOfPrivilege}\n`);
    }
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateSTRIDE(): void {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║        STRIDE THREAT MODELING ANALYSIS            ║');
    console.log('╚════════════════════════════════════════════════════╝');

    const bankingSystem = new BankingSystemSTRIDE();

    // Realizar análisis completo
    bankingSystem.performAnalysis();

    // Generar reporte
    bankingSystem.generateReport();

    // Mostrar template para nuevo componente
    console.log('\n=== TEMPLATE PARA ANÁLISIS DE NUEVOS COMPONENTES ===');
    STRIDEDocumentationTemplate.printTemplate('Mobile App');
}

// Ejecutar demostración
if (require.main === module) {
    demonstrateSTRIDE();
}

export {
    ThreatCategory,
    Severity,
    Threat,
    SystemComponent,
    STRIDEAnalysis,
    BankingSystemSTRIDE,
    STRIDEDocumentationTemplate
};
