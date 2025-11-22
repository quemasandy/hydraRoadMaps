/**
 * Attack Trees (Árboles de Ataque)
 *
 * Un Attack Tree es una representación jerárquica de posibles ataques
 * contra un sistema. El objetivo principal está en la raíz, y las
 * diferentes formas de lograrlo son las hojas.
 *
 * Componentes:
 * - Nodo Raíz: Objetivo del atacante
 * - Nodos AND: Todas las condiciones deben cumplirse
 * - Nodos OR: Cualquier condición es suficiente
 * - Hojas: Acciones atómicas del atacante
 *
 * Cada nodo puede tener:
 * - Costo (dinero, tiempo, recursos)
 * - Probabilidad de éxito
 * - Dificultad técnica
 * - Riesgo de detección
 */

// ============================================================================
// MODELO DE ATTACK TREE
// ============================================================================

enum NodeType {
    ROOT = 'ROOT',      // Objetivo principal
    AND = 'AND',        // Todos los hijos deben cumplirse
    OR = 'OR',          // Cualquier hijo es suficiente
    LEAF = 'LEAF'       // Acción atómica
}

enum Difficulty {
    TRIVIAL = 'TRIVIAL',
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
    EXPERT = 'EXPERT'
}

interface AttackMetrics {
    cost: number;              // Costo en USD
    timeRequired: number;      // Tiempo en horas
    skillLevel: Difficulty;    // Nivel de habilidad requerido
    detectionRisk: number;     // 0-100 (probabilidad de ser detectado)
    successRate: number;       // 0-100 (probabilidad de éxito)
}

interface AttackNode {
    id: string;
    type: NodeType;
    description: string;
    children: AttackNode[];
    metrics?: AttackMetrics;
    mitigation?: string;
}

/**
 * Clase para construir y analizar Attack Trees
 */
class AttackTree {
    private root: AttackNode;

    constructor(rootDescription: string) {
        this.root = {
            id: 'root',
            type: NodeType.ROOT,
            description: rootDescription,
            children: []
        };
    }

    getRoot(): AttackNode {
        return this.root;
    }

    addNode(
        parentId: string,
        node: Omit<AttackNode, 'children'>
    ): void {
        const parent = this.findNode(this.root, parentId);

        if (!parent) {
            throw new Error(`Parent node ${parentId} not found`);
        }

        parent.children.push({ ...node, children: [] });
    }

    private findNode(node: AttackNode, id: string): AttackNode | null {
        if (node.id === id) {
            return node;
        }

        for (const child of node.children) {
            const found = this.findNode(child, id);
            if (found) return found;
        }

        return null;
    }

    // Calcular el camino de ataque más fácil
    findEasiestPath(): {
        path: string[];
        totalCost: number;
        totalTime: number;
        minSuccessRate: number;
    } | null {
        return this.analyzeNode(this.root);
    }

    private analyzeNode(node: AttackNode): {
        path: string[];
        totalCost: number;
        totalTime: number;
        minSuccessRate: number;
    } | null {
        // Nodo hoja
        if (node.children.length === 0) {
            if (!node.metrics) {
                return null;
            }

            return {
                path: [node.description],
                totalCost: node.metrics.cost,
                totalTime: node.metrics.timeRequired,
                minSuccessRate: node.metrics.successRate
            };
        }

        const childAnalyses = node.children
            .map(child => this.analyzeNode(child))
            .filter(result => result !== null) as Array<{
                path: string[];
                totalCost: number;
                totalTime: number;
                minSuccessRate: number;
            }>;

        if (childAnalyses.length === 0) {
            return null;
        }

        if (node.type === NodeType.OR) {
            // OR: Elegir el camino más barato/fácil
            const easiest = childAnalyses.reduce((best, current) => {
                const currentScore = current.totalCost + current.totalTime;
                const bestScore = best.totalCost + best.totalTime;

                return currentScore < bestScore ? current : best;
            });

            return {
                path: [node.description, ...easiest.path],
                totalCost: easiest.totalCost,
                totalTime: easiest.totalTime,
                minSuccessRate: easiest.minSuccessRate
            };
        } else if (node.type === NodeType.AND) {
            // AND: Sumar todos los caminos
            const combined = childAnalyses.reduce(
                (acc, current) => ({
                    path: [...acc.path, ...current.path],
                    totalCost: acc.totalCost + current.totalCost,
                    totalTime: acc.totalTime + current.totalTime,
                    minSuccessRate: Math.min(
                        acc.minSuccessRate,
                        current.minSuccessRate
                    )
                }),
                {
                    path: [node.description],
                    totalCost: 0,
                    totalTime: 0,
                    minSuccessRate: 100
                }
            );

            return combined;
        }

        return null;
    }

