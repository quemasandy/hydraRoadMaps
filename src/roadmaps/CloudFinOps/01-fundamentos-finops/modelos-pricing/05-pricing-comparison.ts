/**
 * Comparativa de Modelos de Pricing AWS
 *
 * Este archivo compara los 4 modelos principales de pricing de AWS:
 * 1. On-Demand
 * 2. Reserved Instances (RI)
 * 3. Savings Plans
 * 4. Spot Instances
 *
 * Objetivo: Saber cuándo usar cada modelo para maximizar ahorros
 */

// ============================================================================
// MODELOS DE PRICING
// ============================================================================

interface PricingModel {
  name: string;
  commitment: string;
  discount: string;
  flexibility: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
  bestFor: string[];
  limitations: string[];
}

const pricingModels: Record<string, PricingModel> = {
  onDemand: {
    name: 'On-Demand',
    commitment: 'None',
    discount: '0% (baseline)',
    flexibility: 'high',
    riskLevel: 'low',
    bestFor: [
      'Workloads impredecibles',
      'Spikes de tráfico',
      'Desarrollo y testing',
      'Aplicaciones nuevas sin histórico',
    ],
    limitations: ['Precio más alto', 'Sin descuentos'],
  },
  reservedInstances: {
    name: 'Reserved Instances',
    commitment: '1 o 3 años',
    discount: 'Hasta 72%',
    flexibility: 'low',
    riskLevel: 'medium',
    bestFor: [
      'Workloads predecibles',
      'Bases de datos de producción',
      'Servidores de aplicación 24/7',
      'Alta utilización (>75%)',
    ],
    limitations: [
      'Compromiso largo',
      'Específico a instance family/region',
      'Menos flexible',
    ],
  },
  savingsPlans: {
    name: 'Savings Plans',
    commitment: '1 o 3 años',
    discount: 'Hasta 66%',
    flexibility: 'medium',
    riskLevel: 'low',
    bestFor: [
      'Uso consistente de cómputo',
      'Mix de EC2, Lambda, Fargate',
      'Flexibilidad de instance types',
      'Multi-región',
    ],
    limitations: ['Compromiso de gasto por hora', 'Requiere forecasting'],
  },
  spotInstances: {
    name: 'Spot Instances',
    commitment: 'None',
    discount: 'Hasta 90%',
    flexibility: 'high',
    riskLevel: 'high',
    bestFor: [
      'Batch processing',
      'Big Data',
      'CI/CD',
      'Workloads fault-tolerant',
      'ML training',
    ],
    limitations: [
      'Pueden ser interrumpidas',
      'No para workloads críticos',
      'Requiere manejo de interrupciones',
    ],
  },
};

// ============================================================================
// COMPARATIVA DE COSTOS REALES
// ============================================================================

/**
 * Comparación de costos para un workload típico
 * Ejemplo: c5.2xlarge en us-east-1
 */
interface InstanceCost {
  instanceType: string;
  region: string;
  onDemandHourly: number;
  reserved1YearHourly: number;
  reserved3YearHourly: number;
  savingsPlanHourly: number;
  spotHourly: number; // Average
}

const c52xlargeExample: InstanceCost = {
  instanceType: 'c5.2xlarge',
  region: 'us-east-1',
  onDemandHourly: 0.34,
  reserved1YearHourly: 0.236, // ~30% discount
  reserved3YearHourly: 0.204, // ~40% discount
  savingsPlanHourly: 0.238, // ~30% discount
  spotHourly: 0.102, // ~70% discount (variable)
};

function calculateMonthlyCost(hourlyRate: number): number {
  const hoursPerMonth = 730; // Average
  return hourlyRate * hoursPerMonth;
}

function calculateAnnualCost(hourlyRate: number): number {
  return calculateMonthlyCost(hourlyRate) * 12;
}

function demonstrateCostComparison(): void {
  console.log('\n=== COMPARATIVA DE COSTOS: c5.2xlarge 24/7 ===\n');

  const costs = {
    onDemand: calculateMonthlyCost(c52xlargeExample.onDemandHourly),
    reserved1Year: calculateMonthlyCost(c52xlargeExample.reserved1YearHourly),
    reserved3Year: calculateMonthlyCost(c52xlargeExample.reserved3YearHourly),
    savingsPlan: calculateMonthlyCost(c52xlargeExample.savingsPlanHourly),
    spot: calculateMonthlyCost(c52xlargeExample.spotHourly),
  };

  console.log('Costo Mensual:');
  console.log(`  On-Demand:         $${costs.onDemand.toFixed(2)}`);
  console.log(
    `  Reserved 1-year:   $${costs.reserved1Year.toFixed(2)} (ahorro: ${(((costs.onDemand - costs.reserved1Year) / costs.onDemand) * 100).toFixed(0)}%)`,
  );
  console.log(
    `  Reserved 3-year:   $${costs.reserved3Year.toFixed(2)} (ahorro: ${(((costs.onDemand - costs.reserved3Year) / costs.onDemand) * 100).toFixed(0)}%)`,
  );
  console.log(
    `  Savings Plan:      $${costs.savingsPlan.toFixed(2)} (ahorro: ${(((costs.onDemand - costs.savingsPlan) / costs.onDemand) * 100).toFixed(0)}%)`,
  );
  console.log(
    `  Spot (avg):        $${costs.spot.toFixed(2)} (ahorro: ${(((costs.onDemand - costs.spot) / costs.onDemand) * 100).toFixed(0)}%)\n`,
  );

  console.log('Costo Anual:');
  console.log(
    `  On-Demand:         $${calculateAnnualCost(c52xlargeExample.onDemandHourly).toFixed(2)}`,
  );
  console.log(
    `  Reserved 3-year:   $${calculateAnnualCost(c52xlargeExample.reserved3YearHourly).toFixed(2)}`,
  );
  console.log(
    `  Spot (avg):        $${calculateAnnualCost(c52xlargeExample.spotHourly).toFixed(2)}\n`,
  );
}

