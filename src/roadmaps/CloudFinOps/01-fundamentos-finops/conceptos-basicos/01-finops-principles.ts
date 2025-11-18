/**
 * Principios Fundamentales de FinOps
 *
 * FinOps (Financial Operations) es la práctica de combinar finanzas,
 * operaciones y tecnología para maximizar el valor del negocio en la nube.
 *
 * Este archivo demuestra los 6 principios fundamentales de FinOps
 * según la FinOps Foundation.
 */

// ============================================================================
// PRINCIPIO 1: Teams need to collaborate
// ============================================================================

/**
 * Modelo de colaboración entre equipos
 * Engineering, Finance y Business deben trabajar juntos
 */
interface TeamResponsibilities {
  engineering: string[];
  finance: string[];
  business: string[];
}

const finOpsCollaboration: TeamResponsibilities = {
  engineering: [
    'Implementar arquitecturas cost-efficient',
    'Instrumentar código con cost metrics',
    'Responder a cost anomalies',
    'Proponer optimizaciones técnicas',
  ],
  finance: [
    'Forecasting y budgeting',
    'Análisis de variaciones de costo',
    'Reporting financiero',
    'Chargeback/Showback models',
  ],
  business: [
    'Definir prioridades de negocio',
    'Aprobar inversiones cloud',
    'Validar ROI de iniciativas',
    'Alinear gastos con objetivos',
  ],
};

function demonstrateCollaboration(): void {
  console.log('=== PRINCIPIO 1: Teams need to collaborate ===\n');

  console.log('Responsabilidades por equipo:\n');
  Object.entries(finOpsCollaboration).forEach(([team, responsibilities]) => {
    console.log(`${team.toUpperCase()}:`);
    responsibilities.forEach((resp) => console.log(`  - ${resp}`));
    console.log();
  });

  // Ejemplo de colaboración en acción
  const monthlyReview = {
    actualSpend: 125000,
    budgetedSpend: 100000,
    variance: 25000, // +25% overspend
    engineeringActions: [
      'Reducir tier de RDS en staging',
      'Implementar auto-scaling más agresivo',
    ],
    financeActions: ['Revisar forecast con nueva data', 'Actualizar budget'],
    businessActions: ['Aprobar migración a Reserved Instances'],
  };

  console.log('Ejemplo de Monthly Cost Review:');
  console.log(`Gasto actual: $${monthlyReview.actualSpend.toLocaleString()}`);
  console.log(
    `Presupuesto: $${monthlyReview.budgetedSpend.toLocaleString()}`,
  );
  console.log(`Variación: +$${monthlyReview.variance.toLocaleString()} ⚠️\n`);
}

// ============================================================================
// PRINCIPIO 2: Everyone takes ownership for their cloud usage
// ============================================================================

/**
 * Modelo de ownership: cada equipo es responsable de sus costos
 */
interface TeamCloudUsage {
  teamName: string;
  monthlyBudget: number;
  actualSpend: number;
  resources: {
    service: string;
    cost: number;
    owner: string;
  }[];
}

const teamUsageExample: TeamCloudUsage[] = [
  {
    teamName: 'Team API',
    monthlyBudget: 10000,
    actualSpend: 8500,
    resources: [
      { service: 'Lambda', cost: 3000, owner: 'juan.perez@company.com' },
      { service: 'DynamoDB', cost: 2500, owner: 'maria.garcia@company.com' },
      { service: 'API Gateway', cost: 2000, owner: 'juan.perez@company.com' },
      { service: 'CloudWatch', cost: 1000, owner: 'DevOps' },
    ],
  },
  {
    teamName: 'Team ML',
    monthlyBudget: 50000,
    actualSpend: 62000,
    resources: [
      { service: 'SageMaker', cost: 45000, owner: 'carlos.lopez@company.com' },
      { service: 'S3', cost: 12000, owner: 'ana.martinez@company.com' },
      { service: 'EC2 (GPU)', cost: 5000, owner: 'carlos.lopez@company.com' },
    ],
  },
];

