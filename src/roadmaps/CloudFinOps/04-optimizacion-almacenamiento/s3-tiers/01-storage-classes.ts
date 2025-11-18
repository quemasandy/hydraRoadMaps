/**
 * S3 Storage Classes - Guía Completa de Costos
 *
 * AWS S3 ofrece 8 storage classes con diferentes características
 * de costo, performance y disponibilidad.
 *
 * Objetivo: Entender cuándo usar cada storage class para maximizar ahorros
 */

// ============================================================================
// S3 STORAGE CLASSES PRICING (us-east-1)
// ============================================================================

interface StorageClass {
  name: string;
  storageCostPerGB: number; // Per month
  retrievalCostPerGB: number;
  requestCostPer1000: {
    put: number;
    get: number;
  };
  minimumStorageDuration: number; // Days
  minimumObjectSize: number; // KB
  availability: string;
  durability: string;
  useCase: string[];
  monitoring: number; // Cost per 1000 objects
}

const s3StorageClasses: Record<string, StorageClass> = {
  standard: {
    name: 'S3 Standard',
    storageCostPerGB: 0.023,
    retrievalCostPerGB: 0,
    requestCostPer1000: {
      put: 0.005,
      get: 0.0004,
    },
    minimumStorageDuration: 0,
    minimumObjectSize: 0,
    availability: '99.99%',
    durability: '99.999999999% (11 9s)',
    useCase: [
      'Frequently accessed data',
      'Content distribution',
      'Dynamic websites',
      'Mobile/gaming applications',
    ],
    monitoring: 0,
  },

  intelligentTiering: {
    name: 'S3 Intelligent-Tiering',
    storageCostPerGB: 0.023, // Same as Standard for frequent access
    retrievalCostPerGB: 0,
    requestCostPer1000: {
      put: 0.005,
      get: 0.0004,
    },
    minimumStorageDuration: 0,
    minimumObjectSize: 0,
    availability: '99.9%',
    durability: '99.999999999% (11 9s)',
    useCase: [
      'Unknown or changing access patterns',
      'Long-lived data',
      'Data lakes',
      'Analytics datasets',
    ],
    monitoring: 0.0025, // $0.0025 per 1000 objects
  },

  standardIA: {
    name: 'S3 Standard-IA (Infrequent Access)',
    storageCostPerGB: 0.0125, // ~45% cheaper storage
    retrievalCostPerGB: 0.01, // But charges for retrieval
    requestCostPer1000: {
      put: 0.01,
      get: 0.001,
    },
    minimumStorageDuration: 30, // Days
    minimumObjectSize: 128, // KB
    availability: '99.9%',
    durability: '99.999999999% (11 9s)',
    useCase: [
      'Backups',
      'Disaster recovery',
      'Long-term storage',
      'Accessed <1x per month',
    ],
    monitoring: 0,
  },

  oneZoneIA: {
    name: 'S3 One Zone-IA',
    storageCostPerGB: 0.01, // ~56% cheaper than Standard
    retrievalCostPerGB: 0.01,
    requestCostPer1000: {
      put: 0.01,
      get: 0.001,
    },
    minimumStorageDuration: 30,
    minimumObjectSize: 128,
    availability: '99.5%',
    durability: '99.999999999% (11 9s) in one AZ',
    useCase: [
      'Secondary backup copies',
      'Recreatable data',
      'Non-critical data',
    ],
    monitoring: 0,
  },

  glacier: {
    name: 'S3 Glacier Instant Retrieval',
    storageCostPerGB: 0.004, // ~83% cheaper storage
    retrievalCostPerGB: 0.03,
    requestCostPer1000: {
      put: 0.02,
      get: 0.01,
    },
    minimumStorageDuration: 90,
    minimumObjectSize: 128,
    availability: '99.9%',
    durability: '99.999999999% (11 9s)',
    useCase: [
      'Archive with instant access',
      'Medical images',
      'News media assets',
      'Accessed <1x per quarter',
    ],
    monitoring: 0,
  },

  glacierFlexible: {
    name: 'S3 Glacier Flexible Retrieval',
    storageCostPerGB: 0.0036, // ~84% cheaper
    retrievalCostPerGB: 0.0, // Depends on retrieval tier
    requestCostPer1000: {
      put: 0.03,
      get: 0.0004, // For initiate job
    },
    minimumStorageDuration: 90,
    minimumObjectSize: 128,
    availability: '99.99%',
    durability: '99.999999999% (11 9s)',
    useCase: [
      'Long-term backup',
      'Archive data',
      'Compliance archives',
      'Minutes to hours retrieval OK',
    ],
    monitoring: 0,
  },

  deepArchive: {
    name: 'S3 Glacier Deep Archive',
    storageCostPerGB: 0.00099, // ~96% cheaper than Standard!
    retrievalCostPerGB: 0.02,
    requestCostPer1000: {
      put: 0.05,
      get: 0.0004,
    },
    minimumStorageDuration: 180, // 6 months
    minimumObjectSize: 128,
    availability: '99.99%',
    durability: '99.999999999% (11 9s)',
    useCase: [
      'Long-term retention (7-10+ years)',
      'Compliance archives',
      'Regulatory archives',
      '12-48 hours retrieval OK',
    ],
    monitoring: 0,
  },
};

