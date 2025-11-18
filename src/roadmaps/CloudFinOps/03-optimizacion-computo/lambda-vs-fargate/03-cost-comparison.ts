/**
 * Lambda vs Fargate: Comparativa de Costos
 *
 * Análisis detallado de costos entre AWS Lambda y AWS Fargate
 * para diferentes patrones de carga de trabajo.
 *
 * Objetivo: Saber cuándo usar Lambda vs Fargate basado en costos reales
 */

// ============================================================================
// MODELOS DE PRICING
// ============================================================================

/**
 * Lambda Pricing (us-east-1)
 * - Requests: $0.20 per 1M requests
 * - Duration: $0.0000166667 per GB-second
 * - Free tier: 1M requests + 400,000 GB-seconds/month
 */
interface LambdaPricing {
  requestCost: number; // Per million requests
  gbSecondCost: number; // Per GB-second
  freeTierRequests: number; // Per month
  freeTierGBSeconds: number; // Per month
}

const lambdaPricing: LambdaPricing = {
  requestCost: 0.2, // $0.20 per 1M
  gbSecondCost: 0.0000166667,
  freeTierRequests: 1_000_000,
  freeTierGBSeconds: 400_000,
};

/**
 * Fargate Pricing (us-east-1)
 * - vCPU: $0.04048 per vCPU per hour
 * - Memory: $0.004445 per GB per hour
 */
interface FargatePricing {
  vCPUPerHour: number;
  memoryGBPerHour: number;
}

const fargatePricing: FargatePricing = {
  vCPUPerHour: 0.04048,
  memoryGBPerHour: 0.004445,
};

// ============================================================================
// LAMBDA COST CALCULATOR
// ============================================================================

interface LambdaWorkload {
  requestsPerMonth: number;
  averageDurationMs: number;
  memoryMB: number;
  includeFreeT
ier: boolean;
}

function calculateLambdaCost(workload: LambdaWorkload): {
  requestCost: number;
  computeCost: number;
  totalCost: number;
  breakdown: string[];
} {
  let requests = workload.requestsPerMonth;
  let gbSeconds =
    (requests * (workload.averageDurationMs / 1000) * workload.memoryMB) /
    1024;

  // Apply free tier
  if (workload.includeFreeTier) {
    requests = Math.max(0, requests - lambdaPricing.freeTierRequests);
    gbSeconds = Math.max(0, gbSeconds - lambdaPricing.freeTierGBSeconds);
  }

  const requestCost = (requests / 1_000_000) * lambdaPricing.requestCost;
  const computeCost = gbSeconds * lambdaPricing.gbSecondCost;
  const totalCost = requestCost + computeCost;

  const breakdown = [
    `Requests: ${workload.requestsPerMonth.toLocaleString()} req/month`,
    `Duration: ${workload.averageDurationMs}ms avg`,
    `Memory: ${workload.memoryMB}MB`,
    `GB-seconds: ${gbSeconds.toLocaleString()} GB-s`,
    `Request cost: $${requestCost.toFixed(2)}`,
    `Compute cost: $${computeCost.toFixed(2)}`,
    `Free tier: ${workload.includeFreeTier ? 'Yes' : 'No'}`,
  ];

  return { requestCost, computeCost, totalCost, breakdown };
}

// ============================================================================
// FARGATE COST CALCULATOR
// ============================================================================

interface FargateWorkload {
  vCPU: number; // 0.25, 0.5, 1, 2, 4
  memoryGB: number;
  hoursPerMonth: number; // Typically 730 for 24/7
}

function calculateFargateCost(workload: FargateWorkload): {
  cpuCost: number;
  memoryCost: number;
  totalCost: number;
  breakdown: string[];
} {
  const cpuCost = workload.vCPU * fargatePricing.vCPUPerHour * workload.hoursPerMonth;
  const memoryCost =
    workload.memoryGB * fargatePricing.memoryGBPerHour * workload.hoursPerMonth;
  const totalCost = cpuCost + memoryCost;

  const breakdown = [
    `vCPU: ${workload.vCPU}`,
    `Memory: ${workload.memoryGB}GB`,
    `Hours: ${workload.hoursPerMonth}h/month`,
    `CPU cost: $${cpuCost.toFixed(2)}`,
    `Memory cost: $${memoryCost.toFixed(2)}`,
  ];

  return { cpuCost, memoryCost, totalCost, breakdown };
}

