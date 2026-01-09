/**
 * Funnel Taxonomy
 *
 * Defines the rules, types, and templates for funnel building.
 * Enables validation of AC-5.1 (Traffic Mismatch) and AC-5.2 (Stage Gating).
 */

// ============================================================================
// TRAFFIC SOURCE TYPES
// ============================================================================

export type TrafficSourceType =
  | 'paid_ads'           // Cold: Facebook Ads, Google Ads, LinkedIn Ads
  | 'cold_outreach'      // Cold: Cold DM, Cold Email, LinkedIn outreach
  | 'organic_content'    // Warm: Blog, YouTube, Social Media posts
  | 'email_list'         // Warm: Newsletter, existing subscribers
  | 'referral'           // Warm: Word of mouth, partner referrals
  | 'direct'             // Warm: Direct traffic, returning visitors

/**
 * Classifies traffic sources as COLD (stranger) or WARM (known audience)
 */
export const TRAFFIC_SOURCES: Record<'cold' | 'warm', TrafficSourceType[]> = {
  cold: ['paid_ads', 'cold_outreach'],
  warm: ['organic_content', 'email_list', 'referral', 'direct']
}

/**
 * Human-readable labels for traffic sources (for UI dropdowns)
 */
export const TRAFFIC_SOURCE_LABELS: Record<TrafficSourceType, string> = {
  paid_ads: 'Paid Ads (Facebook, Google, LinkedIn)',
  cold_outreach: 'Cold Outreach (DM, Email)',
  organic_content: 'Organic Content (Blog, YouTube)',
  email_list: 'Email List / Newsletter',
  referral: 'Referrals / Word of Mouth',
  direct: 'Direct / Returning Visitors'
}

/**
 * Utility: Check if a traffic source is "cold" (stranger)
 */
export function isTrafficCold(source: TrafficSourceType): boolean {
  return TRAFFIC_SOURCES.cold.includes(source)
}

/**
 * Utility: Check if a traffic source is "warm" (known)
 */
export function isTrafficWarm(source: TrafficSourceType): boolean {
  return TRAFFIC_SOURCES.warm.includes(source)
}

// ============================================================================
// FUNNEL STAGE ACTIONS & FRICTION LEVELS
// ============================================================================

export type FrictionLevel = 'low' | 'medium' | 'high'

/**
 * All possible actions a prospect can take in a funnel step
 *
 * LOW: Minimal commitment (passive consumption)
 * MEDIUM: Some engagement (active but non-binding)
 * HIGH: Commitment required (binding or sales conversation)
 */
export type StageActionType =
  | 'landing_page'       // Low: Simple page visit
  | 'video_watch'        // Low: Watch video, no commitment
  | 'lead_magnet'        // Medium: Download PDF, sign up for free resource
  | 'email_sequence'     // Medium: Automated nurture sequence
  | 'webinar'            // Medium: Group presentation
  | 'discovery_call'     // High: 1-on-1 consultation
  | 'proposal_review'    // High: Review proposal, pricing discussion
  | 'contract_signing'   // High: Final commitment

/**
 * Maps each stage action to its friction level
 *
 * Rule: COLD traffic should NOT go directly to HIGH friction (AC-5.1)
 */
export const STAGE_FRICTION_MAP: Record<StageActionType, FrictionLevel> = {
  landing_page: 'low',
  video_watch: 'low',
  lead_magnet: 'medium',
  email_sequence: 'medium',
  webinar: 'medium',
  discovery_call: 'high',
  proposal_review: 'high',
  contract_signing: 'high'
}

/**
 * Human-readable labels for stage actions (for UI dropdowns)
 */
export const STAGE_ACTION_LABELS: Record<StageActionType, string> = {
  landing_page: 'Landing Page',
  video_watch: 'Video (VSL/Demo)',
  lead_magnet: 'Lead Magnet (PDF, Guide)',
  email_sequence: 'Email Nurture Sequence',
  webinar: 'Webinar / Group Demo',
  discovery_call: 'Discovery Call (1-on-1)',
  proposal_review: 'Proposal / Quote Review',
  contract_signing: 'Contract / Payment'
}

/**
 * Utility: Get friction level for a stage action
 */
export function getFrictionLevel(action: StageActionType): FrictionLevel {
  return STAGE_FRICTION_MAP[action]
}

/**
 * Utility: Check if a stage is high friction
 */