// ============================================================================
// DECISION MATRIX
// ============================================================================

interface WorkloadCharacteristics {
  utilizationRate: number; // 0-100%
  predictability: 'low' | 'medium' | 'high';
  criticalness: 'low' | 'medium' | 'high';
  runtime: 'short' | 'medium' | 'long'; // Duration of each job
  faultTolerance: 'low' | 'medium' | 'high';
}

function recommendPricingModel(
  workload: WorkloadCharacteristics,
): {
  primary: string;
  secondary: string;
  reasoning: string;
} {
  // Spot Instances: fault-tolerant, non-critical
  if (
    workload.faultTolerance === 'high' &&
    workload.criticalness === 'low'
  ) {
    return {
      primary: 'Spot Instances',
      secondary: 'On-Demand (fallback)',
      reasoning:
        'High fault tolerance + low criticality = perfect for Spot (90% savings)',
    };
  }

  // Reserved Instances: high utilization, predictable
  if (
    workload.utilizationRate >= 75 &&
    workload.predictability === 'high'
  ) {
    return {
      primary: 'Reserved Instances (3-year)',
      secondary: 'On-Demand (para spikes)',
      reasoning: 'High utilization + predictable = RI for 40% savings',
    };
  }

  // Savings Plans: consistent but flexible
  if (
    workload.utilizationRate >= 60 &&
    workload.predictability === 'medium'
  ) {
    return {
      primary: 'Savings Plans',
      secondary: 'On-Demand (para spikes)',
      reasoning: 'Consistent usage + need flexibility = Savings Plans',
    };
  }

  // On-Demand: unpredictable, low utilization
  return {
    primary: 'On-Demand',
    secondary: 'Spot (for batch tasks)',
    reasoning: 'Low utilization or unpredictable = stick with On-Demand',
  };
}

function demonstrateDecisionMatrix(): void {
  console.log('\n=== DECISION MATRIX: ¿Qué modelo usar? ===\n');

  const scenarios: Array<{
    name: string;
    characteristics: WorkloadCharacteristics;
  }> = [
    {
      name: 'Production Database (RDS)',
      characteristics: {
        utilizationRate: 95,
        predictability: 'high',
        criticalness: 'high',
        runtime: 'long',
        faultTolerance: 'low',
      },
    },
    {
      name: 'ML Model Training',
      characteristics: {
        utilizationRate: 30,
        predictability: 'low',
        criticalness: 'low',
        runtime: 'long',
        faultTolerance: 'high',
      },
    },
    {
      name: 'Web API Servers',
      characteristics: {
        utilizationRate: 70,
        predictability: 'medium',
        criticalness: 'high',
        runtime: 'long',
        faultTolerance: 'low',
      },
    },
    {
      name: 'CI/CD Pipeline',
      characteristics: {
        utilizationRate: 20,
        predictability: 'low',
        criticalness: 'medium',
        runtime: 'short',
        faultTolerance: 'high',
      },
    },
  ];

  scenarios.forEach((scenario) => {
    const recommendation = recommendPricingModel(scenario.characteristics);

    console.log(`📊 ${scenario.name}`);
    console.log(`   Utilization: ${scenario.characteristics.utilizationRate}%`);
    console.log(`   Predictability: ${scenario.characteristics.predictability}`);
    console.log(`   Criticality: ${scenario.characteristics.criticalness}`);
    console.log(
      `   → Recomendación: ${recommendation.primary} + ${recommendation.secondary}`,
    );
    console.log(`   → Razón: ${recommendation.reasoning}\n`);
  });
}

// ============================================================================
// ESTRATEGIA MIXTA (BEST PRACTICE)
// ============================================================================

/**
 * En la práctica, se usa una combinación de modelos
 */
interface MixedPricingStrategy {
  totalMonthlyInstances: number;
  breakdown: {
    model: string;
    instances: number;
    percentage: number;
    monthlyCost: number;
  }[];
  totalMonthlyCost: number;
  savingsVsOnDemand: number;
}