    // Visualizar el árbol
    printTree(): void {
        console.log('\n=== ATTACK TREE ===\n');
        this.printNode(this.root, 0);
    }

    private printNode(node: AttackNode, depth: number): void {
        const indent = '  '.repeat(depth);
        const typeLabel = node.type !== NodeType.LEAF ? `[${node.type}]` : '';

        console.log(`${indent}${typeLabel} ${node.description}`);

        if (node.metrics) {
            console.log(`${indent}  💰 Cost: $${node.metrics.cost}`);
            console.log(`${indent}  ⏱️  Time: ${node.metrics.timeRequired}h`);
            console.log(`${indent}  🎯 Success: ${node.metrics.successRate}%`);
            console.log(`${indent}  🚨 Detection Risk: ${node.metrics.detectionRisk}%`);
            console.log(`${indent}  📊 Skill: ${node.metrics.skillLevel}`);
        }

        if (node.mitigation) {
            console.log(`${indent}  🛡️  Mitigation: ${node.mitigation}`);
        }

        node.children.forEach(child => {
            this.printNode(child, depth + 1);
        });
    }
}

// ============================================================================
// EJEMPLO: Robo de cuenta bancaria
// ============================================================================

function buildBankAccountAttackTree(): AttackTree {
    const tree = new AttackTree('Robar dinero de cuenta bancaria');

    // Nivel 1: Estrategias principales (OR - cualquiera funciona)
    tree.addNode('root', {
        id: 'bypass-auth',
        type: NodeType.OR,
        description: 'Bypasear autenticación'
    });

    tree.addNode('root', {
        id: 'social-engineering',
        type: NodeType.OR,
        description: 'Ingeniería social'
    });

    tree.addNode('root', {
        id: 'technical-exploit',
        type: NodeType.OR,
        description: 'Exploit técnico'
    });

    // Rama 1: Bypasear autenticación
    tree.addNode('bypass-auth', {
        id: 'credential-theft',
        type: NodeType.AND,
        description: 'Robar credenciales + Usar para login'
    });

    tree.addNode('credential-theft', {
        id: 'phishing',
        type: NodeType.LEAF,
        description: 'Phishing email para robar password',
        metrics: {
            cost: 50,
            timeRequired: 4,
            skillLevel: Difficulty.EASY,
            detectionRisk: 30,
            successRate: 60
        },
        mitigation: 'Educación de usuarios, filtros anti-phishing, MFA'
    });

    tree.addNode('credential-theft', {
        id: 'keylogger',
        type: NodeType.LEAF,
        description: 'Instalar keylogger en dispositivo víctima',
        metrics: {
            cost: 100,
            timeRequired: 8,
            skillLevel: Difficulty.MEDIUM,
            detectionRisk: 60,
            successRate: 70
        },
        mitigation: 'Antivirus, EDR, uso de teclado virtual'
    });

    tree.addNode('bypass-auth', {
        id: 'brute-force',
        type: NodeType.LEAF,
        description: 'Brute force attack con diccionario',
        metrics: {
            cost: 20,
            timeRequired: 48,
            skillLevel: Difficulty.EASY,
            detectionRisk: 90,
            successRate: 25
        },
        mitigation: 'Rate limiting, account lockout, CAPTCHA, strong password policy'
    });

    // Rama 2: Ingeniería social
    tree.addNode('social-engineering', {
        id: 'impersonate-support',
        type: NodeType.LEAF,
        description: 'Llamar al soporte haciéndose pasar por víctima',
        metrics: {
            cost: 10,
            timeRequired: 2,
            skillLevel: Difficulty.MEDIUM,
            detectionRisk: 40,
            successRate: 50
        },
        mitigation: 'Procedimientos de verificación estrictos, grabación de llamadas'
    });

    tree.addNode('social-engineering', {
        id: 'sim-swap',
        type: NodeType.AND,
        description: 'SIM swap attack'
    });

    tree.addNode('sim-swap', {
        id: 'convince-carrier',
        type: NodeType.LEAF,
        description: 'Convencer al carrier de transferir número',
        metrics: {
            cost: 50,
            timeRequired: 3,
            skillLevel: Difficulty.MEDIUM,
            detectionRisk: 50,
            successRate: 60
        },
        mitigation: 'PIN de carrier, verificación adicional'
    });

    tree.addNode('sim-swap', {
        id: 'intercept-sms',
        type: NodeType.LEAF,
        description: 'Interceptar SMS de autenticación',
        metrics: {
            cost: 0,
            timeRequired: 1,
            skillLevel: Difficulty.EASY,
            detectionRisk: 20,
            successRate: 95
        },
        mitigation: 'Usar app de autenticación en vez de SMS'
    });

    // Rama 3: Exploit técnico
    tree.addNode('technical-exploit', {
        id: 'sql-injection',
        type: NodeType.LEAF,
        description: 'SQL Injection para bypassear login',
        metrics: {
            cost: 0,
            timeRequired: 6,
            skillLevel: Difficulty.MEDIUM,
            detectionRisk: 70,
            successRate: 40
        },
        mitigation: 'Prepared statements, ORM, WAF, input validation'
    });

    tree.addNode('technical-exploit', {
        id: 'xss-session-theft',
        type: NodeType.AND,
        description: 'XSS para robar sesión'
    });

    tree.addNode('xss-session-theft', {
        id: 'find-xss',
        type: NodeType.LEAF,
        description: 'Encontrar vulnerabilidad XSS',
        metrics: {
            cost: 0,
            timeRequired: 8,
            skillLevel: Difficulty.MEDIUM,
            detectionRisk: 50,
            successRate: 50
        },
        mitigation: 'Output encoding, CSP, sanitización de inputs'
    });

    tree.addNode('xss-session-theft', {
        id: 'steal-cookie',
        type: NodeType.LEAF,
        description: 'Ejecutar JavaScript para robar cookie',
        metrics: {
            cost: 0,
            timeRequired: 1,
            skillLevel: Difficulty.EASY,
            detectionRisk: 30,
            successRate: 90
        },
        mitigation: 'HttpOnly cookies, SameSite attribute'
    });

    tree.addNode('technical-exploit', {
        id: 'mitm',
        type: NodeType.LEAF,
        description: 'Man-in-the-Middle en WiFi público',
        metrics: {
            cost: 200,
            timeRequired: 4,
            skillLevel: Difficulty.HARD,
            detectionRisk: 40,
            successRate: 60
        },
        mitigation: 'TLS/HTTPS obligatorio, certificate pinning'
    });

    return tree;
}