// ============================================================================
// SCENARIO 1: Low-Traffic API (100K requests/month)
// ============================================================================

function scenario1LowTrafficAPI(): void {
  console.log('\n=== SCENARIO 1: Low-Traffic API ===');
  console.log('100K requests/month, 500ms avg duration\n');

  // Lambda configuration
  const lambdaWorkload: LambdaWorkload = {
    requestsPerMonth: 100_000,
    averageDurationMs: 500,
    memoryMB: 512,
    includeFreeTier: true,
  };

  const lambdaCost = calculateLambdaCost(lambdaWorkload);

  console.log('💰 Lambda Cost:');
  lambdaCost.breakdown.forEach((line) => console.log(`   ${line}`));
  console.log(`   → Total: $${lambdaCost.totalCost.toFixed(2)}/month\n`);

  // Fargate configuration (smallest task)
  const fargateWorkload: FargateWorkload = {
    vCPU: 0.25,
    memoryGB: 0.5,
    hoursPerMonth: 730, // 24/7
  };

  const fargateCost = calculateFargateCost(fargateWorkload);

  console.log('💰 Fargate Cost (0.25 vCPU, 0.5GB, 24/7):');
  fargateCost.breakdown.forEach((line) => console.log(`   ${line}`));
  console.log(`   → Total: $${fargateCost.totalCost.toFixed(2)}/month\n`);

  const winner =
    lambdaCost.totalCost < fargateCost.totalCost ? 'Lambda' : 'Fargate';
  const savings = Math.abs(lambdaCost.totalCost - fargateCost.totalCost);
  const savingsPercent =
    (savings / Math.max(lambdaCost.totalCost, fargateCost.totalCost)) * 100;

  console.log(`🏆 Winner: ${winner}`);
  console.log(
    `   Savings: $${savings.toFixed(2)}/month (${savingsPercent.toFixed(0)}%)\n`,
  );
}

// ============================================================================
// SCENARIO 2: Medium-Traffic API (1M requests/month)
// ============================================================================

function scenario2MediumTrafficAPI(): void {
  console.log('\n=== SCENARIO 2: Medium-Traffic API ===');
  console.log('1M requests/month, 300ms avg duration\n');

  // Lambda configuration
  const lambdaWorkload: LambdaWorkload = {
    requestsPerMonth: 1_000_000,
    averageDurationMs: 300,
    memoryMB: 1024,
    includeFreeTier: true,
  };

  const lambdaCost = calculateLambdaCost(lambdaWorkload);

  console.log('💰 Lambda Cost:');
  lambdaCost.breakdown.forEach((line) => console.log(`   ${line}`));
  console.log(`   → Total: $${lambdaCost.totalCost.toFixed(2)}/month\n`);

  // Fargate configuration
  const fargateWorkload: FargateWorkload = {
    vCPU: 0.5,
    memoryGB: 1,
    hoursPerMonth: 730,
  };

  const fargateCost = calculateFargateCost(fargateWorkload);

  console.log('💰 Fargate Cost (0.5 vCPU, 1GB, 24/7):');
  fargateCost.breakdown.forEach((line) => console.log(`   ${line}`));
  console.log(`   → Total: $${fargateCost.totalCost.toFixed(2)}/month\n`);

  const winner =
    lambdaCost.totalCost < fargateCost.totalCost ? 'Lambda' : 'Fargate';
  const savings = Math.abs(lambdaCost.totalCost - fargateCost.totalCost);

  console.log(`🏆 Winner: ${winner}`);
  console.log(`   Savings: $${savings.toFixed(2)}/month\n`);
}

// ============================================================================
// SCENARIO 3: High-Traffic API (10M requests/month)
// ============================================================================