function demonstrateOwnership(): void {
  console.log('\n=== PRINCIPIO 2: Everyone takes ownership ===\n');

  teamUsageExample.forEach((team) => {
    const variance = team.actualSpend - team.monthlyBudget;
    const status = variance > 0 ? '🔴 Over budget' : '✅ Within budget';

    console.log(`Team: ${team.teamName}`);
    console.log(`Budget: $${team.monthlyBudget.toLocaleString()}`);
    console.log(`Actual: $${team.actualSpend.toLocaleString()} - ${status}`);
    console.log('Resources:');
    team.resources.forEach((r) => {
      console.log(
        `  - ${r.service}: $${r.cost.toLocaleString()} (Owner: ${r.owner})`,
      );
    });
    console.log();
  });
}

// ============================================================================
// PRINCIPIO 3: A centralized team drives FinOps
// ============================================================================

/**
 * Cloud Center of Excellence (CCoE) o FinOps Team
 * Centraliza best practices, herramientas y governance
 */
interface FinOpsTeamStructure {
  lead: string;
  members: {
    role: string;
    name: string;
    responsibilities: string[];
  }[];
  tools: string[];
  deliverables: string[];
}

const finOpsTeam: FinOpsTeamStructure = {
  lead: 'Cloud FinOps Manager',
  members: [
    {
      role: 'Cloud Financial Analyst',
      name: 'Ana Rodriguez',
      responsibilities: [
        'Cost analysis y reporting',
        'Budget forecasting',
        'ROI analysis',
      ],
    },
    {
      role: 'Cloud Optimization Engineer',
      name: 'Roberto Sanchez',
      responsibilities: [
        'Rightsizing recommendations',
        'Reserved Instance planning',
        'Automation de optimizaciones',
      ],
    },
    {
      role: 'Cloud Governance Specialist',
      name: 'Laura Fernandez',
      responsibilities: [
        'Tagging policies',
        'Cost allocation',
        'Compliance y auditoría',
      ],
    },
  ],
  tools: [
    'AWS Cost Explorer',
    'AWS Budgets',
    'CloudWatch Dashboards',
    'Custom FinOps Dashboard',
  ],
  deliverables: [
    'Monthly cost review meeting',
    'Weekly cost anomaly reports',
    'Quarterly optimization roadmap',
    'Annual budget planning',
  ],
};

function demonstrateCentralization(): void {
  console.log('\n=== PRINCIPIO 3: Centralized FinOps team ===\n');

  console.log(`FinOps Team Lead: ${finOpsTeam.lead}\n`);
  console.log('Team Members:');
  finOpsTeam.members.forEach((member) => {
    console.log(`\n${member.role} - ${member.name}`);
    member.responsibilities.forEach((r) => console.log(`  • ${r}`));
  });

  console.log('\n\nTools & Deliverables:');
  console.log('Tools:', finOpsTeam.tools.join(', '));
  console.log('\nDeliverables:');
  finOpsTeam.deliverables.forEach((d) => console.log(`  • ${d}`));
  console.log();
}

// ============================================================================
// PRINCIPIO 4: Reports should be accessible and timely
// ============================================================================

/**
 * Democratización de datos de costos
 * Todos deben tener acceso a métricas relevantes en tiempo real
 */
interface CostReport {
  type: string;
  audience: string;
  frequency: string;
  metrics: string[];
  deliveryMethod: string;
}

const costReports: CostReport[] = [
  {
    type: 'Daily Cost Dashboard',
    audience: 'Engineering teams',
    frequency: 'Real-time',
    metrics: [
      'Daily spend by service',
      'Top 10 resources by cost',
      'Budget vs Actual',
    ],
    deliveryMethod: 'CloudWatch Dashboard',
  },
  {
    type: 'Weekly Anomaly Report',
    audience: 'Team leads, FinOps team',
    frequency: 'Weekly (Monday morning)',
    metrics: [
      'Cost anomalies detected',
      'Unexpected spikes',
      'Recommendations',
    ],
    deliveryMethod: 'Email + Slack',
  },
  {
    type: 'Monthly Executive Summary',
    audience: 'C-level, VPs',
    frequency: 'Monthly',
    metrics: [
      'Total cloud spend',
      'YoY growth',
      'Savings achieved',
      'Forecast vs Actual',
    ],
    deliveryMethod: 'PDF Report + Presentation',
  },
  {
    type: 'Quarterly Business Review',
    audience: 'All stakeholders',
    frequency: 'Quarterly',
    metrics: [
      'Unit economics trends',
      'ROI of optimizations',
      'Cloud efficiency score',
      'Next quarter plan',
    ],
    deliveryMethod: 'Live presentation',
  },
];

