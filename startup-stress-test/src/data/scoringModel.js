/**
 * Scoring Model for Startup Idea Stress Tester
 * 
 * Converts user inputs to normalized scores (0-100),
 * applies weights, and generates grades + reports.
 */

// Category weights (must sum to 1.0)
export const WEIGHTS = {
  tam: 0.15,
  marketGrowth: 0.12,
  competition: 0.10,
  barriers: 0.08,
  feasibility: 0.12,
  capital: 0.10,
  timeToMarket: 0.08,
  revenueClarity: 0.10,
  risks: 0.08,
  opportunities: 0.07,
};

// Score mappings for each slider/dropdown value
const TAM_SCORES = {
  '$0-1M': 20,
  '$1M-10M': 40,
  '$10M-100M': 60,
  '$100M-1B': 80,
  '$1B+': 100,
};

const GROWTH_SCORES = {
  'Declining': 10,
  'Flat': 30,
  'Moderate': 50,
  'High': 75,
  'Explosive': 100,
};

const COMPETITION_SCORES = {
  'None': 100,
  'Low': 80,
  'Moderate': 60,
  'High': 40,
  'Saturated': 20,
};

const BARRIERS_SCORES = {
  'None': 30,
  'Low': 50,
  'Moderate': 70,
  'High': 85,
  'Very High': 100,
};

const FEASIBILITY_SCORES = {
  'Very Hard': 20,
  'Hard': 40,
  'Moderate': 60,
  'Easy': 80,
  'Trivial': 95,
};

const CAPITAL_SCORES = {
  'Minimal': 100,
  'Low': 80,
  'Moderate': 60,
  'High': 40,
  'Massive': 20,
};

const TIME_SCORES = {
  '3+ years': 20,
  '1-3 years': 40,
  '6-12 months': 60,
  '3-6 months': 80,
  'Under 3 months': 95,
};

const REVENUE_SCORES = {
  'No idea': 10,
  'Vague': 30,
  'Somewhat clear': 55,
  'Clear': 80,
  'Proven': 100,
};

// Risk factors and their impact
const RISK_IMPACTS = {
  'Regulatory': 15,
  'Technical': 12,
  'Market timing': 10,
  'Key person dependency': 8,
  'IP/legal': 10,
  'Funding': 12,
  'Customer acquisition': 10,
};

// Opportunity factors and their boost
const OPPORTUNITY_BOOSTS = {
  'First mover advantage': 12,
  'Network effects': 15,
  'Recurring revenue': 12,
  'Platform play': 10,
  'Underserved market': 12,
  'Emerging tech tailwind': 10,
};

/**
 * Convert letter grade to color
 */
export function gradeToColor(grade) {
  const colors = {
    'A': '#22c55e', // green
    'B': '#14b8a6', // teal
    'C': '#eab308', // yellow
    'D': '#f97316', // orange
    'F': '#ef4444', // red
  };
  return colors[grade] || '#6b7280';
}

/**
 * Convert numeric score to letter grade
 */
export function scoreToGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Calculate risk score based on selected risks
 * More risks = lower score
 */
function calculateRiskScore(selectedRisks) {
  if (!selectedRisks || selectedRisks.length === 0) return 100;
  
  const maxPenalty = Object.values(RISK_IMPACTS).reduce((a, b) => a + b, 0);
  const totalPenalty = selectedRisks.reduce((sum, risk) => {
    return sum + (RISK_IMPACTS[risk] || 0);
  }, 0);
  
  // Convert penalty to score (fewer risks = higher score)
  return Math.max(0, Math.round(100 - (totalPenalty / maxPenalty) * 100));
}

/**
 * Calculate opportunity score based on selected opportunities
 * More opportunities = higher score
 */
function calculateOpportunityScore(selectedOpportunities) {
  if (!selectedOpportunities || selectedOpportunities.length === 0) return 30;
  
  const maxBoost = Object.values(OPPORTUNITY_BOOSTS).reduce((a, b) => a + b, 0);
  const totalBoost = selectedOpportunities.reduce((sum, opp) => {
    return sum + (OPPORTUNITY_BOOSTS[opp] || 0);
  }, 0);
  
  // Convert boost to score
  return Math.min(100, Math.round(30 + (totalBoost / maxBoost) * 70));
}