function scenario3HighTrafficAPI(): void {
  console.log('\n=== SCENARIO 3: High-Traffic API ===');
  console.log('10M requests/month, 200ms avg duration\n');

  // Lambda configuration
  const lambdaWorkload: LambdaWorkload = {
    requestsPerMonth: 10_000_000,
    averageDurationMs: 200,
    memoryMB: 1024,
    includeFreeTier: false, // Production account
  };

  const lambdaCost = calculateLambdaCost(lambdaWorkload);

  console.log('💰 Lambda Cost:');
  lambdaCost.breakdown.forEach((line) => console.log(`   ${line}`));
  console.log(`   → Total: $${lambdaCost.totalCost.toFixed(2)}/month\n`);

  // Fargate configuration
  const fargateWorkload: FargateWorkload = {
    vCPU: 1,
    memoryGB: 2,
    hoursPerMonth: 730,
  };

  const fargateCost = calculateFargateCost(fargateWorkload);

  console.log('💰 Fargate Cost (1 vCPU, 2GB, 24/7):');
  fargateCost.breakdown.forEach((line) => console.log(`   ${line}`));
  console.log(`   → Total: $${fargateCost.totalCost.toFixed(2)}/month\n`);

  const winner =
    lambdaCost.totalCost < fargateCost.totalCost ? 'Lambda' : 'Fargate';
  const savings = Math.abs(lambdaCost.totalCost - fargateCost.totalCost);

  console.log(`🏆 Winner: ${winner}`);
  console.log(`   Savings: $${savings.toFixed(2)}/month\n`);
}

// ============================================================================
// SCENARIO 4: Long-Running Background Jobs
// ============================================================================

function scenario4LongRunningJobs(): void {
  console.log('\n=== SCENARIO 4: Long-Running Background Jobs ===');
  console.log('Processing jobs that run 5-10 minutes each\n');

  // Lambda configuration (max 15 minutes)
  const lambdaWorkload: LambdaWorkload = {
    requestsPerMonth: 50_000, // Jobs per month
    averageDurationMs: 7 * 60 * 1000, // 7 minutes
    memoryMB: 2048,
    includeFreeTier: false,
  };

  const lambdaCost = calculateLambdaCost(lambdaWorkload);

  console.log('💰 Lambda Cost (2GB, 7min avg):');
  lambdaCost.breakdown.forEach((line) => console.log(`   ${line}`));
  console.log(`   → Total: $${lambdaCost.totalCost.toFixed(2)}/month\n`);

  // Fargate configuration
  const fargateWorkload: FargateWorkload = {
    vCPU: 1,
    memoryGB: 2,
    hoursPerMonth: 730, // Running 24/7 to handle jobs
  };

  const fargateCost = calculateFargateCost(fargateWorkload);

  console.log('💰 Fargate Cost (1 vCPU, 2GB, 24/7):');
  fargateCost.breakdown.forEach((line) => console.log(`   ${line}`));
  console.log(`   → Total: $${fargateCost.totalCost.toFixed(2)}/month\n`);

  console.log('📊 Analysis:');
  console.log(
    '   - Lambda charges per execution (expensive for long jobs)',
  );
  console.log('   - Fargate runs 24/7 but processes jobs continuously');
  console.log(
    '   - Consider Fargate with auto-scaling for bursty workloads\n',
  );
}

// ============================================================================
// SCENARIO 5: WebSocket Connections (Real-time)
// ============================================================================

function scenario5WebSocket(): void {
  console.log('\n=== SCENARIO 5: WebSocket Connections (Real-time) ===');
  console.log('1000 concurrent connections, low message volume\n');

  console.log('💰 Lambda (via API Gateway WebSocket):');
  console.log('   ❌ Not ideal for WebSocket');
  console.log('   - Charges per message ($1 per million)');
  console.log('   - Connection state management is complex');
  console.log('   - Cold starts affect real-time experience\n');

  const fargateWorkload: FargateWorkload = {
    vCPU: 0.5,
    memoryGB: 1,
    hoursPerMonth: 730,
  };

  const fargateCost = calculateFargateCost(fargateWorkload);

  console.log('💰 Fargate Cost (0.5 vCPU, 1GB, 24/7):');
  fargateCost.breakdown.forEach((line) => console.log(`   ${line}`));
  console.log(`   → Total: $${fargateCost.totalCost.toFixed(2)}/month\n`);

  console.log('🏆 Winner: Fargate');
  console.log(
    '   - Better for persistent connections (WebSocket, gRPC)',
  );
  console.log('   - Predictable costs');
  console.log('   - No cold starts\n');
}

// ============================================================================
// BREAK-EVEN ANALYSIS
// ============================================================================