/**
 * Análisis de riesgo basado en Attack Tree
 */
class AttackTreeAnalyzer {
    static analyzeAllPaths(tree: AttackTree): void {
        console.log('\n=== ANÁLISIS DE CAMINOS DE ATAQUE ===\n');

        const easiest = tree.findEasiestPath();

        if (easiest) {
            console.log('CAMINO MÁS PROBABLE DE ATAQUE:\n');

            easiest.path.forEach((step, index) => {
                console.log(`${index + 1}. ${step}`);
            });

            console.log(`\nMétricas del camino:`);
            console.log(`  Costo total: $${easiest.totalCost}`);
            console.log(`  Tiempo total: ${easiest.totalTime} horas`);
            console.log(`  Probabilidad mínima de éxito: ${easiest.minSuccessRate}%`);

            // Calcular esfuerzo vs recompensa
            const effort = easiest.totalCost + easiest.totalTime * 10;
            console.log(`\n  Esfuerzo total (normalizado): ${effort}`);

            if (effort < 500) {
                console.log('  ⚠️  ALTA PRIORIDAD: Ataque fácil y barato!');
            } else if (effort < 1000) {
                console.log('  ⚡ PRIORIDAD MEDIA: Ataque factible');
            } else {
                console.log('  ℹ️  PRIORIDAD BAJA: Ataque costoso');
            }
        }
    }

