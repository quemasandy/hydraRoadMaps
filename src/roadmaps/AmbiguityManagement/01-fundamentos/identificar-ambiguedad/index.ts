/**
 * ==========================================
 * IDENTIFICAR AMBIGÜEDAD EN REQUISITOS
 * ==========================================
 *
 * Este ejercicio demuestra cómo identificar requisitos ambiguos y
 * transformarlos en especificaciones técnicas claras y ejecutables.
 *
 * 📚 CONCEPTOS CLAVE:
 * - Ambigüedad léxica: palabras con múltiples significados
 * - Ambigüedad semántica: interpretación del significado
 * - Ambigüedad de scope: límites no claros
 * - Costo de la ambigüedad: retrabajos y bugs
 *
 * 🏢 USO EN BIG TECH:
 * Google, Amazon, Microsoft invierten tiempo en clarificar requisitos porque:
 * - Reducen time-to-market
 * - Minimizan retrabajos (30-50% menos)
 * - Mejoran satisfacción del cliente
 * - Facilitan estimaciones precisas
 *
 * 💡 POR QUÉ ES IMPORTANTE:
 * Requisitos ambiguos causan:
 * - 50-70% de defectos en software (según estudios IEEE)
 * - Retrabajos que cuestan 10-100x más que clarificar upfront
 * - Conflictos con stakeholders
 * - Features incorrectas o innecesarias
 */

// ============================================
// EJEMPLO 1: Requisito Ambiguo vs Claro
// ============================================

/**
 * ❌ REQUISITO AMBIGUO:
 * "El sistema debe ser rápido"
 *
 * Problemas:
 * - ¿Qué significa "rápido"? ¿100ms? ¿1s? ¿5s?
 * - ¿Rápido en qué operación? ¿Búsqueda? ¿Carga? ¿Todo?
 * - ¿Rápido para quién? ¿Usuario final? ¿Admin?
 * - ¿Bajo qué condiciones? ¿10 usuarios? ¿10,000?
 */

// Implementación basada en requisito ambiguo (problemas garantizados)
class AmbiguousSearchService {
  search(query: string): string[] {
    // ¿Cuánto tiempo es aceptable? No está claro
    // ¿Qué tan grande puede ser el resultado? No está claro
    // ¿Qué algoritmo usar? No está claro
    return []; // Implementación placeholder
  }
}

/**
 * ✅ REQUISITO CLARO:
 * "La búsqueda de productos debe retornar resultados en < 200ms (p95)
 *  para queries de hasta 50 caracteres, con hasta 1000 usuarios concurrentes,
 *  retornando máximo 20 resultados paginados."
 *
 * Ahora podemos:
 * - Medir si cumplimos (200ms p95)
 * - Diseñar tests (queries de 50 chars)
 * - Planear infraestructura (1000 usuarios)
 * - Implementar correctamente (paginación de 20)
 */

interface SearchOptions {
  maxQueryLength: number;
  maxResults: number;
  timeoutMs: number;
}

interface SearchResult<T> {
  results: T[];
  totalCount: number;
  executionTimeMs: number;
  hasMore: boolean;
}

class ClearSearchService<T> {
  private options: SearchOptions = {
    maxQueryLength: 50,
    maxResults: 20,
    timeoutMs: 200,
  };

  async search(query: string, page: number = 1): Promise<SearchResult<T>> {
    // Validación basada en requisitos claros
    if (query.length > this.options.maxQueryLength) {
      throw new Error(
        `Query too long. Max: ${this.options.maxQueryLength} chars`,
      );
    }

    const startTime = Date.now();

    // Simulación de búsqueda
    const results: T[] = []; // Aquí iría la implementación real
    const totalCount = 0;

    const executionTimeMs = Date.now() - startTime;

    // Verificar que cumplimos el requisito de performance
    if (executionTimeMs > this.options.timeoutMs) {
      console.warn(
        `⚠️ Search exceeded timeout: ${executionTimeMs}ms > ${this.options.timeoutMs}ms`,
      );
    }

    return {
      results: results.slice(0, this.options.maxResults),
      totalCount,
      executionTimeMs,
      hasMore: totalCount > page * this.options.maxResults,
    };
  }
}

