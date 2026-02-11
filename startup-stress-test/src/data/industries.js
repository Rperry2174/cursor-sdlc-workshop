/**
 * Industry options and benchmark data for the Startup Stress Tester
 */

export const INDUSTRIES = [
  { value: 'Tech', label: 'Technology / Software' },
  { value: 'Healthcare', label: 'Healthcare / Biotech' },
  { value: 'Fintech', label: 'Fintech / Financial Services' },
  { value: 'E-commerce', label: 'E-commerce / Retail' },
  { value: 'Education', label: 'Education / EdTech' },
  { value: 'SaaS', label: 'SaaS / Enterprise Software' },
  { value: 'Consumer', label: 'Consumer Apps / Social' },
  { value: 'Hardware', label: 'Hardware / IoT' },
  { value: 'Marketplace', label: 'Marketplace / Platform' },
  { value: 'Other', label: 'Other' },
];

export const TAM_OPTIONS = [
  { value: '$0-1M', label: '$0 - $1M (Niche)' },
  { value: '$1M-10M', label: '$1M - $10M (Small)' },
  { value: '$10M-100M', label: '$10M - $100M (Medium)' },
  { value: '$100M-1B', label: '$100M - $1B (Large)' },
  { value: '$1B+', label: '$1B+ (Massive)' },
];

export const SLIDER_OPTIONS = {
  marketGrowth: [
    { value: 'Declining', label: 'Declining' },
    { value: 'Flat', label: 'Flat' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'High', label: 'High' },
    { value: 'Explosive', label: 'Explosive' },
  ],
  competition: [
    { value: 'None', label: 'None' },
    { value: 'Low', label: 'Low' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'High', label: 'High' },
    { value: 'Saturated', label: 'Saturated' },
  ],
  barriers: [
    { value: 'None', label: 'None' },
    { value: 'Low', label: 'Low' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'High', label: 'High' },
    { value: 'Very High', label: 'Very High' },
  ],
  feasibility: [
    { value: 'Very Hard', label: 'Very Hard' },
    { value: 'Hard', label: 'Hard' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Trivial', label: 'Trivial' },
  ],
  capital: [
    { value: 'Minimal', label: 'Minimal' },
    { value: 'Low', label: 'Low' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'High', label: 'High' },
    { value: 'Massive', label: 'Massive' },
  ],
  timeToMarket: [
    { value: '3+ years', label: '3+ years' },
    { value: '1-3 years', label: '1-3 years' },
    { value: '6-12 months', label: '6-12 months' },
    { value: '3-6 months', label: '3-6 months' },
    { value: 'Under 3 months', label: 'Under 3 months' },
  ],
  revenueClarity: [
    { value: 'No idea', label: 'No idea' },
    { value: 'Vague', label: 'Vague' },
    { value: 'Somewhat clear', label: 'Somewhat clear' },
    { value: 'Clear', label: 'Clear' },
    { value: 'Proven', label: 'Proven' },
  ],
};

export const RISK_OPTIONS = [
  { value: 'Regulatory', label: 'Regulatory' },
  { value: 'Technical', label: 'Technical' },
  { value: 'Market timing', label: 'Market timing' },
  { value: 'Key person dependency', label: 'Key person dependency' },
  { value: 'IP/legal', label: 'IP / Legal' },
  { value: 'Funding', label: 'Funding' },
  { value: 'Customer acquisition', label: 'Customer acquisition' },
];

export const OPPORTUNITY_OPTIONS = [
  { value: 'First mover advantage', label: 'First mover advantage' },
  { value: 'Network effects', label: 'Network effects' },
  { value: 'Recurring revenue', label: 'Recurring revenue' },
  { value: 'Platform play', label: 'Platform play' },
  { value: 'Underserved market', label: 'Underserved market' },
  { value: 'Emerging tech tailwind', label: 'Emerging tech tailwind' },
];

// Industry-specific benchmarks (for future enhancement)
export const INDUSTRY_BENCHMARKS = {
  Tech: { avgTAM: '$100M-1B', avgTimeToMarket: '6-12 months', capitalIntensity: 'Moderate' },
  Healthcare: { avgTAM: '$1B+', avgTimeToMarket: '3+ years', capitalIntensity: 'High' },
  Fintech: { avgTAM: '$100M-1B', avgTimeToMarket: '1-3 years', capitalIntensity: 'High' },
  'E-commerce': { avgTAM: '$10M-100M', avgTimeToMarket: '3-6 months', capitalIntensity: 'Moderate' },
  Education: { avgTAM: '$10M-100M', avgTimeToMarket: '6-12 months', capitalIntensity: 'Low' },
  SaaS: { avgTAM: '$100M-1B', avgTimeToMarket: '6-12 months', capitalIntensity: 'Moderate' },
  Consumer: { avgTAM: '$1B+', avgTimeToMarket: '3-6 months', capitalIntensity: 'High' },
  Hardware: { avgTAM: '$10M-100M', avgTimeToMarket: '1-3 years', capitalIntensity: 'Massive' },
  Marketplace: { avgTAM: '$100M-1B', avgTimeToMarket: '6-12 months', capitalIntensity: 'Moderate' },
  Other: { avgTAM: '$10M-100M', avgTimeToMarket: '6-12 months', capitalIntensity: 'Moderate' },
};