function demonstrateReporting(): void {
  console.log('\n=== PRINCIPIO 4: Accessible and timely reports ===\n');

  costReports.forEach((report) => {
    console.log(`📊 ${report.type}`);
    console.log(`   Audience: ${report.audience}`);
    console.log(`   Frequency: ${report.frequency}`);
    console.log(`   Delivery: ${report.deliveryMethod}`);
    console.log(`   Metrics: ${report.metrics.join(', ')}`);
    console.log();
  });

  // Ejemplo de dashboard en tiempo real
  const realtimeDashboard = {
    todaySpend: 4250,
    projectedMonthlySpend: 127500,
    budget: 120000,
    topCosts: [
      { service: 'EC2', cost: 1200, percentage: 28 },
      { service: 'RDS', cost: 950, percentage: 22 },
      { service: 'S3', cost: 600, percentage: 14 },
    ],
  };

  console.log('Real-time Dashboard Example:');
  console.log(`Today's spend: $${realtimeDashboard.todaySpend}`);
  console.log(
    `Projected month: $${realtimeDashboard.projectedMonthlySpend.toLocaleString()}`,
  );
  console.log(`Budget: $${realtimeDashboard.budget.toLocaleString()}`);
  const overBudget =
    realtimeDashboard.projectedMonthlySpend > realtimeDashboard.budget;
  console.log(
    `Status: ${overBudget ? '🔴 Projected over budget' : '✅ On track'}\n`,
  );
}

// ============================================================================
// PRINCIPIO 5: Decisions are driven by business value
// ============================================================================

/**
 * Las decisiones de optimización deben basarse en valor de negocio,
 * no solo en reducción de costos
 */
interface OptimizationProposal {
  name: string;
  costSavings: number;
  implementationCost: number;
  engineeringHours: number;
  businessImpact: 'positive' | 'neutral' | 'negative';
  riskLevel: 'low' | 'medium' | 'high';
  roi: number; // Calculated
  priority: 'high' | 'medium' | 'low'; // Based on business value
}

const optimizationProposals: OptimizationProposal[] = [
  {
    name: 'Migrate production DB to Reserved Instances',
    costSavings: 30000, // Annual
    implementationCost: 1000,
    engineeringHours: 8,
    businessImpact: 'neutral', // No impact on users
    riskLevel: 'low',
    roi: 0,
    priority: 'high',
  },
  {
    name: 'Reduce log retention from 90 to 30 days',
    costSavings: 5000, // Annual
    implementationCost: 500,
    engineeringHours: 4,
    businessImpact: 'negative', // Harder debugging
    riskLevel: 'medium',
    roi: 0,
    priority: 'low',
  },
  {
    name: 'Implement S3 Intelligent-Tiering',
    costSavings: 15000, // Annual
    implementationCost: 2000,
    engineeringHours: 16,
    businessImpact: 'positive', // Better data management
    riskLevel: 'low',
    roi: 0,
    priority: 'high',
  },
];

function calculateROI(proposal: OptimizationProposal): number {
  const totalCost =
    proposal.implementationCost + proposal.engineeringHours * 100; // $100/hr
  return ((proposal.costSavings - totalCost) / totalCost) * 100;
}