// ============================================================================
// COST CALCULATOR
// ============================================================================

interface StorageScenario {
  name: string;
  storageGB: number;
  monthlyGets: number;
  monthlyPuts: number;
  accessFrequency: 'high' | 'medium' | 'low' | 'rare';
}

function calculateStorageCost(
  scenario: StorageScenario,
  storageClass: StorageClass,
): {
  storageCost: number;
  requestCost: number;
  retrievalCost: number;
  monitoringCost: number;
  totalCost: number;
} {
  // Storage cost
  const storageCost = scenario.storageGB * storageClass.storageCostPerGB;

  // Request costs
  const getCost =
    (scenario.monthlyGets / 1000) * storageClass.requestCostPer1000.get;
  const putCost =
    (scenario.monthlyPuts / 1000) * storageClass.requestCostPer1000.put;
  const requestCost = getCost + putCost;

  // Retrieval cost (data transfer out)
  const retrievedGB = (scenario.monthlyGets / 1000) * 0.1; // Assume 100KB per object
  const retrievalCost = retrievedGB * storageClass.retrievalCostPerGB;

  // Monitoring cost (for Intelligent-Tiering)
  const objects = scenario.monthlyPuts; // Approximate
  const monitoringCost = (objects / 1000) * storageClass.monitoring;

  const totalCost =
    storageCost + requestCost + retrievalCost + monitoringCost;

  return {
    storageCost,
    requestCost,
    retrievalCost,
    monitoringCost,
    totalCost,
  };
}

// ============================================================================
// SCENARIO 1: Frequently Accessed Data (Website Assets)
// ============================================================================

function scenario1FrequentAccess(): void {
  console.log('\n=== SCENARIO 1: Website Assets (Frequent Access) ===');
  console.log('1TB storage, 10M GET requests/month\n');

  const scenario: StorageScenario = {
    name: 'Website Assets',
    storageGB: 1000, // 1TB
    monthlyGets: 10_000_000,
    monthlyPuts: 10_000,
    accessFrequency: 'high',
  };

  const classes = ['standard', 'intelligentTiering', 'standardIA'];

  classes.forEach((className) => {
    const storageClass = s3StorageClasses[className];
    const cost = calculateStorageCost(scenario, storageClass);

    console.log(`💰 ${storageClass.name}:`);
    console.log(`   Storage: $${cost.storageCost.toFixed(2)}`);
    console.log(`   Requests: $${cost.requestCost.toFixed(2)}`);
    console.log(`   Retrieval: $${cost.retrievalCost.toFixed(2)}`);
    if (cost.monitoringCost > 0) {
      console.log(`   Monitoring: $${cost.monitoringCost.toFixed(2)}`);
    }
    console.log(`   → Total: $${cost.totalCost.toFixed(2)}/month\n`);
  });

  console.log('🏆 Winner: S3 Standard');
  console.log('   Reason: High access frequency makes retrieval fees costly\n');
}

// ============================================================================
// SCENARIO 2: Infrequent Access (Monthly Reports)
// ============================================================================