console.log("=".repeat(50));
console.log("🎯 EJEMPLO 1: Ambiguo vs Claro");
console.log("=".repeat(50));

console.log("\n❌ Requisito ambiguo:");
console.log('"El sistema debe ser rápido"');
console.log("Imposible de implementar correctamente sin más contexto");

console.log("\n✅ Requisito claro:");
console.log(
  "Búsqueda < 200ms (p95), max 50 chars, 1000 usuarios, 20 resultados",
);
console.log("Ahora sí podemos implementar y medir");

// ============================================
// EJEMPLO 2: Las 3 Preguntas Mágicas
// ============================================

/**
 * Para cualquier requisito ambiguo, hacer estas 3 preguntas:
 *
 * 1. "¿Puedes darme un ejemplo concreto?"
 * 2. "¿Cómo sabremos que está correcto?"
 * 3. "¿Qué NO debería hacer?"
 */

interface Requirement {
  original: string; // Requisito ambiguo
  examples: string[]; // Pregunta 1: Ejemplos concretos
  acceptanceCriteria: string[]; // Pregunta 2: Cómo validar
  outOfScope: string[]; // Pregunta 3: Qué NO hacer
}

function clarifyRequirement(ambiguous: string): Requirement {
  // Placeholder - en la vida real, estas respuestas vienen de stakeholders
  return {
    original: ambiguous,
    examples: [],
    acceptanceCriteria: [],
    outOfScope: [],
  };
}

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 2: Las 3 Preguntas Mágicas");
console.log("=".repeat(50));

const ambiguousReq = "El dashboard debe ser fácil de usar";

const clarifiedReq: Requirement = {
  original: ambiguousReq,
  examples: [
    "Un usuario nuevo puede crear su primer reporte en < 2 minutos sin ayuda",
    "El 95% de usuarios completan tareas sin consultar documentación",
  ],
  acceptanceCriteria: [
    "Time to first value < 2 minutos (medido con 10 usuarios test)",
    "Task success rate > 95% en usability testing",
    "System Usability Scale (SUS) score > 80",
  ],
  outOfScope: [
    "NO incluir tutorial interactivo (se hará en v2)",
    "NO soporte de teclado completo (solo funciones básicas)",
  ],
};

console.log(`\n❌ Original: "${clarifiedReq.original}"`);
console.log("\n✅ Después de las 3 preguntas:\n");
console.log("Ejemplos concretos:");
clarifiedReq.examples.forEach((ex, i) => console.log(`  ${i + 1}. ${ex}`));
console.log("\nCriterios de aceptación:");
clarifiedReq.acceptanceCriteria.forEach((cr, i) =>
  console.log(`  ${i + 1}. ${cr}`),
);
console.log("\nFuera de scope:");
clarifiedReq.outOfScope.forEach((out, i) => console.log(`  ${i + 1}. ${out}`));

// ============================================
// EJEMPLO 3: Framework 5W1H
// ============================================

/**
 * What, Why, Who, When, Where, How
 * Framework completo para clarificar cualquier requisito
 */

interface RequirementClarification {
  what: string; // ¿Qué problema resuelve?
  why: string; // ¿Por qué es importante?
  who: string; // ¿Quién lo usará?
  when: string; // ¿Cuándo se necesita?
  where: string; // ¿Dónde se usará?
  how: string; // ¿Cómo debería funcionar?
}

function apply5W1H(requirement: string): RequirementClarification {
  // En la vida real, estas respuestas vienen de conversaciones con stakeholders
  return {
    what: "",
    why: "",
    who: "",
    when: "",
    where: "",
    how: "",
  };
}

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 3: Framework 5W1H");
console.log("=".repeat(50));

const vagueRequirement = "Necesitamos un sistema de notificaciones";

const clarified5W1H: RequirementClarification = {
  what: "Sistema de notificaciones push para actualizaciones de pedidos",
  why: "40% de usuarios no revisan email, queremos reducir consultas de 'dónde está mi pedido'",
  who: "Usuarios de mobile app que hicieron pedidos en últimos 30 días",
  when: "Antes de Black Friday (deadline: 15 Nov)",
  where: "Mobile app (iOS y Android), NO web",
  how: "Push notifications nativas con deep links a detalle de pedido",
};

