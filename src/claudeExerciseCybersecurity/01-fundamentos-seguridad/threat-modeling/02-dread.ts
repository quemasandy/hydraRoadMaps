/**
 * DREAD Risk Assessment Model
 *
 * DREAD es un modelo de evaluación de riesgos que complementa STRIDE.
 * Califica cada amenaza en 5 dimensiones (escala 1-10):
 *
 * D - Damage Potential (Daño potencial)
 * R - Reproducibility (Reproducibilidad)
 * E - Exploitability (Explotabilidad)
 * A - Affected Users (Usuarios afectados)
 * D - Discoverability (Descubribilidad)
 *
 * Riesgo Total = (D + R + E + A + D) / 5
 *
 * Rangos:
 * - 0-3: Riesgo Bajo
 * - 4-6: Riesgo Medio
 * - 7-8: Riesgo Alto
 * - 9-10: Riesgo Crítico
 */

// ============================================================================
// MODELO DREAD
// ============================================================================

interface DREADScore {
    damage: number;              // 1-10
    reproducibility: number;     // 1-10
    exploitability: number;      // 1-10
    affectedUsers: number;       // 1-10
    discoverability: number;     // 1-10
}

interface DREADAssessment {
    threatId: string;
    threatDescription: string;
    component: string;
    scores: DREADScore;
    totalRisk: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    justification: {
        damage: string;
        reproducibility: string;
        exploitability: string;
        affectedUsers: string;
        discoverability: string;
    };
}

/**
 * Calculadora de riesgo DREAD
 */
class DREADCalculator {
    static calculateRisk(scores: DREADScore): number {
        const total =
            scores.damage +
            scores.reproducibility +
            scores.exploitability +
            scores.affectedUsers +
            scores.discoverability;

        return total / 5;
    }

    static getRiskLevel(riskScore: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
        if (riskScore >= 9) return 'CRITICAL';
        if (riskScore >= 7) return 'HIGH';
        if (riskScore >= 4) return 'MEDIUM';
        return 'LOW';
    }

    static createAssessment(
        threatId: string,
        threatDescription: string,
        component: string,
        scores: DREADScore,
        justification: DREADAssessment['justification']
    ): DREADAssessment {
        const totalRisk = this.calculateRisk(scores);
        const riskLevel = this.getRiskLevel(totalRisk);

        return {
            threatId,
            threatDescription,
            component,
            scores,
            totalRisk,
            riskLevel,
            justification
        };
    }
}

/**
 * Guía de puntuación DREAD
 */
class DREADScoringGuide {
    // Damage Potential: ¿Qué tan grave es el daño si la vulnerabilidad se explota?
    static damagePotentialGuide = {
        1: 'Daño trivial, sin impacto real',
        3: 'Información no crítica revelada',
        5: 'Información de usuario individual comprometida',
        7: 'Múltiples usuarios afectados, pérdida de datos',
        10: 'Compromiso completo del sistema, pérdida masiva de datos'
    };

    // Reproducibility: ¿Qué tan fácil es reproducir el ataque?
    static reproducibilityGuide = {
        1: 'Muy difícil o imposible de reproducir',
        3: 'Difícil, requiere condiciones muy específicas',
        5: 'Moderado, requiere algunos pasos específicos',
        7: 'Fácil, pasos documentados',
        10: 'Trivial, siempre funciona'
    };

    // Exploitability: ¿Qué tan fácil es lanzar el ataque?
    static exploitabilityGuide = {
        1: 'Requiere conocimiento experto y herramientas personalizadas',
        3: 'Requiere habilidades avanzadas',
        5: 'Requiere habilidades moderadas y herramientas disponibles',
        7: 'Fácil con herramientas públicas',
        10: 'No requiere herramientas, puede hacerse desde un navegador'
    };

    // Affected Users: ¿Cuántos usuarios se ven afectados?
    static affectedUsersGuide = {
        1: 'Usuario individual en condiciones muy específicas',
        3: 'Pequeño grupo de usuarios',
        5: 'Cantidad significativa de usuarios',
        7: 'Mayoría de usuarios',
        10: 'Todos los usuarios'
    };