function scenario2InfrequentAccess(): void {
  console.log('\n=== SCENARIO 2: Monthly Reports (Infrequent Access) ===');
  console.log('500GB storage, 50K GET requests/month\n');

  const scenario: StorageScenario = {
    name: 'Monthly Reports',
    storageGB: 500,
    monthlyGets: 50_000,
    monthlyPuts: 1_000,
    accessFrequency: 'low',
  };

  const classes = ['standard', 'intelligentTiering', 'standardIA', 'oneZoneIA'];

  classes.forEach((className) => {
    const storageClass = s3StorageClasses[className];
    const cost = calculateStorageCost(scenario, storageClass);

    console.log(`💰 ${storageClass.name}:`);
    console.log(`   Storage: $${cost.storageCost.toFixed(2)}`);
    console.log(`   Requests: $${cost.requestCost.toFixed(2)}`);
    console.log(`   Retrieval: $${cost.retrievalCost.toFixed(2)}`);
    if (cost.monitoringCost > 0) {
      console.log(`   Monitoring: $${cost.monitoringCost.toFixed(2)}`);
    }
    console.log(`   → Total: $${cost.totalCost.toFixed(2)}/month\n`);
  });

  console.log('🏆 Winner: S3 One Zone-IA');
  console.log(
    '   Reason: Lowest storage cost, infrequent access, recreatable data\n',
  );
}

// ============================================================================
// SCENARIO 3: Archive (Compliance Data)
// ============================================================================

function scenario3Archive(): void {
  console.log('\n=== SCENARIO 3: Compliance Archive (Rare Access) ===');
  console.log('10TB storage, 100 GET requests/month (audits)\n');

  const scenario: StorageScenario = {
    name: 'Compliance Archive',
    storageGB: 10_000, // 10TB
    monthlyGets: 100, // Very rare access
    monthlyPuts: 100,
    accessFrequency: 'rare',
  };

  const classes = [
    'standard',
    'standardIA',
    'glacier',
    'glacierFlexible',
    'deepArchive',
  ];

  classes.forEach((className) => {
    const storageClass = s3StorageClasses[className];
    const cost = calculateStorageCost(scenario, storageClass);

    console.log(`💰 ${storageClass.name}:`);
    console.log(`   Storage: $${cost.storageCost.toFixed(2)}`);
    console.log(`   Requests: $${cost.requestCost.toFixed(2)}`);
    console.log(`   Retrieval: $${cost.retrievalCost.toFixed(2)}`);
    console.log(`   → Total: $${cost.totalCost.toFixed(2)}/month\n`);
  });

  const standardCost = calculateStorageCost(
    scenario,
    s3StorageClasses.standard,
  ).totalCost;
  const deepArchiveCost = calculateStorageCost(
    scenario,
    s3StorageClasses.deepArchive,
  ).totalCost;
  const savings = standardCost - deepArchiveCost;

  console.log('🏆 Winner: S3 Glacier Deep Archive');
  console.log(
    `   Savings: $${savings.toFixed(2)}/month ($${(savings * 12).toFixed(2)}/year!)`,
  );
  console.log(
    '   Reason: 96% cheaper storage, rare access makes retrieval cost negligible\n',
  );
}

// ============================================================================
// SCENARIO 4: Unknown Access Pattern (Data Lake)
// ============================================================================

function scenario4UnknownPattern(): void {
  console.log('\n=== SCENARIO 4: Data Lake (Unknown Access Pattern) ===');
  console.log('5TB storage, variable access pattern\n');

  const scenario: StorageScenario = {
    name: 'Data Lake',
    storageGB: 5_000,
    monthlyGets: 500_000, // Variable
    monthlyPuts: 10_000,
    accessFrequency: 'medium',
  };

  console.log(
    '📊 Access pattern: Some files accessed frequently, others rarely\n',
  );

  // Compare Standard vs Intelligent-Tiering
  const standardCost = calculateStorageCost(
    scenario,
    s3StorageClasses.standard,
  );
  const intelligentCost = calculateStorageCost(
    scenario,
    s3StorageClasses.intelligentTiering,
  );

  console.log('💰 S3 Standard:');
  console.log(`   Total: $${standardCost.totalCost.toFixed(2)}/month\n`);

  console.log('💰 S3 Intelligent-Tiering:');
  console.log(`   Storage (mixed tiers): $${intelligentCost.storageCost.toFixed(2)}`);
  console.log(`   Requests: $${intelligentCost.requestCost.toFixed(2)}`);
  console.log(`   Monitoring: $${intelligentCost.monitoringCost.toFixed(2)}`);
  console.log(`   → Total: $${intelligentCost.totalCost.toFixed(2)}/month\n`);

  console.log('🏆 Winner: S3 Intelligent-Tiering');
  console.log('   Reason: Auto-tiering based on access patterns');
  console.log('   - Frequently accessed → Standard tier');
  console.log('   - 30 days no access → IA tier');
  console.log('   - 90 days no access → Archive tier');
  console.log('   - No retrieval fees when moving between tiers!\n');
}