console.log(`\nRequisito vago: "${vagueRequirement}"\n`);
console.log("Aplicando 5W1H:\n");
console.log(`What:  ${clarified5W1H.what}`);
console.log(`Why:   ${clarified5W1H.why}`);
console.log(`Who:   ${clarified5W1H.who}`);
console.log(`When:  ${clarified5W1H.when}`);
console.log(`Where: ${clarified5W1H.where}`);
console.log(`How:   ${clarified5W1H.how}`);

// ============================================
// EJEMPLO 4: Detección Automática de Ambigüedad
// ============================================

/**
 * Red flags: palabras que indican ambigüedad
 */

const ambiguityRedFlags = [
  "rápido",
  "fácil",
  "mejor",
  "intuitivo",
  "escalable",
  "robusto",
  "flexible",
  "eficiente",
  "simple",
  "user-friendly",
  "moderno",
  "profesional",
];

interface AmbiguityDetectionResult {
  isAmbiguous: boolean;
  redFlags: string[];
  suggestions: string[];
}

function detectAmbiguity(requirement: string): AmbiguityDetectionResult {
  const lowerReq = requirement.toLowerCase();
  const foundRedFlags = ambiguityRedFlags.filter((flag) =>
    lowerReq.includes(flag),
  );

  const suggestions: string[] = [];

  if (foundRedFlags.includes("rápido") || foundRedFlags.includes("eficiente")) {
    suggestions.push(
      "Especificar tiempo de respuesta en ms (ej: < 200ms p95)",
    );
  }

  if (foundRedFlags.includes("fácil") || foundRedFlags.includes("intuitivo")) {
    suggestions.push(
      "Definir métricas de usabilidad (ej: task success rate > 95%)",
    );
  }

  if (foundRedFlags.includes("escalable")) {
    suggestions.push(
      "Especificar capacidad (ej: soportar 10,000 usuarios concurrentes)",
    );
  }

  if (foundRedFlags.includes("mejor")) {
    suggestions.push(
      "Comparar con baseline específico (ej: 50% más rápido que versión actual)",
    );
  }

  return {
    isAmbiguous: foundRedFlags.length > 0,
    redFlags: foundRedFlags,
    suggestions,
  };
}

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 4: Detección Automática de Ambigüedad");
console.log("=".repeat(50));

const testRequirements = [
  "El sistema debe ser rápido y fácil de usar",
  "Implementar búsqueda de productos con paginación",
  "La app debe ser escalable y moderna",
  "La búsqueda debe retornar resultados en < 200ms con máximo 20 items",
];

testRequirements.forEach((req, i) => {
  console.log(`\nRequisito ${i + 1}: "${req}"`);
  const detection = detectAmbiguity(req);

  if (detection.isAmbiguous) {
    console.log("  ⚠️ AMBIGUO - Red flags detectadas:");
    detection.redFlags.forEach((flag) => console.log(`    - "${flag}"`));
    console.log("  💡 Sugerencias:");
    detection.suggestions.forEach((sug) => console.log(`    - ${sug}`));
  } else {
    console.log("  ✅ CLARO - No se detectaron red flags");
  }
});

// ============================================
// EJEMPLO 5: Template de User Story Clara
// ============================================

interface UserStory {
  title: string;
  asA: string; // Como [rol]
  iWant: string; // Quiero [acción]
  soThat: string; // Para [beneficio]
  acceptanceCriteria: AcceptanceCriterion[];
  examples: Example[];
  outOfScope: string[];
  estimatedPoints: number;
}

interface AcceptanceCriterion {
  given: string; // Dado [contexto]
  when: string; // Cuando [acción]
  then: string; // Entonces [resultado]
}

interface Example {
  scenario: string;
  input: string;
  expectedOutput: string;
}