export function isHighFriction(action: StageActionType): boolean {
  return getFrictionLevel(action) === 'high'
}

/**
 * Determine business stage from annual revenue
 *
 * RATIONALE FOR THRESHOLDS:
 * - Stage 0 (Improvise): $0 revenue
 *   WHY: Pre-revenue businesses should focus on product validation, not paid ads
 *   RISK: Burning cash on ads before product-market fit
 *
 * - Stage 1 (Monetize): $0 - $100k
 *   WHY: Proving strangers will pay, optimizing unit economics
 *   FOCUS: Sales process, pricing, initial marketing
 *
 * - Stage 2+ (Scale): $100k+
 *   WHY: Proven business model, ready to scale with capital
 *   FOCUS: Paid acquisition, sophisticated funnels
 */
export function getBusinessStage(revenue: number): 'Improvise' | 'Monetize' | 'Scale' {
  if (revenue === 0) return 'Improvise'
  if (revenue < 100000) return 'Monetize'
  return 'Scale'
}

/**
 * Check if a traffic source is forbidden for a business stage
 *
 * RATIONALE:
 * - Prevents costly mistakes (e.g., Stage 0 user spending on ads before validation)
 * - Enforces Alex Hormozi's "Stage 0 = Work for Free" principle
 * - Returns false for unknown stages (fail-safe, don't block unexpectedly)
 */
export function isTrafficSourceForbidden(
  source: TrafficSourceType,
  businessStage: 'Improvise' | 'Monetize' | 'Scale'
): boolean {
  const forbiddenSources = FUNNEL_RULES.FORBIDDEN_TRAFFIC_SOURCES[businessStage] as unknown as TrafficSourceType[]
  return forbiddenSources?.includes(source) || false
}

// ============================================================================
// VALIDATION RULES & CONSTRAINTS
// ============================================================================

/**
 * Business rules that enforce funnel quality across different business stages
 *
 * These rules are referenced in AC-5.2 (Stage Gating)
 */
export const FUNNEL_RULES = {
  // Minimum required funnel steps by business stage
  MIN_STAGES: {
    Improvise: 2,   // Stage 0: Any basic funnel (e.g., DM -> Call)
    Monetize: 3,    // Stage 1: Need basic nurture step
    Scale: 4        // Stage 2+: Need sophisticated nurture
  },

  // Traffic sources forbidden for specific business stages
  // (Rule: Stage 0 users cannot run paid ads)
  FORBIDDEN_TRAFFIC_SOURCES: {
    Improvise: ['paid_ads'] as const,
    Monetize: [] as const,
    Scale: [] as const,
  },

  // Flag if cold traffic goes directly to high friction (AC-5.1.1)
  COLD_TRAFFIC_HIGH_FRICTION_ERROR: true,

  // Flag if warm traffic goes directly to high friction (AC-5.1.2)
  // Note: This is NOT an error, but might flag as "suboptimal"
  WARM_TRAFFIC_HIGH_FRICTION_WARNING: false
} as const

// ============================================================================
// FUNNEL STEP INTERFACE (Exported for use in Store)
// ============================================================================

export interface FunnelStep {
  id: string                           // UUID for React keys and uniqueness
  name: string                         // User-defined label (e.g., "My Landing Page")
  trafficSource?: TrafficSourceType    // Where leads come from (required for first step)
  action: StageActionType              // What happens at this stage
  conversionRate?: number              // 0-100%, optional for now (Phase 5.2)
  order: number                        // Position in funnel (0-indexed)
}

// ============================================================================
// DEFAULT FUNNEL TEMPLATES
// ============================================================================

/**
 * Pre-built funnel templates for common business models
 * Users can start from these or build custom funnels
 */