    // Discoverability: ¿Qué tan fácil es descubrir la amenaza?
    static discoverabilityGuide = {
        1: 'Prácticamente imposible de encontrar',
        3: 'Difícil, requiere análisis profundo del código',
        5: 'Moderado, puede encontrarse con escaneo',
        7: 'Fácil, herramientas automáticas lo detectan',
        10: 'Visible en la URL o interfaz de usuario'
    };

    static printGuide(): void {
        console.log('\n=== GUÍA DE PUNTUACIÓN DREAD ===\n');

        console.log('D - DAMAGE POTENTIAL (Daño Potencial):');
        Object.entries(this.damagePotentialGuide).forEach(([score, desc]) => {
            console.log(`  ${score}: ${desc}`);
        });

        console.log('\nR - REPRODUCIBILITY (Reproducibilidad):');
        Object.entries(this.reproducibilityGuide).forEach(([score, desc]) => {
            console.log(`  ${score}: ${desc}`);
        });

        console.log('\nE - EXPLOITABILITY (Explotabilidad):');
        Object.entries(this.exploitabilityGuide).forEach(([score, desc]) => {
            console.log(`  ${score}: ${desc}`);
        });

        console.log('\nA - AFFECTED USERS (Usuarios Afectados):');
        Object.entries(this.affectedUsersGuide).forEach(([score, desc]) => {
            console.log(`  ${score}: ${desc}`);
        });

        console.log('\nD - DISCOVERABILITY (Descubribilidad):');
        Object.entries(this.discoverabilityGuide).forEach(([score, desc]) => {
            console.log(`  ${score}: ${desc}`);
        });
    }
}

/**
 * Gestor de evaluaciones DREAD
 */
class DREADAssessmentManager {
    private assessments: DREADAssessment[] = [];

    addAssessment(assessment: DREADAssessment): void {
        this.assessments.push(assessment);
    }

    getAssessmentsByRiskLevel(
        level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    ): DREADAssessment[] {
        return this.assessments.filter(a => a.riskLevel === level);
    }

    getPrioritizedAssessments(): DREADAssessment[] {
        return [...this.assessments].sort((a, b) => b.totalRisk - a.totalRisk);
    }

    printAssessment(assessment: DREADAssessment): void {
        console.log(`\n[${assessment.riskLevel}] ${assessment.threatId}`);
        console.log(`Componente: ${assessment.component}`);
        console.log(`Amenaza: ${assessment.threatDescription}`);
        console.log(`\nPuntuación DREAD:`);

        console.log(`  D - Damage:          ${assessment.scores.damage}/10`);
        console.log(`      ${assessment.justification.damage}`);

        console.log(`  R - Reproducibility: ${assessment.scores.reproducibility}/10`);
        console.log(`      ${assessment.justification.reproducibility}`);

        console.log(`  E - Exploitability:  ${assessment.scores.exploitability}/10`);
        console.log(`      ${assessment.justification.exploitability}`);

        console.log(`  A - Affected Users:  ${assessment.scores.affectedUsers}/10`);
        console.log(`      ${assessment.justification.affectedUsers}`);

        console.log(`  D - Discoverability: ${assessment.scores.discoverability}/10`);
        console.log(`      ${assessment.justification.discoverability}`);

        console.log(`\n  RIESGO TOTAL: ${assessment.totalRisk.toFixed(1)}/10`);
        console.log(`  NIVEL: ${assessment.riskLevel}`);
    }