/**
 * Main scoring function - takes form inputs, returns complete score object
 */
export function calculateScores(inputs) {
  const scores = {
    tam: TAM_SCORES[inputs.tam] || 50,
    marketGrowth: GROWTH_SCORES[inputs.marketGrowth] || 50,
    competition: COMPETITION_SCORES[inputs.competition] || 50,
    barriers: BARRIERS_SCORES[inputs.barriers] || 50,
    feasibility: FEASIBILITY_SCORES[inputs.feasibility] || 50,
    capital: CAPITAL_SCORES[inputs.capital] || 50,
    timeToMarket: TIME_SCORES[inputs.timeToMarket] || 50,
    revenueClarity: REVENUE_SCORES[inputs.revenueClarity] || 50,
    risks: calculateRiskScore(inputs.risks),
    opportunities: calculateOpportunityScore(inputs.opportunities),
  };

  // Calculate weighted overall score
  const overall = Object.entries(WEIGHTS).reduce((sum, [key, weight]) => {
    return sum + (scores[key] * weight);
  }, 0);

  return {
    ...scores,
    overall: Math.round(overall),
  };
}

/**
 * Generate grades for all categories
 */
export function calculateGrades(scores) {
  const grades = {};
  for (const [key, value] of Object.entries(scores)) {
    grades[key] = scoreToGrade(value);
  }
  return grades;
}

/**
 * Category display names
 */
export const CATEGORY_LABELS = {
  tam: 'Total Addressable Market',
  marketGrowth: 'Market Growth Rate',
  competition: 'Competition Level',
  barriers: 'Barriers to Entry',
  feasibility: 'Technical Feasibility',
  capital: 'Capital Requirements',
  timeToMarket: 'Time to Market',
  revenueClarity: 'Revenue Model Clarity',
  risks: 'Risk Profile',
  opportunities: 'Opportunity Score',
  overall: 'Overall Score',
};

/**
 * Generate the verdict based on overall score and patterns
 */
export function generateVerdict(scores, grades, inputs) {
  const { overall } = scores;
  const overallGrade = grades.overall;
  
  // Check for specific patterns
  const hasHighRisk = inputs.risks && inputs.risks.length >= 4;
  const hasManyOpportunities = inputs.opportunities && inputs.opportunities.length >= 4;
  const hasLargeTAM = scores.tam >= 80;
  const hasLowFeasibility = scores.feasibility <= 40;
  const hasHighCompetition = scores.competition <= 40;
  
  if (overall >= 85) {
    if (hasManyOpportunities && hasLargeTAM) {
      return "Exceptional opportunity with strong fundamentals and multiple growth vectors.";
    }
    return "Strong opportunity with favorable market conditions and manageable execution risk.";
  }
  
  if (overall >= 70) {
    if (hasHighRisk) {
      return "Promising concept but significant risks require careful mitigation strategies.";
    }
    if (hasHighCompetition) {
      return "Solid foundation but will need clear differentiation to stand out in a crowded market.";
    }
    return "Viable opportunity with room for optimization. Focus on strengthening weak areas.";
  }
  
  if (overall >= 60) {
    if (hasLowFeasibility) {
      return "Challenging technical execution may limit this idea's potential. Consider simplifying scope.";
    }
    if (hasHighRisk && hasHighCompetition) {
      return "High-risk venture in a competitive space. Proceed with caution and validate assumptions.";
    }
    return "Moderate potential with notable concerns. Significant pivots may be needed.";
  }
  
  // Below 60
  if (hasLargeTAM && hasLowFeasibility) {
    return "Large market but execution barriers are too high. Consider a different approach to the problem.";
  }
  
  return "Significant challenges across multiple dimensions. Recommend revisiting the core concept.";
}

/**
 * Generate strengths list
 */