function calculateMixedStrategy(): MixedPricingStrategy {
  const totalInstances = 100;
  const onDemandHourly = 0.34; // c5.2xlarge

  // Estrategia óptima:
  // 60% Reserved (workload base predecible)
  // 20% On-Demand (spikes y flexibilidad)
  // 20% Spot (batch jobs)

  const breakdown = [
    {
      model: 'Reserved Instances (3yr)',
      instances: 60,
      percentage: 60,
      monthlyCost:
        60 * calculateMonthlyCost(c52xlargeExample.reserved3YearHourly),
    },
    {
      model: 'On-Demand',
      instances: 20,
      percentage: 20,
      monthlyCost:
        20 * calculateMonthlyCost(c52xlargeExample.onDemandHourly),
    },
    {
      model: 'Spot Instances',
      instances: 20,
      percentage: 20,
      monthlyCost: 20 * calculateMonthlyCost(c52xlargeExample.spotHourly),
    },
  ];

  const totalMonthlyCost = breakdown.reduce(
    (sum, item) => sum + item.monthlyCost,
    0,
  );

  const allOnDemandCost =
    totalInstances * calculateMonthlyCost(onDemandHourly);
  const savingsVsOnDemand = allOnDemandCost - totalMonthlyCost;

  return {
    totalMonthlyInstances: totalInstances,
    breakdown,
    totalMonthlyCost,
    savingsVsOnDemand,
  };
}

function demonstrateMixedStrategy(): void {
  console.log('\n=== ESTRATEGIA MIXTA (Best Practice) ===\n');

  const strategy = calculateMixedStrategy();

  console.log(`Total Instances: ${strategy.totalMonthlyInstances}\n`);
  console.log('Breakdown:');

  strategy.breakdown.forEach((item) => {
    console.log(`  ${item.model}:`);
    console.log(`    - Instances: ${item.instances} (${item.percentage}%)`);
    console.log(
      `    - Monthly cost: $${item.monthlyCost.toFixed(2).toLocaleString()}\n`,
    );
  });

  console.log(
    `Total Monthly Cost: $${strategy.totalMonthlyCost.toFixed(2).toLocaleString()}`,
  );
  console.log(
    `Savings vs All On-Demand: $${strategy.savingsVsOnDemand.toFixed(2).toLocaleString()}/month`,
  );
  console.log(
    `Annual Savings: $${(strategy.savingsVsOnDemand * 12).toFixed(2).toLocaleString()} 💰\n`,
  );

  console.log('Why this mix works:');
  console.log('  ✅ Reserved: Covers baseline 24/7 workload');
  console.log('  ✅ On-Demand: Handles traffic spikes flexibly');
  console.log('  ✅ Spot: Runs batch jobs at 90% discount');
}

// ============================================================================
// QUICK REFERENCE TABLE
// ============================================================================

function printQuickReference(): void {
  console.log('\n=== QUICK REFERENCE: Pricing Models ===\n');

  const table = `
┌─────────────────────┬──────────────┬─────────────┬──────────────┬─────────────┐
│ Característica      │ On-Demand    │ Reserved    │ Savings Plan │ Spot        │
├─────────────────────┼──────────────┼─────────────┼──────────────┼─────────────┤
│ Compromiso          │ Ninguno      │ 1-3 años    │ 1-3 años     │ Ninguno     │
│ Descuento           │ 0%           │ Hasta 72%   │ Hasta 66%    │ Hasta 90%   │
│ Flexibilidad        │ ⭐⭐⭐       │ ⭐          │ ⭐⭐         │ ⭐⭐⭐      │
│ Riesgo              │ Bajo         │ Medio       │ Bajo         │ Alto        │
│ Interrupciones      │ No           │ No          │ No           │ Sí (2-min)  │
│ Best for            │ Dev/Test     │ Prod DBs    │ Mix workload │ Batch jobs  │
└─────────────────────┴──────────────┴─────────────┴──────────────┴─────────────┘
`;

  console.log(table);

  console.log('\n💡 REGLAS DE ORO:\n');
  console.log(
    '1. Utilización >75% + predecible → Reserved Instances (3 años)',
  );
  console.log(
    '2. Utilización >60% + variable → Savings Plans (1 año para empezar)',
  );
  console.log('3. Batch/ML/CI-CD + fault-tolerant → Spot Instances');
  console.log('4. Todo lo demás → On-Demand (pero optimiza!)');
  console.log('5. NUNCA uses solo un modelo → Estrategia mixta es óptima\n');
}

// ============================================================================
// DEMOSTRACIÓN COMPLETA
// ============================================================================

function demonstratePricingComparison(): void {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   COMPARATIVA DE MODELOS DE PRICING AWS         ║');
  console.log('╚══════════════════════════════════════════════════╝');

  demonstrateCostComparison();
  demonstrateDecisionMatrix();
  demonstrateMixedStrategy();
  printQuickReference();
}

// Ejecutar demostración
if (require.main === module) {
  demonstratePricingComparison();
}

export {
  pricingModels,
  c52xlargeExample,
  calculateMonthlyCost,
  calculateAnnualCost,
  recommendPricingModel,
  calculateMixedStrategy,
};