export const DEFAULT_FUNNEL_TEMPLATES = {
  // Typical service business: Outreach -> Lead Magnet -> Call -> Close
  SERVICE_BUSINESS: (): FunnelStep[] => [
    {
      id: crypto.randomUUID(),
      name: 'Cold Outreach',
      trafficSource: 'cold_outreach' as TrafficSourceType,
      action: 'landing_page' as StageActionType,
      order: 0
    },
    {
      id: crypto.randomUUID(),
      name: 'Lead Magnet',
      trafficSource: undefined,
      action: 'lead_magnet' as StageActionType,
      order: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Discovery Call',
      trafficSource: undefined,
      action: 'discovery_call' as StageActionType,
      order: 2
    },
    {
      id: crypto.randomUUID(),
      name: 'Close',
      trafficSource: undefined,
      action: 'contract_signing' as StageActionType,
      order: 3
    }
  ],

  // Content-led: Blog/Content -> Email Nurture -> Call -> Close
  WARM_CONTENT: (): FunnelStep[] => [
    {
      id: crypto.randomUUID(),
      name: 'Content (Blog/Video)',
      trafficSource: 'organic_content' as TrafficSourceType,
      action: 'video_watch' as StageActionType,
      order: 0
    },
    {
      id: crypto.randomUUID(),
      name: 'Email Sequence',
      trafficSource: undefined,
      action: 'email_sequence' as StageActionType,
      order: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Call Booking',
      trafficSource: undefined,
      action: 'discovery_call' as StageActionType,
      order: 2
    },
    {
      id: crypto.randomUUID(),
      name: 'Close',
      trafficSource: undefined,
      action: 'contract_signing' as StageActionType,
      order: 3
    }
  ],

  // Paid Ads (only for Monetize/Scale stages): Ads -> LP -> Email -> Webinar -> Close
  PAID_ADS: (): FunnelStep[] => [
    {
      id: crypto.randomUUID(),
      name: 'Paid Ads',
      trafficSource: 'paid_ads' as TrafficSourceType,
      action: 'landing_page' as StageActionType,
      order: 0
    },
    {
      id: crypto.randomUUID(),
      name: 'Lead Magnet',
      trafficSource: undefined,
      action: 'lead_magnet' as StageActionType,
      order: 1
    },
    {
      id: crypto.randomUUID(),
      name: 'Email Nurture',
      trafficSource: undefined,
      action: 'email_sequence' as StageActionType,
      order: 2
    },
    {
      id: crypto.randomUUID(),
      name: 'Webinar / Demo',
      trafficSource: undefined,
      action: 'webinar' as StageActionType,
      order: 3
    },
    {
      id: crypto.randomUUID(),
      name: 'Close',
      trafficSource: undefined,
      action: 'contract_signing' as StageActionType,
      order: 4
    }
  ]
}

/**
 * Create a new empty funnel step
 */
export function createEmptyStep(order: number): FunnelStep {
  return {
    id: crypto.randomUUID(),
    name: 'New Step',
    action: 'landing_page',
    order
  }
}

/**
 * Validate a funnel against the business stage constraints
 * Returns { isValid: boolean, errors: string[] }
 */
export function validateFunnel(
  steps: FunnelStep[],
  businessStage: 'Improvise' | 'Monetize' | 'Scale'
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check minimum step count
  const minSteps = FUNNEL_RULES.MIN_STAGES[businessStage]
  if (steps.length < minSteps) {
    errors.push(
      `You need at least ${minSteps} funnel steps for ${businessStage} stage. You have ${steps.length}.`
    )
  }

  // Check for forbidden traffic sources
  const forbiddenSources = FUNNEL_RULES.FORBIDDEN_TRAFFIC_SOURCES[businessStage] as unknown as TrafficSourceType[]
  if (forbiddenSources && forbiddenSources.length > 0) {
    const firstStep = steps[0]
    if (firstStep?.trafficSource && forbiddenSources.includes(firstStep.trafficSource)) {
      errors.push(
        `You cannot use ${TRAFFIC_SOURCE_LABELS[firstStep.trafficSource]} in ${businessStage} stage. Use organic or manual outreach instead.`
      )
    }
  }

  // Check for cold traffic + high friction (Marriage on First Date)
  if (FUNNEL_RULES.COLD_TRAFFIC_HIGH_FRICTION_ERROR) {
    const firstStep = steps[0]
    if (
      firstStep?.trafficSource &&
      isTrafficCold(firstStep.trafficSource) &&
      steps.length === 1
    ) {
      errors.push(
        `"Marriage on First Date" detected: Cold traffic should NOT go directly to ${STAGE_ACTION_LABELS[firstStep.action]}. Add a lead magnet or nurture step.`
      )
    }
    if (
      firstStep?.trafficSource &&
      isTrafficCold(firstStep.trafficSource) &&
      isHighFriction(firstStep.action)
    ) {
      errors.push(
        `"Marriage on First Date" detected: Cold traffic (${TRAFFIC_SOURCE_LABELS[firstStep.trafficSource]}) should NOT go directly to high friction (${STAGE_ACTION_LABELS[firstStep.action]}). Add a lead magnet first.`
      )
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