    generateReport(): void {
        console.log('\n╔════════════════════════════════════════════════════╗');
        console.log('║           DREAD RISK ASSESSMENT REPORT            ║');
        console.log('╚════════════════════════════════════════════════════╝\n');

        const total = this.assessments.length;
        const critical = this.getAssessmentsByRiskLevel('CRITICAL').length;
        const high = this.getAssessmentsByRiskLevel('HIGH').length;
        const medium = this.getAssessmentsByRiskLevel('MEDIUM').length;
        const low = this.getAssessmentsByRiskLevel('LOW').length;

        console.log(`Total de amenazas evaluadas: ${total}\n`);

        console.log('Distribución por nivel de riesgo:');
        console.log(`  🔴 CRITICAL: ${critical}`);
        console.log(`  🟠 HIGH:     ${high}`);
        console.log(`  🟡 MEDIUM:   ${medium}`);
        console.log(`  🟢 LOW:      ${low}`);

        const avgRisk =
            this.assessments.reduce((sum, a) => sum + a.totalRisk, 0) / total;

        console.log(`\nRiesgo promedio: ${avgRisk.toFixed(2)}/10`);

        console.log('\n=== AMENAZAS PRIORITARIAS ===');

        this.getPrioritizedAssessments().forEach((assessment, index) => {
            if (index < 5) {
                // Top 5
                this.printAssessment(assessment);
            }
        });
    }
}

// ============================================================================
// EJEMPLO: Evaluación de amenazas en sistema bancario
// ============================================================================

function evaluateBankingThreats(): void {
    console.log('\n=== DREAD ASSESSMENT: Sistema Bancario ===');

    const manager = new DREADAssessmentManager();

    // Amenaza 1: SQL Injection en login
    const sqlInjection = DREADCalculator.createAssessment(
        'THR-001',
        'SQL Injection en formulario de login',
        'Authentication Service',
        {
            damage: 10, // Compromiso total de la base de datos
            reproducibility: 9, // Fácilmente reproducible
            exploitability: 7, // Herramientas disponibles (sqlmap)
            affectedUsers: 10, // Todos los usuarios
            discoverability: 6 // Scanners automáticos pueden detectarlo
        },
        {
            damage: 'Acceso completo a la base de datos, exposición de credenciales',
            reproducibility: 'Ataque puede repetirse consistentemente',
            exploitability: 'Herramientas automáticas disponibles (sqlmap)',
            affectedUsers: 'Todos los usuarios del sistema',
            discoverability: 'Scanners de vulnerabilidad pueden detectarlo'
        }
    );

    manager.addAssessment(sqlInjection);

    // Amenaza 2: XSS Reflected
    const xss = DREADCalculator.createAssessment(
        'THR-002',
        'Cross-Site Scripting (XSS) en búsqueda',
        'Web Application',
        {
            damage: 6, // Robo de sesiones individuales
            reproducibility: 8, // Fácil de reproducir
            exploitability: 9, // Solo requiere craft URL
            affectedUsers: 5, // Requiere víctima haga clic en link
            discoverability: 7 // Fácil de encontrar en parámetros
        },
        {
            damage: 'Robo de cookies de sesión, acciones en nombre del usuario',
            reproducibility: 'Consistentemente reproducible con URL crafteado',
            exploitability: 'No requiere herramientas especiales',
            affectedUsers: 'Usuarios que hagan clic en link malicioso',
            discoverability: 'Visible en parámetros URL, fácil de testear'
        }
    );

    manager.addAssessment(xss);

    // Amenaza 3: Weak Password Policy
    const weakPassword = DREADCalculator.createAssessment(
        'THR-003',
        'Política de contraseñas débil',
        'Authentication Service',
        {
            damage: 7, // Compromiso de cuentas individuales
            reproducibility: 10, // Siempre presente
            exploitability: 8, // Brute force con herramientas comunes
            affectedUsers: 7, // Usuarios con contraseñas débiles
            discoverability: 8 // Política visible al registrarse
        },
        {
            damage: 'Compromiso de cuentas mediante brute force o diccionarios',
            reproducibility: 'Vulnerabilidad constante en el sistema',
            exploitability: 'Herramientas de brute force ampliamente disponibles',
            affectedUsers: 'Usuarios que eligen contraseñas débiles',
            discoverability: 'Evidente al observar requisitos de contraseña'
        }
    );

    manager.addAssessment(weakPassword);

    // Amenaza 4: Missing Rate Limiting
    const noRateLimit = DREADCalculator.createAssessment(
        'THR-004',
        'Ausencia de rate limiting en API',
        'API Server',
        {
            damage: 5, // Degradación del servicio
            reproducibility: 10, // Siempre funciona
            exploitability: 10, // Script simple
            affectedUsers: 10, // Afecta a todos durante el ataque
            discoverability: 3 // Requiere testing activo
        },
        {
            damage: 'Denegación de servicio, degradación de performance',
            reproducibility: 'Ataque puede ejecutarse en cualquier momento',
            exploitability: 'Script simple puede generar miles de requests',
            affectedUsers: 'Todos los usuarios durante el ataque DoS',
            discoverability: 'No visible sin testing activo del API'
        }
    );

    manager.addAssessment(noRateLimit);

    // Amenaza 5: Insecure Direct Object Reference (IDOR)
    const idor = DREADCalculator.createAssessment(
        'THR-005',
        'IDOR en endpoint de ver transacciones',
        'API Server',
        {
            damage: 8, // Acceso a datos financieros de otros
            reproducibility: 9, // Fácil cambiar ID en URL
            exploitability: 10, // Solo cambiar parámetro en URL
            affectedUsers: 10, // Todas las cuentas accesibles
            discoverability: 6 // Visible en URLs/requests
        },
        {
            damage: 'Acceso no autorizado a transacciones y datos de otros usuarios',
            reproducibility: 'Fácilmente reproducible cambiando IDs',
            exploitability: 'No requiere herramientas, solo modificar URL',
            affectedUsers: 'Potencialmente todas las cuentas del sistema',
            discoverability: 'IDs visibles en URLs y respuestas de API'
        }
    );

    manager.addAssessment(idor);

    // Amenaza 6: Information Leakage en errores
    const infoLeakage = DREADCalculator.createAssessment(
        'THR-006',
        'Stack traces expuestos en errores',
        'API Server',
        {
            damage: 4, // Información de arquitectura interna
            reproducibility: 7, // Relativamente fácil provocar errores
            exploitability: 5, // Requiere análisis para aprovechar info
            affectedUsers: 3, // Impacto indirecto
            discoverability: 5 // Aparece con errores
        },
        {
            damage: 'Revelación de estructura interna, versiones de librerías',
            reproducibility: 'Errores pueden provocarse con inputs inválidos',
            exploitability: 'Info útil para otros ataques, no directamente explotable',
            affectedUsers: 'Impacto indirecto, facilita otros ataques',
            discoverability: 'Visible cuando ocurren errores en la aplicación'
        }
    );

    manager.addAssessment(infoLeakage);

    // Generar reporte
    manager.generateReport();
}