export function generateStrengths(scores, grades) {
  const strengths = [];
  
  for (const [key, grade] of Object.entries(grades)) {
    if (key === 'overall') continue;
    if (grade === 'A' || grade === 'B') {
      const label = CATEGORY_LABELS[key];
      const score = scores[key];
      strengths.push({
        category: label,
        grade,
        score,
        message: getStrengthMessage(key, score),
      });
    }
  }
  
  return strengths.sort((a, b) => b.score - a.score);
}

/**
 * Generate weaknesses list
 */
export function generateWeaknesses(scores, grades) {
  const weaknesses = [];
  
  for (const [key, grade] of Object.entries(grades)) {
    if (key === 'overall') continue;
    if (grade === 'D' || grade === 'F') {
      const label = CATEGORY_LABELS[key];
      const score = scores[key];
      weaknesses.push({
        category: label,
        grade,
        score,
        message: getWeaknessMessage(key, score),
      });
    }
  }
  
  return weaknesses.sort((a, b) => a.score - b.score);
}

/**
 * Get strength message for a category
 */
function getStrengthMessage(key, score) {
  const messages = {
    tam: "Large addressable market provides significant growth runway.",
    marketGrowth: "Market tailwinds will accelerate customer acquisition.",
    competition: "Limited competition offers first-mover advantages.",
    barriers: "Strong barriers protect against new entrants.",
    feasibility: "Technical execution is straightforward with proven approaches.",
    capital: "Capital efficiency allows for bootstrapping or lean operations.",
    timeToMarket: "Quick launch timeline enables rapid market validation.",
    revenueClarity: "Clear monetization path reduces business model risk.",
    risks: "Favorable risk profile with manageable concerns.",
    opportunities: "Multiple strategic opportunities to capture value.",
  };
  return messages[key] || "Strong performance in this dimension.";
}

/**
 * Get weakness message for a category
 */
function getWeaknessMessage(key, score) {
  const messages = {
    tam: "Limited market size may cap growth potential.",
    marketGrowth: "Stagnant or declining market makes growth difficult.",
    competition: "Intense competition will require significant differentiation.",
    barriers: "Low barriers invite competition and commoditization.",
    feasibility: "Technical complexity adds execution risk and timeline.",
    capital: "High capital requirements limit flexibility and increase burn.",
    timeToMarket: "Long development timeline risks market changes.",
    revenueClarity: "Unclear monetization creates business model risk.",
    risks: "Multiple risk factors require active mitigation.",
    opportunities: "Limited strategic leverage points identified.",
  };
  return messages[key] || "This area needs improvement.";
}

/**
 * Generate risk flags based on inputs and scores
 */
export function generateRiskFlags(inputs, scores) {
  const flags = [];
  
  // Selected risk factors
  if (inputs.risks && inputs.risks.length > 0) {
    inputs.risks.forEach(risk => {
      flags.push({
        type: 'selected',
        risk,
        severity: RISK_IMPACTS[risk] >= 12 ? 'high' : 'medium',
        message: getRiskMessage(risk),
      });
    });
  }
  
  // Derived risk flags from scores
  if (scores.feasibility <= 40 && scores.capital <= 40) {
    flags.push({
      type: 'derived',
      risk: 'Execution Risk',
      severity: 'high',
      message: 'Low feasibility combined with high capital needs creates compounding execution risk.',
    });
  }
  
  if (scores.competition <= 40 && scores.barriers <= 40) {
    flags.push({
      type: 'derived',
      risk: 'Competitive Vulnerability',
      severity: 'high',
      message: 'Intense competition with low barriers invites aggressive competitive response.',
    });
  }
  
  if (scores.timeToMarket <= 40 && scores.marketGrowth >= 75) {
    flags.push({
      type: 'derived',
      risk: 'Timing Risk',
      severity: 'medium',
      message: 'Fast-moving market may shift before product launches.',
    });
  }
  
  return flags;
}

/**
 * Get message for a specific risk factor
 */