    static identifyWeakestLinks(tree: AttackTree): void {
        console.log('\n=== ENLACES MÁS DÉBILES (Priorizar mitigación) ===\n');

        const weakLinks: Array<{
            description: string;
            score: number;
            metrics: AttackMetrics;
        }> = [];

        this.collectLeafNodes(tree.getRoot(), weakLinks);

        // Ordenar por "debilidad" (fácil, barato, alta probabilidad)
        weakLinks.sort((a, b) => a.score - b.score);

        weakLinks.slice(0, 5).forEach((link, index) => {
            console.log(`${index + 1}. ${link.description}`);
            console.log(`   Puntuación de debilidad: ${link.score.toFixed(1)}`);
            console.log(`   Costo: $${link.metrics.cost}`);
            console.log(`   Tiempo: ${link.metrics.timeRequired}h`);
            console.log(`   Éxito: ${link.metrics.successRate}%`);
            console.log(`   Detección: ${link.metrics.detectionRisk}%\n`);
        });
    }

    private static collectLeafNodes(
        node: AttackNode,
        collection: Array<{
            description: string;
            score: number;
            metrics: AttackMetrics;
        }>
    ): void {
        if (node.children.length === 0 && node.metrics) {
            // Calcular "debilidad": menor score = más débil (más fácil de atacar)
            const score =
                node.metrics.cost / 10 +
                node.metrics.timeRequired +
                (100 - node.metrics.successRate) +
                node.metrics.detectionRisk / 10;

            collection.push({
                description: node.description,
                score,
                metrics: node.metrics
            });
        }

        node.children.forEach(child => {
            this.collectLeafNodes(child, collection);
        });
    }
}

// ============================================================================
// DEMOSTRACIÓN
// ============================================================================

function demonstrateAttackTrees(): void {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║              ATTACK TREES ANALYSIS                ║');
    console.log('╚════════════════════════════════════════════════════╝');

    console.log('\nObjetivo: Robar dinero de cuenta bancaria');

    const tree = buildBankAccountAttackTree();

    // Visualizar el árbol completo
    tree.printTree();

    // Analizar caminos de ataque
    AttackTreeAnalyzer.analyzeAllPaths(tree);

    // Identificar eslabones más débiles
    AttackTreeAnalyzer.identifyWeakestLinks(tree);

    console.log('\n=== CONCLUSIONES ===\n');

    console.log('1. Los ataques más probables son de baja complejidad técnica:');
    console.log('   - Phishing (más común)');
    console.log('   - Ingeniería social contra soporte');
    console.log('   - SIM swap attacks\n');

    console.log('2. Mitigaciones prioritarias:');
    console.log('   🔐 Implementar MFA (no basado en SMS)');
    console.log('   📚 Educación de usuarios sobre phishing');
    console.log('   🛡️  Procedimientos estrictos de verificación en soporte');
    console.log('   🚫 Rate limiting y account lockout\n');

    console.log('3. Aunque existen vulnerabilidades técnicas (SQLi, XSS),');
    console.log('   requieren más habilidad y son menos probables como');
    console.log('   primer vector de ataque.\n');
}

// Ejecutar demostración
if (require.main === module) {
    demonstrateAttackTrees();
}

export {
    NodeType,
    Difficulty,
    AttackMetrics,
    AttackNode,
    AttackTree,
    AttackTreeAnalyzer
};