// ============================================================================
// COMPARACIÓN: Con y Sin DREAD
// ============================================================================

function demonstrateDREADValue(): void {
    console.log('\n=== VALOR DEL ANÁLISIS DREAD ===\n');

    console.log('SIN DREAD:');
    console.log('  ❌ "Encontramos 50 vulnerabilidades"');
    console.log('  ❌ Todas parecen igualmente importantes');
    console.log('  ❌ No hay criterio claro de priorización');
    console.log('  ❌ Difícil justificar inversión en correcciones\n');

    console.log('CON DREAD:');
    console.log('  ✅ "Encontramos 3 críticas, 8 altas, 15 medias, 24 bajas"');
    console.log('  ✅ Priorización objetiva basada en riesgo');
    console.log('  ✅ Justificación cuantificada de cada amenaza');
    console.log('  ✅ Comunicación efectiva con stakeholders\n');

    // Mostrar guía de puntuación
    DREADScoringGuide.printGuide();
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateDREAD(): void {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║              DREAD RISK ASSESSMENT                ║');
    console.log('╚════════════════════════════════════════════════════╝');

    demonstrateDREADValue();
    evaluateBankingThreats();
}

// Ejecutar demostración
if (require.main === module) {
    demonstrateDREAD();
}

export {
    DREADScore,
    DREADAssessment,
    DREADCalculator,
    DREADScoringGuide,
    DREADAssessmentManager
};