const exampleUserStory: UserStory = {
  title: "Búsqueda de productos con autocompletado",

  asA: "Usuario comprando en la tienda online",
  iWant: "Ver sugerencias mientras escribo en el buscador",
  soThat: "Puedo encontrar productos más rápido sin escribir el nombre completo",

  acceptanceCriteria: [
    {
      given: "Estoy en la página principal con el buscador visible",
      when: "Escribo al menos 3 caracteres",
      then: "Veo hasta 5 sugerencias de productos en < 200ms",
    },
    {
      given: "Las sugerencias están mostrándose",
      when: "Hago click en una sugerencia",
      then: "Navego a la página del producto seleccionado",
    },
    {
      given: "Escribo un término que no coincide con ningún producto",
      when: "Escribo más de 3 caracteres",
      then: "Veo mensaje 'No se encontraron sugerencias'",
    },
  ],

  examples: [
    {
      scenario: "Happy path - búsqueda exitosa",
      input: "Escribo 'mac'",
      expectedOutput:
        "Veo sugerencias: MacBook Pro, MacBook Air, iMac, Mac Mini, Mac Studio",
    },
    {
      scenario: "Query muy corta",
      input: "Escribo 'ma' (solo 2 caracteres)",
      expectedOutput: "No veo sugerencias (mínimo 3 caracteres)",
    },
    {
      scenario: "Sin resultados",
      input: "Escribo 'xyz123' (no existe)",
      expectedOutput: "Veo mensaje 'No se encontraron sugerencias'",
    },
  ],

  outOfScope: [
    "NO incluir búsqueda por voz (se hará en v2)",
    "NO incluir filtros en sugerencias (solo nombre de producto)",
    "NO incluir corrección ortográfica (se evaluará después)",
  ],

  estimatedPoints: 5,
};

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 5: User Story Clara y Completa");
console.log("=".repeat(50));

console.log(`\nTítulo: ${exampleUserStory.title}`);
console.log(`\nComo ${exampleUserStory.asA},`);
console.log(`Quiero ${exampleUserStory.iWant},`);
console.log(`Para ${exampleUserStory.soThat}.`);

console.log("\nCriterios de Aceptación:");
exampleUserStory.acceptanceCriteria.forEach((ac, i) => {
  console.log(`\n  ${i + 1}. Dado ${ac.given}`);
  console.log(`     Cuando ${ac.when}`);
  console.log(`     Entonces ${ac.then}`);
});

console.log("\nEjemplos Concretos:");
exampleUserStory.examples.forEach((ex, i) => {
  console.log(`\n  ${i + 1}. ${ex.scenario}`);
  console.log(`     Input: ${ex.input}`);
  console.log(`     Output: ${ex.expectedOutput}`);
});

console.log("\nFuera de Scope:");
exampleUserStory.outOfScope.forEach((item, i) =>
  console.log(`  ${i + 1}. ${item}`),
);

console.log(`\nEstimación: ${exampleUserStory.estimatedPoints} story points`);

// ============================================
// EJEMPLO 6: Checklist de Calidad de Requisitos
// ============================================

interface RequirementQualityCheck {
  isSpecific: boolean; // Sin palabras vagas
  isMeasurable: boolean; // Tiene criterios verificables
  hasExamples: boolean; // Al menos 1 ejemplo concreto
  isConsensed: boolean; // Stakeholder confirmó
  isDocumented: boolean; // Escrito en algún lugar
  hasScope: boolean; // Define qué SÍ y qué NO
  isTestable: boolean; // Se puede escribir test
}

function checkRequirementQuality(story: UserStory): RequirementQualityCheck {
  return {
    isSpecific: !detectAmbiguity(story.title + story.iWant).isAmbiguous,
    isMeasurable: story.acceptanceCriteria.length > 0,
    hasExamples: story.examples.length > 0,
    isConsensed: true, // Esto requeriría validación externa
    isDocumented: story.title.length > 0,
    hasScope: story.outOfScope.length > 0,
    isTestable: story.acceptanceCriteria.length > 0,
  };
}

function calculateQualityScore(check: RequirementQualityCheck): number {
  const checks = Object.values(check);
  const passed = checks.filter((v) => v === true).length;
  return (passed / checks.length) * 100;
}

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 6: Checklist de Calidad");
console.log("=".repeat(50));