function getRiskMessage(risk) {
  const messages = {
    'Regulatory': 'Regulatory hurdles may delay launch or require compliance investment.',
    'Technical': 'Technical challenges could extend timelines or require specialized talent.',
    'Market timing': 'Market readiness is uncertain; too early or too late entry is possible.',
    'Key person dependency': 'Success depends on specific individuals who may leave or underperform.',
    'IP/legal': 'Intellectual property or legal issues could create liability or blocking patents.',
    'Funding': 'Funding uncertainty may force premature pivots or operational cuts.',
    'Customer acquisition': 'Customer acquisition cost and difficulty may exceed projections.',
  };
  return messages[risk] || 'This risk factor requires attention.';
}

/**
 * Generate recommendations based on scores and inputs
 */
export function generateRecommendations(scores, grades, inputs) {
  const recommendations = [];
  
  // Address weakest areas first
  const sortedCategories = Object.entries(scores)
    .filter(([key]) => key !== 'overall')
    .sort(([, a], [, b]) => a - b);
  
  const weakest = sortedCategories.slice(0, 2);
  
  weakest.forEach(([key, score]) => {
    if (score < 60) {
      recommendations.push(getRecommendation(key, score, inputs));
    }
  });
  
  // General strategic recommendations
  if (scores.overall >= 70 && scores.competition <= 50) {
    recommendations.push({
      priority: 'strategic',
      message: 'Move quickly to establish market position before competition intensifies.',
    });
  }
  
  if (scores.tam >= 80 && scores.feasibility <= 60) {
    recommendations.push({
      priority: 'strategic',
      message: 'Consider a simpler MVP to validate market demand before full technical buildout.',
    });
  }
  
  if (scores.revenueClarity <= 50) {
    recommendations.push({
      priority: 'validation',
      message: 'Run pricing experiments and customer interviews to validate willingness to pay.',
    });
  }
  
  // Limit to top 3 recommendations
  return recommendations.slice(0, 3);
}

/**
 * Get specific recommendation for a weak category
 */
function getRecommendation(key, score, inputs) {
  const recommendations = {
    tam: {
      priority: 'pivot',
      message: 'Explore adjacent markets or broader positioning to expand addressable market.',
    },
    marketGrowth: {
      priority: 'validation',
      message: 'Validate growth assumptions with industry data and customer research.',
    },
    competition: {
      priority: 'differentiation',
      message: 'Identify and double down on unique value propositions that competitors cannot easily copy.',
    },
    barriers: {
      priority: 'strategic',
      message: 'Develop proprietary technology, data advantages, or network effects to build moats.',
    },
    feasibility: {
      priority: 'execution',
      message: 'Break technical challenges into smaller proofs-of-concept to reduce uncertainty.',
    },
    capital: {
      priority: 'financial',
      message: 'Explore phased approaches or alternative business models to reduce capital intensity.',
    },
    timeToMarket: {
      priority: 'execution',
      message: 'Identify an MVP scope that can launch in 3-6 months while maintaining core value.',
    },
    revenueClarity: {
      priority: 'validation',
      message: 'Test multiple pricing models with early customers to find product-market fit.',
    },
    risks: {
      priority: 'mitigation',
      message: 'Create specific mitigation plans for each identified risk factor.',
    },
    opportunities: {
      priority: 'strategic',
      message: 'Map out second-order opportunities that emerge from initial market position.',
    },
  };
  
  return recommendations[key] || {
    priority: 'general',
    message: 'Focus on improving this dimension through targeted research and iteration.',
  };
}

/**
 * Generate complete report data
 */
export function generateReport(inputs) {
  const scores = calculateScores(inputs);
  const grades = calculateGrades(scores);
  const verdict = generateVerdict(scores, grades, inputs);
  const strengths = generateStrengths(scores, grades);
  const weaknesses = generateWeaknesses(scores, grades);
  const riskFlags = generateRiskFlags(inputs, scores);
  const recommendations = generateRecommendations(scores, grades, inputs);
  
  return {
    startupName: inputs.startupName || 'Untitled Startup',
    industry: inputs.industry || 'Unknown',
    scores,
    grades,
    verdict,
    strengths,
    weaknesses,
    riskFlags,
    recommendations,
  };
}
