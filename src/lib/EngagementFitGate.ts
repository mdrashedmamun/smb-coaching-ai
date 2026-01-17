/**
 * EngagementFitGate.ts
 * 
 * Phase 0: Hard gate for Consulting vs Simulation mode.
 * 
 * FROZEN LOGIC — DO NOT MODIFY WITHOUT GOVERNANCE
 * 
 * This determines if a business qualifies for the full Consulting OS
 * or operates in Simulation Mode (math only, no advisory).
 */

// ============================================================================
// TYPES
// ============================================================================

export interface EngagementFitInput {
  minOfferPrice: number;
  salesMotion: 'consultative' | 'transactional' | 'self_serve';
}

export interface EngagementFitResult {
  mode: 'consulting' | 'simulation';
  qualified: boolean;
  reason: EngagementFailReason | null;
}

export type EngagementFailReason = 'price_below_threshold' | 'non_consultative_motion';

// ============================================================================
// CONSTANTS (FROZEN)
// ============================================================================

export const PRICE_THRESHOLD = 3000;
export const REQUIRED_MOTION = 'consultative';

// ============================================================================
// GATE LOGIC (DETERMINISTIC)
// ============================================================================

/**
 * Evaluates if a business qualifies for Consulting Mode.
 * 
 * Rules:
 * - Price >= $3,000 AND Motion = Consultative → Consulting Mode
 * - Otherwise → Simulation Mode
 * 
 * @param input - The business's minimum offer price and sales motion
 * @returns The mode assignment and qualification reason
 */
export function evaluateEngagementFit(input: EngagementFitInput): EngagementFitResult {
  const pricePass = input.minOfferPrice >= PRICE_THRESHOLD;
  const motionPass = input.salesMotion === REQUIRED_MOTION;

  if (pricePass && motionPass) {
    return {
      mode: 'consulting',
      qualified: true,
      reason: null
    };
  }

  return {
    mode: 'simulation',
    qualified: false,
    reason: !pricePass ? 'price_below_threshold' : 'non_consultative_motion'
  };
}

// ============================================================================
// BUSINESS-LANGUAGE MESSAGING
// ============================================================================

export function getEngagementResultMessage(result: EngagementFitResult): {
  headline: string;
  body: string;
  capabilities: { available: string[]; unavailable: string[] };
} {
  if (result.qualified) {
    return {
      headline: "You're a fit.",
      body: "Your business runs on high-ticket, consultative sales — exactly what this system is built for.",
      capabilities: {
        available: [
          'Revenue gap calculations',
          'Deal and lead targets',
          'Strategic prescriptions',
          'Fundability scoring',
          'CAC Payback analysis'
        ],
        unavailable: []
      }
    };
  }

  const reasonText = result.reason === 'price_below_threshold'
    ? 'Your minimum price is below our $3,000 threshold.'
    : 'Your sales motion is not consultative.';

  return {
    headline: "We can run the math, but not the advice.",
    body: `This system is calibrated for consultative, high-ticket businesses. ${reasonText}`,
    capabilities: {
      available: [
        'Revenue gap calculations',
        'Deal and lead targets'
      ],
      unavailable: [
        'Strategic prescriptions (not applicable)',
        'Fundability scoring (not applicable)'
      ]
    }
  };
}