const qualityCheck = checkRequirementQuality(exampleUserStory);
const score = calculateQualityScore(qualityCheck);

console.log("\nEvaluando requisito contra checklist de calidad:\n");
console.log(
  `  ${qualityCheck.isSpecific ? "✅" : "❌"} Específico (sin palabras vagas)`,
);
console.log(
  `  ${qualityCheck.isMeasurable ? "✅" : "❌"} Medible (criterios verificables)`,
);
console.log(
  `  ${qualityCheck.hasExamples ? "✅" : "❌"} Con ejemplos concretos`,
);
console.log(
  `  ${qualityCheck.isConsensed ? "✅" : "❌"} Consensuado con stakeholders`,
);
console.log(`  ${qualityCheck.isDocumented ? "✅" : "❌"} Documentado`);
console.log(
  `  ${qualityCheck.hasScope ? "✅" : "❌"} Con scope definido (qué SÍ y NO)`,
);
console.log(
  `  ${qualityCheck.isTestable ? "✅" : "❌"} Testeable (se pueden escribir tests)`,
);

console.log(`\n📊 Score de calidad: ${score.toFixed(0)}%`);

if (score >= 90) {
  console.log("✅ Requisito de EXCELENTE calidad - Listo para implementar");
} else if (score >= 70) {
  console.log(
    "⚠️ Requisito de BUENA calidad - Mejorar algunos aspectos antes de implementar",
  );
} else {
  console.log(
    "❌ Requisito de BAJA calidad - NO comenzar implementación sin clarificar",
  );
}

// ============================================
// EJEMPLO 7: Costo de la Ambigüedad
// ============================================

interface ProjectPhase {
  name: string;
  fixCostMultiplier: number; // Cuánto cuesta arreglar en esta fase
}

const projectPhases: ProjectPhase[] = [
  { name: "Requisitos", fixCostMultiplier: 1 },
  { name: "Diseño", fixCostMultiplier: 5 },
  { name: "Implementación", fixCostMultiplier: 10 },
  { name: "Testing", fixCostMultiplier: 15 },
  { name: "Producción", fixCostMultiplier: 100 },
];

function calculateCostOfAmbiguity(
  hoursToClarify: number,
  discoveredInPhase: string,
): void {
  const phase = projectPhases.find((p) => p.name === discoveredInPhase);
  if (!phase) return;

  const costIfClarifiedUpfront = hoursToClarify;
  const costIfClarifiedLater = hoursToClarify * phase.fixCostMultiplier;
  const wastedHours = costIfClarifiedLater - costIfClarifiedUpfront;

  console.log(`\n📊 Costo de NO clarificar en fase de Requisitos:`);
  console.log(
    `  Clarificar ahora: ${costIfClarifiedUpfront} horas`,
  );
  console.log(
    `  Arreglar en ${phase.name}: ${costIfClarifiedLater} horas`,
  );
  console.log(
    `  ⚠️ Desperdicio: ${wastedHours} horas (${phase.fixCostMultiplier}x más caro)`,
  );
}

console.log("\n" + "=".repeat(50));
console.log("🎯 EJEMPLO 7: Costo de la Ambigüedad");
console.log("=".repeat(50));

console.log(
  "\nScenario: Requisito ambiguo que tomaría 2 horas clarificar\n",
);

calculateCostOfAmbiguity(2, "Diseño");
calculateCostOfAmbiguity(2, "Implementación");
calculateCostOfAmbiguity(2, "Producción");

console.log("\n💡 Moraleja:");
console.log(
  "  Invertir 2 horas en clarificar AHORA puede ahorrar hasta 200 horas después",
);

// ============================================
// ❓ PREGUNTAS PARA REFLEXIONAR
// ============================================

