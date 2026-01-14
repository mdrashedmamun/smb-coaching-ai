/**
 * OfferRecommendationEngine.ts
 *
 * Pure logic for constraint-aware offer scoring and recommendations.
 * Scores each offer based on the identified constraint and provides
 * recommendation badges with transparency about confidence levels.
 */

import type { Offer } from '../store/useBusinessStore';

export type ConstraintType = 'lead_flow' | 'conversion' | 'delivery_capacity' | 'retention';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ScoredOffer {
  offer: Offer;
  score: number; // 0-100
  recommendationBadge: string | null; // e.g. "Recommended for Lead Flow"
  dealsByMonth: number;
  callsByMonth: number | null;  // Null if no actual close rate available
  tags: string[]; // e.g. ["High Leverage", "Volume Heavy"]
}

export interface ScoringContext {
  offers: Offer[];
  revenueGap: number;
  constraint: ConstraintType | null;
  confidenceLevel: ConfidenceLevel;
  capacityCallsPerWeek?: number;
  actualCloseRate?: number;  // Real close rate from prior audit (if available)
}

/**
 * Score a single offer based on the constraint and context.
 * All scoring is relative to the user's portfolio, with no hardcoded thresholds.
 */
export const scoreOffer = (
  offer: Offer,
  context: ScoringContext
): ScoredOffer => {
  const dealsByMonth = context.revenueGap > 0 && offer.price > 0
    ? Math.ceil(context.revenueGap / offer.price)
    : 0;

  // FIXED: Only calculate calls/month if we have actual close rate data
  let callsByMonth: number | null = null;
  if (context.actualCloseRate && context.actualCloseRate > 0) {
    callsByMonth = Math.ceil(dealsByMonth / (context.actualCloseRate / 100));
  }

  let score = 50; // Base score
  let recommendationBadge: string | null = null;
  const tags: string[] = [];

  // FIXED: Calculate relative leverage using safe quartile logic
  // This works even for portfolios with fewer than 4 offers
  const allDealsNeeded = context.offers
    .map(o =>
      context.revenueGap > 0 && o.price > 0
        ? Math.ceil(context.revenueGap / o.price)
        : Infinity
    )
    .filter(d => d !== Infinity)
    .sort((a, b) => a - b);

  // Safe quartile calculation: works for any portfolio size
  const q1Index = Math.floor(allDealsNeeded.length * 0.25) || 0;
  const q3Index = Math.floor(allDealsNeeded.length * 0.75) || 0;
  const q1 = allDealsNeeded[q1Index] || 10;
  const q3 = allDealsNeeded[q3Index] || 50;

  // FIXED: Relative leverage tagging (no $2K hardcode)
  if (dealsByMonth <= q1) {
    tags.push('High Leverage');
  }
  if (dealsByMonth >= q3 || dealsByMonth > 50) {
    tags.push('Volume Heavy');
  }

  // FIXED: Calculate price ranks for conversion constraint scoring
  const sortedByPrice = [...context.offers].sort((a, b) => a.price - b.price);
  const priceRank = sortedByPrice.findIndex(o => o.id === offer.id);
  const isLowestPriced = priceRank === 0;
  const isUpperHalfPrice = priceRank > sortedByPrice.length / 2;

  // Constraint-aware scoring
  if (context.constraint === 'lead_flow') {
    // Lead Flow bottleneck → Recommend HIGH-TICKET (minimizes deals needed)
    // Philosophy: If getting leads is hard, each lead needs to be worth more
    if (dealsByMonth <= q1) {
      score += 40;
      recommendationBadge = 'Recommended for Lead Flow';
    } else if (dealsByMonth <= (q1 + q3) / 2) {
      score += 20;
    } else {
      // Penalize volume-heavy offers when lead flow is constrained
      score -= 10;
    }
  } else if (context.constraint === 'conversion') {
    // FIXED: Conversion constraint uses relative price ranking (no $2K hardcode)
    // Philosophy: If closing is hard, recommend lowest-priced offer in portfolio
    if (isLowestPriced) {
      score += 40;
      recommendationBadge = 'Recommended for Conversion';
    } else if (!isUpperHalfPrice) {
      // Lower half of price range
      score += 20;
    } else {
      // Upper half - penalize when conversion is constrained
      score -= 10;
    }
  } else if (context.constraint === 'delivery_capacity') {
    // Delivery/Capacity bottleneck → Recommend HIGH-TICKET (fewer clients)
    // Philosophy: If fulfillment is the bottleneck, charge more per client
    if (dealsByMonth <= q1) {
      score += 40;
      recommendationBadge = 'Capacity-Friendly';
    } else if (dealsByMonth <= (q1 + q3) / 2) {
      score += 20;
    }
  } else if (context.constraint === 'retention') {
    // Retention/LTV bottleneck → Recommend RETAINER/RECURRING
    // Philosophy: Recurring models support customer lifetime value
    if (offer.type === 'retainer' || offer.type === 'consulting') {
      score += 40;
      recommendationBadge = 'LTV Expansion Path';
    }
  }

  // Capacity check (if user provided call capacity)
  if (context.capacityCallsPerWeek && context.capacityCallsPerWeek > 0 && callsByMonth !== null) {
    const callsPerWeek = callsByMonth / 4;
    if (callsPerWeek > context.capacityCallsPerWeek * 1.5) {
      score -= 20;
      tags.push('Exceeds Call Capacity');
    }
  }

  return {
    offer,
    score: Math.max(0, Math.min(100, score)),
    recommendationBadge,
    dealsByMonth,
    callsByMonth,  // Nullable - only set if we have real close rate
    tags
  };
};