function calculateBreakEvenPoint(): void {
  console.log('\n=== BREAK-EVEN ANALYSIS ===');
  console.log('At what request volume does Fargate become cheaper?\n');

  // Fargate baseline (smallest config running 24/7)
  const fargateMonthlyCost = calculateFargateCost({
    vCPU: 0.25,
    memoryGB: 0.5,
    hoursPerMonth: 730,
  }).totalCost;

  console.log(
    `Fargate baseline cost: $${fargateMonthlyCost.toFixed(2)}/month (0.25 vCPU, 0.5GB)\n`,
  );

  // Find break-even for Lambda
  const scenarios = [
    { requests: 1_000_000, duration: 100 },
    { requests: 5_000_000, duration: 100 },
    { requests: 10_000_000, duration: 100 },
    { requests: 20_000_000, duration: 100 },
    { requests: 50_000_000, duration: 100 },
  ];

  console.log('Lambda costs at different request volumes (100ms, 512MB):\n');

  scenarios.forEach(({ requests, duration }) => {
    const lambdaCost = calculateLambdaCost({
      requestsPerMonth: requests,
      averageDurationMs: duration,
      memoryMB: 512,
      includeFreeTier: false,
    }).totalCost;

    const cheaper = lambdaCost < fargateMonthlyCost ? 'Lambda ✅' : 'Fargate ✅';

    console.log(
      `${(requests / 1_000_000).toFixed(0)}M requests: $${lambdaCost.toFixed(2)} → ${cheaper}`,
    );
  });

  console.log('\n💡 Insight:');
  console.log(
    '   For short-duration requests (<200ms), Lambda is cheaper up to ~10-20M req/month',
  );
  console.log(
    '   For longer durations (>1s), Fargate becomes cheaper sooner\n',
  );
}

// ============================================================================
// DECISION MATRIX
// ============================================================================

function printDecisionMatrix(): void {
  console.log('\n=== DECISION MATRIX: Lambda vs Fargate ===\n');

  const matrix = `
┌─────────────────────────┬───────────────────────┬───────────────────────┐
│ Característica          │ Lambda ✅             │ Fargate ✅            │
├─────────────────────────┼───────────────────────┼───────────────────────┤
│ Mejor para              │ Event-driven          │ Long-running          │
│                         │ Intermitente          │ Always-on             │
│                         │ <15min duration       │ Persistent connections│
├─────────────────────────┼───────────────────────┼───────────────────────┤
│ Pricing model           │ Pay per request       │ Pay per hour          │
│                         │ Pay per GB-second     │ vCPU + Memory         │
├─────────────────────────┼───────────────────────┼───────────────────────┤
│ Más barato cuando       │ <10M req/month        │ >20M req/month        │
│                         │ Short duration        │ Long-running jobs     │
│                         │ Bursty traffic        │ Steady traffic        │
├─────────────────────────┼───────────────────────┼───────────────────────┤
│ Cold starts             │ Sí (50-200ms)         │ No                    │
├─────────────────────────┼───────────────────────┼───────────────────────┤
│ Max duration            │ 15 minutos            │ Ilimitado             │
├─────────────────────────┼───────────────────────┼───────────────────────┤
│ Mejor para              │ APIs REST             │ WebSocket             │
│                         │ Webhooks              │ gRPC                  │
│                         │ Cron jobs             │ Background workers    │
│                         │ Image processing      │ Streaming             │
└─────────────────────────┴───────────────────────┴───────────────────────┘
`;

  console.log(matrix);

  console.log('\n🎯 REGLAS DE ORO:\n');
  console.log('1. Event-driven + <15min → Lambda');
  console.log('2. Always-on + persistent connections → Fargate');
  console.log('3. Bursty traffic + low volume → Lambda');
  console.log('4. Steady high traffic → Fargate');
  console.log('5. ¿No estás seguro? → Empieza con Lambda, migra si creces\n');
}

// ============================================================================
// DEMOSTRACIÓN COMPLETA
// ============================================================================

function demonstrateLambdaVsFargateCosts(): void {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   LAMBDA vs FARGATE: COMPARATIVA DE COSTOS          ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  scenario1LowTrafficAPI();
  scenario2MediumTrafficAPI();
  scenario3HighTrafficAPI();
  scenario4LongRunningJobs();
  scenario5WebSocket();
  calculateBreakEvenPoint();
  printDecisionMatrix();

  console.log('═════════════════════════════════════════════════════');
  console.log('CONCLUSIÓN: El contexto importa. Analiza tu workload!');
  console.log('═════════════════════════════════════════════════════\n');
}

// Ejecutar demostración
if (require.main === module) {
  demonstrateLambdaVsFargateCosts();
}

export {
  lambdaPricing,
  fargatePricing,
  calculateLambdaCost,
  calculateFargateCost,
};