/**
 * 🤔 PREGUNTAS PARA PROFUNDIZAR:
 *
 * 1. ¿Qué porcentaje de bugs en tu proyecto vienen de requisitos ambiguos?
 *    Pista: Estudios dicen 50-70% en promedio
 *
 * 2. ¿Cuánto tiempo inviertes clarificando vs implementando?
 *    Pista: La regla 20/80 - 20% clarificar ahorra 80% de retrabajos
 *
 * 3. ¿Cómo mides si un requisito está listo para implementar?
 *    Pista: Definition of Ready checklist
 *
 * 4. ¿Quién es responsable de clarificar requisitos en tu equipo?
 *    Pista: Es responsabilidad compartida (dev + PM + stakeholder)
 *
 * 5. ¿Cómo manejas cuando el stakeholder "no sabe lo que quiere"?
 *    Pista: Prototipos rápidos, ejemplos concretos, iteración
 *
 * 6. ¿Qué haces cuando los requisitos cambian constantemente?
 *    Pista: Validación temprana, sprints cortos, feedback loops
 *
 * 7. ¿Es mejor tener requisitos perfectos antes de empezar?
 *    Pista: No. "Perfect is enemy of good" - clarifica lo crítico, itera el resto
 */

// ============================================
// 🚀 EJERCICIOS PRÁCTICOS
// ============================================

/**
 * 💪 DESAFÍOS:
 *
 * 1. BÁSICO:
 *    Toma 5 tickets de tu backlog y:
 *    a) Detecta ambigüedad con la función detectAmbiguity()
 *    b) Aplica las 3 Preguntas Mágicas
 *    c) Calcula el quality score
 *
 * 2. INTERMEDIO:
 *    Para una feature nueva:
 *    a) Escribe user story completa con template
 *    b) Define 3+ acceptance criteria en formato Given-When-Then
 *    c) Agrega 3+ ejemplos concretos (happy path, error cases, edge cases)
 *    d) Define explícitamente qué está fuera de scope
 *
 * 3. AVANZADO:
 *    Crea un sistema de detección de ambigüedad que:
 *    a) Analice requisitos con NLP (natural language processing)
 *    b) Sugiera preguntas de clarificación automáticamente
 *    c) Genere checklist personalizado por tipo de requisito
 *    d) Calcule risk score basado en nivel de ambigüedad
 *
 * 4. EXPERTO:
 *    Implementa un "Requirements Quality Gate":
 *    a) Integra con tu sistema de tickets (Jira, Linear, etc.)
 *    b) Bloquea implementación si quality score < 80%
 *    c) Genera reportes de requisitos ambiguos por sprint
 *    d) Entrena al equipo en técnicas de clarificación
 */

console.log("\n" + "=".repeat(50));
console.log("💡 TIPS PRÁCTICOS");
console.log("=".repeat(50));

/**
 * ✅ CÓMO IDENTIFICAR AMBIGÜEDAD:
 *
 * 1. Busca palabras vagas (rápido, fácil, mejor, etc.)
 * 2. Pregunta "¿Qué significa exactamente...?"
 * 3. Pide ejemplos concretos
 * 4. Pregunta por contraejemplos (qué NO es)
 * 5. Intenta escribir un test - si no puedes, es ambiguo
 * 6. Pide números y métricas
 * 7. Define qué está fuera de scope
 * 8. Valida entendimiento con stakeholder
 *
 * ⚠️ SEÑALES DE REQUISITOS AMBIGUOS:
 *
 * 1. Usas palabras como "más o menos", "creo que", "probablemente"
 * 2. No puedes estimar con confianza
 * 3. Diferentes personas entienden cosas diferentes
 * 4. No puedes escribir acceptance criteria claros
 * 5. No tienes ejemplos concretos
 * 6. El stakeholder responde "ya veremos"
 * 7. Scope no está definido
 * 8. Hay muchos "depende" en la conversación
 */

console.log("\n" + "=".repeat(50));
console.log("✨ Fin del ejercicio - ¡Practica identificar ambigüedad!");
console.log("=".repeat(50));

console.log("\n🎯 Próximo paso:");
console.log("  1. Toma un requisito de tu backlog");
console.log("  2. Aplica las 3 Preguntas Mágicas");
console.log("  3. Evalúa con el checklist de calidad");
console.log("  4. Si score < 80%, NO implementes - clarifica primero");

export {
  detectAmbiguity,
  checkRequirementQuality,
  calculateQualityScore,
  apply5W1H,
  type Requirement,
  type UserStory,
  type AcceptanceCriterion,
  type RequirementClarification,
};