/**
 * Score all offers and return sorted by score (highest first).
 */
export const scoreOffers = (context: ScoringContext): ScoredOffer[] => {
  const scored = context.offers.map(offer => scoreOffer(offer, context));
  return scored.sort((a, b) => b.score - a.score);
};

/**
 * Helper to infer constraint type from quick constraint check answers.
 * Used by ConstraintCheckScreen to map user responses to constraint type.
 */
export const inferConstraint = (
  q1Response: string | null,
  q2Response: string | null,
  q3CallCapacity?: number
): ConstraintType => {
  // Priority 1: Direct constraint signals from Q1
  if (q1Response === 'lead_flow') return 'lead_flow';
  if (q1Response === 'delivery') return 'delivery_capacity';

  // Priority 2: Sales bottleneck - needs refinement from Q2
  if (q1Response === 'sales') {
    if (q2Response === 'getting_leads') return 'lead_flow';
    if (q2Response === 'booking_calls') return 'conversion';
    if (q2Response === 'closing') return 'conversion';
    if (q2Response === 'retention') return 'retention';
  }

  // Priority 3: "Not sure" - infer from Q2
  if (q1Response === 'not_sure') {
    if (q2Response === 'getting_leads') return 'lead_flow';
    if (q2Response === 'booking_calls') return 'conversion';
    if (q2Response === 'closing') return 'conversion';
    if (q2Response === 'retention') return 'retention';
  }

  // Default fallback
  return 'lead_flow';
};

/**
 * Helper to map bottleneck types from BottleneckEngine to constraint types.
 * Used by DiagnosticFlow to convert prior audit data to constraint signals.
 */
export const mapBottleneckToConstraint = (
  bottleneck: 'volume_outreach' | 'volume_followup' | 'skill_messaging' | 'skill_sales' | 'price' | 'capacity'
): ConstraintType => {
  switch (bottleneck) {
    case 'volume_outreach':
      return 'lead_flow';
    case 'volume_followup':
      // Follow-up is a conversion issue (lead-to-call booking), not lead generation
      return 'conversion';
    case 'skill_messaging':
    case 'skill_sales':
      return 'conversion';
    case 'capacity':
      return 'delivery_capacity';
    case 'price':
      // Price is an economics/conversion issue (objection handling, pricing power)
      // NOT a lead flow problem
      return 'conversion';
    default:
      return 'lead_flow';
  }
};