// ============================================================================
// DECISION TREE
// ============================================================================

function printDecisionTree(): void {
  console.log('\n=== DECISION TREE: Choosing S3 Storage Class ===\n');

  const tree = `
Start here: What's your access pattern?
│
├─ Frequent access (>1x per month)
│  └─ Use: S3 Standard
│     Cost: $0.023/GB/month
│
├─ Infrequent access (<1x per month)
│  ├─ Need instant access?
│  │  ├─ Yes → S3 Standard-IA ($0.0125/GB)
│  │  │        or S3 One Zone-IA ($0.01/GB) if data is recreatable
│  │  └─ No → Can wait minutes?
│  │           └─ Yes → S3 Glacier Instant ($0.004/GB)
│  └─ Rare access (<1x per quarter)
│     ├─ Need within hours? → S3 Glacier Flexible ($0.0036/GB)
│     └─ Can wait 12-48 hours? → S3 Glacier Deep Archive ($0.00099/GB)
│
└─ Unknown/Variable access pattern
   └─ Use: S3 Intelligent-Tiering ($0.023/GB + $0.0025 per 1000 objects)
      Automatically moves objects between tiers
`;

  console.log(tree);

  console.log('\n💡 PRO TIPS:\n');
  console.log(
    '1. Use Intelligent-Tiering for data lakes with unknown patterns',
  );
  console.log(
    '2. Glacier classes have minimum 90-180 day storage duration charges',
  );
  console.log('3. Glacier classes have minimum 128KB object size charges');
  console.log(
    '4. One Zone-IA is great for secondary backups (56% cheaper than Standard)',
  );
  console.log(
    '5. Deep Archive is cheapest but takes 12-48 hours to retrieve\n',
  );
}

// ============================================================================
// COST SAVINGS CALCULATOR
// ============================================================================

function calculatePotentialSavings(): void {
  console.log('\n=== POTENTIAL SAVINGS: Migration Example ===\n');

  const currentSetup = {
    description: 'Current: Everything in S3 Standard',
    storageGB: 50_000, // 50TB
    monthlyCost:
      50_000 * s3StorageClasses.standard.storageCostPerGB,
  };

  console.log(
    `Current Setup: ${currentSetup.storageGB.toLocaleString()}GB in S3 Standard`,
  );
  console.log(
    `Current Cost: $${currentSetup.monthlyCost.toLocaleString()}/month\n`,
  );

  // Optimized setup
  const optimized = {
    frequent: { gb: 5_000, class: 'standard' }, // 10%
    infrequent: { gb: 15_000, class: 'standardIA' }, // 30%
    archive: { gb: 20_000, class: 'glacierFlexible' }, // 40%
    deepArchive: { gb: 10_000, class: 'deepArchive' }, // 20%
  };

  let optimizedCost = 0;
  console.log('Optimized Setup:');

  Object.entries(optimized).forEach(([key, { gb, class: className }]) => {
    const cost = gb * s3StorageClasses[className].storageCostPerGB;
    optimizedCost += cost;
    console.log(
      `  ${key}: ${gb.toLocaleString()}GB in ${s3StorageClasses[className].name} = $${cost.toFixed(2)}`,
    );
  });

  console.log(`\nOptimized Cost: $${optimizedCost.toFixed(2)}/month`);

  const savings = currentSetup.monthlyCost - optimizedCost;
  const savingsPercent = (savings / currentSetup.monthlyCost) * 100;

  console.log(`\n💰 Monthly Savings: $${savings.toFixed(2)}`);
  console.log(`💰 Annual Savings: $${(savings * 12).toFixed(2)}`);
  console.log(`📊 Percentage Reduction: ${savingsPercent.toFixed(0)}%\n`);
}

// ============================================================================
// DEMOSTRACIÓN COMPLETA
// ============================================================================

function demonstrateS3StorageClasses(): void {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   S3 STORAGE CLASSES - GUÍA DE OPTIMIZACIÓN         ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  scenario1FrequentAccess();
  scenario2InfrequentAccess();
  scenario3Archive();
  scenario4UnknownPattern();
  printDecisionTree();
  calculatePotentialSavings();

  console.log('═════════════════════════════════════════════════════');
  console.log('CONCLUSIÓN: Storage class correcto = ahorros masivos!');
  console.log('═════════════════════════════════════════════════════\n');
}

// Ejecutar demostración
if (require.main === module) {
  demonstrateS3StorageClasses();
}

export { s3StorageClasses, calculateStorageCost };