function demonstrateBusinessValue(): void {
  console.log('\n=== PRINCIPIO 5: Business value driven decisions ===\n');

  // Calculate ROI for all proposals
  optimizationProposals.forEach((proposal) => {
    proposal.roi = calculateROI(proposal);
  });

  console.log('Optimization Proposals Analysis:\n');
  optimizationProposals.forEach((proposal) => {
    console.log(`📋 ${proposal.name}`);
    console.log(`   Savings: $${proposal.costSavings.toLocaleString()}/year`);
    console.log(`   ROI: ${proposal.roi.toFixed(0)}%`);
    console.log(`   Business Impact: ${proposal.businessImpact}`);
    console.log(`   Risk: ${proposal.riskLevel}`);
    console.log(`   Priority: ${proposal.priority} ⭐`);
    console.log();
  });

  console.log(
    'Decision: High-priority items with positive/neutral business impact first!',
  );
}

// ============================================================================
// PRINCIPIO 6: Take advantage of variable cost model
// ============================================================================

/**
 * Aprovechar la elasticidad de la nube para optimizar costos
 * Escalar up/down según demanda
 */
interface WorkloadPattern {
  name: string;
  peakHours: number[];
  offPeakHours: number[];
  peakInstances: number;
  offPeakInstances: number;
  monthlySavings: number;
}

const elasticWorkload: WorkloadPattern = {
  name: 'E-commerce Platform',
  peakHours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // 9am-8pm
  offPeakHours: [21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8], // 9pm-8am
  peakInstances: 20,
  offPeakInstances: 5,
  monthlySavings: 0, // Will calculate
};

function calculateElasticSavings(workload: WorkloadPattern): number {
  const instanceCostPerHour = 0.5; // Example: t3.large
  const hoursPerMonth = 730;

  // If we ran 20 instances 24/7
  const staticCost = 20 * instanceCostPerHour * hoursPerMonth;

  // With elastic scaling
  const peakCost =
    workload.peakInstances * instanceCostPerHour * workload.peakHours.length;
  const offPeakCost =
    workload.offPeakInstances *
    instanceCostPerHour *
    workload.offPeakHours.length;
  const daysPerMonth = 30;
  const elasticCost = (peakCost + offPeakCost) * daysPerMonth;

  return staticCost - elasticCost;
}

function demonstrateVariableCost(): void {
  console.log('\n=== PRINCIPIO 6: Variable cost model ===\n');

  elasticWorkload.monthlySavings = calculateElasticSavings(elasticWorkload);

  console.log(`Workload: ${elasticWorkload.name}`);
  console.log(
    `Peak hours (${elasticWorkload.peakHours.length}h): ${elasticWorkload.peakInstances} instances`,
  );
  console.log(
    `Off-peak (${elasticWorkload.offPeakHours.length}h): ${elasticWorkload.offPeakInstances} instances`,
  );
  console.log(
    `\nMonthly savings: $${elasticWorkload.monthlySavings.toLocaleString()} 💰`,
  );
  console.log(
    `Annual savings: $${(elasticWorkload.monthlySavings * 12).toLocaleString()}\n`,
  );

  console.log('Other variable cost strategies:');
  console.log('  • Dev/Test environments: Shutdown nights & weekends');
  console.log('  • Batch processing: Use Spot Instances');
  console.log('  • Serverless: Pay only for actual usage');
  console.log('  • Auto-scaling: Match capacity to demand\n');
}

// ============================================================================
// DEMOSTRACIÓN COMPLETA
// ============================================================================

function demonstrateFinOpsPrinciples(): void {
  console.log('\n╔═══════════════════════════════════════════════╗');
  console.log('║   6 PRINCIPIOS FUNDAMENTALES DE FINOPS       ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  demonstrateCollaboration();
  demonstrateOwnership();
  demonstrateCentralization();
  demonstrateReporting();
  demonstrateBusinessValue();
  demonstrateVariableCost();

  console.log('═══════════════════════════════════════════════');
  console.log('RESUMEN: FinOps es cultura + procesos + tech');
  console.log('═══════════════════════════════════════════════\n');
}

// Ejecutar demostración
if (require.main === module) {
  demonstrateFinOpsPrinciples();
}

export {
  finOpsCollaboration,
  teamUsageExample,
  finOpsTeam,
  costReports,
  optimizationProposals,
  elasticWorkload,
  calculateROI,
  calculateElasticSavings,
};
